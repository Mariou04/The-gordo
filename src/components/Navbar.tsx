export default function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav>
      <img src="/logo.png" alt="The Gordo" className="nav-logo" />
      <ul className="nav-links">
        <li><a href="#horario" onClick={(e) => { e.preventDefault(); scrollTo('horario') }}>Menú</a></li>
        <li><a href="#ubicacion" onClick={(e) => { e.preventDefault(); scrollTo('ubicacion') }}>Ubicación</a></li>
        <li>
          <a
            href="#horario"
            onClick={(e) => { e.preventDefault(); scrollTo('horario') }}
            style={{ color: 'var(--amarillo)' }}
          >
            📲 Pedir Ya
          </a>
        </li>
        <li><a href="/admin" style={{ color: '#aaa', fontSize: '.75rem' }}>Admin</a></li>
      </ul>
    </nav>
  )
}
