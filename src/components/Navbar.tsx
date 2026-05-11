export default function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav>
      <div className="nav-logo">🍔 THE GORDO</div>
      <ul className="nav-links">
        <li><a href="#horario" onClick={(e) => { e.preventDefault(); scrollTo('horario') }}>Menú</a></li>
        <li><a href="#ubicacion" onClick={(e) => { e.preventDefault(); scrollTo('ubicacion') }}>Ubicación</a></li>
        <li>
          <a
            href="https://api.whatsapp.com/send?phone=573004536404&text=Hola%2C%20quiero%20hacer%20un%20pedido%2C%20%C2%BFme%20puedes%20compartir%20la%20carta%20por%20favor%3F%F0%9F%8D%94%F0%9F%94%A5"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--amarillo)' }}
          >
            📲 Pedir Ya
          </a>
        </li>
      </ul>
    </nav>
  )
}
