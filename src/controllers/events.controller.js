import mongoose from 'mongoose'

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

        if (status) filters.status = status
        if (category) filters.category = category
        if (location) filters.location = location

        if (dateFrom || dateTo) {
            filters.date = {}

            if (dateFrom) {
                const startDate = new Date(dateFrom)

                if (Number.isNaN(startDate.getTime())) {
                    const error = new Error('La fecha inicial no es válida')
                    error.statusCode = 400
                    throw error
                }

                filters.date.$gte = startDate
            }

            if (dateTo) {
                const endDate = new Date(dateTo)

                if (Number.isNaN(endDate.getTime())) {
                    const error = new Error('La fecha final no es válida')
                    error.statusCode = 400
                    throw error
                }

                filters.date.$lte = endDate
            }
        }

        const allowedSortFields = ['date', 'title', 'price', 'capacity']
        const sortField = allowedSortFields.includes(sort) ? sort : 'date'

        const events = await getEventsService(
            filters,
            Number(page),
            Number(limit),
            { [sortField]: 1 }
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

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'El ID del evento no es válido'
            })
        }

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
            price
        } = req.body

        const event = await createEventService({
            title,
            description,
            category,
            date,
            location,
            capacity,
            price,
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
        const {
            title,
            description,
            category,
            date,
            location,
            capacity,
            price
        } = req.body

        const updatedEvent = await updateEventService(
            req.params.id,
            {
                title,
                description,
                category,
                date,
                location,
                capacity,
                price
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
        const updatedEvent = await updateEventStatusService(
            req.params.id,
            req.body.status,
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