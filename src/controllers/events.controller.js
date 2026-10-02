import Event from '../models/Event.js'
import { findEvents } from '../repositories/events.repository.js'

export const getEvents = async (req, res, next) => {
    try {
        const events = await findEvents({})

        res.status(200).json({
            status: 'success',
            payload: events
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

        const event = await Event.create({
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

        const event = await Event.findById(id)

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

        event.title = title
        event.description = description
        event.category = category
        event.date = date
        event.location = location
        event.capacity = capacity
        event.price = price
        event.status = status

        await event.save()

        res.status(200).json({
            status: 'success',
            payload: event
        })
    } catch (error) {
        next(error)
    }
}