import {
    createTicketService,
    getMyTicketsService,
    getEventTicketsService,
    cancelTicketService
} from '../services/tickets.service.js'

export const createTicket = async (req, res, next) => {
    try {
        const { eid } = req.params
        const { quantity } = req.body

        const ticket = await createTicketService(
            req.user.id,
            eid,
            quantity
        )

        res.status(201).json({
            status: 'success',
            payload: ticket
        })
    } catch (error) {
        next(error)
    }
}

export const getMyTickets = async (req, res, next) => {
    try {
        const tickets = await getMyTicketsService(req.user.id)

        res.status(200).json({
            status: 'success',
            payload: tickets
        })
    } catch (error) {
        next(error)
    }
}

export const getEventTickets = async (req, res, next) => {
    try {
        const { eid } = req.params

        const tickets = await getEventTicketsService(eid)

        res.status(200).json({
            status: 'success',
            payload: tickets
        })
    } catch (error) {
        next(error)
    }
}

export const cancelTicket = async (req, res, next) => {
    try {
        const { tid } = req.params

        const ticket = await cancelTicketService(
            tid,
            req.user.id,
            req.user.role === 'admin'
        )

        res.status(200).json({
            status: 'success',
            payload: ticket
        })
    } catch (error) {
        next(error)
    }
}