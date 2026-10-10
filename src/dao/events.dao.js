import Event from '../models/Event.js'

class EventsDao {
    async findAll(filters, skip, limit, sort) {
        return await Event.find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
    }

    async count(filters) {
        return await Event.countDocuments(filters)
    }

    async findById(id) {
        return await Event.findById(id)
    }

    async create(eventData) {
        return await Event.create(eventData)
    }

    async update(id, eventData) {
        return await Event.findByIdAndUpdate(
            id,
            eventData,
            {
                new: true,
                runValidators: true
            }
        )
    }

    async updateStatus(id, status) {
        return await Event.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true
            }
        )
    }
}

export default EventsDao