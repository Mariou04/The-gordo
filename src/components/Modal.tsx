import { useState, useRef } from 'react'
import type { MenuType, DeliveryType, ModalState } from '../types'
import type { PedidoConfirmado } from '../types'
import { menuAlmuerzo, menuNoche, hoy, manana } from '../types'
import ConfirmPopup from './ConfirmPopup'

interface Props {
  tipo: MenuType
  onCerrar: () => void
}

const fechaHoy = hoy()
const fechaManana = manana()

function estadoInicial(): ModalState {
  return { item: null, delivery: null, mesa: null, fecha: fechaHoy, hora: '12:00' }
}

export default function Modal({ tipo, onCerrar }: Props) {
  const [state, setState] = useState<ModalState>(estadoInicial)
  const [confirmado, setConfirmado] = useState<PedidoConfirmado | null>(null)
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
  }

  function confirmar() {
    const s = state
    if (!s.item) { return }
    if (!s.delivery) { return }
    if (s.delivery === 'aqui' && !s.mesa) { return }
    setConfirmado({ ...s, tipo } as PedidoConfirmado)
  }

  return (
    <>
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
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <div
                      key={num}
                      className={`mesa${state.mesa === num ? ' selected' : ''}`}
                      onClick={() => selectMesa(num)}
                    >
                      <span className="mesa-icon">🪑</span>
                      <span className="mesa-num">{num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '2px dashed #eee', margin: '1.2rem 0' }} />
            <p style={{ fontFamily: "'Fredoka One'", color: '#555', fontSize: '.95rem', marginBottom: '.7rem' }}>
              🗓️ Reserva
            </p>
            <div className="reserva-grid">
              <select
                className="reserva-select"
                value={state.fecha}
                onChange={(e) => setState((s) => ({ ...s, fecha: e.target.value }))}
              >
                <option value={fechaHoy}>Hoy ({fechaHoy})</option>
                <option value={fechaManana}>Mañana ({fechaManana})</option>
              </select>
              <input
                type="time"
                className="reserva-input"
                value={state.hora}
                onChange={(e) => setState((s) => ({ ...s, hora: e.target.value }))}
              />
            </div>

            <div className="modal-actions">
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

      {confirmado && (
        <ConfirmPopup
          pedido={confirmado}
          onCerrar={() => { setConfirmado(null); onCerrar() }}
        />
      )}
    </>
  )
}
