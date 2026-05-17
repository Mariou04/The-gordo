import { useEffect, useState } from 'react'
import type { PedidoConfirmado } from '../types'
import { formatearPrecio } from '../types'
import { supabase } from '../lib/supabase'

interface Props {
  pedido: PedidoConfirmado
  onCerrar: () => void
}

export default function ConfirmPopup({ pedido, onCerrar }: Props) {
  const [guardando, setGuardando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function guardar() {
        const { error } = await supabase.from('pedidos').insert({
        items: pedido.items,
        total: pedido.total,
        tipo: pedido.tipo,
        delivery: pedido.delivery,
        nombre: pedido.nombre,
        telefono: pedido.telefono,
        direccion: pedido.delivery === 'domicilio' ? pedido.direccion : null,
        mesa: pedido.delivery === 'aqui' ? pedido.mesa : null,
        fecha: pedido.delivery === 'aqui' ? pedido.fecha : null,
        hora: pedido.delivery === 'aqui' ? pedido.hora : null,
        estado: 'en cola',
      })
      setGuardando(false)
      if (error) setError(error.message)
    }
    guardar()
  }, [pedido])

  function labelEntrega() {
    switch (pedido.delivery) {
      case 'aqui': return 'Comer aquí'
      case 'domicilio': return 'Domicilio'
      default: return 'Para llevar'
    }
  }

  return (
    <div className="modal-overlay active popup-overlay" onClick={onCerrar}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        {guardando ? (
          <>
            <div style={{ fontSize: '3rem' }}>⏳</div>
            <h3 style={{ color: '#555' }}>Guardando pedido...</h3>
          </>
        ) : error ? (
          <>
            <div style={{ fontSize: '3rem' }}>❌</div>
            <h3 style={{ color: 'var(--rojo)' }}>Error al guardar</h3>
            <p style={{ margin: '.5rem 0', color: '#555' }}>{error}</p>
            <button className="btn btn-primary" onClick={onCerrar} style={{ marginTop: '1rem' }}>
              Cerrar
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <h3>¡PEDIDO CONFIRMADO!</h3>

            <div className="popup-body">
              {pedido.items.map((item, i) => (
                <div className="popup-row" key={i}>
                  <span className="popup-value" style={{ textAlign: 'left' }}>{item.nombre}</span>
                  <span className="popup-label">{item.precio}</span>
                </div>
              ))}
              <div className="popup-row popup-total">
                <span className="popup-value">Total</span>
                <span className="popup-label">{formatearPrecio(pedido.total)}</span>
              </div>

              <div style={{ borderTop: '1px solid #C8E6C9', margin: '.5rem 0' }} />

              <div className="popup-row">
                <span className="popup-label">Cliente</span>
                <span className="popup-value">{pedido.nombre}</span>
              </div>
              <div className="popup-row">
                <span className="popup-label">Teléfono</span>
                <span className="popup-value">{pedido.telefono}</span>
              </div>
              <div className="popup-row">
                <span className="popup-label">Tipo</span>
                <span className="popup-value">{labelEntrega()}</span>
              </div>
              {pedido.delivery === 'domicilio' && (
                <div className="popup-row">
                  <span className="popup-label">Dirección</span>
                  <span className="popup-value" style={{ textAlign: 'right', maxWidth: '220px' }}>{pedido.direccion}</span>
                </div>
              )}
              {pedido.delivery === 'aqui' && (
                <>
                  <div className="popup-row">
                    <span className="popup-label">Mesa</span>
                    <span className="popup-value">#{pedido.mesa}</span>
                  </div>
                  <div className="popup-row">
                    <span className="popup-label">Fecha</span>
                    <span className="popup-value">{pedido.fecha}</span>
                  </div>
                  <div className="popup-row">
                    <span className="popup-label">Hora</span>
                    <span className="popup-value">{pedido.hora}</span>
                  </div>
                </>
              )}
              <div className="popup-row">
                <span className="popup-label">Menú</span>
                <span className="popup-value">{pedido.tipo === 'almuerzo' ? 'Almuerzo' : 'Noche'}</span>
              </div>
            </div>

            <p style={{ marginTop: '.5rem', color: '#555', fontSize: '.9rem' }}>
              {pedido.tipo === 'almuerzo'
                ? 'Preparándose al mejor estilo Picapiedra 🦕'
                : 'Prepárate para una noche de sabor prehistórico 🔥'}
            </p>

            <div className="popup-actions">
              <button className="btn btn-success" onClick={onCerrar}>
                ✓ Listo
              </button>
              <a
                href={`https://api.whatsapp.com/send?phone=573004536404&text=Hola%2C%20soy%20${encodeURIComponent(pedido.nombre)}%2C%20mi%20pedido%3A%20${encodeURIComponent(pedido.items.map(i => i.nombre).join(', '))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem' }}
              >
                📲 WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
