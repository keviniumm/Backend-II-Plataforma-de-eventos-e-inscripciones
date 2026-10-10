import EventsDao from '../dao/events.dao.js'

const eventsDao = new EventsDao()

export const findEvents = async (filters, skip, limit, sort) => {
    return await eventsDao.findAll(filters, skip, limit, sort)
}

export const countEvents = async (filters) => {
    return await eventsDao.count(filters)
}

export const findEventById = async (id) => {
    return await eventsDao.findById(id)
}

export const createEvent = async (eventData) => {
    return await eventsDao.create(eventData)
}

export const updateEvent = async (id, eventData) => {
    return await eventsDao.update(id, eventData)
}

export const updateEventStatus = async (id, status) => {
    return await eventsDao.updateStatus(id, status)
}