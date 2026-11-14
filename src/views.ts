import type { ComponentType } from 'react'
import Info from './views/Info'
import Arquitectura from './views/Arquitectura'
import Pipeline from './views/Pipeline'
import Flujo from './views/Flujo'
import Guion from './views/Guion'

export interface Vista {
  id: string
  ruta: string
  titulo: string
  descripcion: string
  componente: ComponentType
}

/** Registro de vistas. La barra de navegación y la página de inicio salen de aquí. */
export const vistas: Vista[] = [
  { id: 'info', ruta: '/', titulo: 'Inicio', descripcion: 'Equipo, enlaces a cada vista y datos pendientes.', componente: Info },
  { id: 'arquitectura', ruta: '/arquitectura', titulo: 'Arquitectura', descripcion: 'Recursos de AWS, Terraform con estado en S3 y los dos ambientes, paso a paso.', componente: Arquitectura },
  { id: 'pipeline', ruta: '/pipeline', titulo: 'Pipeline', descripcion: 'Los 5 jobs de ci-cd.yml, la aprobación manual, el fallo en staging y el rollback.', componente: Pipeline },
  { id: 'flujo', ruta: '/flujo', titulo: 'Flujo', descripcion: 'Entrega continua frente a despliegue continuo y el flujo del equipo con pull request.', componente: Flujo },
  { id: 'guion', ruta: '/guion', titulo: 'Guion', descripcion: 'Guion de la sustentación para dos voces y posibles preguntas.', componente: Guion },
]

export const URL_BASE = 'https://sjunka.github.io/taller3-sustentacion/'
export const urlCompleta = (ruta: string) => `${URL_BASE}#${ruta}`
