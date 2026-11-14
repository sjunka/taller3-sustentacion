import Diagrama from '../components/Diagrama'
import GuionVista from '../components/GuionVista'
import { ALTO, ANCHO, aristas, comparacion, nodos, pasos } from '../data/flujo'

export default function Flujo() {
  return (
    <section>
      <h1 className="mb-md text-[36px] leading-tight">Entrega continua y despliegue continuo</h1>
      <div className="mb-xl overflow-hidden rounded-xl border border-hairline">
        <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-card text-[18px] font-semibold text-ink">
          <div className="p-md" />
          <div className="border-l border-hairline p-md">Continuous Delivery</div>
          <div className="border-l border-hairline p-md">Continuous Deployment</div>
        </div>
        {comparacion.map((c) => (
          <div key={c.fila} className="grid grid-cols-[1.1fr_1fr_1fr] border-t border-hairline text-[16px]">
            <div className="p-md font-medium text-ink">{c.fila}</div>
            <div className="border-l border-hairline p-md">{c.delivery}</div>
            <div className="border-l border-hairline p-md">{c.deployment}</div>
          </div>
        ))}
      </div>
      <p className="mb-xl max-w-[1100px] text-[18px] leading-relaxed">
        En el taller se arma primero el despliegue continuo completo y al final se agrega una aprobación manual al ambiente <span className="font-mono text-[16px]">production</span>. Con esa aprobación el pipeline queda como entrega continua.
      </p>
      <h2 className="mb-md text-[28px]">Flujo del equipo</h2>
      <Diagrama ancho={ANCHO} alto={ALTO} nodos={nodos} aristas={aristas} pasos={pasos} />
      <GuionVista vistas={['flujo', 'cierre']} />
    </section>
  )
}
