import React, { useId } from 'react'
import { Link } from 'react-router-dom'

const number = (value) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0
const monthEntries = (map) => Object.entries(map || {}).sort(([a], [b]) => a.localeCompare(b)).map(([label, value]) => ({ label, value: number(value) }))

export function MetricChart({ title, items, loading, line = false, maximum }) {
  const id = useId()
  const max = maximum || Math.max(1, ...items.map((item) => item.value))
  const width = Math.max(440, items.length * 65)
  const x = (index) => 45 + (index + 0.5) * (width - 65) / Math.max(1, items.length)
  const y = (value) => 190 - value / max * 145
  return (
    <section className="bg-white rounded-xl shadow-sm p-6 min-w-0" aria-labelledby={id}>
      <h3 id={id} className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      {loading ? <p role="status" className="text-gray-500">Loading {title.toLowerCase()}…</p> : items.length === 0 || items.every((item) => item.value === 0) ? <p className="py-8 text-gray-500">No data yet.</p> : (
        <div className="overflow-x-auto" tabIndex={0} aria-label={`${title} chart`}>
          <svg role="img" aria-label={`${title}: ${items.map((item) => `${item.label} ${item.value}`).join(', ')}`} viewBox={`0 0 ${width} 235`} className="w-full" style={{ minWidth: width }}>
            {[0, 0.5, 1].map((fraction) => <g key={fraction}>
              <line x1="40" x2={width - 10} y1={y(max * fraction)} y2={y(max * fraction)} stroke="#e5e7eb" />
              <text x="33" y={y(max * fraction) + 4} textAnchor="end" fontSize="11" fill="#6b7280">{Number((max * fraction).toFixed(1))}</text>
            </g>)}
            {line && <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={items.map((item, index) => `${x(index)},${y(item.value)}`).join(' ')} />}
            {items.map((item, index) => <g key={item.label}>
              {line ? <circle cx={x(index)} cy={y(item.value)} r="5" fill="#3b82f6" /> : <rect x={x(index) - 20} y={y(item.value)} width="40" height={190 - y(item.value)} rx="3" fill={item.color || '#3b82f6'} />}
              <text x={x(index)} y={y(item.value) - 10} textAnchor="middle" fontSize="12" fill="#374151">{item.value}</text>
              <text x={x(index)} y="218" textAnchor="middle" fontSize="11" fill="#374151">{item.label}</text>
            </g>)}
          </svg>
        </div>
      )}
    </section>
  )
}

export function EventMetricChart({ title, entries = [], field, loading, rating = false }) {
  const id = useId()
  const max = rating ? 5 : Math.max(1, ...entries.map((entry) => number(entry[field])))
  return (
    <section className="bg-white rounded-xl shadow-sm p-6" aria-labelledby={id}>
      <h3 id={id} className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      {loading ? <p role="status">Loading {title.toLowerCase()}…</p> : entries.length === 0 ? <p className="text-gray-500 py-8">No data yet.</p> : <ul className="space-y-4 max-h-96 overflow-y-auto">
        {entries.map((entry) => <li key={entry.eventSlug}>
          <div className="flex justify-between gap-4 mb-1 text-sm">
            <Link to={`/admin/events/${encodeURIComponent(entry.eventSlug)}`} className="font-semibold text-gray-700 hover:text-secondary">{entry.eventTitle}</Link>
            <span className="whitespace-nowrap">{rating ? `${number(entry[field]).toFixed(1)} / 5` : number(entry[field])}</span>
          </div>
          <div className="bg-gray-100 h-3 rounded-full" role="img" aria-label={`${entry.eventTitle}: ${number(entry[field])}${rating ? ' out of 5' : ' registrations'}`}>
            <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${Math.min(100, number(entry[field]) / max * 100)}%` }} />
          </div>
          {rating && <p className="text-xs text-gray-500 mt-1">{number(entry.feedbackCount)} feedback entries</p>}
        </li>)}
      </ul>}
    </section>
  )
}

export function PopularEventsTable({ entries = [], loading }) {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6" aria-labelledby="popular-events-heading">
      <h3 id="popular-events-heading" className="text-lg font-bold mb-4">Most popular events</h3>
      {loading ? <p role="status">Loading popular events…</p> : entries.length === 0 ? <p className="text-gray-500">No data yet.</p> : (
        <div className="overflow-x-auto" tabIndex={0}>
          <table className="w-full text-sm text-left">
            <caption className="sr-only">Events ranked by the dashboard API</caption>
            <thead><tr>{['Rank', 'Event', 'Registrations', 'Average rating', 'Feedback'].map((label) => <th key={label} scope="col" className="p-3 border-b whitespace-nowrap">{label}</th>)}</tr></thead>
            <tbody>{entries.map((entry, index) => <tr key={entry.eventSlug}>
              <td className="p-3 border-b">{index + 1}</td>
              <td className="p-3 border-b"><Link to={`/admin/events/${encodeURIComponent(entry.eventSlug)}`} className="font-semibold hover:text-secondary">{entry.eventTitle}</Link></td>
              <td className="p-3 border-b">{number(entry.registrations)}</td>
              <td className="p-3 border-b whitespace-nowrap">{number(entry.feedbackCount) ? `${number(entry.averageRating).toFixed(1)} / 5` : '—'}</td>
              <td className="p-3 border-b">{number(entry.feedbackCount)}</td>
            </tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default function DashboardAnalytics({ data = {}, loading = false, section = 'all' }) {
  const summary = [
    ['Total members', number(data.totalMembers)], ['Total admins', number(data.totalAdmins)],
    ['Recorded attendees', number(data.totalAttendees)],
    ['Average feedback rating', number(data.averageFeedbackRating) > 0 ? `${number(data.averageFeedbackRating).toFixed(1)} / 5` : 'No ratings yet'],
  ]
  const show = (group) => section === 'all' || section === group
  const summaries = summary.filter(([label]) => section === 'all' || section === 'overview' || (section === 'members' && ['Total members', 'Total admins'].includes(label)) || (section === 'participation' && label === 'Recorded attendees') || (section === 'feedback' && label === 'Average feedback rating'))
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaries.map(([label, value]) => <section key={label} className="bg-white rounded-xl shadow-sm p-6"><h3 className="text-sm text-gray-500 mb-2">{label}</h3><p className="text-2xl font-bold text-gray-800">{loading ? '…' : value}</p></section>)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {show('events') && <MetricChart title="Events by status" loading={loading} items={['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'].map((status) => ({ label: status.charAt(0) + status.slice(1).toLowerCase(), value: number(data.eventsByStatus?.[status]) }))} />}
        {show('events') && <MetricChart title="Events per month" loading={loading} items={monthEntries(data.eventsPerMonth)} />}
        {show('participation') && <EventMetricChart title="Registrations per event" loading={loading} entries={data.registrationsPerEvent || []} field="registrations" />}
        {show('feedback') && <MetricChart title="Rating distribution" loading={loading} items={[1, 2, 3, 4, 5].map((rating) => ({ label: `${rating} stars`, value: number(data.ratingDistribution?.[rating]) }))} />}
        {show('feedback') && <EventMetricChart title="Average rating by event" loading={loading} entries={data.averageRatingByEvent || []} field="averageRating" rating />}
        {show('members') && <MetricChart title="Member growth" loading={loading} items={monthEntries(data.memberGrowth)} line />}
      </div>
      {show('participation') && <PopularEventsTable entries={data.mostPopularEvents || []} loading={loading} />}
    </div>
  )
}
