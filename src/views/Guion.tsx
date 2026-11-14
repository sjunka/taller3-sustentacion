import { Chip, SeccionGuion } from '../components/GuionVista'
import { guion, totalSeg } from '../data/guion'

export default function Guion() {
  return (
    <section className="max-w-[1200px]">
      <h1 className="text-[36px] leading-tight">Guion de la sustentación</h1>
      <p className="mt-xs text-[17px] text-body">
        Unos {Math.round(totalSeg / 60)} minutos entre <Chip quien="Sergio" /> y <Chip quien="Valeria" />, una pantalla cada uno por turnos.
        Lo que va entre comillas se dice. Lo gris en cursiva es lo que se muestra o se hace. Las preguntas las responde quien tiene esa pantalla.
        Clic en la imagen abre la pantalla en el paso indicado.
      </p>
      <div className="mt-lg grid gap-lg">
        {guion.map((s, i) => <SeccionGuion key={i} s={s} n={i + 1} />)}
      </div>
    </section>
  )
}
