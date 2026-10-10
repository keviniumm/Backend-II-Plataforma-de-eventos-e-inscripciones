import TicketsDao from '../dao/tickets.dao.js'

const ticketsDao = new TicketsDao()

export const createTicket = async (ticketData) => {
    return await ticketsDao.create(ticketData)
}

export const findTicketById = async (id) => {
    return await ticketsDao.findById(id)
}

export const findActiveTicketByUserAndEvent = async (userId, eventId) => {
    return await ticketsDao.findOne({
        user: userId,
        event: eventId,
        status: { $ne: 'cancelled' }
    })
}

export const findTicketsByUser = async (userId) => {
    return await ticketsDao.findByUser(userId)
}

export const findTicketsByEvent = async (eventId) => {
    return await ticketsDao.findByEvent(eventId)
}

export const getOccupiedCapacity = async (eventId) => {
    return await ticketsDao.countActiveByEvent(eventId)
}

export const cancelTicket = async (id) => {
    return await ticketsDao.cancel(id)
}