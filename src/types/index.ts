export type MenuType = 'almuerzo' | 'noche'
export type DeliveryType = 'llevar' | 'aqui'

export interface MenuItem {
  id: string
  emoji: string
  nombre: string
  descripcion: string
  precio: string
}

export interface ModalState {
  item: { nombre: string; precio: string } | null
  delivery: DeliveryType | null
  mesa: number | null
}

export const menuAlmuerzo: MenuItem[] = [
  {
    id: 'costilla-dino',
    emoji: '🦴',
    nombre: 'Costilla de Dino (Pablo Mármol)',
    descripcion: 'La costilla prehistórica de Pablo Mármol. ¡Tan grande que vuelca el auto!',
    precio: '$15.000',
  },
  {
    id: 'pollo-pajaro',
    emoji: '🐔',
    nombre: 'Pollo Pájaro Temprano (Pedro Picapiedra)',
    descripcion: 'El favorito de Pedro. Criado en Piedradura, asado en leña de bambú.',
    precio: '$15.000',
  },
  {
    id: 'mamut-salsa',
    emoji: '🦣',
    nombre: 'Mamut en Salsa Wilma',
    descripcion: 'Receta secreta de Wilma Picapiedra. Suave, jugoso y con sabor a era glacial.',
    precio: '$15.000',
  },
]

export const menuNoche: MenuItem[] = [
  {
    id: 'hamburguesa-pablo',
    emoji: '🍔',
    nombre: 'Hamburguesa Pablo Mármol',
    descripcion: 'Doble carne + tocino + queso fundido. Tan grande como el barrigón de Pablo.',
    precio: '$16.000',
  },
  {
    id: 'burger-pedro',
    emoji: '🍟',
    nombre: 'Burger Pedro Picapiedra',
    descripcion: 'Clasicaza sencilla con lechuga, tomate y la salsa secreta Bedrock.',
    precio: '$14.000',
  },
  {
    id: 'salchipapa-bambam',
    emoji: '🌭',
    nombre: 'Salchipapa Bambam',
    descripcion: 'Papas crocantes + salchicha + salsas. La combo favorita del bebé de Piedradura.',
    precio: '$12.000',
  },
  {
    id: 'perro-dino',
    emoji: '🌮',
    nombre: 'Perro Caliente Dino',
    descripcion: 'Hot dog estilo The Gordo: papa rallada, piña y salsas especiales. ¡Rawr!',
    precio: '$11.000',
  },
  {
    id: 'alitas-ptero',
    emoji: '🍗',
    nombre: 'Alitas Pterodáctilo',
    descripcion: '8 alitas BBQ volando directo desde la era del Jurásico. ¡Atrápalas!',
    precio: '$18.000',
  },
  {
    id: 'mega-papas',
    emoji: '🍟',
    nombre: 'Mega Papas Mamut',
    descripcion: 'Porción enorme de papas a la francesa. ¡Del tamaño de un mamut!',
    precio: '$10.000',
  },
]

export const ocupadas: Record<MenuType, number[]> = {
  almuerzo: [3, 7],
  noche: [2, 5, 8],
}

export function estadoInicial(): ModalState {
  return { item: null, delivery: null, mesa: null }
}
