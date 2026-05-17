import { useState, useMemo } from 'react'
import type { MenuType, DeliveryType, ModalState, PedidoConfirmado, MenuItem } from '../types'
import { menuAlmuerzo, menuNoche, hoy, manana, formatearPrecio } from '../types'
import ConfirmPopup from './ConfirmPopup'

interface Props {
  tipo: MenuType
  onCerrar: () => void
}

const fechaHoy = hoy()
const fechaManana = manana()

const horasDisponibles = [
  { label: '12 PM', value: '12:00' },
  { label: '1 PM', value: '13:00' },
  { label: '2 PM', value: '14:00' },
  { label: '3 PM', value: '15:00' },
  { label: '4 PM', value: '16:00' },
  { label: '5 PM', value: '17:00' },
  { label: '6 PM', value: '18:00' },
  { label: '7 PM', value: '19:00' },
  { label: '8 PM', value: '20:00' },
  { label: '9 PM', value: '21:00' },
  { label: '10 PM', value: '22:00' },
  { label: '11 PM', value: '23:00' },
  { label: '12 AM', value: '00:00' },
  { label: '1 AM', value: '01:00' },
  { label: '2 AM', value: '02:00' },
  { label: '3 AM', value: '03:00' },
  { label: '4 AM', value: '04:00' },
  { label: '5 AM', value: '05:00' },
]

function estadoInicial(): ModalState {
  return { items: [], delivery: null, mesa: null, fecha: fechaHoy, hora: '12:00' }
}

export default function Modal({ tipo, onCerrar }: Props) {
  const [state, setState] = useState<ModalState>(estadoInicial)
  const [confirmado, setConfirmado] = useState<PedidoConfirmado | null>(null)

  const menu = tipo === 'almuerzo' ? menuAlmuerzo : menuNoche
  const titulo = tipo === 'almuerzo' ? 'Menú del Almuerzo' : 'Menú de la Noche'
  const emoji = tipo === 'almuerzo' ? '🦕' : '🌙'

  function toggleItem(item: MenuItem) {
    setState((s) => {
      const existe = s.items.find((i) => i.nombre === item.nombre)
      if (existe) {
        return { ...s, items: s.items.filter((i) => i.nombre !== item.nombre) }
      }
      return {
        ...s,
        items: [
          ...s.items,
          { nombre: item.nombre, precio: item.precio, precioNum: item.precioNum },
        ],
      }
    })
  }

  function selectDelivery(d: DeliveryType) {
    setState((s) => ({
      ...s,
      delivery: d,
      mesa: d !== 'aqui' ? null : s.mesa,
    }))
  }

  function selectMesa(num: number) {
    setState((s) => ({ ...s, mesa: num }))
  }

  const total = useMemo(
    () => state.items.reduce((sum, i) => sum + i.precioNum, 0),
    [state.items],
  )

  function confirmar() {
    const s = state
    if (s.items.length === 0) return
    if (!s.delivery) return
    if (s.delivery === 'aqui' && !s.mesa) return
    setConfirmado({
      items: s.items,
      total,
      delivery: s.delivery,
      mesa: s.mesa,
      fecha: s.delivery === 'aqui' ? s.fecha : '',
      hora: s.delivery === 'aqui' ? s.hora : '',
      tipo,
    })
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

          <div className="modal-body">
            <div className="product-list-label">Productos</div>
            <div className="product-list">
              {menu.map((item) => {
                const sel = state.items.some((i) => i.nombre === item.nombre)
                return (
                  <div
                    key={item.id}
                    className={`product-item${sel ? ' selected' : ''}`}
                    onClick={() => toggleItem(item)}
                  >
                    <div className={`product-check${sel ? ' checked' : ''}`}>
                      {sel ? '✓' : ''}
                    </div>
                    <span className="product-emoji">{item.emoji}</span>
                    <div className="product-info">
                      <div className="product-name">{item.nombre}</div>
                      <div className="product-desc">{item.descripcion}</div>
                    </div>
                    <span className="product-price">{item.precio}</span>
                  </div>
                )
              })}
            </div>

            {state.items.length > 0 && (
              <div className="cart-bar">
                <span>{state.items.length} producto{state.items.length > 1 ? 's' : ''}</span>
                <span className="cart-total">{formatearPrecio(total)}</span>
              </div>
            )}

            <div className="divider" />
            <p className="section-label">¿Cómo lo vas a disfrutar?</p>
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

            {state.delivery === 'aqui' && (
              <>
                <div className="divider" />
                <p className="section-label">Selecciona tu mesa 🗺️</p>
                <div className="mesas-grid-sm">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <div
                      key={num}
                      className={`mesa-sm${state.mesa === num ? ' selected' : ''}`}
                      onClick={() => selectMesa(num)}
                    >
                      🪑 {num}
                    </div>
                  ))}
                </div>

                <div className="divider" />
                <p className="section-label">🗓️ ¿Cuándo vienes?</p>
                <div className="fecha-toggles">
                  <button
                    className={`fecha-btn${state.fecha === fechaHoy ? ' active' : ''}`}
                    onClick={() => setState((s) => ({ ...s, fecha: fechaHoy }))}
                  >
                    📅 Hoy
                  </button>
                  <button
                    className={`fecha-btn${state.fecha === fechaManana ? ' active' : ''}`}
                    onClick={() => setState((s) => ({ ...s, fecha: fechaManana }))}
                  >
                    📅 Mañana
                  </button>
                </div>

                <p className="section-label" style={{ marginTop: '.8rem' }}>🕐 ¿A qué hora?</p>
                <div className="horas-grid">
                  {horasDisponibles.map((h) => (
                    <div
                      key={h.value}
                      className={`hora-chip${state.hora === h.value ? ' selected' : ''}`}
                      onClick={() => setState((s) => ({ ...s, hora: h.value }))}
                    >
                      {h.label}
                    </div>
                  ))}
                </div>
              </>
            )}

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
