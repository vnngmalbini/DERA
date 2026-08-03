import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'
import { apiGet, apiPost, apiDelete, ApiError } from '../../services/apiClient'

function AddLearningResourceModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ icon: '', title: '', subtitle: '', description: '', tag: '', url: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const created = await apiPost('/learning-resources/', {
        icon: form.icon || null,
        title: form.title,
        subtitle: form.subtitle || null,
        description: form.description || null,
        tag: form.tag || null,
        url: form.url || null,
      })
      onCreated(created)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save this resource. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center px-margin-mobile">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-lg border border-outline-variant/30">
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Add Learning Resource</h3>
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
              placeholder="e.g. WASSCE Core Maths Prep"
            />
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="subtitle">
                Subtitle
              </label>
              <input
                id="subtitle"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                placeholder="e.g. Course · Self-paced"
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="tag">
                Tag
              </label>
              <input
                id="tag"
                name="tag"
                value={form.tag}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                placeholder="e.g. Popular or New"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="icon">
                Icon
              </label>
              <input
                id="icon"
                name="icon"
                value={form.icon}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                placeholder="e.g. calculate (Material Symbols name)"
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="url">
                Link URL
              </label>
              <input
                id="url"
                name="url"
                type="url"
                value={form.url}
                onChange={handleChange}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-xs">
            <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none"
              placeholder="What this resource covers..."
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

export default function AdminLearningResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    apiGet('/learning-resources/')
      .then((data) => setResources(data.results ?? data))
      .catch(() => setLoadError('Could not load learning resources right now.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreated = (created) => {
    setResources((prev) => [created, ...prev])
    setShowAddModal(false)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await apiDelete(`/learning-resources/${id}/`)
      setResources((prev) => prev.filter((r) => r.id !== id))
    } catch {
      // leave the row in place if deletion fails
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = resources.filter((r) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      r.title.toLowerCase().includes(query) ||
      (r.subtitle ?? '').toLowerCase().includes(query) ||
      (r.tag ?? '').toLowerCase().includes(query)
    )
  })

  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        title="Learning Resources"
        description="Courses and study materials shown on the youth Learning Resources page."
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit"
          >
            <Icon name="add" />
            Add Resource
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
              placeholder="Search by title, subtitle, or tag..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Subtitle</th>
                <th className="px-6 py-4">Tag</th>
                <th className="px-6 py-4">Link</th>
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                    No learning resources yet. Click "Add Resource" to add one.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4 font-label-md text-label-md text-on-surface">{r.title}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{r.subtitle || '—'}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{r.tag || '—'}</td>
                    <td className="px-6 py-4 text-on-surface-variant max-w-xs truncate">
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {r.url}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        className="inline-flex items-center gap-1 text-error font-label-md text-label-md hover:opacity-70 transition-opacity disabled:opacity-50"
                      >
                        {deletingId === r.id ? 'Deleting…' : 'Delete'}
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
        <AddLearningResourceModal onClose={() => setShowAddModal(false)} onCreated={handleCreated} />
      )}
    </DashboardLayout>
  )
}
