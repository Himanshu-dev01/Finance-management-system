import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import './App.css'

function App() {
  return (
      <BrowserRouter>
        <nav className="navbar">
          <span className="navbar-brand">💰 Finance Manager</span>
          <div className="navbar-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
            <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Transactions</NavLink>
            <NavLink to="/budget" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Budget</NavLink>
          </div>
        </nav>
        <div className="page">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<Budget />} />
          </Routes>
        </div>
      </BrowserRouter>
  )
}

export default App