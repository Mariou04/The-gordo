-- Ejecutar en el SQL Editor de Supabase (https://supabase.com/dashboard)
-- 1. Crear la tabla pedidos (si no existe)
CREATE TABLE IF NOT EXISTS pedidos (
  id BIGSERIAL PRIMARY KEY,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC NOT NULL DEFAULT 0,
  tipo TEXT NOT NULL,
  delivery TEXT NOT NULL,
  nombre TEXT NOT NULL DEFAULT '',
  telefono TEXT NOT NULL DEFAULT '',
  direccion TEXT,
  mesa INT,
  fecha TEXT,
  hora TEXT,
  estado TEXT NOT NULL DEFAULT 'en cola',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Desactivar RLS para permitir inserts desde el anon key
ALTER TABLE pedidos DISABLE ROW LEVEL SECURITY;
