import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'
import { apiGet } from '../../services/apiClient'

const STATUS_STYLES = {
  success: 'bg-secondary-container text-on-secondary-container',
  pending: 'bg-surface-container-highest text-on-surface-variant',
  failed: 'bg-error-container text-on-error-container',
}

export default function Donations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    apiGet('/donations/')
      .then((data) => setDonations(data.results ?? data))
      .catch(() => setLoadError('Could not load your donations right now.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <DashboardPageHeader
        title="Donations"
        description="Your giving history and a quick way to make a new donation."
        action={
          <Link
            to="/donate"
            className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit"
          >
            <Icon name="volunteer_activism" />
            Make a Donation
          </Link>
        }
      />

      {loading ? (
        <p className="text-on-surface-variant">Loading…</p>
      ) : loadError ? (
        <p className="text-error">{loadError}</p>
      ) : donations.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm p-xl text-center">
          <p className="text-on-surface-variant">You haven&apos;t made a donation yet.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
                <tr>
                  <th className="px-6 py-4">Fund</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4 font-label-md text-label-md text-on-surface">
                      {d.project?.title || 'General Fund'}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">₵{Number(d.amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {new Date(d.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full font-label-sm text-label-sm capitalize ${STATUS_STYLES[d.status] || STATUS_STYLES.pending}`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
