export const errorMiddleware = (error, req, res, next) => {
    let statusCode = error.statusCode || 500

    if (error.name === 'ValidationError' || error.name === 'CastError') {
        statusCode = 400
    }

    if (error.code === 11000) {
        statusCode = 409
    }

    res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Error interno del servidor'
    })
}