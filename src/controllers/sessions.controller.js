import SessionsService from '../services/sessions.service.js'

class SessionsController {
    constructor() {
        this.sessionsService = new SessionsService()
    }

    register = async (req, res) => {
        try {
            const newUser = await this.sessionsService.register(req.body)

            res.status(201).json({
                status: 'success',
                payload: {
                    id: newUser._id,
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                    email: newUser.email,
                    role: newUser.role
                }
            })
        } catch (error) {
            if (error.statusCode === 409) {
                return res.status(409).json({
                    status: 'error',
                    message: error.message
                })
            }

            res.status(400).json({
                status: 'error',
                message: error.message
            })
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body

            const token = await this.sessionsService.login(email, password)

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
        } catch (error) {
            res.status(401).json({
                status: 'error',
                message: 'Credenciales inválidas'
            })
        }
    }

    current = (req, res) => {
        res.status(200).json({
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
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