import { Router } from 'express'
import {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    updateEventStatus
} from '../controllers/events.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js'

const router = Router()

router.get('/', getEvents)

router.get('/:id', getEventById)

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

router.patch(
    '/:id/status',
    authMiddleware,
    authorizeMiddleware('organizer', 'admin'),
    updateEventStatus
)

export default router