import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import User from '../models/User.js'

export const initializePassport = () => {

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
                    return done(null, false, { message: 'Todos los campos son obligatorios' })
                }

                const normalizedEmail = email.trim().toLowerCase()

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

                if (!emailRegex.test(normalizedEmail)) {
                    return done(null, false, { message: 'Email inválido' })
                }

                if (password.length < 6) {
                    return done(null, false, { message: 'La contraseña debe tener al menos 6 caracteres' })
                }

                const existingUser = await User.findOne({ email: normalizedEmail })

                if (existingUser) {
                    return done(null, false, { message: 'El usuario ya existe' })
                }

                const hashedPassword = await bcrypt.hash(password, 10)

                const user = await User.create({
                    first_name,
                    last_name,
                    email: normalizedEmail,
                    password: hashedPassword
                })

                return done(null, user)

            } catch (error) {
                return done(error)
            }
        }
    ))

}