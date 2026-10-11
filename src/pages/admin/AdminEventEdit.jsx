import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchEventBySlug, updateEvent, publishEvent, cancelEvent } from '../../services/eventsService'
import { logout } from '../../services/authService'
import EventForm, { EMPTY_FORM, buildPayload, eventToForm } from '../../components/admin/EventForm'

const AdminEventEdit = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [initialValues, setInitialValues] = useState(EMPTY_FORM)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [statusAction, setStatusAction] = useState(null)
  const [eventStatus, setEventStatus] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 5000)
  }

  // Load event data
  useEffect(() => {
    const load = async () => {
      setLoadingEvent(true)
      setLoadError(null)
      try {
        const data = await fetchEventBySlug(slug)
        setEventStatus(data.status?.toUpperCase() || null)
        setInitialValues(eventToForm(data))
      } catch (err) {
        setLoadError(err.message || 'Failed to load event.')
      } finally {
        setLoadingEvent(false)
      }
    }
    load()
  }, [slug])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleSubmit = async (formValues) => {
    if (saving || statusAction) return
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

    setSaving(true)
    try {
      await updateEvent(slug, buildPayload(formValues))
      showToast('success', 'Event updated successfully!')
      setTimeout(() => navigate('/admin/events'), 1200)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update event. Please try again.'
      showToast('error', message)
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (action) => {
    if (saving || statusAction) return
    setStatusAction(action)
    try {
      const data = await (action === 'publish' ? publishEvent(slug) : cancelEvent(slug))
      const status = data?.status?.toUpperCase() || (action === 'publish' ? 'PUBLISHED' : 'CANCELLED')
      setEventStatus(status)
      showToast('success', action === 'publish' ? 'Event published successfully!' : 'Event cancelled successfully!')
    } catch (err) {
      showToast('error', err.response?.data?.message || err.response?.data?.error || err.message || `Failed to ${action} event. Please try again.`)
    } finally {
      setStatusAction(null)
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-white font-bold text-base truncate max-w-xs">
                Edit Event
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* View on site link */}
            <a
              href={`/events/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg text-sm font-semibold transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View
            </a>
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

        {/* Loading event */}
        {loadingEvent && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading event data...</p>
          </div>
        )}

        {/* Load error */}
        {!loadingEvent && loadError && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">⚠️</div>
            <p className="text-gray-700 font-semibold">Failed to load event</p>
            <p className="text-gray-500 text-sm">{loadError}</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/events')}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold hover:border-gray-400 transition-all"
              >
                Back to Events
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        {!loadingEvent && !loadError && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Event</h2>
              <p className="text-gray-500 text-sm mt-1">
                Editing: <span className="font-mono text-gray-700">{slug}</span>
              </p>
            </div>
            <div className="mb-6 p-5 bg-white rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800">Event visibility</p>
                <p className="text-sm text-gray-500" role="status">Status: {eventStatus || 'Unknown'}</p>
                <p className="text-sm text-gray-500">Publishing makes this event public. Cancelling hides it from the public.</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleStatusChange('publish')}
                  disabled={saving || !!statusAction || eventStatus !== 'DRAFT'}
                  className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                  {statusAction === 'publish' ? 'Publishing...' : 'Publish Event'}
                </button>
                <button type="button" onClick={() => handleStatusChange('cancel')}
                  disabled={saving || !!statusAction || eventStatus === 'CANCELLED' || !eventStatus}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                  {statusAction === 'cancel' ? 'Cancelling...' : 'Cancel Event'}
                </button>
              </div>
            </div>
            <EventForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              eventStatus={eventStatus}
              loading={saving || !!statusAction}
              submitLabel="Update Event"
            />
          </>
        )}
      </main>
    </div>
  )
}

export default AdminEventEdit
