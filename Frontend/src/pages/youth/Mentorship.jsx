import { useEffect, useState } from 'react'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ContentCard from '../../components/dashboard/ContentCard'
import { apiGet } from '../../services/apiClient'

export default function Mentorship() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    apiGet('/mentors/')
      .then((data) => setMentors(data.results ?? data))
      .catch(() => setLoadError('Could not load mentors right now.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <DashboardPageHeader
        title="Mentorship"
        description="Connect with mentors matched to your interests and career goals."
      />
      {loading ? (
        <p className="text-on-surface-variant">Loading…</p>
      ) : loadError ? (
        <p className="text-error">{loadError}</p>
      ) : mentors.length === 0 ? (
        <p className="text-on-surface-variant">No mentors available yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor) => (
            <ContentCard key={mentor.id} {...mentor} actionLabel="Message Mentor" />
          ))}
        </div>
      )}
    </>
  )
}
