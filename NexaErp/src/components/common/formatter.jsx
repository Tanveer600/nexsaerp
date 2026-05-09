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
export const sortData = (data, key, direction = 'asc') => {
  return [...data].sort((a, b) => {
    let valA = a[key] ?? a[key.charAt(0).toUpperCase() + key.slice(1)] ?? ''
    let valB = b[key] ?? b[key.charAt(0).toUpperCase() + key.slice(1)] ?? ''
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()

    if (!isNaN(valA) && !isNaN(valB) && typeof valA !== 'boolean' && valA !== '') {
      valA = Number(valA)
      valB = Number(valB)
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1
    if (valA > valB) return direction === 'asc' ? 1 : -1
    return 0
  })
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
