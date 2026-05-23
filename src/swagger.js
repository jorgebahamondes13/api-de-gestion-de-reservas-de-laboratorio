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
      Reserva: {
        type: 'object',
        required: ['usuario', 'rol', 'dia', 'bloque'],
        properties: {
          usuario: {
            type: 'string',
            example: 'docente1'
          },
          rol: {
            type: 'string',
            example: 'docente',
            description: 'docente o administrador'
          },
          dia: {
            type: 'string',
            example: 'lunes',
            description: 'Día de la semana válido: lunes, martes, miercoles, jueves, viernes'
          },
          bloque: {
            type: 'string',
            example: '08:00-09:00',
            description: 'Bloques horarios válidos entre 08:00 y 14:00'
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
          }
        }
      },
      Disponibilidad: {
        type: 'object',
        properties: {
          bloque: {
            type: 'string',
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
                $ref: '#/components/schemas/Reserva'
              },
              example: {
                usuario: 'docente1',
                rol: 'docente',
                dia: 'lunes',
                bloque: '08:00-09:00',
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
