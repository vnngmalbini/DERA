import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ManagementTable from '../../components/dashboard/ManagementTable'
import Icon from '../../components/ui/Icon'

// TODO(backend): replace with a real fetch, e.g. GET /api/admin/content/
const COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'section', label: 'Section' },
  { key: 'updated', label: 'Last Updated' },
  { key: 'status', label: 'Status' },
]

const CONTENT = [
  { id: 1, title: 'Every Young Person Belongs Here', section: 'Home Hero', updated: 'Jul 10, 2026', status: 'Published' },
  { id: 2, title: 'How DERA Works', section: 'How It Works', updated: 'Jun 28, 2026', status: 'Published' },
  { id: 3, title: 'Kojo’s Success Story', section: 'Real Stories', updated: 'Jul 5, 2026', status: 'Draft' },
]

export default function ContentManagement() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        title="Content Management"
        description="Manage the public-facing pages and stories shown across the platform."
        action={
          <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit">
            <Icon name="add" />
            New Content
          </button>
        }
      />
      <ManagementTable
        columns={COLUMNS}
        rows={CONTENT}
        searchKeys={['title', 'section']}
        searchPlaceholder="Search content..."
      />
    </DashboardLayout>
  )
}
