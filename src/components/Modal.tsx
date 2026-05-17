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
                <p className="section-label">🗓️ Reserva</p>
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
