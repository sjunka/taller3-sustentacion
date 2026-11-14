export type Vista = 'intro' | 'arquitectura' | 'pipeline' | 'flujo' | 'cierre'
export type Quien = 'Sergio' | 'Valeria'

export interface Bloque {
  vista: Vista
  quien: Quien
  texto: string
  tiempoSeg: number
}

export const nombresVista: Record<Vista, string> = {
  intro: 'Introducción (pantalla de inicio)',
  arquitectura: 'Arquitectura',
  pipeline: 'Pipeline',
  flujo: 'Flujo del equipo',
  cierre: 'Cierre',
}

export const guion: Bloque[] = [
  {
    vista: 'intro',
    quien: 'Sergio',
    tiempoSeg: 40,
    texto:
      'Buenas. Soy Sergio Junca y con Valeria Cardona presentamos el Taller 3. Partimos del pipeline de integración continua del Taller 2, que termina con una imagen Docker en Docker Hub. Ahora esa imagen tiene que llegar a un servidor. La desplegamos en AWS ECS con Fargate, Terraform crea la infraestructura y un workflow de GitHub Actions lo dispara todo. Hay un ambiente de staging, otro de producción, y una persona aprueba el paso a producción. Valeria empieza con la arquitectura para ver qué recursos existen en AWS.',
  },
  {
    vista: 'arquitectura',
    quien: 'Valeria',
    tiempoSeg: 150,
    texto:
      'Gracias, Sergio. Empiezo por el camino del código. Cualquiera de los dos hace push o abre un pull request en GitHub, y eso arranca GitHub Actions con el archivo ci-cd.yml. Actions construye la imagen y la sube a Docker Hub con dos etiquetas, el SHA del commit y latest. Usamos el SHA para saber qué versión exacta corre en cada ambiente.\n\n' +
      'Desde el mismo workflow, Actions llama a Terraform. Terraform lee los archivos de la carpeta infra y crea los recursos en AWS. Lo importante es dónde guarda el estado: en un bucket de S3, no en el computador de nadie. El pipeline corre cada vez en una máquina nueva. Si el estado fuera local, Terraform intentaría crear todo otra vez y fallaría con errores de que el recurso ya existe. El bucket además bloquea el estado con use_lockfile mientras hay un apply en curso.\n\n' +
      'Usamos dos workspaces, staging y production. Son los mismos archivos, pero cada ambiente tiene su propio estado, así que aplicar producción no pisa staging.\n\n' +
      'Cada ambiente tiene el mismo diseño. Un cluster de ECS con un servicio que corre una tarea en Fargate, de 256 de CPU y 512 de memoria. Fargate nos evita administrar servidores. Delante va un Application Load Balancer que escucha en el puerto 80 y reenvía al target group. El target group consulta la ruta /health cada 30 segundos. Si la tarea no responde 200 tres veces seguidas, el balanceador deja de mandarle tráfico. Los logs del contenedor van a CloudWatch, en un grupo por ambiente, con retención de 7 días.\n\n' +
      'Falta ver cómo se mueve todo esto en el pipeline. Eso lo cuenta Sergio.',
  },
  {
    vista: 'pipeline',
    quien: 'Sergio',
    tiempoSeg: 190,
    texto:
      'Gracias, Valeria. El archivo ci-cd.yml tiene cinco jobs, y cada uno depende del anterior con needs.\n\n' +
      'El primero es build-and-test. Corre Black, Pylint y Flake8, y las pruebas unitarias con mínimo 80 por ciento de cobertura. Valida el formato de Terraform, construye la imagen, la levanta en el runner y le pasa las pruebas de aceptación. Después viene SonarCloud. Solo si estamos en main, publica la imagen en Docker Hub y entrega su URI a los demás jobs. Ese nombre no se puede cambiar, porque la protección de la rama main lo exige como check obligatorio.\n\n' +
      'El segundo, deploy-staging, configura las credenciales de AWS, hace terraform init con el backend de S3, selecciona el workspace staging y ejecuta terraform apply. Al final lee la URL del balanceador.\n\n' +
      'El tercero, test-staging, primero espera. Consulta /health hasta que aparezca el SHA del commit, con un máximo de 30 intentos cada 10 segundos. Eso confirma que la versión nueva ya está sirviendo. Solo entonces corre las pruebas de aceptación contra staging.\n\n' +
      'Entre el tercero y el cuarto está la aprobación manual. deploy-production usa el environment production, que tiene revisores requeridos. El job no empieza hasta que uno de nosotros apruebe. Antes de aprobar abrimos staging y probamos lo nuevo.\n\n' +
      'deploy-production repite los pasos de staging con el workspace production. El último job, smoke-test-production, espera el SHA otra vez y corre las pruebas de humo contra producción.\n\n' +
      'Si algo falla, el pipeline se detiene en ese job. Si test-staging falla, los dos jobs de producción no se ejecutan, y la versión mala no llega. Hay otro caso, que la tarea nueva no arranque. ECS tiene el circuit breaker con rollback: después de varias tareas fallidas vuelve a la última versión que funcionaba, y la tarea anterior nunca dejó de atender. En esta vista pueden ver esos dos escenarios. Valeria sigue con el flujo del equipo.',
  },
  {
    vista: 'flujo',
    quien: 'Valeria',
    tiempoSeg: 120,
    texto:
      'Gracias. Ahora la diferencia entre los dos conceptos y cómo trabajamos.\n\n' +
      'En entrega continua, el cambio se construye, se prueba y se despliega solo en staging, pero llevarlo a producción requiere una aprobación manual. En despliegue continuo no hay esa aprobación: todo lo que pasa las pruebas llega solo a producción. La guía pide armar primero el despliegue continuo y después agregar la aprobación manual al ambiente production. Con eso nuestro pipeline queda como entrega continua.\n\n' +
      'Trabajamos así. Uno de los dos crea la rama feature/nuevas-operaciones y agrega potencia y modulo con sus pruebas. Abre un pull request hacia main. En el pull request solo corre build-and-test, y los jobs de despliegue aparecen omitidos, porque solo se despliega lo que ya está en main. La regla proteger-main exige que ese check pase y que el otro integrante apruebe. Sin eso no hay merge.\n\n' +
      'Con el merge a main corre el pipeline completo. Staging se despliega y se prueba solo, y después el job de producción queda esperando. Antes de aprobar abrimos staging y probamos las operaciones nuevas. Esa es la razón de la aprobación: una persona confirma que lo que está en staging puede ir a producción. Sergio cierra.',
  },
  {
    vista: 'cierre',
    quien: 'Sergio',
    tiempoSeg: 40,
    texto:
      'Para cerrar. Terraform describe la infraestructura, y el estado en S3 deja que el pipeline y nuestros computadores compartan la misma. El ALB con su health check decide a quién llega el tráfico. El rolling update y el circuit breaker evitan que un despliegue malo tumbe el servicio. La aprobación manual deja la decisión de liberar a producción en una persona. Quedamos atentos a sus preguntas.',
  },
]

