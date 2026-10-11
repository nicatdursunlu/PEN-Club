import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEvent } from '../../services/eventsService'
import { logout } from '../../services/authService'
import EventForm, { EMPTY_FORM, buildPayload } from '../../components/admin/EventForm'

const AdminCreateEvent = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 5000)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSubmit = async (formValues) => {
    if (!formValues.title.trim()) {
      showToast('error', 'Event title is required.')
      return
    }
    if (!formValues.date) {
      showToast('error', 'Event date is required.')
      return
    }
    if (!formValues.description.trim()) {
      showToast('error', 'Short description is required.')
      return
    }

    setLoading(true)
    try {
      const event = await createEvent({ ...buildPayload(formValues), status: 'DRAFT' })
      showToast('success', 'Event saved as a draft. Publish it from the event editor when ready.')
      const eventSlug = event?.slug || formValues.slug.trim()
      setTimeout(() => navigate(eventSlug ? `/admin/events/${encodeURIComponent(eventSlug)}` : '/admin/events'), 1200)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to create event. Please try again.'
      showToast('error', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="bg-primary shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/events')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Events
            </button>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-white font-bold text-base">Create New Event</span>
            </div>
          </div>
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
      </header>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-5 z-50 max-w-sm w-full shadow-xl rounded-xl px-5 py-4 flex items-start gap-3 animate-fade-in ${
          toast.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <span className="text-xl flex-shrink-0">{toast.type === 'success' ? '✅' : '❌'}</span>
          <div>
            <p className="font-semibold text-sm">{toast.type === 'success' ? 'Success' : 'Error'}</p>
            <p className="text-sm mt-0.5">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-auto text-gray-400 hover:text-gray-600 flex-shrink-0">✕</button>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-5 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
          <p className="text-gray-500 text-sm mt-1">Create a draft, then publish it from the event editor when ready.</p>
        </div>
        <EventForm
          initialValues={EMPTY_FORM}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Create Draft"
        />
      </main>
    </div>
  )
}

export default AdminCreateEvent
