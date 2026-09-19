import { useEffect, useState } from 'react'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ContentCard from '../../components/dashboard/ContentCard'
import { apiGet } from '../../services/apiClient'

export default function LearningResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    apiGet('/learning-resources/')
      .then((data) => setResources(data.results ?? data))
      .catch(() => setLoadError('Could not load learning resources right now.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <DashboardPageHeader
        title="Learning Resources"
        description="Free courses and study materials to help you get ahead."
      />
      {loading ? (
        <p className="text-on-surface-variant">Loading…</p>
      ) : loadError ? (
        <p className="text-error">{loadError}</p>
      ) : resources.length === 0 ? (
        <p className="text-on-surface-variant">No learning resources available yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((item) => (
            <ContentCard key={item.id} {...item} actionLabel="Start Learning" />
          ))}
        </div>
      )}
    </>
  )
}
