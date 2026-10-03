# Plataforma de Eventos e Inscripciones

## Pre-entrega 6 — Entidad Events y lógica de negocio

Proyecto backend desarrollado con Node.js, Express y MongoDB para la gestión de usuarios, sesiones y eventos.

En esta pre-entrega se completa la entidad `Event`, incorporando:

- CRUD y consulta de eventos
- Validaciones de negocio
- Roles y autorización
- Control de propiedad de los eventos
- Filtros
- Paginación
- Ordenamiento
- Separación de responsabilidades mediante controllers, services y repositories

---

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- Passport
- JWT
- Cookies
- bcrypt

---

## Roles

El sistema maneja tres roles:

- `user`
- `organizer`
- `admin`

El rol por defecto al registrarse es:

```text
user
```

El registro público no permite seleccionar libremente un rol privilegiado.

---

## Matriz de permisos

| Acción | user | organizer | admin |
|---|---:|---:|---:|
| Consultar eventos | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar sus propios eventos | ❌ | ✅ | ✅ |
| Modificar eventos de otros organizadores | ❌ | ❌ | ✅ |
| Cambiar estado de sus propios eventos | ❌ | ✅ | ✅ |
| Cambiar estado de cualquier evento | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |

---

## Entidad Event

La entidad `Event` contiene los siguientes campos:

```text
title
description
category
date
location
capacity
price
status
organizer
```

### Estados disponibles

```text
draft
published
cancelled
finished
```

El estado inicial por defecto es:

```text
draft
```

### Organizer

El campo `organizer` almacena el `ObjectId` del usuario que creó el evento.

El organizador se obtiene automáticamente desde:

```js
req.user.id
```

Por lo tanto, el usuario no puede definir manualmente el propietario del evento desde el body de la petición.

---

## Autenticación

La autenticación se realiza mediante JWT almacenado en una cookie.

El middleware reutilizable se encuentra en:

```text
src/middlewares/auth.middleware.js
```

Este middleware valida la sesión del usuario y deja la información del usuario autenticado disponible en:

```js
req.user
```

Si no existe una sesión válida, se responde con:

```text
401
```

---

## Autorización

El middleware de autorización se encuentra en:

```text
src/middlewares/authorize.middleware.js
```

Permite restringir determinadas rutas según el rol del usuario.

Ejemplo:

```js
authorizeMiddleware('organizer', 'admin')
```

Si el usuario está autenticado pero no posee un rol permitido, se responde con:

```text
403
```

---

# Rutas de Events

## Crear evento

```http
POST /api/events
```

Roles permitidos:

```text
organizer
admin
```

El organizador se asigna automáticamente desde el usuario autenticado.

Ejemplo de body:

```json
{
    "title": "Congreso de Tecnología",
    "description": "Evento sobre tecnología y desarrollo",
    "category": "tecnologia",
    "date": "2027-06-15T18:00:00.000Z",
    "location": "Centro de Convenciones",
    "capacity": 100,
    "price": 5000,
    "status": "draft"
}
```

---

## Obtener eventos

```http
GET /api/events
```

La consulta es pública.

La respuesta incluye información de paginación:

```json
{
    "status": "success",
    "data": [],
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
}
```

---

## Obtener evento por ID

```http
GET /api/events/:id
```

La consulta es pública.

Si el evento no existe:

```text
404
```

---

## Modificar evento

```http
PUT /api/events/:id
```

Roles permitidos:

```text
organizer
admin
```

Reglas de autorización:

- Un `organizer` solamente puede modificar sus propios eventos.
- Un `admin` puede modificar cualquier evento.
- Un `organizer` que intenta modificar un evento de otro organizador recibe `403`.

---

## Modificar estado

```http
PATCH /api/events/:id/status
```

Roles permitidos:

```text
organizer
admin
```

Ejemplo:

```json
{
    "status": "published"
}
```

El cambio de estado respeta las reglas de negocio de la entidad.

---

# Filtros

La ruta:

```http
GET /api/events
```

permite utilizar los siguientes filtros:

```text
status
category
location
dateFrom
dateTo
```

### Filtrar por estado

```http
GET /api/events?status=published
```

### Filtrar por categoría

```http
GET /api/events?category=workshop
```

### Filtrar por ubicación

```http
GET /api/events?location=Buenos%20Aires
```

### Filtrar desde una fecha

```http
GET /api/events?dateFrom=2027-01-01
```

### Filtrar hasta una fecha

```http
GET /api/events?dateTo=2027-12-31
```

### Combinar filtros

```http
GET /api/events?status=published&category=workshop
```

También es posible combinar los filtros de fecha:

```http
GET /api/events?dateFrom=2027-01-01&dateTo=2027-12-31
```

---

# Paginación

La consulta de eventos utiliza:

```text
page
limit
```

Ejemplo:

```http
GET /api/events?page=1&limit=2
```

La respuesta contiene:

```json
{
    "status": "success",
    "data": [],
    "page": 1,
    "limit": 2,
    "total": 4,
    "totalPages": 2
}
```

---

# Ordenamiento

Los eventos pueden ordenarse por fecha mediante:

```http
GET /api/events?sort=date
```

El ordenamiento se realiza de forma ascendente.

---

# Reglas de negocio

Las validaciones de negocio se encuentran en:

