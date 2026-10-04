import Ticket from '../models/Ticket.js'

export const createTicket = async (ticketData) => {
    return await Ticket.create(ticketData)
}

export const findTicketById = async (id) => {
    return await Ticket.findById(id)
}

export const findActiveTicketByUserAndEvent = async (userId, eventId) => {
    return await Ticket.findOne({
        user: userId,
        event: eventId,
        status: { $ne: 'cancelled' }
    })
}

export const findTicketsByUser = async (userId) => {
    return await Ticket.find({ user: userId })
        .populate('event', 'title date location')
}

export const findTicketsByEvent = async (eventId) => {
    return await Ticket.find({ event: eventId })
        .populate('user', 'first_name last_name email')
}

export const getOccupiedCapacity = async (eventId) => {
    const result = await Ticket.aggregate([
        {
            $match: {
                event: eventId,
                status: { $ne: 'cancelled' }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$quantity' }
            }
        }
    ])

    return result.length > 0 ? result[0].total : 0
}

export const cancelTicket = async (id) => {
    return await Ticket.findByIdAndUpdate(
        id,
        {
            status: 'cancelled',
            cancelledAt: new Date()
        },
        { new: true }
    )
}