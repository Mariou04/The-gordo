import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import Horarios from './components/Horarios'
import Modal from './components/Modal'
import Ubicacion from './components/Ubicacion'
import Footer from './components/Footer'
import Admin from './pages/Admin'
import type { MenuType } from './types'

function Home() {
  const [modalTipo, setModalTipo] = useState<MenuType | null>(null)
  const [modalKey, setModalKey] = useState(0)

  function abrirModal(tipo: MenuType) {
    setModalKey((k) => k + 1)
    setModalTipo(tipo)
  }

  return (
    <>
      <Navbar />
      <Banner />
      <Horarios onOpen={abrirModal} />

      {modalTipo && (
        <Modal
          key={modalKey}
          tipo={modalTipo}
          onCerrar={() => setModalTipo(null)}
        />
      )}

      <Ubicacion />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
