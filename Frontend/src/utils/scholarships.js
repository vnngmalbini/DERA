export function startOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

export function isClosed(deadline) {
  if (!deadline) return false
  return new Date(deadline) < startOfToday()
}

export function formatDeadline(deadline) {
  if (!deadline) return 'Rolling — no fixed deadline'
  if (isClosed(deadline)) return 'Closed'
  return new Date(deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
