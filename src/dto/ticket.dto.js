export const toTicketDTO = (ticket) => {
    const user = ticket.user
    const event = ticket.event

    return {
        id: ticket._id?.toString() || ticket.id,
        status: ticket.status,
        quantity: ticket.quantity,
        reservationCode: ticket.reservationCode,
        createdAt: ticket.createdAt,
        cancelledAt: ticket.cancelledAt,
        user: user
            ? typeof user === 'object' && user.email
                ? {
                    id: user._id?.toString() || user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }
                : user._id?.toString() || user.toString()
            : null,
        event: event
            ? typeof event === 'object' && event.title
                ? {
                    id: event._id?.toString() || event.id,
                    title: event.title,
                    date: event.date,
                    location: event.location
                }
                : event._id?.toString() || event.toString()
            : null
    }
}