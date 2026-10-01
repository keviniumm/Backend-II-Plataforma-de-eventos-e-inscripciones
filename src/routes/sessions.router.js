import { Router } from 'express'
import passport from 'passport'
import SessionsController from '../controllers/sessions.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()
const sessionsController = new SessionsController()

router.post('/register', (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(info?.statusCode || 400).json({
                status: 'error',
                message: info?.message || 'Error en el registro'
            })
        }
        req.user = user
        next()
    })(req, res, next)
}, sessionsController.register)

router.post('/login', (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: info?.message || 'Credenciales inválidas'
            })
        }
        req.user = user
        next()
    })(req, res, next)
}, sessionsController.login)

router.get('/current', authMiddleware, sessionsController.current)

router.post('/logout', sessionsController.logout)

export default router