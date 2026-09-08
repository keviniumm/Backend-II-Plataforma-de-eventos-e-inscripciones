# Backend II - Plataforma de Eventos e Inscripciones

## Temática

API REST orientada a la gestión de una plataforma de eventos e inscripciones.

Este proyecto representa la base inicial de una aplicación backend preparada para incorporar futuras funcionalidades como gestión de usuarios, autenticación, eventos e inscripciones.

## Tecnologías

- Node.js
- Express
- dotenv
- JavaScript
- Módulos ESM

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar a la carpeta del proyecto:

```bash
cd backend-ii-plataforma-de-eventos-e-inscripciones
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto utilizando como referencia `.env.example`.

Variables disponibles:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=
JWT_SECRET=
```

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

El servidor se ejecutará en:

```text
http://localhost:8080
```

## Estructura de carpetas

```text
Backend II Plataforma de eventos e inscripciones/
│
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── routes/
│   │   ├── events.router.js
│   │   ├── health.router.js
│   │   └── sessions.router.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── services/
│   ├── repositories/
│   ├── dao/
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── middlewares/
│   └── utils/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Rutas disponibles

### Health Check

**GET**

```text
/api/health
```

Respuesta:

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

### Events

**GET**

```text
/api/events
```

Respuesta:

```json
{
  "status": "success",
  "payload": []
}
```

### Sessions

Estructura inicial disponible mediante:

```text
/api/sessions
```

Sin lógica de autenticación implementada en esta etapa.