```text
src/services/events.service.js
```

## Fecha futura

La fecha de un evento debe ser futura.

No se permite crear o modificar un evento utilizando una fecha pasada.

---

## Capacidad

La capacidad debe ser mayor a cero.

```text
capacity > 0
```

No se permite:

```json
{
    "capacity": 0
}
```

---

## Precio

El precio debe ser mayor o igual a cero.

```text
price >= 0
```

No se permite:

```json
{
    "price": -1
}
```

---

## Eventos cancelados

Un evento con estado:

```text
cancelled
```

no puede ser modificado.

---

## Eventos finalizados

Un evento con estado:

```text
finished
```

no puede volver a publicarse.

No se permite la transición:

```text
finished → published
```

---

# Arquitectura

El proyecto separa las responsabilidades en diferentes capas:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Model
  ↓
MongoDB
```

### Routes

Definen los endpoints y aplican los middlewares correspondientes.

Ubicación:

```text
src/routes/
```

### Controllers

Se encargan de:

- Recibir la petición.
- Obtener parámetros y body.
- Llamar al service.
- Construir la respuesta HTTP.

Ubicación:

```text
src/controllers/
```

### Services

Contienen la lógica de negocio y las validaciones.

Para Events:

```text
src/services/events.service.js
```

### Repositories

Se encargan del acceso a los datos.

Para Events:

```text
src/repositories/events.repository.js
```

### Models

Definen los esquemas de Mongoose.

Para Events:

```text
src/models/Event.js
```

---

# Estructura principal

```text
src/
├── config/
│   └── passport.config.js
├── controllers/
│   ├── events.controller.js
│   └── sessions.controller.js
├── dao/
│   └── users.dao.js
├── middlewares/
│   ├── auth.middleware.js
│   └── authorize.middleware.js
├── models/
│   ├── Event.js
│   └── User.js
├── repositories/
│   ├── events.repository.js
│   └── users.repository.js
├── routes/
│   ├── events.router.js
│   ├── sessions.router.js
│   └── users.router.js
├── services/
│   └── events.service.js
├── utils/
│   └── jwt.js
└── server.js
```

---

# Usuarios

Existe una ruta protegida para consultar todos los usuarios:

```http
GET /api/users
```

Esta ruta requiere rol:

```text
admin
```

Los usuarios se obtienen desde MongoDB mediante:

```text
UsersRepository
    ↓
UsersDao
    ↓
User Model
    ↓
MongoDB
```

La contraseña no se incluye en la respuesta.

---

# Variables de entorno

El proyecto utiliza un archivo `.env`.

Ejemplo:

```env
MONGO_URL=mongodb://localhost:27017/backend2
PORT=8080
JWT_SECRET=tu_secreto
```

Para compartir la configuración sin exponer secretos se incluye:

```text
.env.example
```

El archivo `.env` no debe subirse al repositorio.

---

# Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar al proyecto:

```bash
cd "Backend II Plataforma de eventos e inscripciones"
```

Instalar dependencias:

```bash
npm install
```

Configurar las variables de entorno en:

```text
.env
```

Iniciar el servidor:

```bash
npm start
```

El servidor se ejecuta por defecto en:

```text
http://localhost:8080
```

---

# Pruebas manuales realizadas

Se verificaron mediante Postman diferentes casos de uso.

### Autorización

- Usuario con rol `user` intenta crear un evento → `403`
- `organizer` crea un evento → `201`
- `organizer` modifica su propio evento → `200`
- `organizer` intenta modificar un evento de otro organizador → `403`
- `admin` modifica un evento de otro organizador → `200`

### Validaciones

- Crear evento con fecha pasada → rechazado
- Crear evento con capacidad `0` → rechazado
- Crear evento con precio negativo → rechazado
- Modificar evento con capacidad `0` → rechazado
- Modificar evento cancelado → rechazado
- Publicar evento finalizado → rechazado

### Consultas

- Obtener todos los eventos
- Obtener evento por ID
- Consultar un evento inexistente → `404`
- Filtrar por categoría
- Filtrar por estado
- Filtrar por ubicación
- Filtrar por rango de fechas
- Utilizar paginación
- Ordenar por fecha

### Usuarios

- Consultar usuarios como `admin`
- Verificar que las contraseñas no sean devueltas

---

# Seguridad

Se aplican las siguientes medidas:

- Autenticación mediante JWT.
- JWT almacenado en cookie.
- Autorización mediante roles.
- Control de propiedad de eventos.
- El `organizer` se obtiene desde el usuario autenticado.
- No se permite establecer el propietario desde el body.
- Las contraseñas no se devuelven en la consulta de usuarios.
- Las variables sensibles se mantienen en `.env`.
- `.env` no debe ser publicado en GitHub.

---

# Estado del proyecto

La implementación correspondiente a la entidad `Event` incluye:

- Modelo de eventos.
- Creación de eventos.
- Consulta de eventos.
- Consulta individual.
- Actualización de eventos.
- Actualización de estado.
- Validaciones de negocio.
- Autorización por roles.
- Validación de propietario.
- Filtros.
- Paginación.
- Ordenamiento.
- Acceso a datos mediante Repository.
- Lógica de negocio mediante Service.
- Documentación de endpoints y reglas de negocio.