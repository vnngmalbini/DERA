import { useEffect, useState } from 'react'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'
import { apiGet, apiPatch } from '../../services/apiClient'

function displayName(user) {
  const profile = user.youth_profile || user.counselor_profile || user.donor_profile
  return profile?.full_name || user.email
}

const ROLE_LABELS = {
  youth: 'Youth',
  counselor: 'Counselor',
  donor: 'Donor',
  admin: 'Admin',
}

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    apiGet('/users/')
      .then((data) => setUsers(data.results ?? data))
      .catch(() => setLoadError('Could not load users right now.'))
      .finally(() => setLoading(false))
  }, [])

  const handleToggleActive = async (user) => {
    setUpdatingId(user.id)
    try {
      const updated = await apiPatch(`/users/${user.id}/`, { is_active: !user.is_active })
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)))
    } catch {
      // leave the row unchanged if the update fails
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredUsers = users.filter((u) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      displayName(u).toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.role.toLowerCase().includes(query)
    )
  })

  return (
    <>
      <DashboardPageHeader
        title="User Management"
        description="View and manage every account on the platform."
      />

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">
        <div className="p-md border-b border-outline-variant/40">
          <div className="relative max-w-sm">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name, email, or role..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                    Loading…
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-error">
                    {loadError}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                    No users match your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4 font-label-md text-label-md text-on-surface">{displayName(u)}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{u.email}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{ROLE_LABELS[u.role] ?? u.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${
                          u.is_active
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleActive(u)}
                        disabled={updatingId === u.id}
                        className={`inline-flex items-center gap-1 px-3 py-2 rounded-full font-label-md text-label-md hover:opacity-70 transition-opacity disabled:opacity-50 ${
                          u.is_active ? 'text-error bg-error-container/40' : 'text-primary bg-primary-container/40'
                        }`}
                      >
                        {updatingId === u.id ? 'Updating…' : u.is_active ? 'Deactivate' : 'Activate'}
                        <Icon name={u.is_active ? 'block' : 'check_circle'} className="text-[18px]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
