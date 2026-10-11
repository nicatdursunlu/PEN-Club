import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchDashboard } from '../../services/eventsService'
import { logout } from '../../services/authService'
import { formatDate } from '../../utils/dateUtils'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getDaysUntil = (dateStr) => {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminPanel = () => {
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchDashboard()
      setData(result)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  // Derived values
  const totalEvents = data?.totalEvents ?? 0
  const upcomingCount = data?.upcomingEventsCount ?? 0
  const pastCount = data?.pastEventsCount ?? 0
  const eventsByCategory = data?.eventsByCategory ?? {}
  const nextEvent = data?.nextEvent ?? null
  const mostRecentEvent = data?.mostRecentEvent ?? null
  const daysUntilNext = nextEvent ? getDaysUntil(nextEvent.date) : null

  const CATEGORIES = [
    { key: 'PLAY',    label: 'Play 🎮',    color: 'bg-secondary' },
    { key: 'ENJOY',   label: 'Enjoy 🎉',   color: 'bg-accent' },
    { key: 'NETWORK', label: 'Network 🤝', color: 'bg-blue-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ── Top Bar ── */}
      <header className="bg-primary shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">PEN Club Admin</h1>
              <p className="text-gray-400 text-xs">Dashboard</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => navigate('/admin')}
                className="px-3 py-1.5 text-secondary text-sm font-semibold rounded-lg bg-white bg-opacity-10"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/admin/events')}
                className="px-3 py-1.5 text-gray-300 hover:text-white text-sm font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Events
              </button>
              <button onClick={() => navigate('/admin/users')} className="px-3 py-1.5 text-gray-300 hover:text-white text-sm font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition-all">Users</button>
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg text-sm font-semibold transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-5 py-8 space-y-8">

        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome back 👋</h2>
            <p className="text-gray-500 text-sm mt-1">Here's an overview of your PEN Club events.</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:border-gray-400 hover:text-gray-800 transition-all bg-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
            <button onClick={load} className="ml-auto font-semibold underline hover:no-underline">Retry</button>
          </div>
        )}

        {/* ── Row 1: 3 Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            loading={loading}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            iconBg="bg-secondary"
            label="Total Events"
            value={totalEvents}
            sub="All time"
          />
          <StatCard
            loading={loading}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            iconBg="bg-blue-500"
            label="Upcoming Events"
            value={upcomingCount}
            sub="Scheduled"
          />
          <StatCard
            loading={loading}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            iconBg="bg-green-500"
            label="Past Events"
            value={pastCount}
            sub="Completed"
          />
        </div>

        {/* ── Row 2: Next Event + Category Breakdown ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Next Event Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Next Upcoming Event</h3>
            {loading ? (
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            ) : nextEvent ? (
              <div
                className="cursor-pointer group"
                onClick={() => navigate(`/admin/events/${nextEvent.slug || nextEvent.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {nextEvent.category && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 mb-2 inline-block">
                        {nextEvent.category}
                      </span>
                    )}
                    <h4 className="text-lg font-bold text-gray-800 group-hover:text-secondary transition-colors">
                      {nextEvent.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">📅 {formatDate(nextEvent.date)}</p>
                    {nextEvent.location && (
                      <p className="text-sm text-gray-500 mt-0.5">📍 {nextEvent.location}</p>
                    )}
                  </div>
                  {daysUntilNext !== null && (
                    <div className={`flex-shrink-0 text-center rounded-xl px-4 py-3 min-w-[72px] ${
                      daysUntilNext === 0
                        ? 'bg-red-100 text-red-700'
                        : daysUntilNext <= 7
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {daysUntilNext === 0 ? (
                        <div className="text-base font-bold">Today!</div>
                      ) : (
                        <>
                          <div className="text-2xl font-bold leading-none">{Math.abs(daysUntilNext)}</div>
                          <div className="text-xs font-semibold mt-0.5">
                            {daysUntilNext < 0 ? 'days ago' : 'days left'}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  {nextEvent.attendees ? (
                    <span className="text-sm text-gray-500">👥 {nextEvent.attendees} attendees</span>
                  ) : (
                    <span />
                  )}
                  <span className="text-sm text-secondary font-semibold group-hover:underline">Edit →</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-400 text-sm mb-3">No upcoming events scheduled.</p>
                <button
                  onClick={() => navigate('/admin/events/new')}
                  className="text-secondary font-semibold text-sm hover:underline"
                >
                  Create one now →
                </button>
              </div>
            )}
          </div>

          {/* Category Breakdown Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Events by Category</h3>
            {loading ? (
              <div className="space-y-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    <div className="h-2.5 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : totalEvents === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-gray-400 text-sm">No events yet to show breakdown.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {CATEGORIES.map(({ key, label, color }) => {
                  const count = eventsByCategory[key] ?? 0
                  const pct = totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-gray-700">{label}</span>
                        <span className="text-sm font-bold text-gray-800">
                          {count}
                          <span className="text-gray-400 font-normal text-xs ml-1">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className={`${color} h-2.5 rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                {/* Uncategorized */}
                {(() => {
                  const categorized = CATEGORIES.reduce((s, c) => s + (eventsByCategory[c.key] ?? 0), 0)
                  const uncategorized = totalEvents - categorized
                  if (uncategorized <= 0) return null
                  const pct = Math.round((uncategorized / totalEvents) * 100)
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-gray-500">Uncategorized</span>
                        <span className="text-sm font-bold text-gray-600">
                          {uncategorized}
                          <span className="text-gray-400 font-normal text-xs ml-1">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-gray-400 h-2.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>

        {/* ── Row 3: Manage Events + Most Recent Event ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Manage Events Action Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-800">Manage Events</h4>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  View, edit, and manage all upcoming and past events in one place.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => navigate('/admin/events')}
                className="flex-1 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all hover:scale-[1.02]"
              >
                View All Events
              </button>
              <button
                onClick={() => navigate('/admin/events/new')}
                className="flex-1 py-2.5 bg-secondary text-white rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all hover:scale-[1.02]"
              >
                + New Event
              </button>
            </div>
          </div>

          {/* Most Recent Past Event Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Most Recent Past Event</h3>
            {loading ? (
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            ) : mostRecentEvent ? (
              <div
                className="cursor-pointer group"
                onClick={() => navigate(`/admin/events/${mostRecentEvent.slug || mostRecentEvent.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {mostRecentEvent.category && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mb-2 inline-block">
                        {mostRecentEvent.category}
                      </span>
                    )}
                    <h4 className="text-lg font-bold text-gray-800 group-hover:text-secondary transition-colors">
                      {mostRecentEvent.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">📅 {formatDate(mostRecentEvent.date)}</p>
                    {mostRecentEvent.location && (
                      <p className="text-sm text-gray-500 mt-0.5">📍 {mostRecentEvent.location}</p>
                    )}
                    {mostRecentEvent.attendees && (
                      <p className="text-sm text-gray-500 mt-0.5">👥 {mostRecentEvent.attendees} attendees</p>
                    )}
                  </div>
                  <span className="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                    Completed
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-right">
                  <span className="text-sm text-secondary font-semibold group-hover:underline">Edit →</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🏁</div>
                <p className="text-gray-400 text-sm">No past events yet.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ loading, icon, iconBg, label, value, sub }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-5">
    <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      {loading ? (
        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mt-1"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-800 leading-none mt-1">{value}</p>
      )}
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  </div>
)

export default AdminPanel
