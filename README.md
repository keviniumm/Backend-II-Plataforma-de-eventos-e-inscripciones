# Plataforma de Eventos e Inscripciones

## ENTREGA FINAL — Backend II

API backend desarrollada con Node.js, Express y MongoDB para gestionar usuarios, eventos, inscripciones y tickets.

Esta entrega final integra la arquitectura por capas, la autenticación y autorización de usuarios, la gestión de eventos, el control de capacidad, las inscripciones y sus cancelaciones, las validaciones de datos y el manejo centralizado de errores.

El proyecto busca mantener una separación clara de responsabilidades, facilitar el mantenimiento del código y asegurar que las respuestas de la API expongan únicamente la información necesaria.

---

## 1. Tecnologías utilizadas

* Node.js
* Express
* MongoDB
* Mongoose
* Passport
* JWT
* bcrypt
* Nodemailer
* dotenv
* cookie-parser

---

## 2. Arquitectura del proyecto

El proyecto utiliza una arquitectura por capas para separar el acceso a datos, las reglas de negocio y la gestión de las solicitudes HTTP.

### 2.1. DAO (Data Access Object)

Ubicación: `src/dao/`

Los DAO se encargan del acceso directo a los modelos de Mongoose y a la base de datos.

Archivos principales:

* `users.dao.js`
* `events.dao.js`
* `tickets.dao.js`

Responsabilidades:

* Consultar documentos.
* Buscar registros por identificador.
* Crear y actualizar registros.
* Ejecutar operaciones de acceso a datos.
* Centralizar las consultas a MongoDB.

### 2.2. Repository

Ubicación: `src/repositories/`

Archivos principales:

* `users.repository.js`
* `events.repository.js`
* `tickets.repository.js`

Los Repository actúan como intermediarios entre los Services y los DAO, ofreciendo operaciones para trabajar con los datos sin que la lógica de negocio necesite acceder directamente a los modelos de Mongoose.

### 2.3. Services

Ubicación: `src/services/`

Los Services concentran las reglas de negocio de la aplicación.

Entre sus responsabilidades se encuentran:

* Gestionar las operaciones relacionadas con usuarios.
* Validar las condiciones de creación y modificación de eventos.
* Controlar la capacidad disponible.
* Evitar inscripciones activas duplicadas.
* Gestionar los estados de los tickets.
* Verificar permisos sobre los recursos.
* Procesar las cancelaciones de inscripciones.
* Gestionar el envío de correos de confirmación.

### 2.4. Controllers

Ubicación: `src/controllers/`

Los Controllers coordinan las solicitudes y respuestas HTTP.

Sus responsabilidades incluyen:

* Recibir los datos de `body`, `params` y `query`.
* Invocar los Services correspondientes.
* Devolver las respuestas HTTP.
* Gestionar los códigos de estado.
* Delegar los errores al middleware centralizado.

### 2.5. DTO (Data Transfer Object)

Ubicación: `src/dto/`

Los DTO controlan la información que se devuelve en las respuestas de la API.

Archivos principales:

* `user.dto.js`
* `event.dto.js`
* `ticket.dto.js`

Permiten seleccionar los campos que se exponen, evitar la devolución de contraseñas y controlar la representación de los datos relacionados.

### 2.6. Models

Ubicación: `src/models/`

Los modelos definen la estructura de los documentos almacenados en MongoDB mediante Mongoose.

La aplicación trabaja con entidades relacionadas con:

* Usuarios.
* Eventos.
* Tickets e inscripciones.

### 2.7. Routes

Ubicación: `src/routes/`

Las rutas definen los endpoints disponibles y los middlewares que deben ejecutarse antes de llegar a los Controllers.

Archivos principales:

* `sessions.router.js`
* `users.router.js`
* `events.router.js`
* `tickets.router.js`
* `health.router.js`

### 2.8. Middlewares

Ubicación: `src/middlewares/`

