import type { PedidoConfirmado } from '../types'

interface Props {
  pedido: PedidoConfirmado
  onCerrar: () => void
}

export default function ConfirmPopup({ pedido, onCerrar }: Props) {
  const entrega =
    pedido.delivery === 'aqui' ? 'Comer aquí' : 'Para llevar'

  return (
    <div className="modal-overlay active popup-overlay" onClick={onCerrar}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: '3rem' }}>🎉</div>
        <h3>¡PEDIDO CONFIRMADO!</h3>

        <div className="popup-body">
          <div className="popup-row">
            <span className="popup-label">Producto</span>
            <span className="popup-value">{pedido.item.nombre}</span>
          </div>
          <div className="popup-row">
            <span className="popup-label">Precio</span>
            <span className="popup-value">{pedido.item.precio}</span>
          </div>
          <div className="popup-row">
            <span className="popup-label">Tipo</span>
            <span className="popup-value">{entrega}</span>
          </div>
          {pedido.delivery === 'aqui' && (
            <div className="popup-row">
              <span className="popup-label">Mesa</span>
              <span className="popup-value">#{pedido.mesa}</span>
            </div>
          )}
          <div className="popup-row">
            <span className="popup-label">Fecha</span>
            <span className="popup-value">{pedido.fecha}</span>
          </div>
          <div className="popup-row">
            <span className="popup-label">Hora</span>
            <span className="popup-value">{pedido.hora}</span>
          </div>
          <div className="popup-row">
            <span className="popup-label">Menú</span>
            <span className="popup-value">{pedido.tipo === 'almuerzo' ? 'Almuerzo' : 'Noche'}</span>
          </div>
        </div>

        <p style={{ marginTop: '.5rem', color: '#555' }}>
          {pedido.tipo === 'almuerzo'
            ? 'Tu pedido está siendo preparado al mejor estilo Picapiedra 🦕'
            : 'Prepárate para una noche de sabor prehistórico 🔥'}
        </p>

        <div className="popup-actions">
          <button className="btn btn-success" onClick={onCerrar}>
            ✓ Listo
          </button>
          <a
            href="https://api.whatsapp.com/send?phone=573004536404&text=Hola%2C%20quiero%20hacer%20un%20pedido%2C%20%C2%BFme%20puedes%20compartir%20la%20carta%20por%20favor%3F%F0%9F%8D%94%F0%9F%94%A5"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem' }}
          >
            📲 WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
