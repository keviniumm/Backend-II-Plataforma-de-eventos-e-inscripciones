import {
    getEvents as getEventsService,
    getEventById as getEventByIdService,
    createEventService,
    updateEventService,
    updateEventStatusService
} from '../services/events.service.js'

export const getEvents = async (req, res, next) => {
    try {
        const {
            status,
            category,
            location,
            dateFrom,
            dateTo,
            page = 1,
            limit = 10,
            sort = 'date'
        } = req.query

        const filters = {}

        if (status) {
            filters.status = status
        }

        if (category) {
            filters.category = category
        }

        if (location) {
            filters.location = location
        }

        if (dateFrom || dateTo) {
            filters.date = {}

            if (dateFrom) {
                filters.date.$gte = new Date(dateFrom)
            }

            if (dateTo) {
                filters.date.$lte = new Date(dateTo)
            }
        }

        const events = await getEventsService(
            filters,
            Number(page),
            Number(limit),
            { [sort]: 1 }
        )

        res.status(200).json({
            status: 'success',
            ...events
        })
    } catch (error) {
        next(error)
    }
}

export const getEventById = async (req, res, next) => {
    try {
        const { id } = req.params

        const event = await getEventByIdService(id)

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Evento no encontrado'
            })
        }

        res.status(200).json({
            status: 'success',
            payload: event
        })
    } catch (error) {
        next(error)
    }
}

export const createEvent = async (req, res, next) => {
    try {
        const {
            title,
            description,
            category,
            date,
            location,
            capacity,
            price,
            status
        } = req.body

        const event = await createEventService({
            title,
            description,
            category,
            date,
            location,
            capacity,
            price,
            status,
            organizer: req.user.id
        })

        res.status(201).json({
            status: 'success',
            payload: event
        })
    } catch (error) {
        next(error)
    }
}

export const updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params
        const {
            title,
            description,
            category,
            date,
            location,
            capacity,
            price,
            status
        } = req.body

        const event = await getEventByIdService(id)

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Evento no encontrado'
            })
        }

        if (
            req.user.role === 'organizer' &&
            event.organizer.toString() !== req.user.id
        ) {
            return res.status(403).json({
                status: 'error',
                message: 'No tenés permisos para modificar este evento'
            })
        }

        const updatedEvent = await updateEventService(id, {
            title,
            description,
            category,
            date,
            location,
            capacity,
            price,
            status
        })

        res.status(200).json({
            status: 'success',
            payload: updatedEvent
        })
    } catch (error) {
        next(error)
    }
}

export const updateEventStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const event = await getEventByIdService(id)

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Evento no encontrado'
            })
        }

        if (
            req.user.role === 'organizer' &&
            event.organizer.toString() !== req.user.id
        ) {
            return res.status(403).json({
                status: 'error',
                message: 'No tenés permisos para modificar este evento'
            })
        }

        const updatedEvent = await updateEventStatusService(id, status)

        res.status(200).json({
            status: 'success',
            payload: updatedEvent
        })
    } catch (error) {
        next(error)
    }
}