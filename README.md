# Plataforma de Eventos e Inscripciones

## Pre-entrega 8: Arquitectura con DAO, Repository y DTO

API backend desarrollada con Node.js, Express y MongoDB para gestionar usuarios, eventos, inscripciones y tickets.

El objetivo de esta entrega es implementar una arquitectura por capas que separe el acceso a datos, la lógica de negocio y las respuestas HTTP, manteniendo el funcionamiento de los endpoints existentes.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Passport
- JWT
- Nodemailer

## Arquitectura en capas

El proyecto utiliza una arquitectura organizada en capas para separar responsabilidades y facilitar el mantenimiento.

### 1. DAO (Data Access Object)

Ubicación: `src/dao/`

Los DAO son responsables del acceso directo a los modelos de Mongoose y a la base de datos.

- `users.dao.js`: acceso a los usuarios.
- `events.dao.js`: acceso a los eventos.
- `tickets.dao.js`: acceso a los tickets.

Esta capa centraliza las consultas, búsquedas, creaciones, actualizaciones y conteos de documentos.

Los DAO son los únicos archivos de la aplicación que deben importar directamente los modelos de Mongoose.

### 2. Repository

Ubicación: `src/repositories/`

Los Repository utilizan los DAO y ofrecen operaciones que permiten a los Services acceder a los datos sin importar directamente los modelos de Mongoose.

- `users.repository.js`
- `events.repository.js`
- `tickets.repository.js`

Esta capa actúa como intermediaria entre el acceso a datos y la lógica de negocio.

### 3. Services

Ubicación: `src/services/`

Los Services concentran las reglas de negocio y utilizan los Repository para acceder a los datos.

Entre sus responsabilidades se encuentran:

- Validar las reglas de negocio de los eventos.
- Controlar la capacidad disponible.
- Evitar inscripciones duplicadas activas.
- Gestionar los estados de los tickets.
- Verificar permisos sobre los recursos.
- Gestionar el envío de emails de confirmación.

Los Services no deben importar directamente modelos de Mongoose ni acceder directamente a los DAO.

### 4. Controllers

Ubicación: `src/controllers/`

Los Controllers coordinan las solicitudes y respuestas HTTP.

Sus responsabilidades son:

- Recibir los datos de `body`, `params` y `query`.
- Invocar los Services correspondientes.
- Construir las respuestas HTTP.
- Delegar los errores al middleware centralizado.

Los Controllers no deben importar directamente modelos de Mongoose ni concentrar las reglas de negocio.

### 5. DTO (Data Transfer Object)

Ubicación: `src/dto/`

Los DTO controlan los datos que se exponen en las respuestas de la API.

- `user.dto.js`: respuestas de usuarios.
- `event.dto.js`: respuestas de eventos.
- `ticket.dto.js`: respuestas de tickets e inscripciones.

Los DTO permiten seleccionar los campos que se devuelven y evitar la exposición de información sensible, como las contraseñas.

También filtran los datos de los documentos relacionados cuando se utilizan referencias pobladas.

### 6. Middlewares

Ubicación: `src/middlewares/`

Los middlewares gestionan responsabilidades transversales:

- Autenticación.
- Autorización.
- Manejo centralizado de errores.

El middleware de errores permite mantener un formato consistente para las respuestas de error.

### 7. Routes

Ubicación: `src/routes/`

Las rutas definen los endpoints disponibles y los middlewares que se ejecutan antes de llegar a los Controllers.

La organización de las rutas permite mantener separadas la definición de los endpoints y la lógica de las operaciones.

## Instalación y ejecución

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto y configurar las variables necesarias.

Utilizar `.env.example` como referencia.

Las variables utilizadas incluyen:

- `PORT`
- `NODE_ENV`
- `MONGO_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USER`
- `MAIL_PASS`
- `MAIL_FROM`

No publicar credenciales reales ni subir el archivo `.env` al repositorio.

### 3. Iniciar el servidor

```bash
npm start
```

El servidor utiliza el archivo `src/server.js` como punto de entrada.

## Usuarios y autenticación

La API utiliza Passport y JWT para autenticar usuarios y controlar el acceso a los recursos.

### Roles

- `user`
- `organizer`
- `admin`

### Registro

`POST /api/sessions/register`

Registra un usuario y devuelve sus datos mediante un DTO, sin exponer la contraseña.

### Login

`POST /api/sessions/login`

Autentica al usuario y establece la cookie de autenticación.

### Usuario autenticado

`GET /api/sessions/current`

Devuelve los datos del usuario autenticado sin incluir la contraseña.

### Logout

`POST /api/sessions/logout`

Permite cerrar la sesión.

### Listar usuarios

`GET /api/users`

Permite consultar los usuarios con los permisos correspondientes.

