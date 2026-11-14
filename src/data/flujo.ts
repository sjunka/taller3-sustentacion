import type { Arista, Nodo, Paso } from '../lib/tipos'

export const ANCHO = 1200
export const ALTO = 430

export const nodos: Nodo[] = [
  { id: 'n1', x: 20, y: 30, w: 230, h: 130, vertical: true, logo: 'github', titulo: 'Rama de trabajo', sub: ['feature/nuevas-operaciones', 'potencia y modulo'], monoSub: true },
  { id: 'n2', x: 330, y: 30, w: 230, h: 130, vertical: true, logo: 'github', titulo: 'Pull request', sub: ['hacia main', 'solo corre build-and-test'] },
  { id: 'n3', x: 640, y: 30, w: 230, h: 130, vertical: true, logo: 'githubactions', titulo: 'Check requerido', sub: ['build-and-test en verde', 'deploy omitidos en el PR'] },
  { id: 'n4', x: 950, y: 30, w: 230, h: 130, vertical: true, logo: 'lock', titulo: 'Revisión', sub: ['regla proteger-main:', '1 aprobación del compañero'] },

  { id: 'n5', x: 20, y: 270, w: 230, h: 130, vertical: true, logo: 'github', titulo: 'Merge a main', sub: ['el push dispara', 'el pipeline completo'] },
  { id: 'n6', x: 330, y: 270, w: 230, h: 130, vertical: true, logo: 'ecs', titulo: 'Staging', sub: ['deploy-staging', 'test-staging'], monoSub: true },
  { id: 'n7', x: 640, y: 270, w: 230, h: 130, vertical: true, logo: 'lock', titulo: 'Aprobación manual', sub: ['environment: production', 'revisores del equipo'], tipo: 'puerta' },
  { id: 'n8', x: 950, y: 270, w: 230, h: 130, vertical: true, logo: 'ecs', titulo: 'Producción', sub: ['deploy-production', 'smoke-test-production'], monoSub: true },
]

export const aristas: Arista[] = [
  { id: 'f1', de: 'n1', a: 'n2', etiqueta: 'abre' },
  { id: 'f2', de: 'n2', a: 'n3', etiqueta: 'corre' },
  { id: 'f3', de: 'n3', a: 'n4', etiqueta: 'pasa' },
  { id: 'f4', de: 'n4', a: 'n5', ld: 'b', la: 't', bend: 215, etiqueta: 'aprobado: merge' },
  { id: 'f5', de: 'n5', a: 'n6', etiqueta: 'deploy' },
  { id: 'f6', de: 'n6', a: 'n7', etiqueta: 'listo' },
  { id: 'f7', de: 'n7', a: 'n8', etiqueta: 'aprobar' },
]

export const pasos: Paso[] = [
  { titulo: 'Rama de trabajo', nodos: ['n1'], aristas: [], texto: 'Uno de los dos crea la rama desde main con git checkout -b feature/nuevas-operaciones. Agrega potencia y modulo: la función en calculadora.py, la opción en el select, el elif en app.py y las pruebas unitarias, de componente y de aceptación.' },
  { titulo: 'Se abre el pull request', nodos: ['n1', 'n2'], aristas: ['f1'], texto: 'El PR va hacia main con título y descripción. En el PR solo corre build-and-test. Los jobs de despliegue aparecen omitidos, porque solo se despliega lo que ya está en main.' },
  { titulo: 'El check build-and-test', nodos: ['n2', 'n3'], aristas: ['f2'], texto: 'Ese check tiene que pasar para poder integrar. Es el nombre que usa la regla de protección de main, por eso el job no se puede renombrar.' },
  { titulo: 'Aprobación del compañero', nodos: ['n3', 'n4'], aristas: ['f3'], texto: 'La regla proteger-main exige un pull request con 1 aprobación. El otro integrante revisa Files changed, aprueba y hace el merge.' },
  { titulo: 'Merge a main', nodos: ['n4', 'n5'], aristas: ['f4'], texto: 'El merge es un push a main, y eso dispara el workflow completo. build-and-test, deploy-staging y test-staging corren solos.' },
  { titulo: 'Staging, automático', nodos: ['n5', 'n6'], aristas: ['f5'], texto: 'Staging se actualiza y se prueba sin intervención. Esta parte es despliegue continuo. Cuando termina, deploy-production queda en Waiting.' },
  { titulo: 'Aprobación manual', nodos: ['n6', 'n7'], aristas: ['f6'], estado: 'espera', aviso: 'una persona decide si la versión pasa a producción', texto: 'Antes de aprobar se abre la URL de staging y se prueban las operaciones nuevas. Esa es la razón de la aprobación: una persona confirma que lo que está en staging puede ir a producción. Aquí el pipeline pasa a ser entrega continua.' },
  { titulo: 'Producción', nodos: ['n7', 'n8'], aristas: ['f7'], estado: 'ok', aviso: 'versión liberada a producción', texto: 'En Review deployments se marca production y Approve and deploy. deploy-production y smoke-test-production corren y terminan en verde.' },
]

// Tabla de la sección 2 de la guía del Taller 3.
export const comparacion: { fila: string; delivery: string; deployment: string }[] = [
  { fila: 'Despliegue a producción', delivery: 'Manual (requiere aprobación)', deployment: 'Automático (sin intervención manual)' },
  { fila: 'Frecuencia de despliegue', delivery: 'Controlada (puede ser frecuente)', deployment: 'Muy frecuente (cada imagen validada)' },
  { fila: 'Confianza en la automatización', delivery: 'Alta', deployment: 'Extrema (exige pruebas y monitoreo sólidos)' },
  { fila: 'Velocidad (lead time)', delivery: 'Más lento', deployment: 'Más rápido' },
  { fila: 'Intervención humana', delivery: 'Sí, para liberar a producción', deployment: 'No, idealmente' },
  { fila: 'Feedback de producción', delivery: 'Retrasado por la aprobación', deployment: 'Muy rápido, directo de producción' },
]
