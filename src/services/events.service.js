import {
    findEvents,
    countEvents,
    findEventById,
    createEvent,
    updateEvent,
    updateEventStatus
} from '../repositories/events.repository.js'

import { getOccupiedCapacity } from '../repositories/tickets.repository.js'

const validStatuses = ['draft', 'published', 'cancelled', 'finished']

export const getEvents = async (filters, page, limit, sort) => {
    if (!Number.isInteger(page) || page < 1) {
        const error = new Error('La página debe ser un número entero mayor a 0')
        error.statusCode = 400
        throw error
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        const error = new Error('El límite debe ser un número entero entre 1 y 100')
        error.statusCode = 400
        throw error
    }

    const skip = (page - 1) * limit

    const [events, total] = await Promise.all([
        findEvents(filters, skip, limit, sort),
        countEvents(filters)
    ])

    return {
        data: events,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    }
}

export const getEventById = async (id) => {
    return await findEventById(id)
}

export const createEventService = async (eventData) => {
    const { date, capacity, price } = eventData

    if (new Date(date) <= new Date()) {
        const error = new Error('La fecha del evento debe ser futura')
        error.statusCode = 400
        throw error
    }

    if (capacity <= 0) {
        const error = new Error('La capacidad debe ser mayor a 0')
        error.statusCode = 400
        throw error
    }

    if (price < 0) {
        const error = new Error('El precio no puede ser menor a 0')
        error.statusCode = 400
        throw error
    }

    return await createEvent(eventData)
}

export const updateEventService = async (id, eventData, user) => {
    const event = await findEventById(id)

    if (!event) {
        return null
    }

    if (
        user.role === 'organizer' &&
        event.organizer.toString() !== user.id.toString()
    ) {
        const error = new Error('No tenés permisos para modificar este evento')
        error.statusCode = 403
        throw error
    }

    if (event.status === 'cancelled') {
        const error = new Error('No se puede modificar un evento cancelado')
        error.statusCode = 400
        throw error
    }

    const { date, capacity, price } = eventData

    if (date !== undefined && new Date(date) <= new Date()) {
        const error = new Error('La fecha del evento debe ser futura')
        error.statusCode = 400
        throw error
    }

    if (capacity !== undefined && capacity <= 0) {
        const error = new Error('La capacidad debe ser mayor a 0')
        error.statusCode = 400
        throw error
    }

    if (capacity !== undefined && capacity < event.capacity) {
        const occupiedCapacity = await getOccupiedCapacity(id)

        if (capacity < occupiedCapacity) {
            const error = new Error(
                `La capacidad no puede ser menor a los ${occupiedCapacity} lugares ya reservados`
            )
            error.statusCode = 409
            throw error
        }
    }

    if (price !== undefined && price < 0) {
        const error = new Error('El precio no puede ser menor a 0')
        error.statusCode = 400
        throw error
    }

    return await updateEvent(id, eventData)
}

export const updateEventStatusService = async (id, status, user) => {
    if (!validStatuses.includes(status)) {
        const error = new Error('Estado de evento inválido')
        error.statusCode = 400
        throw error
    }

    const event = await findEventById(id)

    if (!event) {
        return null
    }

    if (
        user.role === 'organizer' &&
        event.organizer.toString() !== user.id.toString()
    ) {
        const error = new Error('No tenés permisos para modificar este evento')
        error.statusCode = 403
        throw error
    }

    if (event.status === 'cancelled') {
        const error = new Error('No se puede modificar un evento cancelado')
        error.statusCode = 400
        throw error
    }

    if (event.status === 'finished' && status === 'published') {
        const error = new Error('No se puede publicar un evento finalizado')
        error.statusCode = 400
        throw error
    }

    return await updateEventStatus(id, status)
}