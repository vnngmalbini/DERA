import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ContentCard from '../../components/dashboard/ContentCard'
import Modal from '../../components/ui/Modal'
import { apiGet } from '../../services/apiClient'

export default function ImpactReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    apiGet('/impact-reports/')
      .then((data) => setReports(data.results ?? data))
      .catch(() => setLoadError('Could not load impact reports right now.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout role="donor">
      <DashboardPageHeader
        title="Impact Reports"
        description="See the measurable outcomes of your giving."
      />

      {loading ? (
        <p className="text-on-surface-variant">Loading…</p>
      ) : loadError ? (
        <p className="text-error">{loadError}</p>
      ) : reports.length === 0 ? (
        <p className="text-on-surface-variant">No impact reports published yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((item) => (
            <ContentCard
              key={item.id}
              icon={item.icon || 'insights'}
              title={item.title}
              subtitle={`Published ${new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`}
              description={item.description}
              tag={item.tag}
              actionLabel="Read Report"
              onAction={() => setSelected(item)}
            />
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <div className="space-y-2">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Published {new Date(selected.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
              {selected.project ? ` — ${selected.project.title}` : ''}
            </p>
            <p className="font-body-md text-body-md text-on-surface">{selected.description}</p>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
