import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Events } from './pages/Events'
import { Feedback } from './pages/Feedback'
import { ViewFeedback } from './pages/ViewFeedback'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/view-feedback" element={<ViewFeedback />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
