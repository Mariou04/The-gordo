export type MenuType = 'almuerzo' | 'noche'
export type DeliveryType = 'llevar' | 'aqui'

export interface MenuItem {
  id: string
  emoji: string
  nombre: string
  descripcion: string
  precio: string
  precioNum: number
}

export interface ItemSeleccionado {
  nombre: string
  precio: string
  precioNum: number
}

export interface ModalState {
  items: ItemSeleccionado[]
  delivery: DeliveryType | null
  mesa: number | null
  fecha: string
  hora: string
}

export interface PedidoConfirmado {
  items: ItemSeleccionado[]
  total: number
  delivery: DeliveryType
  mesa: number | null
  fecha: string
  hora: string
  tipo: MenuType
}

export const menuAlmuerzo: MenuItem[] = [
  {
    id: 'costilla-dino',
    emoji: '🦴',
    nombre: 'Costilla de Dino (Pablo Mármol)',
    descripcion: 'Tan grande que vuelca el auto',
    precio: '$15.000',
    precioNum: 15000,
  },
  {
    id: 'pollo-pajaro',
    emoji: '🐔',
    nombre: 'Pollo Pájaro Temprano (Pedro Picapiedra)',
    descripcion: 'Criado en Piedradura, asado en leña de bambú',
    precio: '$15.000',
    precioNum: 15000,
  },
  {
    id: 'mamut-salsa',
    emoji: '🦣',
    nombre: 'Mamut en Salsa Wilma',
    descripcion: 'Receta secreta de Wilma Picapiedra',
    precio: '$15.000',
    precioNum: 15000,
  },
]

export const menuNoche: MenuItem[] = [
  {
    id: 'hamburguesa-pablo',
    emoji: '🍔',
    nombre: 'Hamburguesa Pablo Mármol',
    descripcion: 'Doble carne + tocino + queso fundido',
    precio: '$16.000',
    precioNum: 16000,
  },
  {
    id: 'burger-pedro',
    emoji: '🍟',
    nombre: 'Burger Pedro Picapiedra',
    descripcion: 'Clasicaza con lechuga, tomate y salsa Bedrock',
    precio: '$14.000',
    precioNum: 14000,
  },
  {
    id: 'salchipapa-bambam',
    emoji: '🌭',
    nombre: 'Salchipapa Bambam',
    descripcion: 'Papas crocantes + salchicha + salsas',
    precio: '$12.000',
    precioNum: 12000,
  },
  {
    id: 'perro-dino',
    emoji: '🌮',
    nombre: 'Perro Caliente Dino',
    descripcion: 'Hot dog con papa rallada, piña y salsas',
    precio: '$11.000',
    precioNum: 11000,
  },
  {
    id: 'alitas-ptero',
    emoji: '🍗',
    nombre: 'Alitas Pterodáctilo',
    descripcion: '8 alitas BBQ del Jurásico',
    precio: '$18.000',
    precioNum: 18000,
  },
  {
    id: 'mega-papas',
    emoji: '🍟',
    nombre: 'Mega Papas Mamut',
    descripcion: 'Porción enorme a la francesa',
    precio: '$10.000',
    precioNum: 10000,
  },
]

export function hoy(): string {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export function manana(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export function formatearPrecio(n: number): string {
  return '$' + n.toLocaleString('es-CO')
}
