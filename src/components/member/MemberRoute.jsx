import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getSession } from '../../services/authService'
import { AUTH_CHANGE_EVENT } from '../../services/authStorage'

export default function MemberRoute({ children }) {
  const location = useLocation()
  const [session, setSession] = useState(() => getSession('MEMBER'))
  useEffect(() => {
    const updateSession = () => setSession(getSession('MEMBER'))
    window.addEventListener(AUTH_CHANGE_EVENT, updateSession)
    window.addEventListener('storage', updateSession)
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, updateSession)
      window.removeEventListener('storage', updateSession)
    }
  }, [])
  return session ? children : <Navigate to="/login" state={{ from: location }} replace />
}
