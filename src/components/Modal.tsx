import { useState, useRef } from 'react'
import type { MenuType, DeliveryType, ModalState } from '../types'
import { menuAlmuerzo, menuNoche, ocupadas } from '../types'

interface Props {
  tipo: MenuType
  onCerrar: () => void
  onToast: (msg: string) => void
}

export default function Modal({ tipo, onCerrar, onToast }: Props) {
  const [state, setState] = useState<ModalState>({ item: null, delivery: null, mesa: null })
  const [confirmado, setConfirmado] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  const items = tipo === 'almuerzo' ? menuAlmuerzo : menuNoche
  const titulo = tipo === 'almuerzo' ? 'Menú del Almuerzo' : 'Menú de la Noche'
  const emoji = tipo === 'almuerzo' ? '🦕' : '🌙'
  const desc =
    tipo === 'almuerzo'
      ? 'Todos los almuerzos incluyen <strong>sopa, arroz, ensalada y jugo</strong>. Solo cambia la proteína 🦴'
      : 'Antojos nocturnos al estilo Piedradura 🔥 ¡Sabor que despierta dinosaurios!'

  function selectItem(nombre: string, precio: string) {
    setState((s) => ({ ...s, item: { nombre, precio } }))
    onToast(`✓ ${nombre} seleccionado`)
  }

  function selectDelivery(d: DeliveryType) {
    setState((s) => ({ ...s, delivery: d, mesa: d !== 'aqui' ? null : s.mesa }))
    if (d === 'aqui' && bodyRef.current) {
      setTimeout(() => {
        bodyRef.current?.querySelector('.mesa-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 50)
    }
  }

  function selectMesa(num: number) {
    setState((s) => ({ ...s, mesa: num }))
    onToast(`Mesa ${num} seleccionada 🪑`)
  }

  function confirmar() {
    const s = state
    if (!s.item) { onToast('⚠️ Selecciona un plato primero'); return }
    if (!s.delivery) { onToast('⚠️ ¿Para llevar o para comer aquí?'); return }
    if (s.delivery === 'aqui' && !s.mesa) { onToast('⚠️ Selecciona una mesa'); return }
    setConfirmado(true)
    onToast('🎉 ¡Pedido confirmado! Yabba Dabba Doo!')
  }

  const ocups = ocupadas[tipo]

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar() }}
    >
      <div className="modal">
        <div className="modal-header">
          <span style={{ fontSize: '2.2rem' }}>{emoji}</span>
          <h2>{titulo}</h2>
          <button className="modal-close" onClick={onCerrar}>✕</button>
        </div>
        <div className="modal-body" ref={bodyRef}>
          <p style={{ color: '#888', marginBottom: '1.2rem', fontSize: '.95rem' }} dangerouslySetInnerHTML={{ __html: desc }} />

          {items.map((item) => (
            <div
              key={item.id}
              className={`menu-item${state.item?.nombre === item.nombre ? ' selected' : ''}`}
              onClick={() => selectItem(item.nombre, item.precio)}
            >
              <div className="menu-item-emoji">{item.emoji}</div>
              <div className="menu-item-info">
                <h4>{item.nombre}</h4>
                <p>{item.descripcion}</p>
              </div>
              <div className="menu-item-price">{item.precio}</div>
              <div className="menu-check">✓</div>
            </div>
          ))}

          <div style={{ borderTop: '2px dashed #eee', margin: '1.2rem 0' }} />
          <p style={{ fontFamily: "'Fredoka One'", color: '#555', fontSize: '.95rem', marginBottom: '.7rem' }}>
            ¿Cómo lo vas a disfrutar?
          </p>
          <div className="delivery-btns">
            <button
              className={`delivery-btn${state.delivery === 'llevar' ? ' active' : ''}`}
              onClick={() => selectDelivery('llevar')}
            >
              🛍️ Para Llevar
            </button>
            <button
              className={`delivery-btn${state.delivery === 'aqui' ? ' active' : ''}`}
              onClick={() => selectDelivery('aqui')}
            >
              🪑 Para Comer Aquí
            </button>
          </div>

          <div className={`mesa-section${state.delivery === 'aqui' ? ' show' : ''}`}>
            <div style={{ borderTop: '2px dashed #eee', margin: '1.2rem 0' }} />
            <p style={{ fontFamily: "'Fredoka One'", color: '#555', fontSize: '.95rem', marginBottom: '.5rem' }}>
              Selecciona tu mesa 🗺️
            </p>
            <div className="restaurant-map">
              <div className="map-label">🏪 PLANTA THE GORDO</div>
              <div className="mesas-grid">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                  const ocupada = ocups.includes(num)
                  return (
                    <div
                      key={num}
                      className={`mesa${ocupada ? ' occupied' : ''}${state.mesa === num ? ' selected' : ''}`}
                      onClick={() => !ocupada && selectMesa(num)}
                      title={ocupada ? 'Mesa ocupada' : ''}
                    >
                      <span className="mesa-icon">🪑</span>
                      <span className="mesa-num">{num}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="leyenda">
              <div className="leyenda-item">
                <div className="dot" style={{ background: '#fff', border: '2px solid #8D6E63' }} />
                Disponible
              </div>
              <div className="leyenda-item">
                <div className="dot" style={{ background: 'var(--amarillo)', border: '2px solid var(--rojo)' }} />
                Seleccionada
              </div>
              <div className="leyenda-item">
                <div className="dot" style={{ background: '#FFCDD2', border: '2px solid #E57373' }} />
                Ocupada
              </div>
            </div>
          </div>

          <div className={`confirm-box${confirmado ? ' show' : ''}`}>
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <h3>¡PEDIDO CONFIRMADO!</h3>
            <div className="confirm-detail">
              🍽️ <strong>{state.item?.nombre}</strong><br />
              💰 {state.item?.precio}<br />
              {state.delivery === 'aqui' ? `🪑 Mesa #${state.mesa}` : '🛍️ Para llevar'}
            </div>
            <p>
              {tipo === 'almuerzo'
                ? 'Tu pedido está siendo preparado al mejor estilo Picapiedra 🦕<br>¡Yabba Dabba Doo!'
                : '¡Tu pedido está en camino! Prepárate para una noche de sabor prehistórico 🔥'}
            </p>
            <div style={{ marginTop: '1.2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-success" style={{ flex: 1 }} onClick={onCerrar}>
                ✓ Listo
              </button>
              <a
                href="https://api.whatsapp.com/send?phone=573004536404&text=Hola%2C%20quiero%20hacer%20un%20pedido%2C%20%C2%BFme%20puedes%20compartir%20la%20carta%20por%20favor%3F%F0%9F%8D%94%F0%9F%94%A5"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem' }}
              >
                📲 WhatsApp
              </a>
            </div>
          </div>

          <div className="modal-actions" style={{ display: confirmado ? 'none' : 'flex' }}>
            <button className="btn btn-primary" onClick={confirmar}>
              ✓ Confirmar Pedido
            </button>
            <button className="btn btn-outline" onClick={onCerrar}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
