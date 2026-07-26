import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import ManagementTable from '../../components/dashboard/ManagementTable'

// TODO(backend): replace with a real fetch, e.g. GET /api/admin/donations/
const COLUMNS = [
  { key: 'donor', label: 'Donor' },
  { key: 'fund', label: 'Fund' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
]

const DONATIONS = [
  { id: 1, donor: 'Nana Yaw', fund: 'Girls in STEM Fund', amount: '₵2,000', status: 'Active' },
  { id: 2, donor: 'MTN Foundation', fund: 'Rural Coding Bootcamp', amount: '₵15,000', status: 'Active' },
  { id: 3, donor: 'Efua Asante', fund: 'General Scholarship Fund', amount: '₵1,500', status: 'Pending' },
]

export default function AdminDonations() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        title="Donations"
        description="Platform-wide donation activity across all donors."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-lg">
        <DashboardStatCard icon="volunteer_activism" value="₵482,300" label="Total Donated" tone="primary" />
        <DashboardStatCard icon="groups" value="460" label="Active Donors" tone="secondary" />
        <DashboardStatCard icon="pending_actions" value="6" label="Pending Payouts" tone="error" />
      </div>

      <ManagementTable
        columns={COLUMNS}
        rows={DONATIONS}
        searchKeys={['donor', 'fund']}
        searchPlaceholder="Search by donor or fund..."
      />
    </DashboardLayout>
  )
}
