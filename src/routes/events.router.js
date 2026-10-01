import { Router } from 'express'
import { getEvents, createEvent, updateEvent } from '../controllers/events.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js'

const router = Router()

router.get('/', getEvents)

router.post(
    '/',
    authMiddleware,
    authorizeMiddleware('organizer', 'admin'),
    createEvent
)

router.put(
    '/:id',
    authMiddleware,
    authorizeMiddleware('organizer', 'admin'),
    updateEvent
)

export default router