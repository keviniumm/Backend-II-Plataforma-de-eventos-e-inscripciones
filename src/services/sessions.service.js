import UsersRepository from '../repositories/users.repository.js'
import { createHash, isValidPassword } from '../utils/hash.js'
import { generateToken } from '../utils/jwt.js'

class SessionsService {
    constructor() {
        this.usersRepository = new UsersRepository()
    }

    async register(userData) {
        const { first_name, last_name, email, password } = userData

        if (!first_name || !last_name || !email || !password) {
            throw new Error('Faltan campos obligatorios')
        }

        if (!email.includes('@')) {
            throw new Error('Email inválido')
        }

        if (password.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres')
        }

        const normalizedEmail = email.trim().toLowerCase()

        const existingUser = await this.usersRepository.findByEmail(normalizedEmail)

        if (existingUser) {
            const error = new Error('El email ya está registrado')
            error.statusCode = 409
            throw error
        }

        const hashedPassword = createHash(password)

        const newUser = await this.usersRepository.create({
            first_name,
            last_name,
            email: normalizedEmail,
            password: hashedPassword
        })

        return newUser
    }

    async login(email, password) {
        if (!email || !password) {
            throw new Error('Credenciales inválidas')
        }

        const normalizedEmail = email.trim().toLowerCase()

        const user = await this.usersRepository.findByEmail(normalizedEmail)

        if (!user || !isValidPassword(password, user.password)) {
            throw new Error('Credenciales inválidas')
        }

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        })

        return token
    }
}

export default SessionsService