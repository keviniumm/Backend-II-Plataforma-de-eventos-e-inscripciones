import { Router } from 'express'
import passport from 'passport'
import SessionsController from '../controllers/sessions.controller.js'

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

router.get('/current', (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'No autorizado'
            })
        }
        req.user = user
        next()
    })(req, res, next)
}, sessionsController.current)

router.post('/logout', sessionsController.logout)

export default router