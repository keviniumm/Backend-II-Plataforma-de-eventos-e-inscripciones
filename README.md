# Plataforma de Eventos e Inscripciones

## Pre-entrega 2 — Registro seguro de usuarios

### Descripción

Implementación del registro seguro de usuarios mediante el endpoint:

POST /api/sessions/register

El registro incluye validación de datos, normalización del email, verificación de usuarios duplicados, hash de contraseña con bcrypt y persistencia en MongoDB.

---

## Endpoint

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

---

## Ejemplo de petición

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

---

## Respuesta exitosa

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

---

## Seguridad

Las contraseñas son hasheadas utilizando bcrypt antes de guardarse en MongoDB.

Las contraseñas no se guardan en texto plano y tampoco se incluyen en las respuestas del endpoint.

---

## Configuración

Crear un archivo `.env` utilizando como referencia `.env.example`.

Variables necesarias:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=TU_URL_DE_MONGODB
JWT_SECRET=
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

## Cómo probar el endpoint

Enviar una petición POST a:

```text
http://localhost:8080/api/sessions/register
```

Con un body JSON que contenga:

```json
{
  "first_name": "Nombre",
  "last_name": "Apellido",
  "email": "email@mail.com",
  "password": "contraseña"
}
```