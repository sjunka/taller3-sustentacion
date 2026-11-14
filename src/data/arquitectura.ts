import type { Arista, Nodo, Paso } from '../lib/tipos'

export const ANCHO = 1200
export const ALTO = 720

// Los nombres salen de infra/main.tf, infra/backend.hcl y .github/workflows/ci-cd.yml.
export const nodos: Nodo[] = [
  { id: 'dev', x: 20, y: 20, w: 180, h: 90, titulo: 'Equipo', sub: ['Sergio y Valeria'], logo: 'laptop' },
  { id: 'repo', x: 310, y: 20, w: 180, h: 90, titulo: 'Repo GitHub', sub: ['rama main'], logo: 'github' },
  { id: 'actions', x: 600, y: 20, w: 180, h: 90, titulo: 'GitHub Actions', sub: ['ci-cd.yml'], logo: 'githubactions' },
  { id: 'hub', x: 965, y: 20, w: 220, h: 90, titulo: 'Docker Hub', sub: ['imagen :SHA y :latest'], logo: 'docker' },

  { id: 's3', x: 200, y: 170, w: 280, h: 90, titulo: 'Bucket S3', sub: ['estado de Terraform', 'tfstate-calculadora-sjunka'], logo: 's3' },
  { id: 'tf', x: 600, y: 170, w: 180, h: 90, titulo: 'Terraform', sub: ['carpeta infra/'], logo: 'terraform' },

  { id: 'gstg', x: 10, y: 340, w: 580, h: 365, titulo: 'Staging: cluster calculadora-staging-cluster', tipo: 'grupo' },
  { id: 'albS', x: 30, y: 395, w: 130, h: 130, titulo: 'ALB', sub: ['puerto 80'], logo: 'elb', vertical: true },
  { id: 'tgS', x: 225, y: 395, w: 130, h: 130, titulo: 'Target group', sub: ['GET /health'], logo: 'elb', vertical: true },
  { id: 'svcS', x: 420, y: 395, w: 130, h: 130, titulo: 'Servicio ECS', sub: ['tarea Fargate', '256 CPU, 512 MB'], logo: 'ecs', vertical: true },
  { id: 'cwS', x: 420, y: 570, w: 130, h: 120, titulo: 'CloudWatch', sub: ['logs, 7 días'], logo: 'cloudwatch', vertical: true },

  { id: 'gprd', x: 600, y: 340, w: 590, h: 365, titulo: 'Producción: cluster calculadora-production-cluster', tipo: 'grupo' },
  { id: 'albP', x: 620, y: 395, w: 130, h: 130, titulo: 'ALB', sub: ['puerto 80'], logo: 'elb', vertical: true },
  { id: 'tgP', x: 815, y: 395, w: 130, h: 130, titulo: 'Target group', sub: ['GET /health'], logo: 'elb', vertical: true },
  { id: 'svcP', x: 1010, y: 395, w: 130, h: 130, titulo: 'Servicio ECS', sub: ['tarea Fargate', '256 CPU, 512 MB'], logo: 'ecs', vertical: true },
  { id: 'cwP', x: 1010, y: 570, w: 130, h: 120, titulo: 'CloudWatch', sub: ['logs, 7 días'], logo: 'cloudwatch', vertical: true },
]

export const aristas: Arista[] = [
  { id: 'e1', de: 'dev', a: 'repo', ld: 'r', la: 'l', etiqueta: 'git push' },
  { id: 'e2', de: 'repo', a: 'actions', ld: 'r', la: 'l', etiqueta: 'dispara' },
  { id: 'e3', de: 'actions', a: 'hub', ld: 'r', la: 'l', etiqueta: 'docker push' },
  { id: 'e4', de: 'actions', a: 'tf', ld: 'b', la: 't', etiqueta: 'apply' },
  { id: 'e5', de: 'tf', a: 's3', ld: 'l', la: 'r', etiqueta: 'estado' },
  { id: 'e6', de: 'tf', a: 'gstg', ld: 'b', la: 't', bend: 295, etiqueta: 'workspace staging' },
  { id: 'e7', de: 'hub', a: 'svcS', ld: 'b', la: 't', bend: 325, etiqueta: 'pull de imagen' },
  { id: 'e8', de: 'albS', a: 'tgS', ld: 'r', la: 'l', etiqueta: 'http' },
  { id: 'e9', de: 'tgS', a: 'svcS', ld: 'r', la: 'l', etiqueta: 'tareas' },
  { id: 'e10', de: 'svcS', a: 'cwS', ld: 'b', la: 't', etiqueta: 'logs' },
  { id: 'e11', de: 'tf', a: 'gprd', ld: 'b', la: 't', bend: 295, etiqueta: 'workspace production' },
  { id: 'e12', de: 'hub', a: 'svcP', ld: 'b', la: 't', etiqueta: 'pull de imagen' },
  { id: 'e13', de: 'albP', a: 'tgP', ld: 'r', la: 'l', etiqueta: 'http' },
  { id: 'e14', de: 'tgP', a: 'svcP', ld: 'r', la: 'l', etiqueta: 'tareas' },
  { id: 'e15', de: 'svcP', a: 'cwP', ld: 'b', la: 't', etiqueta: 'logs' },
]

