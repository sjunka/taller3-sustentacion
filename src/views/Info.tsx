import CopiarUrl from '../components/CopiarUrl'
import GuionVista from '../components/GuionVista'
import Pendiente from '../components/Pendiente'
import { capturas, enlacesExternos } from '../data/pendientes'
import { urlCompleta, vistas } from '../views'

export default function Info() {
  return (
    <section className="max-w-[1100px]">
      <h1 className="text-[48px] leading-[1.1]">Taller 3 - Despliegue Continuo en AWS ECS</h1>
      <p className="mt-md text-[18px]">Integración y Entrega Continua de Software, EAFIT. Equipo: Sergio Junca y Valeria Cardona Urrea.</p>

      <h2 className="mt-xxl text-[28px]">Vistas</h2>
      <ul className="mt-md grid gap-sm">
        {vistas.map((v) => {
          const url = urlCompleta(v.ruta)
          return (
            <li key={v.id} className="flex flex-wrap items-center gap-md rounded-lg border border-hairline bg-card p-md">
              <div className="min-w-[260px] flex-1">
                <div className="text-[18px] font-medium text-ink">{v.titulo}</div>
                <div className="text-[15px] text-body">{v.descripcion}</div>
                <a href={url} className="break-all font-mono text-[14px] text-primary-active underline">{url}</a>
              </div>
              <CopiarUrl url={url} />
            </li>
          )
        })}
      </ul>

      <h2 className="mt-xxl text-[28px]">Enlaces externos</h2>
      <ul className="mt-md grid gap-sm">
        {enlacesExternos.map((e) => (
          <li key={e.titulo} className="flex flex-wrap items-center gap-md rounded-lg border border-hairline bg-card p-md">
            <span className="min-w-[200px] text-[17px] font-medium text-ink">{e.titulo}</span>
            {e.url ? (
              <>
                <a href={e.url} target="_blank" rel="noreferrer" className="break-all font-mono text-[14px] text-primary-active underline">{e.url}</a>
                <span className="ml-auto"><CopiarUrl url={e.url} /></span>
              </>
            ) : <Pendiente />}
          </li>
        ))}
      </ul>

      <h2 className="mt-xxl text-[28px]">Capturas</h2>
      <ul className="mt-md grid gap-sm">
        {capturas.map((c) => (
          <li key={c.titulo} className="rounded-lg border border-hairline bg-card p-md">
            <div className="flex flex-wrap items-center gap-md">
              <span className="text-[17px] font-medium text-ink">{c.titulo}</span>
              {!c.ruta && <Pendiente />}
            </div>
            {c.ruta && <img src={`${import.meta.env.BASE_URL}${c.ruta}`} alt={c.titulo} className="mt-sm max-w-full rounded-md border border-hairline" />}
          </li>
        ))}
      </ul>

      <GuionVista vistas={['intro']} />
    </section>
  )
}
