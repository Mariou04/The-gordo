import { useEffect, useRef } from 'react'

interface Props {
  mensaje: string
  visible: boolean
}

export default function Toast({ mensaje, visible }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visible && ref.current) {
      ref.current.classList.add('show')
      const timer = setTimeout(() => {
        ref.current?.classList.remove('show')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [visible])

  return (
    <div className="toast" ref={ref}>
      {mensaje}
    </div>
  )
}
