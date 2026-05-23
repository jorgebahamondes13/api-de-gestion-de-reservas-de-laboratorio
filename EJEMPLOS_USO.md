# Ejemplos de uso - EVA-4 API de Reservas

## Inicio rápido
```bash
npm install
npm start
# La API estará disponible en http://localhost:3000
```

## Endpoints y ejemplos

### 1. Verificar estado de la API
```bash
curl http://localhost:3000/
```
**Respuesta:**
```json
{
  "status": "ok",
  "service": "API de reservas de laboratorio"
}
```

---

### 2. Listar todas las reservas
```bash
curl http://localhost:3000/reservas
```
**Respuesta:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "usuario": "docente1",
      "rol": "docente",
      "dia": "lunes",
      "bloque": "08:00-09:00",
      "materia": "Matemáticas",
      "descripcion": "Clase de álgebra",
      "creadoEn": "2026-05-23T10:00:00.000Z"
    }
  ]
}
```

---

### 3. Crear una nueva reserva
```bash
curl -X POST http://localhost:3000/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "docente1",
    "rol": "docente",
    "dia": "lunes",
    "bloque": "08:00-09:00",
    "materia": "Matemáticas",
    "descripcion": "Clase de álgebra"
  }'
```
**Respuesta (201):**
```json
{
  "insertedId": "507f1f77bcf86cd799439012",
  "data": {
    "usuario": "docente1",
    "rol": "docente",
    "dia": "lunes",
    "bloque": "08:00-09:00",
    "materia": "Matemáticas",
    "descripcion": "Clase de álgebra",
    "creadoEn": "2026-05-23T10:00:00.000Z"
  }
}
```

---

### 4. Consultar disponibilidad por día
```bash
curl "http://localhost:3000/reservas/disponibilidad?dia=lunes"
```
**Respuesta:**
```json
{
  "query": {
    "dia": "lunes"
  },
  "reservadas": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "usuario": "docente1",
      "dia": "lunes",
      "bloque": "08:00-09:00"
    }
  ],
  "disponibilidad": [
    { "bloque": "08:00-09:00", "disponible": false },
    { "bloque": "09:00-10:00", "disponible": true },
    { "bloque": "10:00-11:00", "disponible": true },
    { "bloque": "11:00-12:00", "disponible": true },
    { "bloque": "12:00-13:00", "disponible": true },
    { "bloque": "13:00-14:00", "disponible": true }
  ]
}
```

---

### 5. Listar reservas de un usuario
```bash
curl http://localhost:3000/reservas/usuario/docente1
```
**Respuesta:**
```json
{
  "usuario": "docente1",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "usuario": "docente1",
      "rol": "docente",
      "dia": "lunes",
      "bloque": "08:00-09:00",
      "materia": "Matemáticas",
      "creadoEn": "2026-05-23T10:00:00.000Z"
    }
  ]
}
```

---

### 6. Eliminar una reserva
```bash
curl -X DELETE http://localhost:3000/reservas/507f1f77bcf86cd799439011
```
**Respuesta (200):**
```json
{
  "deletedId": "507f1f77bcf86cd799439011"
}
```

---

## Códigos de estado HTTP

| Status | Significado |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Bloque horario ya reservado |
| 500 | Internal Server Error - Error del servidor |

---

## Validaciones

### Días válidos
- `lunes`, `martes`, `miercoles`, `jueves`, `viernes`

### Bloques válidos
- `08:00-09:00`
- `09:00-10:00`
- `10:00-11:00`
- `11:00-12:00`
- `12:00-13:00`
- `13:00-14:00`

### Roles válidos
- `docente`
- `administrador`

### Campos obligatorios
- `usuario` (string, no vacío)
- `dia` (string, uno de los días válidos)
- `bloque` (string, uno de los bloques válidos)

### Campos opcionales
- `rol` (default: "docente")
- `materia` (string)
- `descripcion` (string)

---

## Errores comunes

### Bloque ya reservado
```json
{
  "error": "El bloque horario ya se encuentra reservado"
}
```

### Campos inválidos
```json
{
  "errors": [
    "El campo dia debe ser uno de lunes, martes, miercoles, jueves o viernes",
    "El campo usuario es obligatorio"
  ]
}
```

### ID inválido
```json
{
  "error": "Id de reserva inválido"
}
```

---

## Notas
- Todas las solicitudes deben tener `Content-Type: application/json`.
- Los nombres de los días son en minúsculas.
- Los espacios en los campos se recortan automáticamente.
- Las consultas de disponibilidad requieren el parámetro `dia`.