export const pasos: Paso[] = [
  {
    titulo: 'Del equipo al repositorio',
    texto: 'Sergio o Valeria hacen push o abren un pull request hacia main en el repositorio de GitHub. Ese repositorio es el que se entrega y el que ejecuta el pipeline.',
    nodos: ['dev', 'repo'], aristas: ['e1'],
  },
  {
    titulo: 'GitHub Actions arranca el workflow',
    texto: 'El archivo .github/workflows/ci-cd.yml se dispara con un push a main, con un pull request hacia main o a mano (workflow_dispatch). Los cambios que solo tocan archivos .md o docs/ no vuelven a desplegar.',
    nodos: ['repo', 'actions'], aristas: ['e2'],
  },
  {
    titulo: 'La imagen llega a Docker Hub',
    texto: 'El job build-and-test construye la imagen y, solo en main, la publica con dos etiquetas: el SHA del commit y latest. El SHA permite saber qué versión exacta corre en cada ambiente.',
    nodos: ['actions', 'hub'], aristas: ['e3'],
  },
  {
    titulo: 'Terraform corre dentro del pipeline',
    texto: 'deploy-staging y deploy-production ejecutan terraform init y terraform apply sobre la carpeta infra/, que tiene main.tf, variables.tf, outputs.tf y backend.hcl. Terraform describe la infraestructura y el pipeline la aplica.',
    nodos: ['actions', 'tf'], aristas: ['e4'],
  },
  {
    titulo: 'El estado vive en S3',
    texto: 'El bloque backend "s3" guarda el estado en el bucket tfstate-calculadora-sjunka, con use_lockfile para bloquear mientras hay un apply en curso. El pipeline corre cada vez en una máquina nueva, así que el estado no puede quedar en el computador de nadie.',
    nodos: ['tf', 's3'], aristas: ['e5'],
  },
  {
    titulo: 'Terraform crea staging',
    texto: 'Con el workspace staging, los mismos archivos .tf crean el cluster, los security groups, el ALB, el target group, el listener, la task definition, el servicio y el log group. Cada ambiente tiene su propio estado dentro del bucket.',
    nodos: ['tf', 'gstg'], aristas: ['e6'],
  },
  {
    titulo: 'Fargate baja la imagen',
    texto: 'La task definition apunta a docker_image_uri, que es usuario/repo:SHA. Fargate descarga la imagen de Docker Hub; por eso la tarea recibe IP pública en las subredes por defecto.',
    nodos: ['hub', 'svcS'], aristas: ['e7'],
  },
  {
    titulo: 'El ALB reparte el tráfico',
    texto: 'El ALB escucha en el puerto 80 y reenvía al target group. El target group consulta GET /health cada 30 segundos y espera 200. Tres fallas seguidas dejan la tarea en unhealthy y el ALB deja de enviarle tráfico. El security group de la tarea solo acepta el puerto 8000 desde el ALB.',
    nodos: ['albS', 'tgS', 'svcS'], aristas: ['e8', 'e9'],
  },
  {
    titulo: 'Los logs van a CloudWatch',
    texto: 'El contenedor escribe con el driver awslogs en el grupo /ecs/calculadora-staging, con retención de 7 días. Ahí se ve por qué una tarea no arrancó.',
    nodos: ['svcS', 'cwS'], aristas: ['e10'],
  },
  {
    titulo: 'Producción repite el diseño',
    texto: 'Con el workspace production se crea lo mismo en un ambiente aparte, con estado separado. Este despliegue solo corre después de la aprobación manual (ver la vista Pipeline).',
    nodos: ['tf', 'gprd'], aristas: ['e11'],
  },
  {
    titulo: 'Misma imagen, mismo camino',
    texto: 'Producción usa la misma imagen (el mismo SHA) que ya se probó en staging. El tráfico sigue el mismo camino: ALB, target group, servicio ECS, y los logs van a su propio grupo en CloudWatch.',
    nodos: ['hub', 'albP', 'tgP', 'svcP', 'cwP'], aristas: ['e12', 'e13', 'e14', 'e15'],
  },
]
