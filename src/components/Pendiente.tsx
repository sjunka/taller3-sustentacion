export default function Pendiente({ texto = 'pendiente' }: { texto?: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-warn px-sm py-[2px] text-[13px] font-medium text-warn">
      {texto}
    </span>
  )
}
