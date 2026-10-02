import {
    getEvents as getEventsService,
    getEventById as getEventByIdService,
    createEventService,
    updateEventService
} from '../services/events.service.js'

export const getEvents = async (req, res, next) => {
    try {
        const events = await getEventsService({})

        res.status(200).json({
            status: 'success',
            payload: events
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