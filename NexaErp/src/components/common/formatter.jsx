/**
 * Formats numbers based on locale and decimal requirements.
 */
export const toNumber = (value, minimumFractionDigits = 2) => {
  if (value === null || value === undefined || value === '') return '-'
  let minDigits = minimumFractionDigits
  if (value % 1 === 0) minDigits = 0

  const locale = navigator.language || 'en-US'
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: minDigits,
  })

  return formatter.format(value)
}

export const toNumberOrWhole = (value, minimumFractionDigits = 2) => {
  if (value === null || value === undefined || value === '') return '-'
  if (value % 1 !== 0) return toNumber(value, minimumFractionDigits)
  return toNumber(value, 0)
}

export const toBracketNumber = (value, minimumFractionDigits = 2) => {
  if (value === null || value === undefined || value === '') return '-'
  let minDigits = minimumFractionDigits
  if (value % 1 === 0) minDigits = 0

  const locale = navigator.language || 'en-US'
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: minDigits,
  })

  if (Number(value) === 0) return '-'
  if (value < 0) return `(${formatter.format(value * -1)})`

  return formatter.format(value)
}

// Date Formatter helper
export const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString()
}
export const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  return date.toISOString().split('T')[0] // Sirf YYYY-MM-DD nikalta hai
}
