import { Routes, Route } from 'react-router-dom'
import ChainSelector from './pages/ChainSelector'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChainSelector />} />
    </Routes>
  )
}

export default App
