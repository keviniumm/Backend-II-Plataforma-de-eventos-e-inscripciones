# Plataforma de Eventos e Inscripciones

## Pre-entrega 7 — Tickets, inscripciones y control de cupos

Backend desarrollado con Node.js, Express y MongoDB para gestionar usuarios, eventos e inscripciones mediante tickets.

---

## Tecnologías

* Node.js
* Express
* MongoDB
* Mongoose
* Passport
* JWT
* Nodemailer

---

## Instalación

Instalar las dependencias:

```bash
npm install
```

Para iniciar el servidor:

```bash
npm start
```

---

## Variables de entorno

Crear un archivo `.env` con las variables necesarias para la conexión a la base de datos y la autenticación.

Para el envío de emails mediante Nodemailer:

```env
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

Las credenciales no deben estar hardcodeadas en el código ni subirse al repositorio.

El archivo `.env` debe estar incluido en `.gitignore`.

---

# Usuarios y autenticación

El sistema utiliza autenticación y autorización mediante sesiones/JWT y roles.

Roles principales:

* `user`
* `organizer`
* `admin`

### Registro

```http
POST /api/sessions/register
```

### Login

```http
POST /api/sessions/login
```

Las rutas protegidas requieren autenticación.

---

# Eventos

Los eventos cuentan con:

* Título
* Descripción
* Fecha
* Ubicación
* Capacidad
* Precio
* Estado

Los eventos pueden tener diferentes estados, incluyendo:

* `draft`
* `published`
* `cancelled`
* `finished`

Para realizar una inscripción, el evento debe estar publicado y no debe haber finalizado ni estar cancelado.

---

# Tickets

Los tickets representan la inscripción de un usuario a un evento.

La entidad `Ticket` utiliza referencias mediante `ObjectId` para relacionar usuarios y eventos.

No se almacenan objetos completos de usuarios o eventos dentro del ticket.

## Campos

Cada ticket contiene:

* `user`: referencia al usuario.
* `event`: referencia al evento.
* `status`: estado del ticket.
* `quantity`: cantidad de cupos reservados.
* `reservationCode`: código único de reserva.
* `createdAt`: fecha de creación.
* `cancelledAt`: fecha de cancelación.

---

# Estados de Ticket

Los estados permitidos son:

* `confirmed`
* `pending`
* `cancelled`

Los tickets con estado `cancelled` no ocupan cupos.

---

# Inscripción a un evento

```http
POST /api/events/:eid/tickets
```

Requiere autenticación.

El servicio valida:

1. Que el evento exista.
2. Que el evento esté en estado `published`.
3. Que el evento no haya finalizado.
4. Que el evento no esté cancelado.
5. Que `quantity` sea un número entero mayor a `0`.
6. Que existan suficientes cupos disponibles.
7. Que el usuario no tenga otra inscripción activa para el mismo evento.

Si todas las validaciones son correctas, se crea el ticket con estado `confirmed`.

---

# Control de cupos

Los cupos ocupados se calculan considerando únicamente los tickets activos.

```text
Cupos ocupados =
suma de quantity de tickets cuyo estado no sea cancelled
```

Los tickets cancelados no se contabilizan.

Por lo tanto, cuando un ticket es cancelado, sus cupos quedan disponibles automáticamente.

Ejemplo:

```text
Capacidad del evento: 10

Ticket 1 → quantity: 3 → confirmed
Ticket 2 → quantity: 2 → confirmed
Ticket 3 → quantity: 4 → cancelled