Los middlewares permiten gestionar responsabilidades transversales, entre ellas:

* Autenticación.
* Autorización.
* Manejo centralizado de errores.

### 2.9. Configuración y utilidades

El proyecto también incluye archivos de configuración y utilidades para gestionar la conexión a la base de datos, la autenticación y otros procesos necesarios para el funcionamiento de la API.

---

## 3. Instalación y ejecución

### 3.1. Requisitos previos

Para ejecutar el proyecto se necesita:

* Node.js.
* npm.
* Una base de datos MongoDB accesible.
* Un entorno de correo configurado para las notificaciones, si se desea utilizar esa funcionalidad.

### 3.2. Instalar las dependencias

Desde la carpeta raíz del proyecto, ejecutar:

```bash
npm install
```

### 3.3. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`.

Las variables utilizadas son:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1h
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

Descripción:

* `PORT`: puerto en el que se inicia el servidor.
* `NODE_ENV`: entorno de ejecución.
* `MONGO_URL`: cadena de conexión a MongoDB.
* `JWT_SECRET`: secreto utilizado para firmar los tokens JWT.
* `JWT_EXPIRES_IN`: duración del token.
* `MAIL_HOST`: servidor SMTP.
* `MAIL_PORT`: puerto del servidor SMTP.
* `MAIL_USER`: usuario del servicio de correo.
* `MAIL_PASS`: credencial del servicio de correo.
* `MAIL_FROM`: dirección de correo utilizada como remitente.

Se deben completar los valores correspondientes al entorno de ejecución.

El archivo `.env` está destinado a la configuración local y se encuentra excluido del seguimiento de Git mediante `.gitignore`. Para compartir la configuración del proyecto se utiliza `.env.example`, sin credenciales personales.

### 3.4. Iniciar el servidor

Ejecutar:

```bash
npm start
```

El punto de entrada del servidor es:

`src/server.js`

La aplicación utiliza el puerto configurado en `PORT`. Con la configuración predeterminada, la dirección local es:

`http://localhost:8080`

---

## 4. Usuarios y autenticación

La aplicación utiliza Passport y JWT para autenticar usuarios y controlar el acceso a los recursos protegidos.

Las contraseñas se almacenan mediante hashing con bcrypt y no deben exponerse en las respuestas de la API.

### Roles disponibles

* `user`: usuario que puede consultar eventos y gestionar sus propias inscripciones.
* `organizer`: usuario con permisos de gestión sobre los eventos que le corresponden.
* `admin`: administrador con permisos ampliados para gestionar recursos.

Los permisos concretos dependen de las reglas de autorización implementadas en cada endpoint.

### Endpoints de sesiones

| Método | Endpoint                 | Descripción                       |
| ------ | ------------------------ | --------------------------------- |
| POST   | `/api/sessions/register` | Registrar un usuario.             |
| POST   | `/api/sessions/login`    | Iniciar sesión.                   |
| GET    | `/api/sessions/current`  | Consultar el usuario autenticado. |
| POST   | `/api/sessions/logout`   | Cerrar sesión.                    |

La autenticación utiliza una cookie HTTP para mantener la sesión autenticada mediante JWT.

### Usuarios

| Método | Endpoint     | Descripción                                                           |
| ------ | ------------ | --------------------------------------------------------------------- |
| GET    | `/api/users` | Consultar el listado de usuarios según los permisos correspondientes. |

Las respuestas de usuarios utilizan DTO para controlar los datos expuestos y excluir las contraseñas.

---

## 5. Gestión de eventos

Los eventos contienen información como título, descripción, categoría, fecha, ubicación, capacidad, precio, estado y organizador.

### Estados posibles

* `draft`: evento en borrador.
* `published`: evento publicado.
* `cancelled`: evento cancelado.
* `finished`: evento finalizado.

### Endpoints de eventos

