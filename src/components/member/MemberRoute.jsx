import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getMemberSession, MEMBER_AUTH_EVENT } from '../../services/memberAuthService'

export default function MemberRoute({ children }) {
  const location = useLocation()
  const [session, setSession] = useState(getMemberSession)
  useEffect(() => {
    const updateSession = () => setSession(getMemberSession())
    window.addEventListener(MEMBER_AUTH_EVENT, updateSession)
    window.addEventListener('storage', updateSession)
    return () => {
      window.removeEventListener(MEMBER_AUTH_EVENT, updateSession)
      window.removeEventListener('storage', updateSession)
    }
  }, [])
  return session ? children : <Navigate to="/login" state={{ from: location }} replace />
}
