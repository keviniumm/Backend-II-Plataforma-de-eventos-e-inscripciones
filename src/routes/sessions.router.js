import { Router } from 'express'
import passport from 'passport'
import SessionsController from '../controllers/sessions.controller.js'

const router = Router()
const sessionsController = new SessionsController()

router.post('/register', passport.authenticate('register', { session: false }), sessionsController.register)
router.post('/login', passport.authenticate('login', { session: false }), sessionsController.login)
router.get('/current', passport.authenticate('current', { session: false }), sessionsController.current)
router.post('/logout', sessionsController.logout)

export default router