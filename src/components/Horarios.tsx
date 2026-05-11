import type { MenuType } from '../types'

interface Props {
  onOpen: (tipo: MenuType) => void
}

export default function Horarios({ onOpen }: Props) {
  return (
    <section id="horario">
      <h2>¿En qué horario vas a comer hoy?</h2>
      <div className="meal-cards">
        <div className="meal-card" onClick={() => onOpen('almuerzo')}>
          <div className="meal-badge">🌞 Almuerzo</div>
          <img
            src="/almuerzos.jpg"
            alt="Almuerzos"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80'
            }}
          />
          <div className="meal-card-body">
            <h3>🦕 Para Almorzar</h3>
            <p>Menú del día con proteína a tu elección. ¡Al estilo Picapiedra!</p>
          </div>
        </div>

        <div className="meal-card" onClick={() => onOpen('noche')}>
          <div className="meal-badge">🌙 Noche</div>
          <img
            src="/rapidas.jpg"
            alt="Para la Noche"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80'
            }}
          />
          <div className="meal-card-body">
            <h3>🔥 Para la Noche</h3>
            <p>Hamburguesas, salchipapas y antojos nocturnos. ¡Con mucho fuego!</p>
          </div>
        </div>
      </div>
    </section>
  )
}