| Método | Endpoint                   | Descripción                                                             |
| ------ | -------------------------- | ----------------------------------------------------------------------- |
| GET    | `/api/events`              | Consultar eventos.                                                      |
| GET    | `/api/events/:id`          | Consultar un evento por identificador.                                  |
| POST   | `/api/events`              | Crear un evento según los permisos del usuario.                         |
| PUT    | `/api/events/:id`          | Modificar los datos de un evento.                                       |
| PATCH  | `/api/events/:id/status`   | Modificar el estado de un evento.                                       |
| GET    | `/api/events/:eid/tickets` | Consultar los tickets de un evento según los permisos correspondientes. |

### Filtros, paginación y ordenamiento

El listado de eventos admite parámetros de consulta para filtrar y organizar los resultados.

Parámetros disponibles:

* `status`: filtrar por estado.
* `category`: filtrar por categoría.
* `location`: filtrar por ubicación.
* `dateFrom`: filtrar desde una fecha.
* `dateTo`: filtrar hasta una fecha.
* `page`: seleccionar la página.
* `limit`: cantidad de resultados por página.
* `sort`: ordenar los resultados.

Ejemplos:

Consultar eventos publicados:

`GET /api/events?status=published`

Filtrar por categoría:

`GET /api/events?category=tecnologia`

Filtrar por ubicación:

`GET /api/events?location=Buenos%20Aires`

Filtrar por intervalo de fechas:

`GET /api/events?dateFrom=2027-01-01&dateTo=2027-06-30`

Consultar una página de resultados:

`GET /api/events?page=1&limit=10`

Ordenar por título:

`GET /api/events?sort=title&page=1&limit=10`

Los valores de paginación y los parámetros de fecha se validan para evitar solicitudes con datos inválidos.

### Validaciones de eventos

La aplicación contempla validaciones relacionadas con:

* Campos obligatorios.
* Fechas.
* Capacidad mayor que cero.
* Precio igual o mayor que cero.
* Estados permitidos.
* Capacidad disponible frente a las inscripciones existentes.
* Restricciones para modificar eventos cancelados.
* Permisos de acceso y modificación.

---

## 6. Gestión de tickets e inscripciones

Los tickets representan las inscripciones de los usuarios a los eventos.

Cada ticket incluye información relacionada con el usuario, el evento, el estado de la inscripción, la cantidad reservada, el código de reserva y las fechas correspondientes.

### Estados de los tickets

* `active`: inscripción activa.
* `cancelled`: inscripción cancelada.

### Endpoints de tickets

| Método | Endpoint                   | Descripción                                                  |
| ------ | -------------------------- | ------------------------------------------------------------ |
| POST   | `/api/events/:eid/tickets` | Crear una inscripción a un evento.                           |
| GET    | `/api/tickets/my-tickets`  | Consultar las inscripciones del usuario autenticado.         |
| GET    | `/api/events/:eid/tickets` | Consultar las inscripciones de un evento según los permisos. |
| PATCH  | `/api/tickets/:tid/cancel` | Cancelar una inscripción.                                    |

### Reglas de negocio

La gestión de inscripciones contempla las siguientes reglas:

* El evento debe existir.
* El evento debe estar publicado y admitir inscripciones.
* La cantidad solicitada debe ser un número entero mayor que cero.
* No se permiten inscripciones activas duplicadas del mismo usuario al mismo evento.
* Se comprueba la capacidad disponible antes de aceptar una inscripción.
* La capacidad se calcula teniendo en cuenta las cantidades reservadas por las inscripciones que siguen ocupando lugares.
* Cada inscripción cuenta con un código de reserva.
* Se contempla el envío de correos de confirmación.
* Los usuarios pueden consultar sus propias inscripciones.
* La cancelación está sujeta a las reglas de autorización.
* No se permite cancelar dos veces una misma inscripción.
* Las inscripciones canceladas permanecen registradas y dejan de ocupar capacidad disponible.

Las respuestas de tickets utilizan DTO para controlar los datos expuestos del ticket y de sus entidades relacionadas.

