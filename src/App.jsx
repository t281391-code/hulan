import { Routes, Route } from 'react-router-dom'
import SolarLanding from './components/SolarLanding'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SolarLanding />} />
    </Routes>
  )
}

export default App
