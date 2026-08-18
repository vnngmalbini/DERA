import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'
import { apiGet, apiPostForm, apiDelete, ApiError } from '../../services/apiClient'

const GHANA_REGIONS = [
  'Ashanti', 'Bono', 'Bono East', 'Ahafo', 'Central', 'Eastern', 'Greater Accra', 'Northern',
  'North East', 'Savannah', 'Upper East', 'Upper West', 'Volta', 'Oti', 'Western', 'Western North',
]

const CONSENT_STYLES = {
  granted: 'bg-secondary-container text-on-secondary-container',
  pending: 'bg-surface-container-highest text-on-surface-variant',
  revoked: 'bg-error-container text-on-error-container',
}

function AddStoryModal({ careerPaths, onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', speaker_name: '', narrative: '', region: '', career_path_id: '' })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] ?? null
    setPhoto(file)
    setPhotoPreview(file ? URL.createObjectURL(file) : '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const data = new FormData()
      data.append('title', form.title)
      if (form.speaker_name) data.append('speaker_name', form.speaker_name)
      data.append('narrative', form.narrative)
      if (form.region) data.append('region', form.region)
      if (form.career_path_id) data.append('career_path_id', form.career_path_id)
      if (photo) data.append('photo', photo)
      data.append('consent_status', 'granted')

      const created = await apiPostForm('/stories/', data)
      onCreated(created)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save this story. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center px-margin-mobile">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-lg w-full p-lg border border-outline-variant/30">
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Add a Story</h3>
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
              placeholder="e.g. Ama found her path in Agri-Tech"
            />
          </div>

          <div className="space-y-xs">
            <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="speaker_name">
              Speaker's Name
            </label>
            <input
              id="speaker_name"
              name="speaker_name"
              value={form.speaker_name}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
              placeholder="e.g. Ama Boateng"
            />
          </div>

          <div className="space-y-xs">
            <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="narrative">
              Story
            </label>
            <textarea
              id="narrative"
              name="narrative"
              required
              rows={5}
              value={form.narrative}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none"
              placeholder="Tell the story..."
            />
          </div>

          <div className="space-y-xs">
            <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="photo">
              Photo of the storyteller
            </label>
            <div className="flex items-center gap-sm">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  loading="lazy"
                  decoding="async"
                  className="h-16 w-16 rounded-full object-cover border border-outline-variant/40"
                />
              )}
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="flex-1 text-sm text-on-surface-variant file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-secondary-container file:text-on-secondary-container file:font-label-md file:text-label-md file:cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
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

          <div className="pt-sm flex gap-sm">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary text-on-primary font-semibold py-sm rounded-lg flex items-center justify-center gap-xs active:scale-95 transition-transform disabled:opacity-70"
            >
              {submitting ? <Icon name="progress_activity" className="animate-spin" /> : <Icon name="check" />}
              Publish Story
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

export default function ContentManagement() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [careerPaths, setCareerPaths] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    apiGet('/stories/')
      .then((data) => setStories(data.results ?? data))
      .catch(() => setLoadError('Could not load stories right now.'))
      .finally(() => setLoading(false))
    apiGet('/career-paths/')
      .then((data) => setCareerPaths(data.results ?? data))
      .catch(() => setCareerPaths([]))
  }, [])

  const handleStoryCreated = (created) => {
    setStories((prev) => [created, ...prev])
    setShowAddModal(false)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await apiDelete(`/stories/${id}/`)
      setStories((prev) => prev.filter((s) => s.id !== id))
    } catch {
      // leave the row in place if deletion fails
    } finally {
      setDeletingId(null)
    }
  }

  const filteredStories = stories.filter((s) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      s.title.toLowerCase().includes(query) ||
      (s.speaker_name ?? '').toLowerCase().includes(query) ||
      (s.region ?? '').toLowerCase().includes(query)
    )
  })

  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        title="Content Management"
        description="Real stories shown on the public Real Stories page. Only stories added here — verified by an admin — are visible to youth."
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit"
          >
            <Icon name="add" />
            Add Story
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
              placeholder="Search stories by title, speaker, or region..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
              <tr>
                <th className="px-6 py-4">Photo</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Speaker</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Career Path</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant">
                    Loading…
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-error">
                    {loadError}
                  </td>
                </tr>
              ) : filteredStories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant">
                    No stories yet. Click "Add Story" to publish one.
                  </td>
                </tr>
              ) : (
                filteredStories.map((story) => (
                  <tr key={story.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4">
                      {story.photo ? (
                        <img src={story.photo} alt="" loading="lazy" decoding="async" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                          <Icon name="person" className="text-on-surface-variant text-[18px]" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-label-md text-label-md text-on-surface">{story.title}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{story.speaker_name || '—'}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{story.region || '—'}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{story.career_path?.title || '—'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${
                          CONSENT_STYLES[story.consent_status] ?? 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {story.consent_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(story.id)}
                        disabled={deletingId === story.id}
                        className="inline-flex items-center gap-1 text-error font-label-md text-label-md hover:opacity-70 transition-opacity disabled:opacity-50"
                      >
                        {deletingId === story.id ? 'Deleting…' : 'Delete'}
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
        <AddStoryModal
          careerPaths={careerPaths}
          onClose={() => setShowAddModal(false)}
          onCreated={handleStoryCreated}
        />
      )}
    </DashboardLayout>
  )
}
