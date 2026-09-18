# Plataforma de Eventos e Inscripciones

## Pre-entrega 4 — Autenticación centralizada con Passport.js

### Descripción

Implementación de autenticación centralizada mediante Passport.js para los siguientes endpoints:

* POST /api/sessions/register
* POST /api/sessions/login
* GET /api/sessions/current
* POST /api/sessions/logout

La autenticación utiliza Passport.js con las estrategias `register`, `login` y `current`.

El registro incluye validación de datos, normalización del email, verificación de usuarios duplicados, hash de contraseña con bcrypt, asignación del rol por defecto y persistencia en MongoDB.

El login valida las credenciales mediante Passport, genera un JWT y lo almacena en una cookie `currentUser`.

El endpoint `current` valida el JWT mediante la estrategia `current` de Passport y obtiene el usuario autenticado mediante `req.user`.

---

## Passport.js

Passport se inicializa en `src/app.js`.

Las estrategias de autenticación se encuentran centralizadas en:

`src/config/passport.config.js`

### Estrategia register

La estrategia `register` se encarga de:

* Validar los campos obligatorios.
* Validar el formato básico del email.
* Validar la longitud mínima de la contraseña.
* Normalizar el email.
* Verificar si el usuario ya existe.
* Hashear la contraseña mediante bcrypt.
* Asignar el rol `user` por defecto.
* Crear el usuario en MongoDB.

La ruta utiliza la estrategia `register` de Passport.

### Estrategia login

La estrategia `login` se encarga de:

* Recibir email y contraseña.
* Normalizar el email.
* Buscar el usuario.
* Comparar la contraseña mediante bcrypt.
* Validar las credenciales.

Las credenciales inválidas generan una respuesta genérica para no revelar si el email existe o no.

La ruta utiliza la estrategia `login` de Passport.

Después de una autenticación exitosa, el controller genera el JWT y lo almacena en la cookie `currentUser`.

### Estrategia current

La estrategia `current` utiliza `passport-jwt`.

El JWT se obtiene desde la cookie `currentUser`.

Passport valida el token mediante `JWT_SECRET` y busca el usuario correspondiente en MongoDB.

El usuario autenticado queda disponible mediante `req.user`.

La ruta utiliza la estrategia `current` de Passport.

No se utiliza `express-session`, ya que la autenticación se realiza mediante JWT.

La estructura permite incorporar futuras estrategias de autenticación externa, como Google o GitHub, desde `passport.config.js` sin modificar la inicialización de Passport en `app.js`.

---

## Endpoints

### POST /api/sessions/register

Registra un nuevo usuario en la base de datos.

### Campos esperados

| Campo      | Tipo   | Descripción            |
| ---------- | ------ | ---------------------- |
| first_name | String | Nombre del usuario     |
| last_name  | String | Apellido del usuario   |
| email      | String | Email del usuario      |
| password   | String | Contraseña del usuario |

El campo `role` no debe ser enviado desde el registro público. La estrategia `register` asigna el valor `user`.

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

* Se eliminan los espacios innecesarios.
* Se convierte a minúsculas.

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

Autentica un usuario mediante email y contraseña utilizando Passport.

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

* `httpOnly: true`
* `sameSite: lax`
* `maxAge: 3600000`
* `secure: true` solamente en producción

El JWT contiene únicamente:

* `id`
* `email`
* `role`

La contraseña no se incluye en el token.

---

### GET /api/sessions/current

Obtiene los datos del usuario autenticado.

Este endpoint está protegido mediante la estrategia `current` de Passport y requiere una cookie `currentUser` con un JWT válido.

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
  "status": "success",
  "payload": {
    "id": "6aaca2fdab88612a00772004",
    "email": "carlos@test.com",
    "role": "user"
  }
}
```

La respuesta no incluye la contraseña ni otros datos personales innecesarios.

### Respuesta sin autenticación

Código HTTP:

```text
401 Unauthorized
```

También se devuelve `401 Unauthorized` cuando el JWT es inválido, está manipulado o está expirado.

---

### POST /api/sessions/logout

Cierra la sesión eliminando la cookie `currentUser`.

Este endpoint no utiliza Passport.

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

Las contraseñas no se guardan en texto plano y tampoco se incluyen en las respuestas de los endpoints.

Los tokens JWT contienen únicamente `id`, `email` y `role`.

El JWT se almacena en una cookie `currentUser` configurada con `httpOnly: true`.

El secreto utilizado para firmar y validar los JWT se configura mediante variables de entorno.

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

El archivo `.env` no debe subirse al repositorio.

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

El login exitoso genera la cookie `currentUser`.

### Usuario actual

Enviar una petición GET a:

```text
http://localhost:8080/api/sessions/current
```

No requiere body.

La cookie `currentUser` debe estar presente y contener un JWT válido.

### Logout

Enviar una petición POST a:

```text
http://localhost:8080/api/sessions/logout
```

No requiere body.

Después del logout, una petición a `/api/sessions/current` debe devolver `401 Unauthorized`.
