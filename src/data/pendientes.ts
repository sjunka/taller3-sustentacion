/**
 * Datos que todavía no existen (AWS aún no está desplegado).
 * null = pendiente. La app muestra un chip "pendiente" y nunca inventa un valor.
 * Cuando haya el dato real, se escribe aquí y no se toca nada más.
 */
export const URL_STAGING: string | null = null
export const URL_PRODUCCION: string | null = null
export const URL_REPO_EQUIPO: string | null = 'https://github.com/sjunka/cicd-pipeline-python-cd'
export const URL_DOCKERHUB: string | null = null
export const URL_SONARCLOUD: string | null = null

/** Rutas de capturas dentro de public/ (por ejemplo 'evidencias/produccion.png'). */
export const capturas: { titulo: string; ruta: string | null }[] = [
  { titulo: 'Producción con una operación nueva', ruta: null },
  { titulo: 'Target group calculadora-production-tg con el target healthy', ruta: null },
]

export const enlacesExternos: { titulo: string; url: string | null }[] = [
  { titulo: 'Repositorio del equipo', url: URL_REPO_EQUIPO },
  { titulo: 'Staging (ALB)', url: URL_STAGING },
  { titulo: 'Producción (ALB)', url: URL_PRODUCCION },
  { titulo: 'Docker Hub', url: URL_DOCKERHUB },
  { titulo: 'SonarCloud', url: URL_SONARCLOUD },
]
