import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ManagementTable from '../../components/dashboard/ManagementTable'
import Icon from '../../components/ui/Icon'

// TODO(backend): replace with a real fetch, e.g. GET /api/admin/opportunities/
const COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'type', label: 'Type' },
  { key: 'postedBy', label: 'Posted By' },
  { key: 'status', label: 'Status' },
]

const OPPORTUNITIES = [
  { id: 1, title: 'MTN Digital Skills Internship', type: 'Internship', postedBy: 'MTN Foundation', status: 'Open' },
  { id: 2, title: 'National Young Innovators Challenge', type: 'Competition', postedBy: 'DERA Admin', status: 'Open' },
  { id: 3, title: 'Rural Youth Leadership Fellowship', type: 'Fellowship', postedBy: 'USAID Ghana', status: 'Closed' },
]

export default function AdminOpportunities() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        title="Opportunities"
        description="Review and manage internships, fellowships, and competitions posted platform-wide."
        action={
          <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit">
            <Icon name="add" />
            Post Opportunity
          </button>
        }
      />
      <ManagementTable
        columns={COLUMNS}
        rows={OPPORTUNITIES}
        searchKeys={['title', 'type', 'postedBy']}
        searchPlaceholder="Search opportunities..."
      />
    </DashboardLayout>
  )
}