La respuesta utiliza un DTO para controlar los campos expuestos y excluir las contraseñas.

## Gestión de eventos

Los eventos contienen información como título, descripción, categoría, fecha, ubicación, capacidad, precio, organizador y estado.

### Estados de los eventos

- `draft`
- `published`
- `cancelled`
- `finished`

### Consultar eventos

`GET /api/events`

Permite consultar eventos mediante los filtros y la paginación disponibles.

### Consultar un evento

`GET /api/events/:id`

Devuelve los datos de un evento específico.

### Crear un evento

`POST /api/events`

Permite crear un evento según los permisos del usuario autenticado.

### Modificar un evento

`PUT /api/events/:id`

Permite modificar un evento según las reglas de autorización.

### Modificar el estado de un evento

`PATCH /api/events/:id/status`

Permite actualizar el estado de un evento según las reglas de autorización.

Las respuestas de eventos utilizan un DTO para controlar los campos expuestos, incluidos los datos del organizador.

## Gestión de tickets e inscripciones

Los tickets representan las inscripciones de los usuarios a los eventos.

Cada ticket contiene referencias al usuario y al evento, además de su estado, cantidad reservada y código de reserva.

### Estados de los tickets

- `confirmed`
- `pending`
- `cancelled`

### Inscribirse a un evento

`POST /api/events/:eid/tickets`

Permite solicitar una inscripción.

La operación contempla reglas de negocio como:

- Verificar que el evento exista.
- Comprobar que el evento esté publicado y no haya finalizado.
- Validar la cantidad solicitada.
- Evitar inscripciones duplicadas activas.
- Comprobar la capacidad disponible.
- Generar el código de reserva.
- Enviar el email de confirmación.

### Consultar mis tickets

`GET /api/tickets/my-tickets`

Devuelve las inscripciones del usuario autenticado.

### Consultar los tickets de un evento

`GET /api/events/:eid/tickets`

Permite consultar las inscripciones de un evento según los permisos del usuario.

### Cancelar un ticket

`PATCH /api/tickets/:tid/cancel`

Permite cancelar un ticket según las reglas de autorización.

Los tickets cancelados permanecen registrados y dejan de ocupar capacidad disponible.

Las respuestas utilizan DTO para controlar los datos del ticket, del usuario y del evento relacionados.

## Manejo de errores HTTP

La API utiliza un middleware centralizado para gestionar los errores y mantener respuestas consistentes.

Códigos HTTP contemplados:

- `400 Bad Request`: datos inválidos o reglas de negocio incumplidas.
- `401 Unauthorized`: usuario no autenticado.
- `403 Forbidden`: usuario sin permisos.
- `404 Not Found`: recurso no encontrado.
- `409 Conflict`: conflicto, como una inscripción duplicada.
- `500 Internal Server Error`: error interno del servidor.

## Seguridad

La aplicación contempla las siguientes medidas:

- Las contraseñas se almacenan mediante hashing.
- Las respuestas de la API no deben exponer contraseñas.
- Las rutas protegidas requieren autenticación.
- Los permisos se verifican según el usuario y su rol.
- Las credenciales se configuran mediante variables de entorno.
- El archivo `.env` no debe publicarse en el repositorio.

## Pruebas realizadas

Se realizaron pruebas manuales con Postman para comprobar los principales flujos de la aplicación después de implementar la arquitectura.

Entre los casos comprobados se encuentran:

1. Registro de usuarios.
2. Inicio de sesión.
3. Consulta del usuario autenticado mediante `/api/sessions/current`.
4. Ausencia de contraseñas en las respuestas de usuarios.
5. Creación y publicación de eventos.
6. Creación de inscripciones.
7. Consulta de las inscripciones de un usuario.
8. Cancelación de inscripciones.
9. Rechazo de cancelaciones repetidas.
10. Consulta de tickets de un evento.
11. Rechazo de inscripciones duplicadas activas.
12. Restricciones de permisos sobre eventos y tickets ajenos.
13. Rechazo de peticiones sin autenticación.
14. Consulta del listado de usuarios con el rol de administrador.

Las pruebas manuales complementan la revisión de la separación entre DAO, Repository, Services, Controllers y DTO.

## Objetivo de la Pre-entrega 8

La Pre-entrega 8 tiene como objetivo mejorar la organización interna de la Plataforma de Eventos e Inscripciones mediante una arquitectura basada en DAO, Repository, Services, Controllers y DTO.

La separación de responsabilidades reduce el acoplamiento entre capas, centraliza las reglas de negocio y controla la información expuesta por la API.

El comportamiento externo de los endpoints debe conservarse para que los clientes puedan seguir utilizando la API sin modificar la forma en que realizan sus solicitudes.