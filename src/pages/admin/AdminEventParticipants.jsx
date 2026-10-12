import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchEventParticipants } from '../../services/eventsService'
import { logout } from '../../services/authService'

const display = (value) => value === null || value === undefined || value === '' ? '—' : value
// LocalDateTime has no timezone: retain the date and wall-clock time from the API.
const displayDateTime = (value) => value ? value.replace('T', ' ').replace(/\.\d+$/, '') : '—'

export default function AdminEventParticipants() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setParticipants([])
    fetchEventParticipants(slug).then((data) => {
      if (active) setParticipants(data)
    }).catch((err) => {
      if (!active) return
      const message = err.response?.data?.message || err.response?.data?.error || err.message
      setError(err.response?.status === 403 ? 'Only admins can view this event’s participants.' : Array.isArray(message) ? message.join(' ') : typeof message === 'string' ? message : 'Unable to load participants. Please try again.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug, reload])

  const registeredCount = participants.filter((participant) => participant.registered).length

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-5 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link to="/admin" className="font-bold text-lg">PEN Club Admin</Link>
          <div className="flex flex-wrap gap-4 items-center">
            <Link to="/admin/events" className="hover:text-secondary">Manage events</Link>
            <Link to="/admin/users" className="hover:text-secondary">Users</Link>
            <button type="button" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-secondary" onClick={() => { logout(); navigate('/login', { replace: true }) }}>Logout</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-5 py-8">
        <Link to="/admin/events" className="inline-block text-secondary font-semibold mb-6 hover:underline">← Back to admin events</Link>
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl">Event participants</h1>
            <p className="text-gray-600 break-words">{slug}</p>
            {!loading && !error && <p className="text-sm text-gray-500 mb-0">{registeredCount} registered · {participants.length - registeredCount} unregistered · {participants.length} total</p>}
          </div>
          <button type="button" disabled={loading} onClick={() => setReload((value) => value + 1)} className="px-5 py-2 rounded-lg bg-secondary text-white font-semibold disabled:opacity-60 hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-primary">Refresh</button>
        </div>
        {loading && <p role="status" className="text-center py-16 text-gray-600">Loading participants…</p>}
        {!loading && error && (
          <div className="bg-white rounded-xl p-8 text-center">
            <p role="alert" className="text-red-700">{error}</p>
            <button type="button" onClick={() => setReload((value) => value + 1)} className="px-5 py-2 bg-secondary text-white rounded-lg font-semibold">Try again</button>
          </div>
        )}
        {!loading && !error && participants.length === 0 && <p className="bg-white rounded-xl p-8 text-center text-gray-500">No participants for this event yet.</p>}
        {!loading && !error && participants.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div role="region" aria-label="Event participants table" tabIndex={0} className="overflow-x-auto focus-visible:ring-2 focus-visible:ring-secondary">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Participant details and registration history for {slug}</caption>
                <thead className="bg-gray-50 text-gray-700">
                  <tr>{['First name', 'Last name', 'Email', 'Gender', 'Phone number', 'Education degree', 'Status', 'Registered at', 'Unregistered at'].map((label) => <th key={label} scope="col" className="px-4 py-3 whitespace-nowrap font-semibold">{label}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {participants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">{display(participant.firstName)}</td>
                      <td className="px-4 py-4">{display(participant.lastName)}</td>
                      <td className="px-4 py-4">{display(participant.email)}</td>
                      <td className="px-4 py-4">{display(participant.gender)}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{display(participant.phoneNumber)}</td>
                      <td className="px-4 py-4">{display(participant.educationDegree)}</td>
                      <td className="px-4 py-4"><span className={`inline-block px-3 py-1 rounded-full font-semibold ${participant.registered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{participant.registered ? 'Registered' : 'Unregistered'}</span></td>
                      <td className="px-4 py-4 whitespace-nowrap">{displayDateTime(participant.registeredAt)}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{displayDateTime(participant.unregisteredAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
