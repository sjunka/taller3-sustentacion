import { BloqueGuion } from '../components/GuionVista'
import { guion, preguntas, totalSeg } from '../data/guion'

export default function Guion() {
  return (
    <section className="max-w-[1000px]">
      <h1 className="text-[36px] leading-tight">Guion de la sustentación</h1>
      <p className="mt-xs text-[16px] text-muted">
        Duración estimada: {Math.floor(totalSeg / 60)} min{totalSeg % 60 ? ` ${totalSeg % 60} s` : ''}. Habla Sergio en inicio, pipeline y cierre. Habla Valeria en arquitectura y flujo.
      </p>
      <div className="mt-lg grid gap-md">
        {guion.map((b, i) => <BloqueGuion key={i} b={b} />)}
      </div>
      <h2 className="mt-xxl text-[28px]">Posibles preguntas del profe</h2>
      <div className="mt-md grid gap-sm">
        {preguntas.map((q) => (
          <details key={q.pregunta} className="rounded-lg border border-hairline bg-card p-md">
            <summary className="cursor-pointer text-[17px] font-medium text-ink">{q.pregunta}</summary>
            <p className="mt-sm text-[17px] leading-relaxed text-body">{q.respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
