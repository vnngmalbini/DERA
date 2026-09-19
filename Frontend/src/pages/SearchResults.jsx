import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { search } from '../services/searchService'

const SECTIONS = [
  { key: 'career_paths', label: 'Career Paths', icon: 'psychology' },
  { key: 'scholarships', label: 'Scholarships', icon: 'school' },
  { key: 'stories', label: 'Real Stories', icon: 'auto_stories' },
  { key: 'forms', label: 'Forms', icon: 'assignment' },
  { key: 'mentors', label: 'Mentors', icon: 'diversity_3' },
  { key: 'learning_resources', label: 'Learning Resources', icon: 'auto_stories' },
]

const EMPTY_RESULTS = {
  career_paths: [],
  scholarships: [],
  stories: [],
  forms: [],
  mentors: [],
  learning_resources: [],
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [input, setInput] = useState(initialQuery)
  const [results, setResults] = useState(EMPTY_RESULTS)
  const [loading, setLoading] = useState(!!initialQuery)
  const [loadError, setLoadError] = useState('')

  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (!query.trim()) {
      setResults(EMPTY_RESULTS)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setLoadError('')
    search(query)
      .then((data) => {
        if (!cancelled) setResults(data)
      })
      .catch(() => {
        if (!cancelled) setLoadError('Could not search right now. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [query])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = input.trim()
    setSearchParams(trimmed ? { q: trimmed } : {})
  }

  const totalResults = Object.values(results).reduce((sum, list) => sum + list.length, 0)

  return (
    <>
      <div className="px-margin-mobile md:px-margin-desktop max-w-[900px] mx-auto py-lg">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-sm">
          Search DERA
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-md">
          Find scholarships, career paths, stories, forms, mentors, and learning resources.
        </p>

        <form onSubmit={handleSubmit} className="relative mb-xl">
          <Icon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl"
          />
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search anything on DERA..."
            className="w-full bg-surface-container-low border-none rounded-full pl-12 pr-4 py-4 focus:ring-2 focus:ring-secondary-fixed transition-all text-on-surface"
          />
        </form>

        {!query.trim() ? (
          <p className="text-on-surface-variant text-center py-xl">Type something above to start searching.</p>
        ) : loading ? (
          <p className="text-on-surface-variant text-center py-xl">Searching…</p>
        ) : loadError ? (
          <p className="text-error text-center py-xl">{loadError}</p>
        ) : totalResults === 0 ? (
          <p className="text-on-surface-variant text-center py-xl">
            No results for &quot;{query}&quot;. Try a different search term.
          </p>
        ) : (
          <div className="space-y-lg">
            {SECTIONS.map((section) => {
              const items = results[section.key] || []
              if (items.length === 0) return null
              return (
                <div key={section.key}>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm flex items-center gap-2">
                    <Icon name={section.icon} className="text-secondary" />
                    {section.label}
                  </h2>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <Link
                        key={`${section.key}-${item.id}`}
                        to={item.url}
                        className="block bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-md hover:bg-surface-container transition-colors"
                      >
                        <p className="font-label-lg text-label-lg text-on-surface">{item.title}</p>
                        {item.subtitle && (
                          <p className="text-label-sm text-on-surface-variant">{item.subtitle}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
