import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import { apiGet } from '../../services/apiClient'

const STATUS_LABELS = {
  success: 'Success',
  pending: 'Pending',
  failed: 'Failed',
}

const STATUS_STYLES = {
  success: 'bg-secondary-container text-on-secondary-container',
  pending: 'bg-surface-container-highest text-on-surface-variant',
  failed: 'bg-error-container text-on-error-container',
}

function formatGHS(amount) {
  return `₵${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function AdminDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    apiGet('/donations/')
      .then((data) => setDonations(data.results ?? data))
      .catch(() => setLoadError('Could not load donations right now.'))
      .finally(() => setLoading(false))
  }, [])

  const totals = useMemo(() => {
    const successful = donations.filter((d) => d.status === 'success')
    const totalDonated = successful.reduce((sum, d) => sum + Number(d.amount), 0)
    const activeDonors = new Set(successful.map((d) => d.donor_email)).size
    return { totalDonated, activeDonors, count: donations.length }
  }, [donations])

  const filtered = donations.filter((d) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      (d.donor_name ?? '').toLowerCase().includes(query) ||
      (d.donor_email ?? '').toLowerCase().includes(query) ||
      (d.reference ?? '').toLowerCase().includes(query)
    )
  })

  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        title="Donations"
        description="Platform-wide donation activity across all donors."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-lg">
        <DashboardStatCard icon="volunteer_activism" value={formatGHS(totals.totalDonated)} label="Total Donated" tone="primary" />
        <DashboardStatCard icon="groups" value={String(totals.activeDonors)} label="Active Donors" tone="secondary" />
        <DashboardStatCard icon="receipt_long" value={String(totals.count)} label="All Donations" tone="tertiary" />
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">
        <div className="p-md border-b border-outline-variant/40">
          <div className="relative max-w-sm">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by donor name, email, or reference..."
              className="w-full pl-4 pr-4 py-2 bg-surface border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
              <tr>
                <th className="px-6 py-4">Donor</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-on-surface-variant">
                    Loading…
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-error">
                    {loadError}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-on-surface-variant">
                    No donations yet.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4 font-label-md text-label-md text-on-surface">
                      {d.donor_name || d.donor_email}
                      {d.donor_name && (
                        <span className="block text-on-surface-variant text-label-sm">{d.donor_email}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{d.project?.title || 'General Donation'}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{formatGHS(d.amount)}</td>
                    <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">{d.reference}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {new Date(d.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${STATUS_STYLES[d.status] || STATUS_STYLES.pending}`}
                      >
                        {STATUS_LABELS[d.status] || d.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
