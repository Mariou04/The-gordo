# The Gordo 🦕🔥

App web de comidas rápidas para **The Gordo** — menú de almuerzo y noche, pedidos online con opciones de llevar, comer aquí o domicilio, y panel de administración.

## Estructura del proyecto

```
the-gordo/
├── public/
│   ├── banner2.png
│   ├── logo.png
│   ├── almuerzos.jpg
│   └── rapidas.jpg
├── src/
│   ├── App.tsx              # Router: / (Home) y /admin
│   ├── main.tsx             # Entry point
│   ├── index.css            # Todos los estilos
│   ├── env.d.ts             # Tipos para VITE_ env vars
│   ├── assets/
│   │   └── hero.png
│   ├── components/
│   │   ├── Navbar.tsx       # Navbar con logo
│   │   ├── Banner.tsx       # Banner principal
│   │   ├── Horarios.tsx     # Tarjetas almuerzo/noche
│   │   ├── Modal.tsx        # Modal de pedido (multi-producto + datos + entrega)
│   │   ├── ConfirmPopup.tsx # Popup de confirmación + guardado Supabase
│   │   ├── Ubicacion.tsx    # Mapa y ubicación
│   │   ├── Toast.tsx        # Notificaciones
│   │   └── Footer.tsx
│   ├── pages/
│   │   └── Admin.tsx        # Login + dashboard + gestión de pedidos
│   ├── lib/
│   │   └── supabase.ts      # Cliente Supabase
│   └── types/
│       └── index.ts         # Tipos, menús, helpers
├── migracion.sql            # Script SQL para crear tabla pedidos
├── .env                     # Variables de entorno (gitignored)
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

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
