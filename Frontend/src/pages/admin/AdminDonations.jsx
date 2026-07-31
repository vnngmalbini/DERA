import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import { apiGet } from '../../services/apiClient'

function formatGHS(amount) {
  return `₵${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function AdminDonations() {
  const [sponsorships, setSponsorships] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    apiGet('/sponsorships/')
      .then((data) => setSponsorships(data.results ?? data))
      .catch(() => setLoadError('Could not load donations right now.'))
      .finally(() => setLoading(false))
  }, [])

  const totals = useMemo(() => {
    const totalDonated = sponsorships.reduce((sum, s) => sum + Number(s.amount), 0)
    const activeDonors = new Set(sponsorships.map((s) => s.donor)).size
    return { totalDonated, activeDonors, count: sponsorships.length }
  }, [sponsorships])

  const filtered = sponsorships.filter((s) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    const donorName = (s.donor_detail?.full_name ?? '').toLowerCase()
    const formTitle = (s.order_detail?.form?.title ?? '').toLowerCase()
    return donorName.includes(query) || formTitle.includes(query)
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
        <DashboardStatCard icon="handshake" value={String(totals.count)} label="Sponsorships" tone="tertiary" />
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">
        <div className="p-md border-b border-outline-variant/40">
          <div className="relative max-w-sm">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by donor or funded form..."
              className="w-full pl-4 pr-4 py-2 bg-surface border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
              <tr>
                <th className="px-6 py-4">Donor</th>
                <th className="px-6 py-4">Funded</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-on-surface-variant">
                    Loading…
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-error">
                    {loadError}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-on-surface-variant">
                    No donations yet.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4 font-label-md text-label-md text-on-surface">
                      {s.donor_detail?.full_name || '—'}
                      {s.donor_detail?.organization && (
                        <span className="block text-on-surface-variant text-label-sm">{s.donor_detail.organization}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{s.order_detail?.form?.title || '—'}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{formatGHS(s.amount)}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {new Date(s.funded_at).toLocaleDateString()}
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
