import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'
import { apiGet, apiPost, apiDelete, ApiError } from '../../services/apiClient'
import { isClosed } from '../../utils/scholarships'

function AddScholarshipModal({ careerPaths, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', provider: '', education_level: '', deadline: '', source_url: '', career_path_id: '',
    eligibility_criteria: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const created = await apiPost('/scholarships/', {
        title: form.title,
        provider: form.provider || null,
        education_level: form.education_level || null,
        deadline: form.deadline || null,
        source_url: form.source_url || null,
        career_path_id: form.career_path_id || null,
        eligibility_criteria: form.eligibility_criteria || null,
      })
      onCreated(created)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save this scholarship. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center px-margin-mobile">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-lg border border-outline-variant/30">
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Add Scholarship</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors">
            <Icon name="close" />
          </button>
        </div>

        {error && (
          <div className="mb-md p-md rounded-lg bg-error-container">
            <p className="font-body-md text-body-md text-on-error-container">{error}</p>
          </div>
        )}

        <form className="space-y-md" onSubmit={handleSubmit}>
          <div className="space-y-xs">
            <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
              placeholder="e.g. MTN Bright Scholarship"
            />
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="provider">
                Provider
              </label>
              <input
                id="provider"
                name="provider"
                value={form.provider}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                placeholder="e.g. MTN Ghana Foundation"
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="education_level">
                Education Level
              </label>
              <input
                id="education_level"
                name="education_level"
                value={form.education_level}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                placeholder="e.g. SHS or Tertiary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="deadline">
                Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="career_path_id">
                Career Path
              </label>
              <select
                id="career_path_id"
                name="career_path_id"
                value={form.career_path_id}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
              >
                <option value="">—</option>
                {careerPaths.map((cp) => (
                  <option key={cp.id} value={cp.id}>{cp.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-xs">
            <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="source_url">
              Source URL
            </label>
            <input
              id="source_url"
              name="source_url"
              type="url"
              value={form.source_url}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-xs">
            <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="eligibility_criteria">
              Eligibility Criteria
            </label>
            <textarea
              id="eligibility_criteria"
              name="eligibility_criteria"
              rows={4}
              value={form.eligibility_criteria}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none"
              placeholder="Who can apply..."
            />
          </div>

          <div className="pt-sm flex gap-sm">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary text-on-primary font-semibold py-sm rounded-lg flex items-center justify-center gap-xs active:scale-95 transition-transform disabled:opacity-70"
            >
              {submitting ? <Icon name="progress_activity" className="animate-spin" /> : <Icon name="check" />}
              Publish
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
      </div>
    </div>
  )
}

export default function AdminScholarships() {
  const [scholarships, setScholarships] = useState([])
  const [careerPaths, setCareerPaths] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    apiGet('/scholarships/')
      .then((data) => setScholarships(data.results ?? data))
      .catch(() => setLoadError('Could not load scholarships right now.'))
      .finally(() => setLoading(false))
    apiGet('/career-paths/')
      .then((data) => setCareerPaths(data.results ?? data))
      .catch(() => setCareerPaths([]))
  }, [])

  const handleCreated = (created) => {
    setScholarships((prev) => [created, ...prev])
    setShowAddModal(false)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await apiDelete(`/scholarships/${id}/`)
      setScholarships((prev) => prev.filter((s) => s.id !== id))
    } catch {
      // leave the row in place if deletion fails
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = scholarships.filter((s) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      s.title.toLowerCase().includes(query) ||
      (s.provider ?? '').toLowerCase().includes(query) ||
      (s.education_level ?? '').toLowerCase().includes(query)
    )
  })

  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        title="Scholarships"
        description="Real scholarship listings shown on the Scholarship Hub."
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit"
          >
            <Icon name="add" />
            Add Scholarship
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
              placeholder="Search by title, provider, or level..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
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
                    No scholarships yet. Click "Add Scholarship" to publish one.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const closed = isClosed(s.deadline)
                  return (
                  <tr key={s.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4 font-label-md text-label-md text-on-surface">{s.title}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{s.provider || '—'}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{s.education_level || '—'}</td>
                    <td className={`px-6 py-4 ${closed ? 'text-error font-semibold' : 'text-on-surface-variant'}`}>
                      {closed ? 'Closed' : s.deadline ? new Date(s.deadline).toLocaleDateString() : 'Rolling'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full font-label-sm text-label-sm ${
                          closed ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'
                        }`}
                      >
                        {closed ? 'Closed' : 'Open'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                        className="inline-flex items-center gap-1 text-error font-label-md text-label-md hover:opacity-70 transition-opacity disabled:opacity-50"
                      >
                        {deletingId === s.id ? 'Deleting…' : 'Delete'}
                        <Icon name="delete" className="text-[18px]" />
                      </button>
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddScholarshipModal careerPaths={careerPaths} onClose={() => setShowAddModal(false)} onCreated={handleCreated} />
      )}
    </DashboardLayout>
  )
}
