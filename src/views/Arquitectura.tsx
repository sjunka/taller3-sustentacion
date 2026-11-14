import Diagrama from '../components/Diagrama'
import GuionVista from '../components/GuionVista'
import { ALTO, ANCHO, aristas, nodos, pasos } from '../data/arquitectura'

export default function Arquitectura() {
  return (
    <section>
      <h1 className="mb-md text-[36px] leading-tight">Arquitectura en AWS</h1>
      <Diagrama ancho={ANCHO} alto={ALTO} nodos={nodos} aristas={aristas} pasos={pasos} />
      <GuionVista vistas={['arquitectura', 'cierre']} />
    </section>
  )
}