Cupos ocupados: 5
Cupos disponibles: 5
```

---

# Evitar inscripciones duplicadas

Un usuario no puede tener más de un ticket activo para el mismo evento.

Si intenta inscribirse nuevamente, la API devuelve un error de negocio.

Una inscripción anterior que haya sido cancelada no ocupa cupo.

---

# Consultar mis tickets

```http
GET /api/tickets/my-tickets
```

Requiere autenticación.

Devuelve únicamente los tickets pertenecientes al usuario autenticado.

Los datos del evento se obtienen mediante `populate` e incluyen:

* `title`
* `date`
* `location`

No se exponen datos sensibles de otros usuarios.

---

# Consultar tickets de un evento

```http
GET /api/events/:eid/tickets
```

Acceso permitido para:

* `organizer` propietario del evento.
* `admin`.

Un usuario común recibe `403 Forbidden`.

Un `organizer` que no sea propietario del evento también recibe `403 Forbidden`.

---

# Cancelar un ticket

```http
PATCH /api/tickets/:tid/cancel
```

Puede cancelar:

* El propietario del ticket.
* Un usuario con rol `admin`.

La cancelación:

* Cambia `status` a `cancelled`.
* Registra la fecha en `cancelledAt`.
* No elimina el documento de MongoDB.
* Libera automáticamente los cupos reservados.

Un ticket que ya está cancelado no puede volver a cancelarse.

---

# Reservation Code

Cada ticket posee un `reservationCode` único que identifica la reserva.

El código se genera automáticamente al crear la inscripción.

---

# Notificaciones por email

Las inscripciones confirmadas utilizan Nodemailer para enviar un email de confirmación.

Las credenciales se configuran mediante variables de entorno:

```env
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

Nunca se almacenan credenciales directamente en el código fuente.

---

# Manejo de errores

Los errores de negocio utilizan un `statusCode` para que el middleware global pueda devolver el código HTTP correspondiente.

Ejemplo:

```json
{
  "status": "error",
  "message": "La fecha del evento debe ser futura"
}
```

Los errores pueden responder con códigos como:

* `400` — Error de validación o regla de negocio.
* `401` — Usuario no autenticado.
* `403` — Usuario sin permisos.
* `404` — Recurso inexistente.
* `409` — Conflicto, por ejemplo una inscripción duplicada.

---

# Endpoints principales

| Método  | Ruta                       | Acceso                        |
| ------- | -------------------------- | ----------------------------- |
| `POST`  | `/api/sessions/register`   | Público                       |
| `POST`  | `/api/sessions/login`      | Público                       |
| `POST`  | `/api/events/:eid/tickets` | Autenticado                   |
| `GET`   | `/api/tickets/my-tickets`  | Autenticado                   |
| `GET`   | `/api/events/:eid/tickets` | Organizer propietario / Admin |
| `PATCH` | `/api/tickets/:tid/cancel` | Dueño / Admin                 |

---

# Pruebas

Las funcionalidades de esta pre-entrega se prueban mediante Postman.

Casos principales:

1. Inscripción exitosa.
2. Recepción del email de confirmación.
3. Inscripción sin sesión → `401`.
4. Evento inexistente → `404`.
5. Evento cancelado o finalizado → error de negocio.
6. Cantidad de cupos insuficiente → error de negocio.
7. Inscripción duplicada activa → `409`.
8. Cancelación propia → exitosa.
9. Cancelación de ticket ajeno → `403`.
10. Consulta de tickets de evento como `user` → `403`.
11. Consulta de tickets de evento como `organizer` de otro evento → `403`.
12. Cancelación de ticket → liberación del cupo.

---

# Pre-entrega 7

Esta versión corresponde a la **Pre-entrega 7: Tickets, inscripciones y control de cupos**.

El objetivo de esta etapa es implementar el flujo completo de inscripción a eventos mediante una entidad `Ticket`, incorporando:

* Control de cupos.
* Prevención de inscripciones duplicadas.
* Estados de ticket.
* Cancelación de inscripciones.
* Liberación automática de cupos.
* Relaciones mediante referencias `ObjectId`.
* Autorización según usuario y rol.
* Notificaciones por email mediante Nodemailer.
* Manejo de errores de negocio.
* Pruebas mediante Postman.
