import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { getSession, isAdmin, login, register as registerAccount } from '../services/authService'

export default function Auth({ register = false }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: location.state?.email || '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const from = location.state?.from?.pathname
  const destination = from === '/profile' || /^\/events\/[^/]+$/.test(from || '') ? from : '/profile'

  if (isAdmin()) return <Navigate to="/admin" replace />
  if (getSession()) return <Navigate to={destination} replace />

  const submit = async (event) => {
    event.preventDefault()
    if (loading) return
    if (register && (!form.firstName.trim() || !form.lastName.trim())) {
      setError('Please enter your first and last name.')
      return
    }
    setLoading(true)
    setError('')
    const payload = { ...form, firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim() }
    try {
      if (register) {
        const authenticated = await registerAccount(payload)
        navigate(authenticated ? (isAdmin() ? '/admin' : destination) : '/login', {
          replace: true,
          state: authenticated ? undefined : { registered: true, email: payload.email, from: location.state?.from },
        })
      } else {
        await login(payload.email, payload.password)
        navigate(isAdmin() ? '/admin' : destination, { replace: true })
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || err.message
      setError(Array.isArray(message) ? message.join(' ') : typeof message === 'string' ? message : 'Unable to complete your request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    ...(register ? [
      { name: 'firstName', label: 'First name', autoComplete: 'given-name' },
      { name: 'lastName', label: 'Last name', autoComplete: 'family-name' },
    ] : []),
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
    { name: 'password', label: 'Password', type: 'password', autoComplete: register ? 'new-password' : 'current-password' },
  ]

  return (
    <section className="bg-gradient-to-br from-primary to-bg-dark px-5 py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="text-center text-white mb-8">
          <p className="text-secondary font-semibold">PEN Club</p>
          <h1 className="text-3xl">{register ? 'Create your account' : 'Welcome back'}</h1>
          <p className="text-gray-300">{register ? 'Join the community and manage your profile.' : 'Sign in to your PEN Club account.'}</p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
          {!register && location.state?.registered && <p role="status" className="bg-green-50 text-green-800 rounded-lg p-3 text-sm">Your account has been created. Log in to continue.</p>}
          {error && <p role="alert" className="bg-red-50 text-red-700 rounded-lg p-3 text-sm">{error}</p>}
          <form onSubmit={submit} className="space-y-5" aria-busy={loading}>
            {fields.map(({ name, label, type = 'text', autoComplete }) => (
              <div key={name}>
                <label htmlFor={`auth-${name}`} className="block text-sm font-semibold mb-2">{label}</label>
                <div className="relative">
                <input id={`auth-${name}`} name={name} type={name === 'password' && showPassword ? 'text' : type} autoComplete={autoComplete}
                  required minLength={register && name === 'password' ? 8 : undefined}
                  value={form[name]} disabled={loading}
                  onChange={(event) => { setForm((prev) => ({ ...prev, [name]: event.target.value })); setError('') }}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-60 ${name === 'password' ? 'pr-12' : ''}`} />
                {name === 'password' && (
                  <button type="button" disabled={loading}
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-controls="auth-password"
                    aria-pressed={showPassword}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-3 rounded-md text-gray-500 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-60">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                      {showPassword ? (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 9 7 9 7a17.7 17.7 0 01-3.2 3.8M6.2 6.2A18 18 0 003 12s4 7 9 7a10.8 10.8 0 005.8-1.8" />
                        </>
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12s4-7 9-7 9 7 9 7-4 7-9 7-9-7-9-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                )}
                </div>
                {register && name === 'password' && <span className="text-xs text-gray-500">Use at least 8 characters.</span>}
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full py-3 bg-secondary text-white rounded-lg font-bold hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (register ? 'Creating account…' : 'Logging in…') : (register ? 'Register' : 'Login')}
            </button>
          </form>
          <p className="text-sm text-center mt-6 mb-0 text-gray-600">
            {register ? 'Already a member? ' : 'New to PEN Club? '}
            <Link to={register ? '/login' : '/register'} state={{ from: location.state?.from }} className="text-secondary font-semibold hover:underline">{register ? 'Login' : 'Register'}</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
