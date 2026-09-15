import { verifyToken } from '../utils/jwt.js'

const auth = (req, res, next) => {
    const token = req.cookies.currentUser

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'No autenticado'
        })
    }

    try {
        const payload = verifyToken(token)

        req.user = payload

        next()
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Token invalido o expirado'
        })
    }
}

export default auth