import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAdmin, getSession } from '../../services/authService'
import { AUTH_CHANGE_EVENT } from '../../services/authStorage'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const [authenticated, setAuthenticated] = useState(isAdmin)
  useEffect(() => {
    const update = () => setAuthenticated(isAdmin())
    window.addEventListener(AUTH_CHANGE_EVENT, update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, update)
      window.removeEventListener('storage', update)
    }
  }, [])

  if (!authenticated) {
    return <Navigate to={getSession() ? '/profile' : '/login'} state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
