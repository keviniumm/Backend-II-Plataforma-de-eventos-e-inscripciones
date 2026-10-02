import {
    findEvents,
    findEventById,
    createEvent,
    updateEvent
} from '../repositories/events.repository.js'

export const getEvents = async (filters) => {
    return await findEvents(filters)
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