export const preguntas: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: 'Cuál es la diferencia entre entrega continua y despliegue continuo.',
    respuesta:
      'En los dos, el cambio se construye, se prueba y llega a staging solo. La diferencia está en producción. En entrega continua una persona aprueba el despliegue. En despliegue continuo no hay aprobación y todo lo que pasa las pruebas se despliega. Nuestro pipeline tiene la aprobación en el environment production, así que es entrega continua.',
  },
  {
    pregunta: 'Por qué el estado de Terraform va en S3.',
    respuesta:
      'Porque despliegan dos lugares distintos: un computador y el pipeline, que corre en una máquina nueva cada vez. Si el estado estuviera local, el pipeline no sabría qué recursos existen e intentaría crearlos otra vez. En S3 todos ven el mismo estado, y use_lockfile evita dos apply al mismo tiempo.',
  },
  {
    pregunta: 'Para qué sirve el health check del ALB.',
    respuesta:
      'El ALB consulta /health cada 30 segundos. Si una tarea falla tres veces seguidas queda unhealthy y el ALB deja de enviarle tráfico. El ALB no reinicia nada. Quien reemplaza la tarea es ECS, porque el servicio está conectado al target group.',
  },
  {
    pregunta: 'Qué pasa si las pruebas fallan en staging.',
    respuesta:
      'El job test-staging queda en rojo. deploy-production tiene needs: test-staging, así que no corre ni pide aprobación. Producción sigue con la versión anterior. Se corrige en una rama y se repite el proceso.',
  },
  {
    pregunta: 'Cómo funciona el rollback.',
    respuesta:
      'Lo hace ECS con deployment_circuit_breaker, con rollback en true. Si la tarea nueva no queda sana, ECS reintenta y, después de varias tareas fallidas, vuelve a la última versión que funcionaba. Como el despliegue mantiene la tarea anterior hasta que la nueva esté sana, el servicio no se interrumpe. El pipeline también se detiene porque terraform apply termina con error.',
  },
  {
    pregunta: 'Por qué dos workspaces y no dos carpetas.',
    respuesta:
      'Usamos los mismos archivos .tf para los dos ambientes y cada workspace tiene su propio estado en el bucket. Si compartieran estado, el apply de producción reemplazaría a staging.',
  },
  {
    pregunta: 'Por qué el pipeline espera el SHA en /health.',
    respuesta:
      'Porque terraform apply puede terminar antes de que la tarea nueva esté sirviendo. La app expone APP_VERSION en /health, y los jobs de prueba reintentan hasta ver el SHA del commit. Así se prueba la versión nueva y no la anterior.',
  },
  {
    pregunta: 'Por qué no crean roles IAM en Terraform.',
    respuesta:
      'Las credenciales del Learner Lab no tienen permiso para crear roles. Por eso Terraform consulta el LabRole existente con un data source y no crea nada de IAM.',
  },
]

export const totalSeg = guion.reduce((s, b) => s + b.tiempoSeg, 0)
