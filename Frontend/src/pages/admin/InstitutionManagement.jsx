import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'
import Modal from '../../components/ui/Modal'
import { apiGet, apiPost, apiDelete, ApiError } from '../../services/apiClient'

const GHANA_REGIONS = [
  'Ashanti', 'Bono', 'Bono East', 'Ahafo', 'Central', 'Eastern', 'Greater Accra', 'Northern',
  'North East', 'Savannah', 'Upper East', 'Upper West', 'Volta', 'Oti', 'Western', 'Western North',
]

const TYPE_LABELS = {
  school: 'School',
  university: 'University',
  technical_university: 'Technical University',
  college_of_education: 'College of Education',
  tvet_centre: 'TVET Centre',
}

function AddInstitutionModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', type: 'school', region: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const created = await apiPost('/institutions/', {
        name: form.name,
        type: form.type,
        region: form.region || null,
      })
      onCreated(created)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save this institution. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open onClose={onClose} title="Add Institution">
      {error && (
        <div className="mb-md p-md rounded-lg bg-error-container">
          <p className="font-body-md text-body-md text-on-error-container">{error}</p>
        </div>
      )}

      <form className="space-y-md" onSubmit={handleSubmit}>
        <div className="space-y-xs">
          <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
            placeholder="e.g. Tamale Girls SHS"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
          <div className="space-y-xs">
            <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
            >
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-xs">
            <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="region">
              Region
            </label>
            <select
              id="region"
              name="region"
              value={form.region}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
            >
              <option value="">—</option>
              {GHANA_REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-sm flex gap-sm">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-primary text-on-primary font-semibold py-sm rounded-lg flex items-center justify-center gap-xs active:scale-95 transition-transform disabled:opacity-70"
          >
            {submitting ? <Icon name="progress_activity" className="animate-spin" /> : <Icon name="check" />}
            Add Institution
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-lg py-sm rounded-lg border border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default function InstitutionManagement() {
  const [institutions, setInstitutions] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    apiGet('/institutions/')
      .then((data) => setInstitutions(data.results ?? data))
      .catch(() => setLoadError('Could not load institutions right now.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreated = (created) => {
    setInstitutions((prev) => [created, ...prev])
    setShowAddModal(false)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await apiDelete(`/institutions/${id}/`)
      setInstitutions((prev) => prev.filter((i) => i.id !== id))
    } catch {
      // leave the row in place if deletion fails
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = institutions.filter((i) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      i.name.toLowerCase().includes(query) ||
      (TYPE_LABELS[i.type] ?? i.type ?? '').toLowerCase().includes(query) ||
      (i.region ?? '').toLowerCase().includes(query)
    )
  })

  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        title="Institution Management"
        description="Schools and institutions registered on the platform."
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit"
          >
            <Icon name="add_business" />
            Add Institution
          </button>
        }
      />

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">
        <div className="p-md border-b border-outline-variant/40">
          <div className="relative max-w-sm">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search institutions by name, type, or region..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
              <tr>
                <th className="px-6 py-4">Institution</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4 text-right">Actions</th>
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
                    No institutions match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((inst) => (
                  <tr key={inst.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4 font-label-md text-label-md text-on-surface">{inst.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{TYPE_LABELS[inst.type] ?? inst.type}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{inst.region || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(inst.id)}
                        disabled={deletingId === inst.id}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-error bg-error-container/40 font-label-md text-label-md hover:opacity-70 transition-opacity disabled:opacity-50"
                      >
                        {deletingId === inst.id ? 'Deleting…' : 'Delete'}
                        <Icon name="delete" className="text-[18px]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddInstitutionModal onClose={() => setShowAddModal(false)} onCreated={handleCreated} />
      )}
    </DashboardLayout>
  )
}
