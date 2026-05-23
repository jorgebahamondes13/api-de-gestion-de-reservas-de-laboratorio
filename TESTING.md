# Testing - EVA-4 API de Reservas

## Configuración de pruebas
El proyecto usa **Jest** como framework de pruebas y **Supertest** para pruebas de integración de API.

### Archivos de pruebas
- `tests/api.test.js`: Pruebas de endpoints y rutas.
- `tests/validation.test.js`: Pruebas de funciones de validación.

## Ejecución de pruebas
```bash
npm test              # Ejecuta todas las pruebas
npm run test:watch   # Ejecuta en modo observador
```

## Cobertura de pruebas

### Endpoints probados
- **GET /**: Verifica estado de la API.
- **GET /reservas**: Lista todas las reservas.
- **POST /reservas**: Crea una nueva reserva con validaciones.
- **GET /reservas/disponibilidad**: Obtiene disponibilidad por día.
- **GET /reservas/usuario/:usuario**: Lista reservas de un usuario.
- **DELETE /reservas/:id**: Elimina una reserva.

### Casos de validación
- Rechaza días fuera de lunes-viernes.
- Rechaza bloques horarios inválidos (solo 08:00-14:00).
- Rechaza duplicidad de reservas en el mismo bloque.
- Rechaza IDs inválidos en DELETE.
- Requiere usuario obligatorio.
- Valida roles (docente/administrador).

## Ejemplos de casos de prueba

### Crear una reserva válida
```javascript
POST /reservas
{
  "usuario": "docente1",
  "rol": "docente",
  "dia": "lunes",
  "bloque": "08:00-09:00",
  "materia": "Matemáticas",
  "descripcion": "Clase de álgebra"
}
```
Esperado: Status 201, retorna insertedId.

### Rechazar reserva con día inválido
```javascript
POST /reservas
{
  "usuario": "docente1",
  "rol": "docente",
  "dia": "sabado",  // Inválido
  "bloque": "08:00-09:00",
  "materia": "Matemáticas"
}
```
Esperado: Status 400, retorna errores de validación.

### Rechazar duplicidad
```javascript
POST /reservas (segundo intento del mismo bloque)
{
  "usuario": "docente2",
  "rol": "docente",
  "dia": "lunes",
  "bloque": "08:00-09:00",  // Mismo bloque ya reservado
  "materia": "Física"
}
```
Esperado: Status 409, error de conflicto.

### Consultar disponibilidad
```javascript
GET /reservas/disponibilidad?dia=lunes
```
Esperado: Status 200, retorna lista de bloques con disponibilidad true/false.

### Eliminar una reserva
```javascript
DELETE /reservas/507f1f77bcf86cd799439011
```
Esperado: Status 200, retorna deletedId.

### Eliminar con ID inválido
```javascript
DELETE /reservas/id-invalido
```
Esperado: Status 400, error de ID inválido.

## Notas
- Los tests mockan la colección de MongoDB para no requerir conexión real.
- Las pruebas validan tanto la lógica como los códigos HTTP.
- Cada caso de prueba es independiente y aislado.
