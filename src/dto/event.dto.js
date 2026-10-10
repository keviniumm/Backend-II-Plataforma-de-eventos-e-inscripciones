export const toEventDTO = (event) => {
    const organizer = event.organizer

    return {
        id: event._id?.toString() || event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        price: event.price,
        status: event.status,
        organizer: organizer
            ? typeof organizer === 'object' && organizer.email
                ? {
                    id: organizer._id?.toString() || organizer.id,
                    first_name: organizer.first_name,
                    last_name: organizer.last_name,
                    email: organizer.email
                }
                : organizer._id?.toString() || organizer.toString()
            : null
    }
}