---

## 7. Manejo de errores HTTP

La API dispone de un middleware centralizado para gestionar errores y mantener un formato consistente de respuesta.

Entre los códigos HTTP utilizados se encuentran:

* `200 OK`: solicitud procesada correctamente.
* `201 Created`: recurso creado correctamente.
* `400 Bad Request`: datos inválidos o reglas de negocio incumplidas.
* `401 Unauthorized`: falta autenticación válida.
* `403 Forbidden`: el usuario no tiene permisos suficientes.
* `404 Not Found`: recurso no encontrado.
* `409 Conflict`: conflicto con el estado o los datos existentes, cuando corresponde.
* `500 Internal Server Error`: error interno del servidor.

También se validan identificadores y fechas para devolver mensajes comprensibles ante solicitudes inválidas.

---

## 8. Seguridad

La aplicación contempla las siguientes medidas:

* Hashing de contraseñas mediante bcrypt.
* Autenticación mediante Passport y JWT.
* Uso de cookie HTTP para la autenticación.
* Autorización según roles y permisos sobre los recursos.
* Exclusión de contraseñas de las respuestas de la API.
* Uso de DTO para controlar los datos expuestos.
* Configuración mediante variables de entorno.
* Manejo centralizado de errores.

Las credenciales de servicios externos deben mantenerse fuera del código fuente y no deben publicarse en el repositorio.

---

## 9. Pruebas realizadas con Postman

Se realizaron pruebas manuales para verificar los principales flujos de la aplicación y las validaciones de datos.

### Usuarios y autenticación

* Registro correcto de usuarios.
* Rechazo de registros con email duplicado.
* Validación del formato del email.
* Validación de campos obligatorios.
* Validación de longitud de contraseña.
* Inicio de sesión correcto.
* Rechazo de credenciales incorrectas.
* Consulta del usuario autenticado.
* Cierre de sesión.
* Rechazo de solicitudes posteriores sin autenticación.

### Eventos

* Consulta del listado de eventos.
* Consulta de eventos por identificador.
* Rechazo de identificadores inexistentes.
* Rechazo de identificadores mal formados.
* Filtrado por estado.
* Filtrado por categoría y ubicación.
* Filtrado por intervalo de fechas.
* Ordenamiento por distintos campos.
* Paginación.
* Validación de límites de paginación.
* Rechazo de capacidad igual a cero.
* Rechazo de precios negativos.
* Rechazo de estados inválidos.
* Restricciones de permisos.
* Validación de fechas inválidas.
* Control de capacidad frente a las inscripciones existentes.

### Tickets e inscripciones

* Creación de inscripciones.
* Consulta de las inscripciones propias.
* Consulta de los tickets de un evento según los permisos.
* Cancelación de inscripciones.
* Rechazo de cancelaciones repetidas.
* Rechazo de cancelaciones sin permisos.
* Rechazo de inscripciones duplicadas activas.
* Validación de cantidades iguales a cero.
* Rechazo de cantidades decimales.
* Rechazo de cantidades negativas.
* Liberación de capacidad tras cancelar una inscripción.
* Rechazo de inscripciones a eventos cancelados.

Las pruebas se realizaron mediante solicitudes HTTP en Postman y permitieron verificar el comportamiento de los endpoints y las principales reglas de negocio.

---

## 10. Objetivo de la entrega final

La entrega final consolida el desarrollo de la Plataforma de Eventos e Inscripciones y reúne las funcionalidades de autenticación, autorización, gestión de eventos, inscripciones y tickets.

También incorpora una arquitectura por capas con DAO, Repository, Services, Controllers y DTO, con el objetivo de separar responsabilidades, reducir el acoplamiento y facilitar el mantenimiento del código.

Las pruebas manuales con Postman permitieron comprobar los principales flujos de la API, las restricciones de acceso y las validaciones implementadas.

**Estado del proyecto: ENTREGA FINAL — Backend II.**
