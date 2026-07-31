import { useEffect, useState } from 'react'
import { fetchDashboardSummary } from '../services/dashboardService'

export function useDashboardSummary(role) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchDashboardSummary(role).then((data) => {
      if (!cancelled) {
        setSummary(data)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [role])

  return { summary, loading }
}
