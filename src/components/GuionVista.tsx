import { guion, nombresVista, type Vista } from '../data/guion'

export function BloqueGuion({ b }: { b: (typeof guion)[number] }) {
  const color = b.quien === 'Sergio' ? 'var(--s4)' : 'var(--s1)'
  return (
    <div className="rounded-lg border border-hairline bg-card p-md" style={{ borderLeft: `6px solid ${color}` }}>
      <div className="mb-xs flex flex-wrap items-center gap-sm text-[14px]">
        <span className="font-semibold text-ink">{b.quien}</span>
        <span className="text-muted">{nombresVista[b.vista]}</span>
        <span className="ml-auto text-muted">{Math.floor(b.tiempoSeg / 60)}:{String(b.tiempoSeg % 60).padStart(2, '0')} min</span>
      </div>
      {b.texto.split('\n\n').map((p, i) => (
        <p key={i} className="mt-xs text-[17px] leading-relaxed text-body">{p}</p>
      ))}
    </div>
  )
}

export default function GuionVista({ vistas }: { vistas: Vista[] }) {
  const bloques = guion.filter((b) => vistas.includes(b.vista))
  return (
    <details className="mt-lg rounded-xl border border-hairline bg-soft p-md">
      <summary className="cursor-pointer text-[16px] font-medium text-ink">Guion de esta vista</summary>
      <div className="mt-md grid gap-sm">
        {bloques.map((b, i) => <BloqueGuion key={i} b={b} />)}
      </div>
    </details>
  )
}
