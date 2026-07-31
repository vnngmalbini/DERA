import { useEffect, useMemo, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'
import StoryCard from '../components/ui/StoryCard'
import { apiGet } from '../services/apiClient'

export default function Stories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [activeFilter, setActiveFilter] = useState('All Stories')

  useEffect(() => {
    apiGet('/stories/')
      .then((data) => setStories(data.results ?? data))
      .catch(() => setLoadError('Could not load stories right now. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  const filters = useMemo(() => {
    const distinct = new Set(stories.map((s) => s.region).filter(Boolean))
    return ['All Stories', ...distinct]
  }, [stories])

  const filtered = useMemo(() => {
    if (activeFilter === 'All Stories') return stories
    return stories.filter((s) => s.region === activeFilter)
  }, [stories, activeFilter])

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        {/* Hero Section */}
        <section className="mb-lg text-center md:text-left">
          <div className="space-y-6 max-w-2xl mx-auto md:mx-0">
            <span className="inline-block px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full font-label-md text-label-md">
              Community Voices
            </span>
            <h2 className="font-display-lg text-display-lg text-primary leading-tight">
              Real Stories, <br />
              Unfiltered Hope.
            </h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl">
              Every Young Person Belongs Here. Discover how young Ghanaians in rural communities are breaking
              barriers and building futures through the DERA ecosystem.
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="mb-md overflow-x-auto">
          <div className="flex items-center gap-3 pb-4 min-w-max">
            <span className="text-on-surface font-semibold mr-4">Filter by:</span>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-full font-label-md transition-all ${
                  activeFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-white border border-outline-variant/30 text-on-surface hover:bg-surface-container'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Stories Bento Grid */}
        {loading ? (
          <p className="text-on-surface-variant font-label-md text-label-md py-12 text-center">Loading…</p>
        ) : loadError ? (
          <p className="text-error font-label-md text-label-md py-12 text-center">{loadError}</p>
        ) : filtered.length === 0 ? (
          <p className="text-on-surface-variant font-label-md text-label-md py-12 text-center">
            No stories to show yet.
          </p>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {filtered.map((story, i) => (
              <StoryCard key={story.id} story={story} featured={i === 0}  />
            ))}
          </section>
        )}

        {/* Inspiration Quote Section */}
        <section className="mt-xl text-center py-16 bg-surface-container/30 rounded-[40px] px-6">
          <Icon name="format_quote" className="text-primary text-5xl opacity-50 mb-6" />
          <p className="font-display-lg text-2xl md:text-3xl text-primary-container font-semibold italic max-w-3xl mx-auto mb-8">
            "Growth is not just about the individual; it's about lifting the entire community as we climb."
          </p>
          <div className="flex flex-col items-center">
            <div className="h-1 w-24 bg-tertiary-fixed-dim rounded-full mb-4" />
            <span className="font-label-md text-on-surface-variant uppercase tracking-widest">
              The DERA Philosophy
            </span>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
