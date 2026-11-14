import React from 'react'

const categories = [
  { key: 'PLAY', label: 'Play', color: '#f97316' },
  { key: 'ENJOY', label: 'Enjoy', color: '#16a34a' },
  { key: 'NETWORK', label: 'Network', color: '#3b82f6' },
]
const count = (value) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0

export default function DashboardCharts({ eventsByCategory = {}, upcomingCount = 0, pastCount = 0, loading = false }) {
  const values = categories.map((category) => ({ ...category, count: count(eventsByCategory[category.key]) }))
  const max = Math.max(1, ...values.map((category) => category.count))
  const upcoming = count(upcomingCount)
  const past = count(pastCount)
  const total = upcoming + past
  const upcomingPercent = total ? upcoming / total * 100 : 0
  const circumference = 2 * Math.PI * 70

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <section className="bg-white rounded-xl shadow-sm p-6" aria-labelledby="category-chart-heading">
        <h3 id="category-chart-heading" className="text-lg font-bold text-gray-800 mb-4">Events by category</h3>
        {loading ? <p role="status" className="text-gray-500">Loading category chart…</p> : values.every((category) => category.count === 0) ? (
          <p className="text-gray-500 py-8">No categorized events yet.</p>
        ) : (
          <>
            <svg role="img" aria-label={`Events by category: ${values.map((category) => `${category.label} ${category.count}`).join(', ')}`} viewBox="0 0 400 260" className="w-full">
              {[0, 0.5, 1].map((fraction) => (
                <g key={fraction}>
                  <line x1="45" x2="385" y1={215 - fraction * 170} y2={215 - fraction * 170} stroke="#e5e7eb" />
                  <text x="36" y={220 - fraction * 170} textAnchor="end" fontSize="12" fill="#6b7280">{Number((max * fraction).toFixed(1))}</text>
                </g>
              ))}
              {values.map((category, index) => {
                const height = category.count / max * 170
                const x = 72 + index * 110
                return (
                  <g key={category.key}>
                    <rect x={x} y={215 - height} width="60" height={height} rx="4" fill={category.color}><title>{category.label}: {category.count} events</title></rect>
                    <text x={x + 30} y={205 - height} textAnchor="middle" fontSize="14" fill="#374151">{category.count}</text>
                    <text x={x + 30} y="242" textAnchor="middle" fontSize="14" fill="#374151">{category.label}</text>
                  </g>
                )
              })}
            </svg>
            <p className="text-xs text-gray-500">Number of events in each category.</p>
          </>
        )}
      </section>
      <section className="bg-white rounded-xl shadow-sm p-6" aria-labelledby="timing-chart-heading">
        <h3 id="timing-chart-heading" className="text-lg font-bold text-gray-800 mb-4">Upcoming vs past events</h3>
        {loading ? <p role="status" className="text-gray-500">Loading event timing chart…</p> : total === 0 ? (
          <p className="text-gray-500 py-8">No upcoming or past events yet.</p>
        ) : (
          <>
            <svg role="img" aria-label={`Upcoming ${upcoming}, past ${past}, total ${total} events`} viewBox="0 0 240 220" className="w-full max-w-xs mx-auto">
              <circle cx="120" cy="105" r="70" fill="none" stroke="#9ca3af" strokeWidth="28" />
              <circle cx="120" cy="105" r="70" fill="none" stroke="#3b82f6" strokeWidth="28"
                strokeDasharray={`${circumference * upcomingPercent / 100} ${circumference}`} transform="rotate(-90 120 105)" />
              <text x="120" y="103" textAnchor="middle" fontSize="30" fontWeight="bold" fill="#1f2937">{total}</text>
              <text x="120" y="126" textAnchor="middle" fontSize="13" fill="#6b7280">events</text>
            </svg>
            <ul className="flex flex-wrap justify-center gap-5 text-sm text-gray-700">
              <li className="flex items-center gap-2"><span aria-hidden="true" className="w-3 h-3 rounded-full bg-blue-500" />Upcoming: {upcoming} ({Math.round(upcomingPercent)}%)</li>
              <li className="flex items-center gap-2"><span aria-hidden="true" className="w-3 h-3 rounded-full bg-gray-400" />Past: {past} ({Math.round(100 - upcomingPercent)}%)</li>
            </ul>
          </>
        )}
      </section>
    </div>
  )
}
