import {
    createTicket,
    findTicketById,
    findActiveTicketByUserAndEvent,
    findTicketsByUser,
    findTicketsByEvent,
    getOccupiedCapacity,
    cancelTicket
} from '../repositories/tickets.repository.js'

import { findEventById } from '../repositories/events.repository.js'
import UsersRepository from '../repositories/users.repository.js'
import { sendConfirmationEmail } from './email.service.js'
import crypto from 'crypto'

const usersRepository = new UsersRepository()

export const createTicketService = async (userId, eventId, quantity) => {
    const event = await findEventById(eventId)

    if (!event) {
        const error = new Error('Evento no encontrado')
        error.statusCode = 404
        throw error
    }

    if (event.status !== 'published') {
        const error = new Error('El evento no está publicado')
        error.statusCode = 400
        throw error
    }

    if (new Date(event.date) <= new Date()) {
        const error = new Error('El evento ya finalizó')
        error.statusCode = 400
        throw error
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        const error = new Error('La cantidad debe ser un número entero mayor a 0')
        error.statusCode = 400
        throw error
    }

    const existingTicket = await findActiveTicketByUserAndEvent(userId, eventId)

    if (existingTicket) {
        const error = new Error('El usuario ya tiene una inscripción activa para este evento')
        error.statusCode = 409
        throw error
    }

    const occupiedCapacity = await getOccupiedCapacity(eventId)
    const availableCapacity = event.capacity - occupiedCapacity

    if (availableCapacity < quantity) {
        const error = new Error(`No hay cupos suficientes. Cupos disponibles: ${availableCapacity}`)
        error.statusCode = 400
        throw error
    }

    const reservationCode = crypto.randomUUID()

    const ticket = await createTicket({
        user: userId,
        event: eventId,
        status: 'confirmed',
        quantity,
        reservationCode
    })

    const user = await usersRepository.findById(userId)

    await sendConfirmationEmail(
        user.email,
        ticket,
        event
    )

    return ticket
}

export const getMyTicketsService = async (userId) => {
    return await findTicketsByUser(userId)
}

export const getEventTicketsService = async (eventId, userId, isAdmin) => {
    const event = await findEventById(eventId)

    if (!event) {
        const error = new Error('Evento no encontrado')
        error.statusCode = 404
        throw error
    }

    if (!isAdmin && event.organizer.toString() !== userId.toString()) {
        const error = new Error('No tenés permisos para ver los tickets de este evento')
        error.statusCode = 403
        throw error
    }

    return await findTicketsByEvent(eventId)
}

export const cancelTicketService = async (ticketId, userId, isAdmin) => {
    const ticket = await findTicketById(ticketId)

    if (!ticket) {
        const error = new Error('Ticket no encontrado')
        error.statusCode = 404
        throw error
    }

    if (!isAdmin && ticket.user.toString() !== userId.toString()) {
        const error = new Error('No tenés permisos para cancelar este ticket')
        error.statusCode = 403
        throw error
    }

    if (ticket.status === 'cancelled') {
        const error = new Error('El ticket ya está cancelado')
        error.statusCode = 400
        throw error
    }

    return await cancelTicket(ticketId)
}