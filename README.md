# Plataforma de Eventos e Inscripciones

## Pre-entrega 2 — Registro seguro de usuarios y autenticación

### Descripción

Implementación del registro seguro de usuarios y autenticación mediante los siguientes endpoints:

- POST /api/sessions/register
- POST /api/sessions/login
- GET /api/sessions/current
- POST /api/sessions/logout

El registro incluye validación de datos, normalización del email, verificación de usuarios duplicados, hash de contraseña con bcrypt y persistencia en MongoDB.

La autenticación utiliza JWT almacenado en una cookie `currentUser`.

---

## Endpoints

### POST /api/sessions/register

Registra un nuevo usuario en la base de datos.

### Campos esperados

| Campo | Tipo | Descripción |
|---|---|---|
| first_name | String | Nombre del usuario |
| last_name | String | Apellido del usuario |
| email | String | Email del usuario |
| password | String | Contraseña del usuario |

El campo `role` no puede ser enviado ni manipulado desde el registro público. Su valor por defecto es `user`.

### Ejemplo de petición

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

El email es normalizado antes de guardarse:

- Se eliminan los espacios innecesarios.
- Se convierte a minúsculas.

Resultado:

```text
ana@mail.com
```

### Respuesta exitosa

Código HTTP:

```text
201 Created
```

Ejemplo:

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

La respuesta no incluye la contraseña.

---

### POST /api/sessions/login

Autentica un usuario mediante email y contraseña.

### Ejemplo de petición

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

### Respuesta exitosa

Código HTTP:

```text
200 OK
```

Ejemplo:

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

Al realizar el login correctamente, se genera un JWT y se almacena en la cookie `currentUser`.

La cookie utiliza:

- `httpOnly: true`
- `sameSite: lax`
- `maxAge: 3600000`
- `secure: true` solamente en producción

El JWT contiene únicamente:

- `id`
- `email`
- `role`

La contraseña no se incluye en el token.

---

### GET /api/sessions/current

Obtiene los datos del usuario autenticado.

Este endpoint está protegido mediante el middleware de autenticación y requiere una cookie `currentUser` con un JWT válido.

### Ejemplo de petición

```text
GET /api/sessions/current
```

No requiere body.

### Respuesta exitosa

Código HTTP:

```text
200 OK
```

Ejemplo:

```json
{
  "id": "6aa8959fb78a518c26711f3e",
  "email": "martin.fernandez.prueba@mail.com",
  "role": "user"
}
```

La respuesta contiene únicamente `id`, `email` y `role`.

### Respuesta sin autenticación

Código HTTP:

```text
401 Unauthorized
```

Ejemplo:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

También se devuelve `401 Unauthorized` cuando el JWT es inválido o está expirado.

---

### POST /api/sessions/logout

Cierra la sesión eliminando la cookie `currentUser`.

### Ejemplo de petición

```text
POST /api/sessions/logout
```

No requiere body.

### Respuesta exitosa

Código HTTP:

```text
200 OK
```

Ejemplo:

```json
{
  "status": "success",
  "message": "Logout correcto"
}
```

---

## Errores

### Campos obligatorios faltantes

Código HTTP:

```text
400 Bad Request
```

Respuesta:

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

### Email inválido

Código HTTP:

```text
400 Bad Request
```

### Email ya registrado

Código HTTP:

```text
409 Conflict
```

Respuesta:

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

### Credenciales inválidas

Código HTTP:

```text
401 Unauthorized
```

Respuesta:

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

La misma respuesta se utiliza cuando el email no existe o la contraseña es incorrecta.

---

## Seguridad

Las contraseñas son hasheadas utilizando bcrypt antes de guardarse en MongoDB.

Las contraseñas no se guardan en texto plano y tampoco se incluyen en las respuestas del endpoint.

Los tokens JWT contienen únicamente `id`, `email` y `role`.

El secreto utilizado para firmar los JWT se configura mediante variables de entorno.

---

## Configuración

Crear un archivo `.env` utilizando como referencia `.env.example`.

Variables necesarias:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=TU_URL_DE_MONGODB
JWT_SECRET=TU_SECRETO_JWT
JWT_EXPIRES_IN=1h
```

---

## Ejecución del proyecto

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor:

```bash
npm start
```

El servidor se ejecuta en:

```text
http://localhost:8080
```

---

## Cómo probar los endpoints

### Registro

Enviar una petición POST a:

```text
http://localhost:8080/api/sessions/register
```

Con un body JSON:

```json
{
  "first_name": "Nombre",
  "last_name": "Apellido",
  "email": "email@mail.com",
  "password": "contraseña"
}
```

### Login

Enviar una petición POST a:

```text
http://localhost:8080/api/sessions/login
```

Con un body JSON:

```json
{
  "email": "email@mail.com",
  "password": "contraseña"
}
```

### Usuario actual

Enviar una petición GET a:

```text
http://localhost:8080/api/sessions/current
```

No requiere body. La cookie `currentUser` debe estar presente y contener un JWT válido.

### Logout

Enviar una petición POST a:

```text
http://localhost:8080/api/sessions/logout
```

No requiere body.

Después del logout, una petición a `/api/sessions/current` debe devolver `401 Unauthorized`.