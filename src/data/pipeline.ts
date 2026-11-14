import type { Arista, Escenario, Nodo, Paso } from '../lib/tipos'

export const ANCHO = 1200
export const ALTO = 660

// Nombres de jobs y needs tomados de .github/workflows/ci-cd.yml.
export const nodos: Nodo[] = [
  { id: 'hub', x: 30, y: 20, w: 170, h: 80, titulo: 'Docker Hub', sub: ['imagen :SHA'], logo: 'docker' },
  { id: 'sonar', x: 225, y: 20, w: 165, h: 80, titulo: 'SonarCloud', sub: ['análisis'], logo: 'sonarcloud' },
  { id: 'stg', x: 435, y: 20, w: 330, h: 80, titulo: 'Staging', sub: ['ALB + ECS Fargate'], logo: 'ecs' },

  { id: 'j1', x: 30, y: 175, w: 330, h: 110, titulo: 'build-and-test', monoTitulo: true, num: 1, logo: 'python', sub: ['Black, Pylint, Flake8, pytest', 'Docker + Sonar + push a Docker Hub', 'salida: image_uri'] },
  { id: 'j2', x: 435, y: 175, w: 330, h: 110, titulo: 'deploy-staging', monoTitulo: true, num: 2, logo: 'terraform', sub: ['needs: build-and-test', 'terraform apply, workspace staging', 'salida: alb_url'] },
  { id: 'j3', x: 840, y: 175, w: 330, h: 110, titulo: 'test-staging', monoTitulo: true, num: 3, logo: 'python', sub: ['needs: deploy-staging', 'espera el SHA en /health', 'pruebas de aceptación'] },

  { id: 'gate', x: 30, y: 420, w: 330, h: 110, titulo: 'Aprobación manual', tipo: 'puerta', logo: 'lock', sub: ['environment: production', 'Required reviewers'] },
  { id: 'j4', x: 435, y: 420, w: 330, h: 110, titulo: 'deploy-production', monoTitulo: true, num: 4, logo: 'terraform', sub: ['needs: build-and-test, test-staging', 'apply en workspace production', 'environment: production'] },
  { id: 'j5', x: 840, y: 420, w: 330, h: 110, titulo: 'smoke-test-production', monoTitulo: true, num: 5, logo: 'python', sub: ['needs: deploy-production', 'espera el SHA en /health', 'pruebas de humo'] },

  { id: 'prod', x: 435, y: 570, w: 330, h: 80, titulo: 'Producción', sub: ['ALB + ECS Fargate'], logo: 'ecs' },
]

export const aristas: Arista[] = [
  { id: 'h1', de: 'j1', a: 'hub', ld: 't', la: 'b', od: -80, etiqueta: 'push' },
  { id: 'h2', de: 'j1', a: 'sonar', ld: 't', la: 'b', od: 112, etiqueta: 'scan' },
  { id: 'n12', de: 'j1', a: 'j2', ld: 'r', la: 'l', etiqueta: 'needs' },
  { id: 'n23', de: 'j2', a: 'j3', ld: 'r', la: 'l', etiqueta: 'needs' },
  { id: 'a2', de: 'j2', a: 'stg', ld: 't', la: 'b', etiqueta: 'apply' },
  { id: 'a3', de: 'j3', a: 'stg', ld: 't', la: 'r', etiqueta: 'pytest' },
  { id: 'n3g', de: 'j3', a: 'gate', ld: 'b', la: 't', bend: 352, etiqueta: 'needs: test-staging' },
  { id: 'g4', de: 'gate', a: 'j4', ld: 'r', la: 'l', etiqueta: 'ok' },
  { id: 'n45', de: 'j4', a: 'j5', ld: 'r', la: 'l', etiqueta: 'needs' },
  { id: 'a4', de: 'j4', a: 'prod', ld: 'b', la: 't', etiqueta: 'apply' },
  { id: 'a5', de: 'j5', a: 'prod', ld: 'b', la: 'r', etiqueta: 'smoke' },
]

const fin = ['gate', 'j4', 'j5', 'prod']

const p1: Paso = {
  titulo: 'Job 1, build-and-test: integración continua',
  texto: 'Corre en push a main y en pull request. Black (falla si el formato no cumple), Pylint y Flake8 en modo informe, pruebas unitarias y de componente con cobertura mínima de 80%, terraform fmt y validate, build de la imagen y pruebas de aceptación sobre el contenedor. Luego SonarCloud. Solo en main publica la imagen en Docker Hub y entrega image_uri a los demás jobs.',
  nodos: ['j1', 'hub', 'sonar'], aristas: ['h1', 'h2'],
}
const p2: Paso = {
  titulo: 'Job 2, deploy-staging: Terraform en staging',
  texto: 'Solo corre en main. Configura las credenciales de AWS, hace terraform init con el backend de S3, selecciona el workspace staging y aplica con TF_VAR_docker_image_uri y TF_VAR_app_version (el SHA). Usa environment: staging y deja alb_url como salida.',
  nodos: ['j2', 'stg'], aristas: ['n12', 'a2'],
}

