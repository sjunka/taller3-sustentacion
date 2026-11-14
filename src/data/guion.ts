// Guion de la sustentación. Una sección por pantalla, con su captura.
// Línea con `dice`: lo que se dice en voz alta. Línea con `accion`: qué mostrar o qué clic hacer.
export type Quien = 'Sergio' | 'Valeria'
export type Vista = 'intro' | 'arquitectura' | 'pipeline' | 'fallos' | 'flujo' | 'cierre'

export type Linea = { quien: Quien; dice: string } | { accion: string }

export interface Seccion {
  vista: Vista
  titulo: string
  quien: Quien
  ruta: string // ruta de la app a abrir, con escenario y paso
  captura: string // archivo en public/capturas/
  tiempoSeg: number
  lineas: Linea[]
  preguntas?: { pregunta: string; respuesta: string }[]
}

export const colorQuien: Record<Quien, string> = { Sergio: '#2f6fe4', Valeria: '#b0397a' }

export const guion: Seccion[] = [
  {
    vista: 'intro',
    titulo: 'Qué hicimos',
    quien: 'Sergio',
    ruta: '#/',
    captura: 'capturas/1-inicio.png',
    tiempoSeg: 40,
    lineas: [
      { accion: 'Abrir la pantalla de inicio.' },
      { quien: 'Sergio', dice: 'Buenas. Soy Sergio Junca y con Valeria Cardona presentamos el Taller 3.' },
      { quien: 'Sergio', dice: 'El Taller 2 terminaba con una imagen Docker en Docker Hub. Ahora esa imagen tiene que llegar a un servidor.' },
      { quien: 'Sergio', dice: 'La desplegamos en AWS ECS con Fargate. Terraform crea la infraestructura y GitHub Actions lo dispara todo. Hay staging, hay producción, y una persona aprueba el paso a producción.' },
      { quien: 'Sergio', dice: 'Valeria arranca con la arquitectura.' },
    ],
  },
  {
    vista: 'arquitectura',
    titulo: 'La arquitectura en AWS',
    quien: 'Valeria',
    ruta: '#/arquitectura?paso=11',
    captura: 'capturas/2-arquitectura.png',
    tiempoSeg: 150,
    lineas: [
      { accion: 'Abrir Arquitectura y dar Reproducir. Hablar mientras avanzan los pasos 1 a 3.' },
      { quien: 'Valeria', dice: 'Empiezo por el camino del código. Hacemos push o abrimos un pull request, y eso arranca GitHub Actions con el archivo ci-cd.yml.' },
      { quien: 'Valeria', dice: 'Actions construye la imagen y la sube a Docker Hub con dos etiquetas: el SHA del commit y latest. Con el SHA sabemos qué versión exacta corre en cada ambiente.' },
      { accion: 'Pasos 4 y 5: señalar Terraform y el bucket S3.' },
      { quien: 'Valeria', dice: 'Desde el mismo workflow corre Terraform, que lee la carpeta infra y crea los recursos.' },
      { quien: 'Valeria', dice: 'El estado de Terraform vive en un bucket de S3. El pipeline corre cada vez en una máquina nueva. Si el estado fuera local, Terraform no sabría qué existe e intentaría crearlo otra vez.' },
      { quien: 'Valeria', dice: 'Usamos dos workspaces, staging y production. Mismos archivos, estado separado. Así aplicar producción no pisa staging.' },
      { accion: 'Pasos 6 a 9: recorrer el cuadro de staging de izquierda a derecha.' },
      { quien: 'Valeria', dice: 'Cada ambiente tiene un cluster de ECS con un servicio que corre una tarea Fargate de 256 de CPU y 512 de memoria. Fargate nos ahorra administrar servidores.' },
      { quien: 'Valeria', dice: 'Delante va un Application Load Balancer en el puerto 80. Su target group pregunta por /health cada 30 segundos. Si la tarea falla tres veces seguidas, deja de recibir tráfico.' },
      { quien: 'Valeria', dice: 'Los logs van a CloudWatch, un grupo por ambiente, con 7 días de retención.' },
      { accion: 'Pasos 10 y 11: señalar producción.' },
      { quien: 'Valeria', dice: 'Producción es igual y usa la misma imagen. Cómo se mueve todo esto en el pipeline lo cuenta Sergio.' },
    ],
    preguntas: [
      {
        pregunta: '¿Por qué el estado de Terraform va en S3?',
        respuesta: 'Porque despliegan dos lugares: nuestro computador y el pipeline, que es una máquina nueva cada vez. En S3 todos ven el mismo estado, y use_lockfile evita dos apply al mismo tiempo.',
      },
      {
        pregunta: '¿Por qué dos workspaces y no dos carpetas?',
        respuesta: 'Los dos ambientes usan los mismos .tf y cada workspace tiene su estado. Si compartieran estado, el apply de producción reemplazaría a staging.',
      },
      {
        pregunta: '¿Por qué no crean roles IAM en Terraform?',
        respuesta: 'Las credenciales del Learner Lab no pueden crear roles. Terraform consulta el LabRole que ya existe con un data source.',
      },
    ],
  },
  {
    vista: 'pipeline',
    titulo: 'Los cinco jobs',
    quien: 'Sergio',
    ruta: '#/pipeline?esc=normal&paso=4',
    captura: 'capturas/3-pipeline.png',
    tiempoSeg: 150,
    lineas: [
      { accion: 'Abrir Pipeline, escenario Camino normal. Paso 1.' },
      { quien: 'Sergio', dice: 'ci-cd.yml tiene cinco jobs y cada uno depende del anterior con needs.' },
      { quien: 'Sergio', dice: 'El primero es build-and-test. Corre Black, las pruebas con mínimo 80 por ciento de cobertura, construye la imagen, la prueba y pasa SonarCloud. Solo en main la publica en Docker Hub.' },
      { quien: 'Sergio', dice: 'Ese nombre no se puede cambiar, porque la protección de main lo exige como check.' },
      { accion: 'Paso 2.' },
      { quien: 'Sergio', dice: 'deploy-staging configura AWS, hace terraform init con el backend de S3, elige el workspace staging y hace apply. Al final saca la URL del balanceador.' },
      { accion: 'Paso 3.' },
      { quien: 'Sergio', dice: 'test-staging primero espera. Consulta /health hasta ver el SHA del commit, hasta 30 intentos cada 10 segundos. Así sabemos que ya responde la versión nueva. Luego corre las pruebas de aceptación.' },
      { accion: 'Paso 4: señalar el candado amarillo.' },
      { quien: 'Sergio', dice: 'Aquí está la aprobación manual. deploy-production usa el environment production, que tiene revisores. No arranca hasta que uno de los dos apruebe.' },
      { accion: 'Pasos 5 y 6.' },
      { quien: 'Sergio', dice: 'deploy-production repite lo de staging en el workspace production, y smoke-test-production corre las pruebas de humo contra producción.' },
      { quien: 'Sergio', dice: 'Valeria muestra qué pasa cuando algo falla.' },
    ],
    preguntas: [
      {
        pregunta: '¿Por qué esperan el SHA en /health?',
        respuesta: 'terraform apply puede terminar antes de que la tarea nueva esté sirviendo. La app devuelve APP_VERSION en /health y las pruebas esperan hasta ver el SHA. Así probamos la versión nueva y no la vieja.',
      },
      {
        pregunta: '¿Pylint y Flake8 detienen el pipeline?',
        respuesta: 'No, corren con --exit-zero y solo informan. Black sí lo detiene si el formato no cumple.',
      },
    ],
  },
  {
    vista: 'fallos',
    titulo: 'Cuando algo falla',
    quien: 'Valeria',
    ruta: '#/pipeline?esc=fallo&paso=1',
    captura: 'capturas/4-fallos.png',
    tiempoSeg: 90,
    lineas: [
      { accion: 'Cambiar al escenario Fallo en staging.' },
      { quien: 'Valeria', dice: 'Si test-staging falla, se pone en rojo y el pipeline se detiene ahí.' },
      { quien: 'Valeria', dice: 'deploy-production tiene needs test-staging, así que ni siquiera pide aprobación. Producción sigue con la versión anterior.' },
      { accion: 'Cambiar al escenario Rollback del circuit breaker. Avanzar los pasos.' },
      { quien: 'Valeria', dice: 'El otro caso es que la tarea nueva no arranque sana. ECS tiene el circuit breaker con rollback activado.' },
      { quien: 'Valeria', dice: 'Después de varias tareas fallidas vuelve a la última versión que funcionaba. La tarea vieja nunca dejó de atender, así que el usuario no ve caída.' },
      { quien: 'Valeria', dice: 'Y como terraform apply termina con error, el pipeline también se detiene. Sergio sigue con cómo trabajamos en equipo.' },
    ],
    preguntas: [
      {
        pregunta: '¿Cómo funciona el rollback?',
        respuesta: 'Lo hace ECS con deployment_circuit_breaker y rollback en true. La tarea anterior se mantiene hasta que la nueva esté sana, por eso no hay caída.',
      },
      {
        pregunta: '¿El ALB reinicia la tarea que falla?',
        respuesta: 'No. El ALB solo deja de mandarle tráfico. Quien reemplaza la tarea es ECS, porque el servicio está conectado al target group.',
      },
    ],
  },
  {
    vista: 'flujo',
    titulo: 'Delivery vs Deployment y el flujo del equipo',
    quien: 'Sergio',
    ruta: '#/flujo?paso=7',
    captura: 'capturas/5-flujo.png',
    tiempoSeg: 120,
    lineas: [
      { accion: 'Abrir Flujo. Señalar la tabla de arriba.' },
      { quien: 'Sergio', dice: 'En entrega continua todo llega solo hasta staging, y a producción pasa con una aprobación. En despliegue continuo no hay aprobación: lo que pasa las pruebas sale a producción.' },
      { quien: 'Sergio', dice: 'La guía pide armar primero el despliegue continuo y después agregar la aprobación. Con eso el nuestro es entrega continua.' },
      { accion: 'Reproducir el diagrama, pasos 1 a 4.' },
      { quien: 'Sergio', dice: 'Así trabajamos. Uno crea la rama feature/nuevas-operaciones con potencia y modulo y sus pruebas, y abre un pull request a main.' },
      { quien: 'Sergio', dice: 'En el pull request solo corre build-and-test. La regla proteger-main exige que pase y que el otro apruebe. Sin eso no hay merge.' },
      { accion: 'Pasos 5 a 8.' },
      { quien: 'Sergio', dice: 'Con el merge corre todo. Staging se despliega y se prueba solo. Luego producción espera. Abrimos staging, probamos las operaciones nuevas y aprobamos.' },
      { quien: 'Sergio', dice: 'Valeria cierra.' },
    ],
    preguntas: [
      {
        pregunta: '¿Cuál es la diferencia entre entrega continua y despliegue continuo?',
        respuesta: 'En las dos el cambio llega solo a staging. En entrega continua una persona aprueba producción. En despliegue continuo no. Nuestro pipeline tiene la aprobación, así que es entrega continua.',
      },
    ],
  },
  {
    vista: 'cierre',
    titulo: 'Cierre',
    quien: 'Valeria',
    ruta: '#/arquitectura?paso=11',
    captura: 'capturas/2-arquitectura.png',
    tiempoSeg: 35,
    lineas: [
      { accion: 'Volver a Arquitectura, último paso.' },
      { quien: 'Valeria', dice: 'Para cerrar. Terraform describe la infraestructura y el estado en S3 deja que el pipeline y nosotros veamos la misma.' },
      { quien: 'Valeria', dice: 'El health check del ALB decide a quién llega el tráfico, y el circuit breaker evita que un despliegue malo tumbe el servicio.' },
      { quien: 'Valeria', dice: 'Y la salida a producción la decide una persona. Quedamos atentos a sus preguntas.' },
    ],
  },
]

export const totalSeg = guion.reduce((s, b) => s + b.tiempoSeg, 0)
