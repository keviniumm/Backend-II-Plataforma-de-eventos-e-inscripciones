import dotenv from 'dotenv'
import mongoose from 'mongoose'
import app from './app.js'

dotenv.config()

const PORT = process.env.PORT || 8080

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Conectado a MongoDB')

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`)
        })
    })
    .catch((error) => {
        console.error('Error al conectar con MongoDB:', error)
    })