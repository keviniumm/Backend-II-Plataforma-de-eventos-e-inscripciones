import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled'],
        default: 'active',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    reservationCode: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    cancelledAt: {
        type: Date,
        default: null
    }
})

const Ticket = mongoose.model('Ticket', ticketSchema)

export default Ticket