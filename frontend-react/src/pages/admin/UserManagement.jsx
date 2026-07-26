import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ManagementTable from '../../components/dashboard/ManagementTable'
import Icon from '../../components/ui/Icon'

// TODO(backend): replace with a real fetch, e.g. GET /api/admin/users/
const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]

const USERS = [
  { id: 1, name: 'Ama Serwaa', email: 'ama.serwaa@example.com', role: 'Youth', status: 'Active' },
  { id: 2, name: 'Kwame Mensah', email: 'kwame.mensah@example.com', role: 'Counselor', status: 'Active' },
  { id: 3, name: 'Nana Yaw', email: 'nana.yaw@example.com', role: 'Donor', status: 'Active' },
  { id: 4, name: 'Abena Owusu', email: 'abena.owusu@example.com', role: 'Youth', status: 'Pending' },
  { id: 5, name: 'Kojo Antwi', email: 'kojo.antwi@example.com', role: 'Youth', status: 'Suspended' },
]

export default function UserManagement() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        title="User Management"
        description="View and manage every account on the platform."
        action={
          <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit">
            <Icon name="person_add" />
            Invite User
          </button>
        }
      />
      <ManagementTable
        columns={COLUMNS}
        rows={USERS}
        searchKeys={['name', 'email', 'role']}
        searchPlaceholder="Search users by name, email, or role..."
      />
    </DashboardLayout>
  )
}
