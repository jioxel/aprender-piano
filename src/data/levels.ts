export interface Level {
  id: string
  name: string
  description: string
  available: boolean
}

export const levels: Level[] = [
  {
    id: 'nivel-1',
    name: 'Nivel 1',
    description: 'Lectura de notas en el pentagrama, primeras dos octavas.',
    available: true,
  },
  {
    id: 'nivel-2',
    name: 'Nivel 2',
    description: 'Próximamente',
    available: false,
  },
  {
    id: 'nivel-3',
    name: 'Nivel 3',
    description: 'Próximamente',
    available: false,
  },
]
