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

function resumenStats(pedidos: PedidoDB[]) {
  return {
    total: pedidos.length,
    cola: pedidos.filter((p) => p.estado === 'en cola').length,
    entregado: pedidos.filter((p) => p.estado === 'entregado').length,
    cancelado: pedidos.filter((p) => p.estado === 'cancelado').length,
    totalHoy: pedidos.filter((p) => {
      if (!p.created_at) return false
      return p.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10)
    }).length,
  }
}

export default function Admin() {
  const [vista, setVista] = useState<Vista>('login')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [pedidos, setPedidos] = useState<PedidoDB[]>([])
  const [filtro, setFiltro] = useState<EstadoPedido | 'todos'>('todos')
  const [cargando, setCargando] = useState(false)
  const [detalle, setDetalle] = useState<PedidoDB | null>(null)

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
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)))
    if (detalle?.id === id) setDetalle((prev) => prev ? { ...prev, estado } : null)
  }

  function deliveryIcon(d: string) {
    switch (d) {
      case 'aqui': return '🪑'
      case 'domicilio': return '🏠'
      default: return '🛍️'
    }
  }

  function deliveryLabel(p: PedidoDB) {
    if (p.delivery === 'aqui') return `Mesa ${p.mesa}${p.personas ? ` (${p.personas} pers.)` : ''}`
    if (p.delivery === 'domicilio') return 'Domicilio'
    return 'Llevar'
  }

  if (vista === 'login') {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <div style={{ fontSize: '3rem' }}>🔐</div>
          <h2>Admin The Gordo</h2>
          <input
            className="campo" placeholder="Usuario" value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            className="campo" type="password" placeholder="Contraseña" value={pass}
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

  const stats = resumenStats(pedidos)

  return (
    <div className="admin-dash">
      <div className="admin-bar">
        <h2>📋 The Gordo Admin</h2>
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
          <button className="btn btn-outline" style={{ flex: 0, padding: '.5rem 1rem', fontSize: '.85rem', color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }} onClick={() => setVista('login')}>
            Salir
          </button>
        </div>
      </div>

      {err && (
        <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--rojo)', background: '#FFF0F0', margin: '1rem 2rem', borderRadius: '10px', fontSize: '.9rem' }}>
          ❌ {err}
        </p>
      )}

      {!err && (
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="stat-num" style={{ color: 'var(--rojo)' }}>{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-num" style={{ color: '#FF9800' }}>{stats.cola}</div>
            <div className="stat-label">En cola</div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-num" style={{ color: '#4CAF50' }}>{stats.entregado}</div>
            <div className="stat-label">Entregado</div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-num" style={{ color: '#F44336' }}>{stats.cancelado}</div>
            <div className="stat-label">Cancelado</div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-num" style={{ color: '#2196F3' }}>{stats.totalHoy}</div>
            <div className="stat-label">Hoy</div>
          </div>
        </div>
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
                <th>Menú</th>
                <th>Entrega</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td className="clickable" onClick={() => setDetalle(p)} style={{ fontWeight: 700 }}>{p.id}</td>
                  <td className="clickable" onClick={() => setDetalle(p)}>
                    {p.nombre}
                    {p.direccion && <><br /><small style={{ color: '#888' }}>{p.direccion}</small></>}
                  </td>
                  <td>{p.telefono}</td>
                  <td style={{ maxWidth: 200 }} className="clickable" onClick={() => setDetalle(p)}>
                    {p.items.map((i, idx) => (
                      <div key={idx} style={{ fontSize: '.82rem' }}>• {i.nombre}</div>
                    ))}
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatearPrecio(p.total)}</td>
                  <td>{p.tipo === 'almuerzo' ? '🌞 Almuerzo' : '🌙 Noche'}</td>
                  <td style={{ fontSize: '.85rem' }}>
                    {deliveryIcon(p.delivery)} {deliveryLabel(p)}
                    {p.fecha && <><br /><small style={{ color: '#888' }}>{p.fecha} {p.hora}</small></>}
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

      {detalle && (
        <div className="detalle-overlay" onClick={() => setDetalle(null)}>
          <div className="detalle-modal" onClick={(e) => e.stopPropagation()}>
            <h3>📄 Pedido #{detalle.id}</h3>

            <div className="detalle-row">
              <span className="detalle-label">Cliente</span>
              <span className="detalle-value">{detalle.nombre}</span>
            </div>
            <div className="detalle-row">
              <span className="detalle-label">Teléfono</span>
              <span className="detalle-value">{detalle.telefono}</span>
            </div>
            <div className="detalle-row">
              <span className="detalle-label">Menú</span>
              <span className="detalle-value">{detalle.tipo === 'almuerzo' ? '🌞 Almuerzo' : '🌙 Noche'}</span>
            </div>
            <div className="detalle-row">
              <span className="detalle-label">Entrega</span>
              <span className="detalle-value">{deliveryIcon(detalle.delivery)} {deliveryLabel(detalle)}</span>
            </div>
            {detalle.delivery === 'domicilio' && detalle.direccion && (
              <div className="detalle-row">
                <span className="detalle-label">Dirección</span>
                <span className="detalle-value" style={{ maxWidth: '220px', textAlign: 'right' }}>{detalle.direccion}</span>
              </div>
            )}
            {detalle.delivery === 'aqui' && (
              <>
                <div className="detalle-row">
                  <span className="detalle-label">Mesa</span>
                  <span className="detalle-value">#{detalle.mesa}</span>
                </div>
                {detalle.personas && (
                  <div className="detalle-row">
                    <span className="detalle-label">Personas</span>
                    <span className="detalle-value">{detalle.personas}</span>
                  </div>
                )}
                <div className="detalle-row">
                  <span className="detalle-label">Fecha / Hora</span>
                  <span className="detalle-value">{detalle.fecha} {detalle.hora}</span>
                </div>
              </>
            )}
            <div className="detalle-row">
              <span className="detalle-label">Estado</span>
              <span className="detalle-value">
                <span className="estado-badge" style={{ background: estadoColores[detalle.estado] }}>
                  {estadoLabels[detalle.estado]}
                </span>
              </span>
            </div>
            <div className="detalle-row">
              <span className="detalle-label">Creado</span>
              <span className="detalle-value" style={{ fontSize: '.8rem', color: '#888' }}>
                {new Date(detalle.created_at).toLocaleString('es-CO')}
              </span>
            </div>

            <div style={{ borderTop: '2px solid #f0f0f0', margin: '1rem 0', paddingTop: '.8rem' }}>
              <p style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: '.5rem' }}>🛒 Productos</p>
              {detalle.items.map((i, idx) => (
                <div className="detalle-row" key={idx}>
                  <span className="detalle-value" style={{ textAlign: 'left' }}>{i.nombre}</span>
                  <span className="detalle-label">{i.precio}</span>
                </div>
              ))}
              <div className="detalle-row" style={{ borderTop: '2px solid #ddd', marginTop: '.3rem', paddingTop: '.5rem' }}>
                <span className="detalle-value" style={{ fontSize: '1rem' }}>Total</span>
                <span className="detalle-value" style={{ fontSize: '1rem', color: 'var(--rojo)' }}>{formatearPrecio(detalle.total)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '.6rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {detalle.estado !== 'entregado' && (
                <button className="btn btn-success" style={{ flex: 1, padding: '.6rem 1rem', fontSize: '.9rem' }} onClick={() => cambiarEstado(detalle.id, 'entregado')}>
                  ✓ Entregado
                </button>
              )}
              {detalle.estado !== 'cancelado' && (
                <button className="btn btn-outline" style={{ flex: 1, padding: '.6rem 1rem', fontSize: '.9rem', borderColor: '#F44336', color: '#F44336' }} onClick={() => cambiarEstado(detalle.id, 'cancelado')}>
                  ✕ Cancelar
                </button>
              )}
              {detalle.estado !== 'en cola' && (
                <button className="btn btn-outline" style={{ flex: 1, padding: '.6rem 1rem', fontSize: '.9rem', borderColor: '#FF9800', color: '#FF9800' }} onClick={() => cambiarEstado(detalle.id, 'en cola')}>
                  ↩ Volver a cola
                </button>
              )}
              <button className="btn btn-primary" style={{ flex: 1, padding: '.6rem 1rem', fontSize: '.9rem' }} onClick={() => setDetalle(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
