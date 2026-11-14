import React, { useState, useEffect } from 'react'

// ─── Category Options ─────────────────────────────────────────────────────────
export const CATEGORY_OPTIONS = [
  { value: '', label: 'Select a category...' },
  { value: 'PLAY', label: 'Play' },
  { value: 'ENJOY', label: 'Enjoy' },
  { value: 'NETWORK', label: 'Network' },
]

// ─── Empty Form State ─────────────────────────────────────────────────────────
export const EMPTY_FORM = {
  slug: '',
  title: '',
  description: '',
  fullDescription: '',
  date: '',
  time: '',
  location: '',
  locationLink: '',
  mapEmbedUrl: '',
  category: '',
  status: 'DRAFT',
  organizer: '',
  attendees: '',
  specialNote: '',
  goal: '',
  pricingFull: '',
  pricingBasic: '',
  highlights: [''],
  eventHighlights: [''],
  agenda: [{ time: '', title: '', description: '' }],
  images: [{ url: '', alt: '', caption: '' }],
}

// ─── Small reusable UI components ────────────────────────────────────────────
export const SectionTitle = ({ children }) => (
  <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">{children}</h2>
)

export const Label = ({ htmlFor, children, optional }) => (
  <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 mb-1.5">
    {children}
    {optional && <span className="ml-1 text-gray-400 font-normal text-xs">(optional)</span>}
  </label>
)

export const Input = ({ id, className = '', ...props }) => (
  <input
    id={id}
    className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-sm ${className}`}
    {...props}
  />
)

export const Textarea = ({ id, rows = 3, className = '', ...props }) => (
  <textarea
    id={id}
    rows={rows}
    className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-sm resize-vertical ${className}`}
    {...props}
  />
)

// ─── Build API payload from form state ───────────────────────────────────────
export const buildPayload = (form) => {
  const filteredHighlights = form.highlights.filter((h) => h.trim())
  const filteredEventHighlights = form.eventHighlights.filter((h) => h.trim())
  const filteredAgenda = form.agenda.filter((a) => a.title.trim())
  const filteredImages = form.images.filter((img) => img.url.trim())

  return {
    title: form.title.trim(),
    description: form.description.trim(),
    date: form.date,
    ...(form.slug.trim() && { slug: form.slug.trim() }),
    ...(form.fullDescription.trim() && { fullDescription: form.fullDescription.trim() }),
    ...(form.time && { time: form.time }),
    ...(form.location.trim() && { location: form.location.trim() }),
    ...(form.locationLink.trim() && { locationLink: form.locationLink.trim() }),
    ...(form.mapEmbedUrl.trim() && { mapEmbedUrl: form.mapEmbedUrl.trim() }),
    ...(form.category && { category: form.category }),
    ...(form.organizer.trim() && { organizer: form.organizer.trim() }),
    ...(form.attendees && { attendees: Number(form.attendees) }),
    ...(form.specialNote.trim() && { specialNote: form.specialNote.trim() }),
    ...(form.goal.trim() && { goal: form.goal.trim() }),
    ...(form.pricingFull.trim() || form.pricingBasic.trim()
      ? {
          pricing: {
            ...(form.pricingFull.trim() && { full: form.pricingFull.trim() }),
            ...(form.pricingBasic.trim() && { basic: form.pricingBasic.trim() }),
          },
        }
      : {}),
    ...(filteredHighlights.length && { highlights: filteredHighlights }),
    ...(filteredEventHighlights.length && { eventHighlights: filteredEventHighlights }),
    ...(filteredAgenda.length && { agenda: filteredAgenda }),
    ...(filteredImages.length && {
      images: filteredImages.map((img) => ({
        url: img.url.trim(),
        ...(img.alt.trim() && { alt: img.alt.trim() }),
        ...(img.caption.trim() && { caption: img.caption.trim() }),
      })),
    }),
  }
}

// ─── Map API event object to form state ──────────────────────────────────────
export const eventToForm = (event) => ({
  slug: event.slug || '',
  title: event.title || '',
  description: event.description || '',
  fullDescription: event.fullDescription || '',
  date: event.date || '',
  time: event.time || '',
  location: event.location || '',
  locationLink: event.locationLink || '',
  mapEmbedUrl: event.mapEmbedUrl || '',
  category: event.category || '',
  status: event.status?.toUpperCase() || 'DRAFT',
  organizer: event.organizer || '',
  attendees: event.attendees != null ? String(event.attendees) : '',
  specialNote: event.specialNote || '',
  goal: event.goal || '',
  pricingFull: event.pricing?.full || '',
  pricingBasic: event.pricing?.basic || '',
  highlights: event.highlights?.length ? event.highlights : [''],
  eventHighlights: event.eventHighlights?.length ? event.eventHighlights : [''],
  agenda: event.agenda?.length ? event.agenda.map((a) => ({ time: a.time || '', title: a.title || '', description: a.description || '' })) : [{ time: '', title: '', description: '' }],
  images: event.images?.length ? event.images.map((img) => ({ url: img.url || '', alt: img.alt || '', caption: img.caption || '' })) : [{ url: '', alt: '', caption: '' }],
})

