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
        throw new Error('La fecha del evento debe ser futura')
    }

    if (capacity <= 0) {
        throw new Error('La capacidad debe ser mayor a 0')
    }

    if (price < 0) {
        throw new Error('El precio no puede ser menor a 0')
    }

    return await createEvent(eventData)
}

export const updateEventService = async (id, eventData) => {
    return await updateEvent(id, eventData)
}

export const updateEventStatusService = async (id, status) => {
    return await updateEventStatus(id, status)
}