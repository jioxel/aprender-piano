export interface Game {
  id: string
  levelId: string
  name: string
  description: string
  available: boolean
  path: string
}

export const games: Game[] = [
  {
    id: 'lectura-notas',
    levelId: 'nivel-1',
    name: 'Lectura de notas',
    description: 'Identifica en el piano la nota que aparece en el pentagrama.',
    available: true,
    path: '/nivel/nivel-1/juego/lectura-notas',
  },
]

export function getGamesForLevel(levelId: string): Game[] {
  return games.filter((game) => game.levelId === levelId)
}
