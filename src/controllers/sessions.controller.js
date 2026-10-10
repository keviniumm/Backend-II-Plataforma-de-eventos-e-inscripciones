import { generateToken } from '../utils/jwt.js'
import {
    toAuthenticatedUserDTO,
    toRegisteredUserDTO
} from '../dto/user.dto.js'

class SessionsController {
    register = (req, res) => {
        const newUser = req.user

        res.status(201).json({
            status: 'success',
            payload: toRegisteredUserDTO(newUser)
        })
    }

    login = (req, res) => {
        const user = req.user

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        })

        res.cookie('currentUser', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production'
        })

        res.status(200).json({
            status: 'success',
            message: 'Login correcto'
        })
    }

    current = (req, res) => {
        res.status(200).json({
            status: 'success',
            payload: toAuthenticatedUserDTO(req.user)
        })
    }

    logout = (req, res) => {
        res.clearCookie('currentUser')

        res.status(200).json({
            status: 'success',
            message: 'Logout correcto'
        })
    }
}

export default SessionsController