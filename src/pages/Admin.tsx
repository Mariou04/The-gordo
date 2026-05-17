import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { PedidoDB, EstadoPedido } from '../types'
import { formatearPrecio } from '../types'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'gordo2025'

type Vista = 'login' | 'dashboard'

const estadoLabels: Record<EstadoPedido, string> = {
  'en cola': 'En cola',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

const estadoColores: Record<EstadoPedido, string> = {
  'en cola': '#FF9800',
  entregado: '#4CAF50',
  cancelado: '#F44336',
}

export default function Admin() {
  const [vista, setVista] = useState<Vista>('login')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [pedidos, setPedidos] = useState<PedidoDB[]>([])
  const [filtro, setFiltro] = useState<EstadoPedido | 'todos'>('todos')
  const [cargando, setCargando] = useState(false)

  function login() {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setVista('dashboard')
      setErr('')
    } else {
      setErr('Credenciales inválidas')
    }
  }

  async function cargarPedidos() {
    setCargando(true)
    setErr('')
    let q = supabase.from('pedidos').select('*').order('created_at', { ascending: false })
    if (filtro !== 'todos') q = q.eq('estado', filtro)
    const { data, error } = await q
    if (error) {
      setErr(error.message)
    } else if (data) {
      setPedidos(data as PedidoDB[])
    }
    setCargando(false)
  }

  useEffect(() => {
    if (vista === 'dashboard') cargarPedidos()
  }, [vista, filtro])

  async function cambiarEstado(id: number, estado: EstadoPedido) {
    await supabase.from('pedidos').update({ estado }).eq('id', id)
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado } : p)),
    )
  }

  function deliveryIcon(d: string) {
    switch (d) {
      case 'aqui': return '🪑'
      case 'domicilio': return '🏠'
      default: return '🛍️'
    }
  }

  if (vista === 'login') {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <div style={{ fontSize: '3rem' }}>🔐</div>
          <h2>Admin The Gordo</h2>
          <input
            className="campo"
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            className="campo"
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            style={{ marginTop: '.5rem' }}
            onKeyDown={(e) => e.key === 'Enter' && login()}
          />
          {err && <p style={{ color: 'var(--rojo)', marginTop: '.5rem', fontSize: '.9rem' }}>{err}</p>}
          <button className="btn btn-primary" onClick={login} style={{ marginTop: '1rem' }}>
            Ingresar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dash">
      <div className="admin-bar">
        <h2>📋 Pedidos</h2>
        <div className="admin-bar-right">
          <select
            className="admin-filtro"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as EstadoPedido | 'todos')}
          >
            <option value="todos">Todos</option>
            <option value="en cola">En cola</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <button className="btn btn-outline" style={{ flex: 0, padding: '.5rem 1rem', fontSize: '.85rem' }} onClick={() => setVista('login')}>
            Salir
          </button>
        </div>
      </div>

      {err && (
        <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--rojo)', background: '#FFF0F0', margin: '1rem 2rem', borderRadius: '10px', fontSize: '.9rem' }}>
          ❌ {err}
        </p>
      )}
      {cargando ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Cargando...</p>
      ) : !err && pedidos.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No hay pedidos</p>
      ) : !err && (
        <div className="admin-tabla-wrap">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Tipo</th>
                <th>Entrega</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}<br /><small style={{ color: '#888' }}>{p.direccion || ''}</small></td>
                  <td>{p.telefono}</td>
                  <td style={{ maxWidth: 200 }}>
                    {p.items.map((i, idx) => (
                      <div key={idx} style={{ fontSize: '.82rem' }}>• {i.nombre}</div>
                    ))}
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatearPrecio(p.total)}</td>
                  <td>{p.tipo === 'almuerzo' ? '🌞 Almuerzo' : '🌙 Noche'}</td>
                  <td>
                    {deliveryIcon(p.delivery)} {p.delivery === 'aqui' ? `Mesa ${p.mesa}` : p.delivery === 'domicilio' ? 'Domicilio' : 'Llevar'}
                    {p.fecha && <><br /><small>{p.fecha} {p.hora}</small></>}
                  </td>
                  <td>
                    <span className="estado-badge" style={{ background: estadoColores[p.estado] }}>
                      {estadoLabels[p.estado]}
                    </span>
                  </td>
                  <td>
                    <div className="estado-acciones">
                      {p.estado !== 'entregado' && (
                        <button className="estado-btn entregado" onClick={() => cambiarEstado(p.id, 'entregado')} title="Entregado">✓</button>
                      )}
                      {p.estado !== 'cancelado' && (
                        <button className="estado-btn cancelado" onClick={() => cambiarEstado(p.id, 'cancelado')} title="Cancelado">✕</button>
                      )}
                      {p.estado !== 'en cola' && (
                        <button className="estado-btn cola" onClick={() => cambiarEstado(p.id, 'en cola')} title="Volver a cola">↩</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
