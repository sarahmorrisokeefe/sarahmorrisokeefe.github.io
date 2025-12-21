import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import About from './pages/About'
import Experience from './pages/Experience'
import Projects from './pages/Projects'
import Education from './pages/Education'
import Freelance from './pages/Freelance'
import Contact from './pages/Contact'
import BeyondTheCode from './pages/BeyondTheCode'

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/education" element={<Education />} />
          <Route path="/freelance" element={<Freelance />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/beyond-the-code" element={<BeyondTheCode />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

