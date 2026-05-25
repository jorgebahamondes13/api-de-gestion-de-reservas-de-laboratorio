const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API de Gestión de Reservas de Laboratorio',
    version: '1.0.0',
    description: 'API REST para la gestión de reservas de un laboratorio de computación, con documentación Swagger UI y ejemplos de uso.'
  },
  servers: [
    {
      url: '/',
      description: 'Servidor local o desplegado'
    }
  ],
  tags: [
    { name: 'General', description: 'Información general y estado de la API' },
    { name: 'Reservas', description: 'Operaciones de gestión de reservas' }
  ],
  components: {
    schemas: {
      ReservaCrear: {
        type: 'object',
        required: ['usuario', 'dia', 'bloque'],
        properties: {
          usuario: {
            type: 'string',
            description: 'Identificador único del docente',
            example: 'docente1'
          },
          rol: {
            type: 'string',
            enum: ['docente', 'administrador'],
            default: 'docente',
            description: 'Rol del usuario (opcional, default: docente)'
          },
          dia: {
            type: 'string',
            enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
            description: 'Día de la semana de la reserva',
            example: 'lunes'
          },
          bloque: {
            type: 'string',
            enum: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00'],
            description: 'Bloque horario de la reserva',
            example: '08:00-09:00'
          },
          materia: {
            type: 'string',
            description: 'Nombre de la materia (opcional)',
            example: 'Matemáticas'
          },
          descripcion: {
            type: 'string',
            description: 'Descripción o notas de la reserva (opcional)',
            example: 'Clase de álgebra'
          }
        }
      },
      Reserva: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'ID único de la reserva en MongoDB',
            example: '650b4efb34e2d1cabc123456'
          },
          usuario: {
            type: 'string',
            example: 'docente1'
          },
          rol: {
            type: 'string',
            enum: ['docente', 'administrador'],
            example: 'docente'
          },
          dia: {
            type: 'string',
            enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
            example: 'lunes'
          },
          bloque: {
            type: 'string',
            enum: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00'],
            example: '08:00-09:00'
          },
          materia: {
            type: 'string',
            example: 'Matemáticas'
          },
          descripcion: {
            type: 'string',
            example: 'Clase de álgebra'
          },
          creadoEn: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora de creación de la reserva',
            example: '2026-05-23T12:00:00.000Z'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string'
          },
          message: {
            type: 'string'
          },
          hint: {
            type: 'string'
          },
          errors: {
            type: 'array',
            description: 'Errores de validación'
          }
        }
      },
      Disponibilidad: {
        type: 'object',
        properties: {
          bloque: {
            type: 'string',
            enum: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00'],
            example: '08:00-09:00'
          },
          disponible: {
            type: 'boolean',
            example: true
          }
        }
      }
    }
  },
  paths: {
    '/': {
      get: {
        tags: ['General'],
        summary: 'Estado de la API',
        responses: {
          '200': {
            description: 'API disponible',
            content: {
              'application/json': {
                example: {
                  status: 'ok',
                  service: 'API de reservas de laboratorio',
                  mongoConnected: true
                }
              }
            }
          }
        }
      }
    },
    '/health': {
      get: {
        tags: ['General'],
        summary: 'Verifica el estado de la API y MongoDB',
        responses: {
          '200': {
            description: 'Estado del servicio',
            content: {
              'application/json': {
                example: {
                  api: 'ok',
                  mongodb: 'connected',
                  timestamp: '2026-05-23T12:34:56.789Z'
                }
              }
            }
          }
        }
      }
    },
    '/reservas': {
      get: {
        tags: ['Reservas'],
        summary: 'Lista todas las reservas',
        responses: {
          '200': {
            description: 'Listado de reservas',
            content: {
              'application/json': {
                example: {
                  data: [
                    {
                      _id: '650b4efb34e2d1cabc123456',
                      usuario: 'docente1',
                      rol: 'docente',
                      dia: 'lunes',
                      bloque: '08:00-09:00',
                      materia: 'Matemáticas',
                      descripcion: 'Clase de álgebra',
                      creadoEn: '2026-05-23T12:00:00.000Z'
                    }
                  ]
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Reservas'],
        summary: 'Crear una nueva reserva',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ReservaCrear'
              },
              example: {
                usuario: 'docente1',
                dia: 'lunes',
                bloque: '08:00-09:00',
                rol: 'docente',
                materia: 'Matemáticas',
                descripcion: 'Clase de álgebra'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Reserva creada',
            content: {
              'application/json': {
                example: {
                  insertedId: '650b4efb34e2d1cabc123457',
                  data: {
                    usuario: 'docente1',
                    rol: 'docente',
                    dia: 'lunes',
                    bloque: '08:00-09:00',
                    materia: 'Matemáticas',
                    descripcion: 'Clase de álgebra',
                    creadoEn: '2026-05-23T12:00:00.000Z'
                  }
                }
              }
            }
          },
          '400': {
            description: 'Datos inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '409': {
            description: 'Bloque horario ya reservado',
            content: {
              'application/json': {
                example: {
                  error: 'El bloque horario ya se encuentra reservado'
                }
              }
            }
          }
        }
      }
    },
    '/reservas/disponibilidad': {
      get: {
        tags: ['Reservas'],
        summary: 'Consulta disponibilidad de bloques por día',
        parameters: [
          {
            name: 'dia',
            in: 'query',
            schema: {
              type: 'string'
            },
            required: true,
            description: 'Día de la semana: lunes, martes, miercoles, jueves, viernes',
            example: 'lunes'
          }
        ],
        responses: {
          '200': {
            description: 'Disponibilidad de bloques',
            content: {
              'application/json': {
                example: {
                  query: {
                    dia: 'lunes'
                  },
                  reservadas: [
                    { dia: 'lunes', bloque: '08:00-09:00', usuario: 'docente1' }
                  ],
                  disponibilidad: [
                    { bloque: '08:00-09:00', disponible: false },
                    { bloque: '09:00-10:00', disponible: true }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/reservas/usuario/{usuario}': {
      get: {
        tags: ['Reservas'],
        summary: 'Listar reservas de un usuario',
        parameters: [
          {
            name: 'usuario',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            example: 'docente1'
          }
        ],
        responses: {
          '200': {
            description: 'Reservas del usuario',
            content: {
              'application/json': {
                example: {
                  usuario: 'docente1',
                  data: [
                    {
                      _id: '650b4efb34e2d1cabc123456',
                      usuario: 'docente1',
                      rol: 'docente',
                      dia: 'lunes',
                      bloque: '08:00-09:00',
                      materia: 'Matemáticas',
                      descripcion: 'Clase de álgebra',
                      creadoEn: '2026-05-23T12:00:00.000Z'
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/reservas/{id}': {
      delete: {
        tags: ['Reservas'],
        summary: 'Eliminar una reserva por id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            example: '650b4efb34e2d1cabc123456'
          }
        ],
        responses: {
          '200': {
            description: 'Reserva eliminada',
            content: {
              'application/json': {
                example: {
                  deletedId: '650b4efb34e2d1cabc123456'
                }
              }
            }
          },
          '400': {
            description: 'ID inválido',
            content: {
              'application/json': {
                example: {
                  error: 'Id de reserva inválido'
                }
              }
            }
          },
          '404': {
            description: 'Reserva no encontrada',
            content: {
              'application/json': {
                example: {
                  error: 'Reserva no encontrada'
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
