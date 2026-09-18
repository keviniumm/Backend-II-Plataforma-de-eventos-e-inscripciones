import { Router } from 'express'
import passport from 'passport'
import SessionsController from '../controllers/sessions.controller.js'
import auth from '../middlewares/auth.middleware.js'

const router = Router()
const sessionsController = new SessionsController()

router.post('/register', passport.authenticate('register'), sessionsController.register)
router.post('/login', sessionsController.login)
router.get('/current', auth, sessionsController.current)
router.post('/logout', sessionsController.logout)

export default router