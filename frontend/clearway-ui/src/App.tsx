// import Dashboard from './pages/Dashboard';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/landing/HomePage'
import Dashboard from './pages/Dashboard'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

function App() {
  return (
  <RouterProvider router={router} />
)
}

export default App