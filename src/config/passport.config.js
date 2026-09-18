import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import bcrypt from 'bcrypt'
import UsersRepository from '../repositories/users.repository.js'

export const initializePassport = () => {

    const usersRepository = new UsersRepository()

    passport.use('register', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name } = req.body

                if (!first_name || !last_name || !email || !password) {
                    return done(null, false, { message: 'Faltan campos obligatorios' })
                }

                if (!email.includes('@')) {
                    return done(null, false, { message: 'Email inválido' })
                }

                if (password.length < 8) {
                    return done(null, false, { message: 'La contraseña debe tener al menos 8 caracteres' })
                }

                const normalizedEmail = email.trim().toLowerCase()

                const existingUser = await usersRepository.findByEmail(normalizedEmail)

                if (existingUser) {
                    return done(null, false, {
                        message: 'El email ya está registrado',
                        statusCode: 409
                    })
                }

                const hashedPassword = await bcrypt.hash(password, 10)

                const newUser = await usersRepository.create({
                    first_name,
                    last_name,
                    email: normalizedEmail,
                    password: hashedPassword,
                    role: 'user' 
                })

                return done(null, newUser)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                if (!email || !password) {
                    return done(null, false)
                }

                const normalizedEmail = email.trim().toLowerCase()
                const user = await usersRepository.findByEmail(normalizedEmail)

                if (!user) {
                    return done(null, false)
                }

                const isValid = await bcrypt.compare(password, user.password)

                if (!isValid) {
                    return done(null, false)
                }

                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('current', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([
                req => req.cookies?.currentUser
            ]),
            secretOrKey: process.env.JWT_SECRET
        },
        async (payload, done) => {
            try {
                const user = await usersRepository.findByEmail(payload.email)

                if (!user) {
                    return done(null, false)
                }

                return done(null, {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                })
            } catch (error) {
                return done(error, false)
            }
        }
    ))

}