import { useState, useCallback } from 'react'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import Horarios from './components/Horarios'
import Modal from './components/Modal'
import Ubicacion from './components/Ubicacion'
import Footer from './components/Footer'
import Toast from './components/Toast'
import type { MenuType } from './types'

function App() {
  const [modalTipo, setModalTipo] = useState<MenuType | null>(null)
  const [modalKey, setModalKey] = useState(0)
  const [toastMsg, setToastMsg] = useState('')
  const [toastKey, setToastKey] = useState(0)

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setToastKey((k) => k + 1)
  }, [])

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
          onToast={showToast}
        />
      )}

      <Ubicacion />
      <Footer />
      <Toast key={toastKey} mensaje={toastMsg} visible={toastKey > 0} />
    </>
  )
}

export default App
