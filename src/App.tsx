import { Route, Routes } from 'react-router-dom'
import { GamesPage } from './pages/GamesPage/GamesPage'
import { LevelsPage } from './pages/LevelsPage/LevelsPage'
import { NoteReadingGamePage } from './pages/NoteReadingGamePage/NoteReadingGamePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LevelsPage />} />
      <Route path="/nivel/:levelId" element={<GamesPage />} />
      <Route path="/nivel/:levelId/juego/lectura-notas" element={<NoteReadingGamePage />} />
    </Routes>
  )
}

export default App
