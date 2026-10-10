import {
    getEvents as getEventsService,
    getEventById as getEventByIdService,
    createEventService,
    updateEventService,
    updateEventStatusService
} from '../services/events.service.js'

import { toEventDTO } from '../dto/event.dto.js'

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
            ...events,
            data: events.data.map(toEventDTO)
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
            payload: toEventDTO(event)
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
            payload: toEventDTO(event)
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

        const updatedEvent = await updateEventService(
            id,
            {
                title,
                description,
                category,
                date,
                location,
                capacity,
                price,
                status
            },
            req.user
        )

        if (!updatedEvent) {
            return res.status(404).json({
                status: 'error',
                message: 'Evento no encontrado'
            })
        }

        res.status(200).json({
            status: 'success',
            payload: toEventDTO(updatedEvent)
        })
    } catch (error) {
        next(error)
    }
}

export const updateEventStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const updatedEvent = await updateEventStatusService(
            id,
            status,
            req.user
        )

        if (!updatedEvent) {
            return res.status(404).json({
                status: 'error',
                message: 'Evento no encontrado'
            })
        }

        res.status(200).json({
            status: 'success',
            payload: toEventDTO(updatedEvent)
        })
    } catch (error) {
        next(error)
    }
}