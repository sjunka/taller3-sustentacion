import { useState } from 'react'
import Diagrama from '../components/Diagrama'
import GuionVista from '../components/GuionVista'
import { ALTO, ANCHO, aristas, escenarios, nodos, parametros } from '../data/pipeline'

export default function Pipeline() {
  const [id, setId] = useState(() => {
    const e = new URLSearchParams(location.hash.split('?')[1] ?? '').get('esc')
    return escenarios.find((x) => x.id === e)?.id ?? escenarios[0].id
  })
  const esc = escenarios.find((e) => e.id === id)!
  return (
    <section>
      <h1 className="mb-sm text-[36px] leading-tight">Pipeline ci-cd.yml</h1>
      <div className="mb-sm flex flex-wrap gap-xs" role="tablist">
        {escenarios.map((e) => (
          <button
            key={e.id}
            role="tab"
            aria-selected={e.id === id}
            onClick={() => setId(e.id)}
            className={`h-10 rounded-md px-md text-[15px] font-medium ${e.id === id ? (e.id === 'normal' ? 'bg-ink text-canvas' : 'bg-err text-white') : 'border border-hairline text-ink hover:bg-card'}`}
          >
            {e.nombre}
          </button>
        ))}
      </div>
      <Diagrama key={esc.id} ancho={ANCHO} alto={ALTO} nodos={nodos} aristas={aristas} pasos={esc.pasos} />

      <details className="mt-lg rounded-xl border border-hairline bg-soft p-md">
        <summary className="cursor-pointer text-[16px] font-medium text-ink">Parámetros del servicio ECS que sostienen el rollback (infra/main.tf)</summary>
        <table className="mt-md w-full text-left text-[15px]">
          <tbody>
            {parametros.map(([k, v]) => (
              <tr key={k} className="border-t border-hairline">
                <td className="py-xs pr-md font-mono text-[14px] text-ink">{k}</td>
                <td className="py-xs text-body">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <GuionVista vistas={['pipeline', 'fallos']} />
    </section>
  )
}