export const escenarios: Escenario[] = [
  {
    id: 'normal',
    nombre: 'Camino normal',
    pasos: [
      p1,
      p2,
      {
        titulo: 'Job 3, test-staging: aceptación sobre staging',
        texto: 'Primero espera: consulta /health hasta que aparezca el SHA del commit, con hasta 30 intentos cada 10 segundos. Después corre tests/test_acceptance_app.py contra la URL del ALB de staging y sube el reporte.',
        nodos: ['j3', 'stg'], aristas: ['n23', 'a3'],
      },
      {
        titulo: 'Aprobación manual antes de producción',
        texto: 'deploy-production declara environment: production, que tiene Required reviewers. El job queda en Waiting y no usa credenciales hasta que alguien apruebe. Antes de aprobar se abre staging y se prueba lo nuevo.',
        nodos: ['gate'], aristas: ['n3g'], estado: 'espera', aviso: 'el pipeline espera a que un revisor apruebe el despliegue a producción',
      },
      {
        titulo: 'Job 4, deploy-production: Terraform en producción',
        texto: 'Tiene needs: [build-and-test, test-staging]. Hace los mismos pasos que staging con el workspace production y la misma imagen que se probó (image_uri).',
        nodos: ['j4', 'prod'], aristas: ['g4', 'a4'],
      },
      {
        titulo: 'Job 5, smoke-test-production: pruebas de humo',
        texto: 'Espera el SHA en /health de producción y corre tests/test_smoke_app.py. Si pasa, la versión quedó liberada con los 5 jobs en verde.',
        nodos: ['j5', 'prod'], aristas: ['n45', 'a5'], estado: 'ok', aviso: 'los 5 jobs en verde, versión nueva en producción',
      },
    ],
  },
  {
    id: 'fallo',
    nombre: 'Fallo en staging',
    pasos: [
      p1,
      p2,
      {
        titulo: 'Job 3: test-staging falla',
        texto: 'pytest termina con error contra staging y el job queda en rojo. deploy-production tiene needs: test-staging, así que no se ejecuta y tampoco pide aprobación. Staging queda con la versión defectuosa, pero producción sigue con la anterior.',
        nodos: ['j3'], aristas: ['n23'], estado: 'fail', omitidos: fin,
        aviso: 'test-staging en rojo, deploy-production y smoke-test-production no corren',
      },
      {
        titulo: 'Cómo se resuelve',
        texto: 'Se corrige en una rama, se abre otro pull request y el merge a main arranca el pipeline desde el job 1. Ninguna versión que no pasó staging llega a producción.',
        nodos: ['j1'], aristas: [], omitidos: fin,
      },
    ],
  },
  {
    id: 'rollback',
    nombre: 'Rollback del circuit breaker',
    pasos: [
      p1,
      {
        titulo: 'Job 2: deploy-staging lanza la tarea nueva',
        texto: 'El servicio tiene deployment_maximum_percent = 200 y deployment_minimum_healthy_percent = 100. ECS levanta la tarea nueva junto a la anterior y no baja de una tarea sana. health_check_grace_period_seconds = 60 le da un minuto para arrancar.',
        nodos: ['j2', 'stg'], aristas: ['n12', 'a2'],
      },
      {
        titulo: 'La tarea nueva no queda sana',
        texto: 'Por ejemplo, la aplicación falla al arrancar y /health no responde 200. ECS sigue lanzando tareas y el ALB no las marca healthy. La tarea anterior nunca dejó de atender.',
        nodos: ['stg'], aristas: ['a2'], estado: 'fail', aviso: 'la versión nueva no pasa el health check en staging',
      },
      {
        titulo: 'El circuit breaker revierte',
        texto: 'deployment_circuit_breaker tiene enable y rollback en true. Después de varias tareas fallidas (como mínimo 3; en esta configuración puede tardar cerca de 10 minutos) ECS marca el despliegue como fallido y vuelve a la última versión que funcionaba.',
        nodos: ['stg'], aristas: [], estado: 'ok', aviso: 'ECS revierte a la última versión que funcionaba',
      },
      {
        titulo: 'El pipeline se detiene',
        texto: 'Con wait_for_steady_state = true, terraform apply termina con error. Si no fuera así, el paso de espera de test-staging fallaría porque /health sigue mostrando el SHA anterior. La versión defectuosa nunca llega a producción.',
        nodos: ['j2'], aristas: [], estado: 'fail', omitidos: ['j3', 'gate', 'j4', 'j5', 'prod'],
        aviso: 'deploy-staging en rojo, producción nunca recibe la versión',
      },
    ],
  },
]

export const parametros: [string, string][] = [
  ['deployment_minimum_healthy_percent', '100'],
  ['deployment_maximum_percent', '200'],
  ['deployment_circuit_breaker', 'enable = true, rollback = true'],
  ['wait_for_steady_state', 'true'],
  ['health_check_grace_period_seconds', '60'],
  ['health_check del target group', '/health, cada 30 s, 3 fallas = unhealthy'],
  ['deregistration_delay', '30 s'],
  ['desired_count', '1'],
]