// ─── Main EventForm Component ─────────────────────────────────────────────────
const EventForm = ({ initialValues = EMPTY_FORM, onSubmit, loading = false, disabled = false, submitLabel = 'Create Event', eventStatus }) => {
  const [form, setForm] = useState(initialValues)

  useEffect(() => {
    setForm(initialValues)
  }, [initialValues])

  useEffect(() => {
    if (eventStatus) setForm((previous) => ({ ...previous, status: eventStatus }))
  }, [eventStatus])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleListChange = (listKey, index, value) => {
    setForm((prev) => {
      const updated = [...prev[listKey]]
      updated[index] = value
      return { ...prev, [listKey]: updated }
    })
  }

  const addListItem = (listKey, emptyItem) => {
    setForm((prev) => ({ ...prev, [listKey]: [...prev[listKey], emptyItem] }))
  }

  const removeListItem = (listKey, index) => {
    setForm((prev) => {
      const updated = prev[listKey].filter((_, i) => i !== index)
      return { ...prev, [listKey]: updated.length ? updated : [''] }
    })
  }

  const handleAgendaChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.agenda]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, agenda: updated }
    })
  }

  const handleImageChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.images]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, images: updated }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (disabled || loading) return
    onSubmit(form)
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      setForm(initialValues)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">

        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SectionTitle>Basic Information</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="md:col-span-2">
              <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
              <Input id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Job Networking Night" />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="slug" optional>Slug (URL identifier)</Label>
              <Input id="slug" name="slug" value={form.slug} onChange={handleChange} placeholder="e.g. job-networking-night-march-2026" />
              <p className="text-xs text-gray-400 mt-1">Used in the event URL. Leave blank to let the server generate it.</p>
            </div>

            <div>
              <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
              <select
                id="status"
                name="status"
                value={form.status}
                disabled
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-sm bg-white"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <Label htmlFor="category" optional>Category</Label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-sm bg-white"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
              <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="time" optional>Time</Label>
              <Input id="time" name="time" type="time" value={form.time} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="organizer" optional>Organizer</Label>
              <Input id="organizer" name="organizer" value={form.organizer} onChange={handleChange} placeholder="e.g. PEN Club Team" />
            </div>

            <div>
              <Label htmlFor="attendees" optional>Number of Attendees</Label>
              <Input id="attendees" name="attendees" type="number" min="0" value={form.attendees} onChange={handleChange} placeholder="e.g. 50" />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Short Description <span className="text-red-500">*</span></Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Brief summary shown on the events listing page..." rows={2} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="fullDescription" optional>Full Description</Label>
              <Textarea id="fullDescription" name="fullDescription" value={form.fullDescription} onChange={handleChange} placeholder="Detailed description shown on the event detail page..." rows={5} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SectionTitle>Location</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label htmlFor="location" optional>Location Name</Label>
              <Input id="location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Warsaw, ul. Marszałkowska 10" />
            </div>
            <div>
              <Label htmlFor="locationLink" optional>Google Maps Link</Label>
              <Input id="locationLink" name="locationLink" type="url" value={form.locationLink} onChange={handleChange} placeholder="https://maps.google.com/..." />
            </div>
            <div>
              <Label htmlFor="mapEmbedUrl" optional>Map Embed URL</Label>
              <Input id="mapEmbedUrl" name="mapEmbedUrl" type="url" value={form.mapEmbedUrl} onChange={handleChange} placeholder="https://www.google.com/maps/embed?..." />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SectionTitle>Pricing <span className="text-gray-400 font-normal text-sm">(optional)</span></SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="pricingFull" optional>Full Package Price</Label>
              <Input id="pricingFull" name="pricingFull" value={form.pricingFull} onChange={handleChange} placeholder="e.g. 50 PLN" />
            </div>
            <div>
              <Label htmlFor="pricingBasic" optional>Basic Package Price</Label>
              <Input id="pricingBasic" name="pricingBasic" value={form.pricingBasic} onChange={handleChange} placeholder="e.g. 30 PLN" />
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SectionTitle>What Participants Will Gain <span className="text-gray-400 font-normal text-sm">(optional)</span></SectionTitle>
          <div className="space-y-3">
            {form.highlights.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input value={item} onChange={(e) => handleListChange('highlights', index, e.target.value)} placeholder={`Highlight ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => removeListItem('highlights', index)}
                  disabled={form.highlights.length === 1}
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem('highlights', '')} className="flex items-center gap-2 text-secondary font-semibold text-sm hover:text-accent transition-colors">
              <span className="text-lg">+</span> Add Highlight
            </button>
          </div>
        </div>

        {/* Event Highlights */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SectionTitle>Event Highlights <span className="text-gray-400 font-normal text-sm">(optional)</span></SectionTitle>
          <div className="space-y-3">
            {form.eventHighlights.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input value={item} onChange={(e) => handleListChange('eventHighlights', index, e.target.value)} placeholder={`Event highlight ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => removeListItem('eventHighlights', index)}
                  disabled={form.eventHighlights.length === 1}
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem('eventHighlights', '')} className="flex items-center gap-2 text-secondary font-semibold text-sm hover:text-accent transition-colors">
              <span className="text-lg">+</span> Add Event Highlight
            </button>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SectionTitle>Event Images <span className="text-gray-400 font-normal text-sm">(optional)</span></SectionTitle>
          <div className="space-y-4">
            {form.images.map((img, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Image {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => {
                        const updated = prev.images.filter((_, i) => i !== index)
                        return { ...prev, images: updated.length ? updated : [{ url: '', alt: '', caption: '' }] }
                      })
                    }}
                    disabled={form.images.length === 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-3">
                    <Label htmlFor={`image-url-${index}`}>Image URL</Label>
                    <Input id={`image-url-${index}`} type="url" value={img.url} onChange={(e) => handleImageChange(index, 'url', e.target.value)} placeholder="https://example.com/image.jpg" />
                  </div>
                  <div>
                    <Label htmlFor={`image-alt-${index}`} optional>Alt Text</Label>
                    <Input id={`image-alt-${index}`} value={img.alt} onChange={(e) => handleImageChange(index, 'alt', e.target.value)} placeholder="Describe the image..." />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`image-caption-${index}`} optional>Caption</Label>
                    <Input id={`image-caption-${index}`} value={img.caption} onChange={(e) => handleImageChange(index, 'caption', e.target.value)} placeholder="Optional caption..." />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addListItem('images', { url: '', alt: '', caption: '' })} className="flex items-center gap-2 text-secondary font-semibold text-sm hover:text-accent transition-colors">
              <span className="text-lg">+</span> Add Image
            </button>
          </div>
        </div>

        {/* Agenda */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SectionTitle>Event Agenda <span className="text-gray-400 font-normal text-sm">(optional)</span></SectionTitle>
          <div className="space-y-4">
            {form.agenda.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Agenda Item {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => {
                        const updated = prev.agenda.filter((_, i) => i !== index)
                        return { ...prev, agenda: updated.length ? updated : [{ time: '', title: '', description: '' }] }
                      })
                    }}
                    disabled={form.agenda.length === 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor={`agenda-time-${index}`} optional>Time</Label>
                    <Input id={`agenda-time-${index}`} value={item.time} onChange={(e) => handleAgendaChange(index, 'time', e.target.value)} placeholder="e.g. 18:00" />
                  </div>
                  <div>
                    <Label htmlFor={`agenda-title-${index}`}>Title</Label>
                    <Input id={`agenda-title-${index}`} value={item.title} onChange={(e) => handleAgendaChange(index, 'title', e.target.value)} placeholder="e.g. Opening Ceremony" />
                  </div>
                  <div>
                    <Label htmlFor={`agenda-desc-${index}`} optional>Description</Label>
                    <Input id={`agenda-desc-${index}`} value={item.description} onChange={(e) => handleAgendaChange(index, 'description', e.target.value)} placeholder="Brief description..." />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addListItem('agenda', { time: '', title: '', description: '' })} className="flex items-center gap-2 text-secondary font-semibold text-sm hover:text-accent transition-colors">
              <span className="text-lg">+</span> Add Agenda Item
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SectionTitle>Additional Information</SectionTitle>
          <div className="space-y-5">
            <div>
              <Label htmlFor="goal" optional>Our Goal</Label>
              <Textarea id="goal" name="goal" value={form.goal} onChange={handleChange} placeholder="What is the goal of this event?" rows={3} />
            </div>
            <div>
              <Label htmlFor="specialNote" optional>Special Note</Label>
              <Textarea id="specialNote" name="specialNote" value={form.specialNote} onChange={handleChange} placeholder="Any special notes or announcements for attendees..." rows={3} />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Fields marked with <span className="text-red-500 font-bold">*</span> are required.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold text-sm hover:border-gray-400 hover:text-gray-800 transition-all"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading || disabled}
              className="px-8 py-2.5 bg-secondary text-white rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {submitLabel}
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </form>
  )
}

export default EventForm
