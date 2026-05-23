# Plan del Proyecto

## 1. Objetivo
Definir un plan de trabajo para el desarrollo del informe y la planificación del MVP de la API de gestión de reservas de laboratorio, incluyendo una fase de levantamiento de requerimientos y una fase de pruebas.

## 2. Contexto
Basado en `spec.md`, el proyecto se centra en una API para la gestión de agendamiento de un laboratorio de computación en un establecimiento educacional municipal en Rancagua. La solución propone centralizar la reserva de horarios y evitar duplicidades mediante validaciones en tiempo real.

## 3. Variables del Proyecto
- `DATABASE_URL`: mongodb+srv://jorgebahamondes_db_user:1234@cluster0.k8rz8gr.mongodb.net/
- `COLECCION`: coleccionprueba4

Estas variables serán usadas para conectar el MVP con la base de datos MongoDB y para almacenar las reservas en la colección definida.

## 4. Alcance del MVP
### Funcionalidades esenciales
- Consulta de disponibilidad de horarios del laboratorio.
- Creación de reservas con validación de bloque horario.
- Cancelación de reservas.
- Gestión de roles básicos: docente y administrador.
- Almacenamiento de datos en MongoDB usando la colección `coleccionprueba4`.

### Exclusiones del MVP
- Integración con autenticación institucional externa.
- Notificaciones por correo electrónico.
- Aplicaciones móviles.
- Analítica avanzada.

## 5. Fase de levantamiento
### 5.1 Revisión de requerimientos
- Analizar el problema actual de agendamiento descrito en `spec.md`.
- Confirmar los roles de usuario: docente y administrador.
- Definir los bloques horarios y días hábiles (lunes a viernes).
- Identificar las entidades principales: reserva, usuario, bloque horario.

### 5.2 Validación técnica
- Confirmar la arquitectura de la API REST en Node.js/Express para el MVP.
- Validar el modelo de datos MongoDB y la colección `coleccionprueba4`.
- Revisar la infraestructura propuesta: Render para la API y MongoDB Atlas para la base de datos.

### 5.3 Entregables de levantamiento
- Documento de requerimientos funcionales y no funcionales.
- Modelo de datos inicial para MongoDB.
- Definición de endpoints principales.
- Diagrama simple de flujo de reservas.

## 6. Fase de desarrollo del MVP
### 6.1 Setup inicial
- Configurar el proyecto Node.js con Express.
- Cargar variables de entorno `DATABASE_URL` y `COLECCION`.
- Conectar la API a MongoDB Atlas usando `DATABASE_URL`.
- Crear la colección `coleccionprueba4` para las reservas.

### 6.2 Implementación de endpoints
- `GET /reservas`: listar reservas y disponibilidad.
- `POST /reservas`: crear nueva reserva con validación.
- `DELETE /reservas/:id`: cancelar reserva.
- `GET /reservas/usuario/:id`: ver reservas por docente.

### 6.3 Validaciones
- Validar que no exista otra reserva en el mismo bloque horario.
- Validar que las reservas se limiten a lunes-viernes.
- Validar permisos básicos entre docentes y administrador.

## 7. Fase de testing
### 7.1 Pruebas unitarias
- Probar la creación de reservas válidas.
- Probar rechazo de reservas duplicadas.
- Probar la cancelación de reservas.
- Probar lectura de datos desde `coleccionprueba4`.

### 7.2 Pruebas de integración
- Verificar la conexión real con MongoDB usando `DATABASE_URL`.
- Asegurar que los endpoints gestionen correctamente los flujos de reserva.
- Validar que la colección `coleccionprueba4` reciba y entregue datos correctos.

### 7.3 Pruebas de aceptación
- Simular el flujo de un docente reservando un bloque.
- Simular la cancelación y la disponibilidad liberada.
- Validar la separación de roles entre docente y administrador.

### 7.4 Documentación de pruebas
- Registrar casos de prueba y resultados.
- Documentar errores encontrados y acciones correctivas.

## 8. Cronograma tentativo
- Semana 1: Levantamiento de requerimientos y definición de modelo.
- Semana 2: Implementación del MVP y conexión a MongoDB.
- Semana 3: Testing unitario, de integración y ajustes.
- Semana 4: Revisión final del informe y entrega.

## 9. Observaciones finales
Este plan se basa en el MVP descrito en `spec.md` y en el uso de las variables de entorno `DATABASE_URL` y `COLECCION`. La fase de levantamiento asegura que los objetivos del informe y la arquitectura técnica estén alineados, mientras que el testing valida el comportamiento esperado del sistema.
