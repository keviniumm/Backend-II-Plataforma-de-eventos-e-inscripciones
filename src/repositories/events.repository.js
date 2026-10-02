import Event from '../models/Event.js'

export const findEvents = async (filters) => {
    return await Event.find(filters)
}

export const findEventById = async (id) => {
    return await Event.findById(id)
}

export const createEvent = async (eventData) => {
    return await Event.create(eventData)
}