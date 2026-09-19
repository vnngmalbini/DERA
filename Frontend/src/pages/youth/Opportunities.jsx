import { useEffect, useState } from 'react'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ContentCard from '../../components/dashboard/ContentCard'
import { apiGet } from '../../services/apiClient'

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    apiGet('/opportunities/')
      .then((data) => setOpportunities(data.results ?? data))
      .catch(() => setLoadError('Could not load opportunities right now.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <DashboardPageHeader
        title="Opportunities"
        description="Internships, fellowships, and competitions curated for you."
      />
      {loading ? (
        <p className="text-on-surface-variant">Loading…</p>
      ) : loadError ? (
        <p className="text-error">{loadError}</p>
      ) : opportunities.length === 0 ? (
        <p className="text-on-surface-variant">No opportunities posted yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((item) => (
            <ContentCard key={item.id} {...item} actionLabel="View Opportunity" />
          ))}
        </div>
      )}
    </>
  )
}
