/**
 * Formats a date string from yyyy-MM-DD to DD.MM.YYYY.
 * @param {string} dateStr - Date string in yyyy-MM-DD format
 * @returns {string} Formatted date string in DD.MM.YYYY format
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const [year, month, day] = dateStr.split('-')
    return `${day}.${month}.${year}`
  } catch {
    return dateStr
  }
}

export const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  const [date, time] = dateTime.split('T')
  return `${formatDate(date)}${time ? ` ${time.slice(0, 5)}` : ''}`
}
