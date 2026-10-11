import React from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Router from './components/Router'
import './App.css'

const ADMIN_PATHS = ['/admin']

const AppLayout = () => {
  const location = useLocation()
  const isAdminRoute = ADMIN_PATHS.some((path) => location.pathname.startsWith(path))

  return (
    <div className="App">
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? '' : 'main-content'}>
        <Router />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
