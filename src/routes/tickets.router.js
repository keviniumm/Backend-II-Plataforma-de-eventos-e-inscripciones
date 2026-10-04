import { Router } from 'express'
import {
    createTicket,
    getMyTickets,
    getEventTickets,
    cancelTicket
} from '../controllers/tickets.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/events/:eid/tickets', authMiddleware, createTicket)

router.get('/tickets/my-tickets', authMiddleware, getMyTickets)

router.get('/events/:eid/tickets', authMiddleware, getEventTickets)

router.patch('/tickets/:tid/cancel', authMiddleware, cancelTicket)

export default router