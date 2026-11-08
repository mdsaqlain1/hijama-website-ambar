export const money = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(n || 0))

export const toLocalISO = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const todayISO = () => toLocalISO(new Date())

export const monthStart = () => {
  const d = new Date()
  return toLocalISO(new Date(d.getFullYear(), d.getMonth(), 1))
}

export const prettyDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : '—'

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join('')
    .toUpperCase() || 'P'

export const currentYearMonth = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const shiftYearMonth = (ym, delta) => {
  const [y, m] = (ym || currentYearMonth()).split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const formatMonthName = (ym) => {
  if (!ym) return ''
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  })
}

export function getFinanceRange(preset, customStart, customEnd, selectedMonth) {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  if (preset === 'today') {
    const today = todayISO()
    return {
      start: today,
      end: today,
      label: `Today (${prettyDate(today)})`,
      shortLabel: 'Today'
    }
  }
  if (preset === 'week') {
    const day = now.getDay()
    const diff = (day === 0 ? -6 : 1) - day
    const mon = new Date(now)
    mon.setDate(now.getDate() + diff)
    const sun = new Date(mon)
    sun.setDate(mon.getDate() + 6)
    const s = toLocalISO(mon)
    const e = toLocalISO(sun)
    return {
      start: s,
      end: e,
      label: `This Week (${prettyDate(s)} – ${prettyDate(e)})`,
      shortLabel: 'This Week'
    }
  }
  if (preset === 'month') {
    const s = toLocalISO(new Date(y, m, 1))
    const e = toLocalISO(new Date(y, m + 1, 0))
    const moName = formatMonthName(`${y}-${String(m + 1).padStart(2, '0')}`)
    return {
      start: s,
      end: e,
      label: `This Month (${moName})`,
      shortLabel: `This Month (${moName})`
    }
  }
  if (preset === 'last_month') {
    const s = toLocalISO(new Date(y, m - 1, 1))
    const e = toLocalISO(new Date(y, m, 0))
    const prevDate = new Date(y, m - 1, 1)
    const labelMo = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
    const moName = formatMonthName(labelMo)
    return {
      start: s,
      end: e,
      label: `Last Month (${moName})`,
      shortLabel: `Last Month (${moName})`
    }
  }
  if (preset === 'year') {
    return {
      start: `${y}-01-01`,
      end: `${y}-12-31`,
      label: `This Year (${y})`,
      shortLabel: `This Year (${y})`
    }
  }
  if (preset === 'by_month') {
    const targetMonth = selectedMonth || currentYearMonth()
    const [yr, mo] = targetMonth.split('-').map(Number)
    const s = `${targetMonth}-01`
    const e = toLocalISO(new Date(yr, mo, 0))
    const moName = formatMonthName(targetMonth)
    return {
      start: s,
      end: e,
      label: moName,
      shortLabel: moName
    }
  }
  if (preset === 'custom') {
    const s = customStart || ''
    const e = customEnd || ''
    let label = 'Custom Range'
    if (s && e) label = `${prettyDate(s)} – ${prettyDate(e)}`
    else if (s) label = `From ${prettyDate(s)}`
    else if (e) label = `Until ${prettyDate(e)}`
    return {
      start: s,
      end: e,
      label,
      shortLabel: label
    }
  }
  return { start: '', end: '', label: 'All Time', shortLabel: 'All Time' }
}
