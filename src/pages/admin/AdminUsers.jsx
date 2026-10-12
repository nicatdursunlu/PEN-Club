import React, { useEffect, useState } from 'react'
import { fetchUsers } from '../../services/usersService'
import AdminNavbar from '../../components/admin/AdminNavbar'

const columns = [
  ['firstName', 'First name'], ['lastName', 'Last name'], ['email', 'Email'],
  ['gender', 'Gender'], ['phoneNumber', 'Phone number'], ['educationDegree', 'Education degree'],
]

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setUsers([])
    fetchUsers().then((data) => {
      if (active) setUsers(data)
    }).catch((err) => {
      if (!active) return
      const message = err.response?.data?.message || err.response?.data?.error || err.message
      setError(err.response?.status === 403 ? 'Only admins can view the users list.' : Array.isArray(message) ? message.join(' ') : typeof message === 'string' ? message : 'Unable to load users. Please try again.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reload])

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-5 py-8">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl">Users</h1>
            <p className="text-gray-600">View PEN Club user profiles.</p>
            {!loading && !error && <p className="text-sm text-gray-500 mb-0">{users.length} {users.length === 1 ? 'user' : 'users'}</p>}
          </div>
          <button type="button" disabled={loading} onClick={() => setReload((value) => value + 1)} className="px-5 py-2 rounded-lg bg-secondary text-white font-semibold disabled:opacity-60 hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-primary">Refresh</button>
        </div>
        {loading && <p role="status" className="text-center py-16 text-gray-600">Loading users…</p>}
        {!loading && error && (
          <div className="bg-white rounded-xl p-8 text-center">
            <p role="alert" className="text-red-700">{error}</p>
            <button type="button" onClick={() => setReload((value) => value + 1)} className="px-5 py-2 bg-secondary text-white rounded-lg font-semibold">Try again</button>
          </div>
        )}
        {!loading && !error && users.length === 0 && <p className="bg-white rounded-xl p-8 text-center text-gray-500">No users found.</p>}
        {!loading && !error && users.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div role="region" aria-label="Users table" tabIndex={0} className="overflow-x-auto focus-visible:ring-2 focus-visible:ring-secondary">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">PEN Club users and profile information</caption>
                <thead className="bg-gray-50 text-gray-700"><tr>{columns.map(([key, label]) => <th key={key} scope="col" className="px-4 py-3 whitespace-nowrap font-semibold">{label}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id || user.userId || user.email} className="hover:bg-gray-50">
                      {columns.map(([key]) => <td key={key} className="px-4 py-4">{user[key] === null || user[key] === undefined || user[key] === '' ? '—' : user[key]}</td>)}
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
