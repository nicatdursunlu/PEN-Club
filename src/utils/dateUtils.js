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
