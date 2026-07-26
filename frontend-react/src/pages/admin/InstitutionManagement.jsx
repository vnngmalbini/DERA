import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ManagementTable from '../../components/dashboard/ManagementTable'
import Icon from '../../components/ui/Icon'

// TODO(backend): replace with a real fetch, e.g. GET /api/admin/institutions/
const COLUMNS = [
  { key: 'name', label: 'Institution' },
  { key: 'type', label: 'Type' },
  { key: 'region', label: 'Region' },
  { key: 'status', label: 'Status' },
]

const INSTITUTIONS = [
  { id: 1, name: 'Achimota School', type: 'SHS', region: 'Greater Accra', status: 'Active' },
  { id: 2, name: 'Prempeh College', type: 'SHS', region: 'Ashanti', status: 'Active' },
  { id: 3, name: 'Tamale Girls SHS', type: 'SHS', region: 'Northern', status: 'Pending' },
  { id: 4, name: 'Kwame Nkrumah University', type: 'Tertiary', region: 'Ashanti', status: 'Active' },
]

export default function InstitutionManagement() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        title="Institution Management"
        description="Schools and institutions registered on the platform."
        action={
          <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit">
            <Icon name="add_business" />
            Add Institution
          </button>
        }
      />
      <ManagementTable
        columns={COLUMNS}
        rows={INSTITUTIONS}
        searchKeys={['name', 'type', 'region']}
        searchPlaceholder="Search institutions by name, type, or region..."
      />
    </DashboardLayout>
  )
}
