import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchAllEvents } from '../../services/eventsService'
import AdminNavbar from '../../components/admin/AdminNavbar'
import { formatDate } from '../../utils/dateUtils'

const STATUS_BADGES = {
  DRAFT: { label: 'Draft', color: 'bg-yellow-100 text-yellow-800' },
  PUBLISHED: { label: 'Published', color: 'bg-blue-100 text-blue-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700' },
}

const AdminEvents = () => {
  const navigate = useNavigate()

  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const requestId = useRef(0)

  const categories = ['PLAY', 'ENJOY', 'NETWORK']
  const currentPage = page
  const firstIndex = (currentPage - 1) * pageSize

  const clearFilters = () => {
    setCategory('')
    setStatus('')
    setPage(1)
  }

  const loadEvents = async () => {
    const currentRequest = ++requestId.current
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllEvents({ page: page - 1, size: pageSize, category, status })
      if (currentRequest !== requestId.current) return
      setAllEvents(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(Math.max(1, data.totalPages))
      if (page > Math.max(1, data.totalPages)) setPage(Math.max(1, data.totalPages))
    } catch (err) {
      if (currentRequest !== requestId.current) return
      setError(err.message || 'Failed to load events.')
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
    return () => { requestId.current++ }
  }, [page, pageSize, category, status])



  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-5 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Events</h2>
            <p className="text-gray-500 text-sm mt-1">Click on an event to edit it.</p>
          </div>
          <button
            onClick={loadEvents}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:border-gray-400 hover:text-gray-800 transition-all bg-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="mb-6 bg-white rounded-xl shadow-sm p-5 flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="event-category-filter" className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select id="event-category-filter" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1) }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary">
              <option value="">All categories</option>
              {categories.map((value) => <option key={value} value={value}>{value.charAt(0) + value.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="event-status-filter" className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select id="event-status-filter" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary">
              <option value="">All statuses</option>
              {Object.entries(STATUS_BADGES).map(([value, badge]) => <option key={value} value={value}>{badge.label}</option>)}
            </select>
          </div>
          <button type="button" onClick={clearFilters} disabled={!category && !status}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-secondary hover:text-secondary focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed">Clear filters</button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading events...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">⚠️</div>
            <p className="text-gray-700 font-semibold">Failed to load events</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <button
              onClick={loadEvents}
              className="px-6 py-2.5 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && totalElements === 0 && !category && !status && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">📭</div>
            <p className="text-gray-500">No events found.</p>
            <button
              onClick={() => navigate('/admin/events/new')}
              className="px-6 py-2.5 bg-secondary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Create First Event
            </button>
          </div>
        )}

        {!loading && !error && totalElements === 0 && (category || status) && (
          <div className="text-center py-16">
            <p className="text-gray-500">No events match these filters.</p>
            <button type="button" onClick={clearFilters} className="mt-3 px-4 py-2 text-secondary font-semibold rounded-lg focus-visible:ring-2 focus-visible:ring-secondary">Clear filters</button>
          </div>
        )}

        {!loading && !error && allEvents.length > 0 && (
          <div className="space-y-3">
            {allEvents.map((event) => (
              <EventRow
                key={event.id || event.slug}
                event={event}
                badge={STATUS_BADGES[event.status?.toUpperCase()] || { label: event.status || 'Unknown', color: 'bg-gray-100 text-gray-600' }}
                onClick={() => navigate(`/admin/events/${encodeURIComponent(event.slug || event.id)}`)}
              />
            ))}
          </div>
        )}
        {!loading && !error && allEvents.length > 0 && (
          <nav aria-label="Events pagination" className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p role="status" className="text-sm text-gray-600">Showing {firstIndex + 1}–{firstIndex + allEvents.length} of {totalElements} events</p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="event-page-size" className="text-sm font-semibold text-gray-700">Events per page</label>
                <select id="event-page-size" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1) }}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary">
                  {[10, 25, 50].map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </div>
              <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-secondary">Previous</button>
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-secondary">Next</button>
            </div>
          </nav>
        )}
      </main>
    </div>
  )
}

// ─── Event Row Component ──────────────────────────────────────────────────────
const EventRow = ({ event, badge, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl shadow-sm p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-transparent hover:border-secondary hover:border-opacity-30"
  >
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
          {badge.label}
        </span>
        {event.category && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
            {event.category}
          </span>
        )}
      </div>
      <h3 className="text-base font-bold text-gray-800 truncate">{event.title}</h3>
      {event.description && (
        <p className="mt-1 text-sm text-gray-600 whitespace-pre-line break-words">{event.description}</p>
      )}
      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
        {event.date && (
          <span className="flex items-center gap-1">
            <span>📅</span> {formatDate(event.date)}
          </span>
        )}
        {event.location && (
          <span className="flex items-center gap-1">
            <span>📍</span> {event.location}
          </span>
        )}
      </div>
    </div>
    <div className="flex-shrink-0 flex items-center gap-2 text-secondary">
      {(event.slug || event.id) && (
        <Link
          to={`/admin/events/${encodeURIComponent(event.slug || event.id)}/participants`}
          onClick={(click) => click.stopPropagation()}
          className="px-3 py-2 mr-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 focus-visible:ring-2 focus-visible:ring-secondary"
        >
          View participants
        </Link>
      )}
      <span className="text-sm font-semibold hidden sm:block">Edit</span>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
)

export default AdminEvents
