import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

export const sendConfirmationEmail = async (to, ticket, event) => {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: 'Confirmación de inscripción',
        html: `
            <h2>Inscripción confirmada</h2>
            <p>Tu inscripción al evento <strong>${event.title}</strong> fue confirmada.</p>
            <p>Cantidad: ${ticket.quantity}</p>
            <p>Código de reserva: <strong>${ticket.reservationCode}</strong></p>
        `
    })
}