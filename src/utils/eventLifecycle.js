export const canRegisterForEvent = (event, now = new Date()) => {
  if (event?.status?.toUpperCase() !== 'PUBLISHED' || !event.date) return false
  const start = new Date(`${event.date}T00:00:00`)
  if (Number.isNaN(start.getTime())) return false
  const time = event.time?.match(/^\s*(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i)
  if (time) {
    let hours = Number(time[1])
    const minutes = Number(time[2])
    const period = time[3]?.toUpperCase()
    if (minutes > 59 || hours > (period ? 12 : 23) || (period && hours < 1)) return false
    if (period) hours = hours % 12 + (period === 'PM' ? 12 : 0)
    start.setHours(hours, minutes)
    return start > now
  }
  // With no parseable start time, allow the event day; the API enforces eligibility.
  start.setDate(start.getDate() + 1)
  return start > now
}
