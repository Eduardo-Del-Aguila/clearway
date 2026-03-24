// import Dashboard from './pages/Dashboard';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { HomePage } from './pages/landing/HomePage'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <>
    <Dashboard/>
      {/* <main>
        <Outlet/>
      </main> */}
    </>
)
}

export default App