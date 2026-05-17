export default function Ubicacion() {
  return (
    <section id="ubicacion">
      <h2>📍 Nuestra Ubicación</h2>
      <p className="ubicacion-sub">¡Encuéntranos en Piedradura... digo, en Bucaramanga!</p>

      <div className="map-wrapper">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15835.666040599222!2d-73.14598147579767!3d7.135653225837054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6815f9bd6ac1a3%3A0xfa3953af5513841c!2sComidas%20Rapidas%20The%20Gordo!5e0!3m2!1ses!2sco!4v1778464223716!5m2!1ses!2sco"
          width="700"
          height="420"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <p className="pedir-ahora">PIDE AHORA 📲 🔥◽ SABOR Y CALIDAD EN UN SOLO LUGAR 📍</p>
    </section>
  )
}
