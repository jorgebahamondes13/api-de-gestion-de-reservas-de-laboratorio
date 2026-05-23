# EVA-4 API de Reservas de Laboratorio

API REST para la gestión de reservas de un laboratorio de computación, desarrollada con Node.js, Express y MongoDB.

## Archivos principales
- `package.json`: dependencias del proyecto.
- `src/index.js`: arranque del servidor.
- `src/app.js`: configuración de Express.
- `src/db.js`: conexión a MongoDB usando `DATABASE_URL` y `COLECCION`.
- `src/routes/reservas.js`: endpoints de la API.

## Variables de entorno
El proyecto usa las variables definidas en `.env`:
- `DATABASE_URL`: URL de conexión a MongoDB.
- `COLECCION`: nombre de la colección para reservas.

Si la URL de MongoDB no incluye el nombre de la base de datos, el proyecto usará por defecto `laboratorio_reservas`.

## Comandos
- `npm install`: instala dependencias.
- `npm start`: inicia la API.
- `npm run dev`: inicia la API con `nodemon` (si está disponible).

## Endpoints principales
- `GET /reservas`: lista todas las reservas.
- `GET /reservas/disponibilidad?dia=<dia>&bloque=<bloque>`: obtiene la disponibilidad para un día y bloque.
- `GET /reservas/usuario/:usuario`: lista reservas de un docente.
- `POST /reservas`: crea una reserva.
- `DELETE /reservas/:id`: elimina una reserva.

## Nota
En este entorno no se encontró `npm`, por lo que la instalación de dependencias debe ejecutarse localmente cuando Node.js esté disponible.
