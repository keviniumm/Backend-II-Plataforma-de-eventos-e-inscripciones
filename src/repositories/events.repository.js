import Event from '../models/Event.js'

export const findEvents = async (filters, skip, limit, sort) => {
    return await Event.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
}

export const countEvents = async (filters) => {
    return await Event.countDocuments(filters)
}

export const findEventById = async (id) => {
    return await Event.findById(id)
}

export const createEvent = async (eventData) => {
    return await Event.create(eventData)
}

export const updateEvent = async (id, eventData) => {
    return await Event.findByIdAndUpdate(
        id,
        eventData,
        {
            new: true,
            runValidators: true
        }
    )
}

export const updateEventStatus = async (id, status) => {
    return await Event.findByIdAndUpdate(
        id,
        { status },
        {
            new: true,
            runValidators: true
        }
    )
}