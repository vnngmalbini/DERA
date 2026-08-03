import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ContentCard from '../../components/dashboard/ContentCard'
import Modal from '../../components/ui/Modal'
import { apiGet } from '../../services/apiClient'

export default function SponsoredProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    apiGet('/donations/')
      .then((data) => {
        const donations = data.results ?? data
        const byId = new Map()
        donations.forEach((d) => {
          if (d.project) byId.set(d.project.id, d.project)
        })
        setProjects([...byId.values()])
      })
      .catch(() => setLoadError('Could not load your sponsored projects right now.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout role="donor">
      <DashboardPageHeader
        title="Sponsored Projects"
        description="Projects you're currently funding or have completed."
      />

      {loading ? (
        <p className="text-on-surface-variant">Loading…</p>
      ) : loadError ? (
        <p className="text-error">{loadError}</p>
      ) : projects.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm p-xl text-center">
          <p className="text-on-surface-variant mb-4">
            You haven&apos;t directed a donation to a specific project yet.
          </p>
          <Link to="/donate" className="text-primary font-label-md text-label-md hover:underline">
            Make a donation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((item) => (
            <ContentCard
              key={item.id}
              icon={item.icon || 'handshake'}
              title={item.title}
              subtitle={[item.region, item.status].filter(Boolean).join(' · ')}
              description={item.description}
              tag={item.status === 'active' ? 'Active' : 'Completed'}
              actionLabel="View Project"
              onAction={() => setSelected(item)}
            />
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <div className="space-y-2">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {[selected.region, selected.status].filter(Boolean).join(' · ')}
            </p>
            <p className="font-body-md text-body-md text-on-surface">{selected.description}</p>
            <p className="font-label-md text-label-md text-primary pt-2">
              ₵{Number(selected.raised_amount).toLocaleString()} raised
              {selected.target_amount ? ` of ₵${Number(selected.target_amount).toLocaleString()} goal` : ''} from{' '}
              {selected.donor_count} donor{selected.donor_count === 1 ? '' : 's'}
            </p>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
