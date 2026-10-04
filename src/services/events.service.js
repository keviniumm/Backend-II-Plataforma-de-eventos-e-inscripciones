import {
    findEvents,
    countEvents,
    findEventById,
    createEvent,
    updateEvent,
    updateEventStatus
} from '../repositories/events.repository.js'

export const getEvents = async (filters, page, limit, sort) => {
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

export const updateEventService = async (id, eventData) => {
    const event = await findEventById(id)

    if (!event) {
        return null
    }

    if (event.status === 'cancelled') {
        const error = new Error('No se puede modificar un evento cancelado')
        error.statusCode = 400
        throw error
    }

    if (event.status === 'finished' && eventData.status === 'published') {
        const error = new Error('No se puede publicar un evento finalizado')
        error.statusCode = 400
        throw error
    }

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

    return await updateEvent(id, eventData)
}

export const updateEventStatusService = async (id, status) => {
    const event = await findEventById(id)

    if (!event) {
        return null
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