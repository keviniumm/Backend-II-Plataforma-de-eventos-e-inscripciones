import SessionsService from '../services/sessions.service.js'

const sessionsService = new SessionsService()

export const register = async (req, res) => {
    try {
        const newUser = await sessionsService.register(req.body)

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