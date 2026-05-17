# The Gordo 🦕🔥

App web de comidas rápidas para **The Gordo** — menú de almuerzo y noche, pedidos online con opciones de llevar, comer aquí o domicilio, y panel de administración.

## Stack

- React 19 + TypeScript + Vite
- React Router DOM
- Supabase (PostgreSQL)
- Google Fonts (Bangers, Fredoka One, Nunito)

## Funcionalidades

- Menú dividido en **Almuerzo** y **Noche**
- Selección múltiple de productos con checkboxes
- Modal de pedido con datos del cliente (nombre, teléfono solo números)
- Opciones de entrega: **Para llevar**, **Comer aquí** (con selección de mesa, fecha Hoy/Mañana, horario 12PM–5AM), **Domicilio** (con dirección)
- Confirmación guarda el pedido en Supabase y muestra resumen con enlace a WhatsApp
- Panel admin en `/admin` con login (`admin` / `gordo2025`), tabla de pedidos, filtro por estado, y botones para cambiar estado (entregado/cancelado/cola)

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Copiar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` a `.env`
3. Ejecutar el contenido de `migracion.sql` en el SQL Editor

## Deploy en Vercel

Agregar las variables de entorno en Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
