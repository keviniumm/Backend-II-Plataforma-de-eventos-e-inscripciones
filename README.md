# Plataforma de Eventos e Inscripciones

## Pre-entrega 5 — Roles y autorización

Proyecto backend desarrollado con Node.js, Express y MongoDB para la gestión de usuarios, sesiones y eventos.

En esta pre-entrega se implementa un sistema de **roles y autorización**, utilizando autenticación mediante JWT y middlewares reutilizables.

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

El registro público no permite que el usuario seleccione libremente un rol privilegiado. Los nuevos usuarios son registrados siempre con el rol `user`.

---

## Matriz de permisos

| Acción | user | organizer | admin |
|---|---:|---:|---:|
| Consultar eventos publicados | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar sus propios eventos | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |

---

## Autenticación

La autenticación se realiza mediante JWT almacenado en una cookie.

Se implementó un middleware reutilizable:

```text
src/middlewares/auth.middleware.js
```

Este middleware:

1. Obtiene el JWT desde la cookie.
2. Valida el token mediante Passport.
3. Busca y valida el usuario.
4. Guarda el usuario autenticado en:

```js
req.user
```

5. Si no existe una sesión válida, responde:

```text
401 No autenticado
```

---

## Autorización

Se implementó un middleware reutilizable:

```text
src/middlewares/authorize.middleware.js
```

Este middleware recibe los roles permitidos para una determinada acción.

Ejemplo:

```js
authorizeMiddleware('organizer', 'admin')
```

Si el usuario autenticado no posee uno de los roles permitidos, responde:

```text
403 No tenés permisos para realizar esta acción
```

---

## Rutas protegidas

### Obtener usuario autenticado

```http
GET /api/sessions/current
```

Requiere autenticación.

Sin una cookie JWT válida:

```text
401
```

---

### Crear un evento

```http
POST /api/events
```

Roles permitidos:

```text
organizer
admin
```

Un usuario con rol `user` recibe:

```text
403
```

---

### Modificar un evento

```http
PUT /api/events/:id
```

Roles permitidos:

```text
organizer
admin
```

Además se valida la propiedad del recurso:

- Un `organizer` solamente puede modificar sus propios eventos.
- Un `admin` puede modificar cualquier evento.

Si un `organizer` intenta modificar un evento perteneciente a otro `organizer`, recibe:

```text
403
```

---

### Ver todos los usuarios

```http
GET /api/users
```

Esta ruta requiere rol:

```text
admin
```

Un usuario autenticado con otro rol recibe:

```text
403
```

---

## Diferencia entre 401 y 403

### 401 — No autenticado

Se devuelve cuando el usuario no tiene una sesión válida.

Ejemplo:

```http
GET /api/sessions/current
```

sin cookie JWT.

Respuesta:

```json
{
    "status": "error",
    "message": "No autenticado"
}
```

---

### 403 — Sin permisos

Se devuelve cuando el usuario está autenticado pero su rol no permite realizar la acción.

Ejemplo:

Un usuario con rol:

```text
user
```

intenta crear un evento.

Respuesta:

```json
{
    "status": "error",
    "message": "No tenés permisos para realizar esta acción"
}
```

---

## Validación de propiedad de eventos

Los eventos almacenan el usuario que los creó mediante el campo:

```js
organizer
```

Este campo referencia al usuario propietario del evento.

Al modificar un evento:

- Si el usuario es `organizer`, se compara su ID con el ID del propietario del evento.
- Si no coinciden, se devuelve `403`.
- Si el usuario es `admin`, puede modificar el evento independientemente de su propietario.

---

## Pruebas realizadas

Se verificaron los siguientes casos:

### 1. Usuario intenta crear un evento

Rol:

```text
user
```

Resultado:

```text
403
```

---

### 2. Organizer crea un evento

Rol:

```text
organizer
```

Resultado:

```text
201
```

El evento fue creado correctamente.

---

### 3. Organizer intenta acceder a una ruta administrativa

Rol:

```text
organizer
```

Ruta:

```http
GET /api/users
```

Resultado:

```text
403
```

---

### 4. Admin accede a una ruta administrativa

Rol:

```text
admin
```

Ruta:

```http
GET /api/users
```

Resultado:

```text
200
```

---

### 5. Acceso a ruta privada sin autenticación

Ruta:

```http
GET /api/sessions/current
```

Sin cookie JWT.

Resultado:

```text
401
```

---

### 6. Organizer intenta modificar el evento de otro organizer

Resultado:

```text
403
```

Se verificó correctamente la validación de propiedad del recurso.

---

## Estructura principal

```text
src/
│
├── config/
│   └── passport.config.js
│
├── controllers/
│   ├── events.controller.js
│   └── sessions.controller.js
│
├── middlewares/
│   ├── auth.middleware.js
│   └── authorize.middleware.js
│
├── models/
│   ├── Event.js
│   └── User.js
│
├── repositories/
│   └── users.repository.js
│
├── routes/
│   ├── events.router.js
│   ├── health.router.js
│   ├── sessions.router.js
│   └── users.router.js
│
├── app.js
└── server.js
```

---

## Middlewares

### `auth.middleware.js`

Responsable de verificar la autenticación mediante JWT.

```text
JWT válido → req.user → continúa
JWT inválido/ausente → 401
```

### `authorize.middleware.js`

Responsable de verificar que el rol del usuario tenga permiso para realizar la acción.

```text
Rol permitido → continúa
Rol no permitido → 403
```

---

## Variables de entorno

El proyecto utiliza variables de entorno para la configuración sensible.

Archivo utilizado durante el desarrollo:

```text
.env
```

Las variables esperadas son:

```text
MONGO_URL=
JWT_SECRET=
PORT=
```

Para publicar el proyecto se debe utilizar:

```text
.env.example
```

No se debe subir el archivo `.env` al repositorio.

---

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

Crear el archivo:

```text
.env
```

Configurar las variables de entorno necesarias.

Iniciar el servidor:

```bash
npm start
```

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Passport
- Passport Local
- Passport JWT
- bcrypt
- JSON Web Token
- Postman

---

## Seguridad

El proyecto implementa:

- Autenticación mediante JWT.
- JWT almacenado mediante cookie.
- Contraseñas almacenadas utilizando hash.
- Roles de usuario.
- Middleware reutilizable de autenticación.
- Middleware reutilizable de autorización.
- Protección de rutas.
- Control de propiedad de recursos.
- Respuestas diferenciadas entre errores `401` y `403`.
- Restricción del rol durante el registro público.

---

## Pre-entrega

Esta implementación corresponde a la **Pre-entrega 5 — Roles y autorización** del proyecto Backend II.

El objetivo principal de esta etapa es implementar:

- Roles.
- Autenticación.
- Autorización.
- Middleware reutilizable.
- Protección de rutas.
- Control de permisos.
- Control de propiedad de recursos.
- Manejo correcto de respuestas `401` y `403`.