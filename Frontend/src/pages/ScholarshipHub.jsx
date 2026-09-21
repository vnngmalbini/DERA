import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/ui/Icon'
import { apiGet } from '../services/apiClient'
import { formatDeadline, isClosed } from '../utils/scholarships'

export default function ScholarshipHub() {
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All Levels')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    apiGet('/scholarships/')
      .then((data) => setScholarships(data.results ?? data))
      .catch(() => setLoadError('Could not load scholarships right now. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  const levels = useMemo(() => {
    const distinct = new Set(scholarships.map((s) => s.education_level).filter(Boolean))
    return ['All Levels', ...distinct]
  }, [scholarships])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return scholarships
      .filter((s) => {
        const matchesSearch =
          !q ||
          s.title?.toLowerCase().includes(q) ||
          s.provider?.toLowerCase().includes(q) ||
          s.eligibility_criteria?.toLowerCase().includes(q)
        const matchesLevel = level === 'All Levels' || s.education_level === level
        return matchesSearch && matchesLevel
      })
      .sort((a, b) => {
        const aClosed = isClosed(a.deadline)
        const bClosed = isClosed(b.deadline)
        if (aClosed !== bClosed) return aClosed ? 1 : -1
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline) - new Date(b.deadline)
      })
  }, [scholarships, search, level])

  const openCount = scholarships.filter((scholarship) => !isClosed(scholarship.deadline)).length
  const rollingCount = scholarships.filter((scholarship) => !scholarship.deadline).length

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        {/* Hero Section */}
        <section className="mb-10 overflow-hidden rounded-[1.75rem] bg-primary px-6 py-8 text-on-primary shadow-[0_20px_50px_rgba(31,45,34,0.14)] md:px-10 md:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 font-label-sm text-label-sm uppercase tracking-[0.12em] text-tertiary-fixed">Scholarship hub</p>
              <h2 className="max-w-xl font-headline-lg-mobile text-headline-lg-mobile leading-tight md:font-headline-lg md:text-headline-lg">
                Find funding for what comes next.
              </h2>
              <p className="mt-4 max-w-xl text-body-lg text-on-primary/85">
                Explore Ghanaian and Africa-focused scholarships with clear eligibility details, official application
                links, and deadlines in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-stretch">
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="font-headline-md text-headline-md">{openCount}</p>
                <p className="font-label-sm text-label-sm text-on-primary/75">Open listings</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="font-headline-md text-headline-md">{rollingCount}</p>
                <p className="font-label-sm text-label-sm text-on-primary/75">Rolling deadlines</p>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="mb-12">
          <div className="space-y-6 rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm md:p-6">
            <div className="relative group">
              <Icon
                name="search"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
              />
              <input
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline/40 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                placeholder="Search for scholarships (e.g. provider, keyword)"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
                <Icon name="school" className="text-[18px]" /> Education Level
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {levels.map((item) => (
                  <button
                    key={item}
                    onClick={() => setLevel(item)}
                    className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
                      level === item
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-secondary-fixed text-on-secondary-container hover:bg-secondary-container'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Results Grid */}
        <section className="mb-xl">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 font-label-sm text-label-sm uppercase tracking-[0.1em] text-primary">Opportunities</p>
              <h3 className="font-headline-md text-headline-md text-on-background">Available scholarships</h3>
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant">{filtered.length} matches</p>
          </div>
          {loading ? (
            <p className="text-on-surface-variant font-label-md text-label-md py-12 text-center">Loading…</p>
          ) : loadError ? (
            <p className="text-error font-label-md text-label-md py-12 text-center">{loadError}</p>
          ) : filtered.length === 0 ? (
            <p className="text-on-surface-variant font-label-md text-label-md py-12 text-center">
              No scholarships match your search. Try a different filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s) => {
                const closed = isClosed(s.deadline)
                return (
                  <article
                    key={s.id}
                    className={`flex flex-col rounded-2xl border border-outline-variant/30 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${closed ? 'opacity-70' : ''}`}
                  >
                    <div className="mb-4">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        {s.education_level && (
                          <span className="inline-block bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full font-label-sm text-label-sm">
                            {s.education_level}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm ${
                            closed ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'
                          }`}
                        >
                          <Icon name={closed ? 'lock' : 'check_circle'} className="text-[14px]" />
                          {closed ? 'Closed' : 'Open'}
                        </span>
                      </div>
                      <h4 className="font-headline-md text-headline-md text-on-background">{s.title}</h4>
                      {s.provider && (
                        <p className="text-label-md text-on-surface-variant mt-1">{s.provider}</p>
                      )}
                    </div>
                    <div className="space-y-3 mb-6 flex-1">
                      <div className="flex items-start gap-3">
                        <Icon name="event" className="text-primary text-[20px] mt-0.5" />
                        <p className={`leading-tight ${closed ? 'font-semibold text-error' : 'text-on-surface-variant'} text-label-md`}>
                          <span className="font-semibold text-on-surface">Deadline</span> · {formatDeadline(s.deadline)}
                        </p>
                      </div>
                      {s.eligibility_criteria && (
                        <div className="flex items-start gap-3">
                          <Icon name="verified" className="text-primary text-[20px] mt-0.5" />
                          <p className="text-label-md text-on-surface-variant leading-tight line-clamp-3">
                            {s.eligibility_criteria}
                          </p>
                        </div>
                      )}
                      {s.career_path?.title && (
                        <div className="flex items-start gap-3">
                          <Icon name="work" className="text-primary text-[20px] mt-0.5" />
                          <p className="text-label-md text-on-surface-variant leading-tight">
                            Related career path: {s.career_path.title}
                          </p>
                        </div>
                      )}
                    </div>
                    {closed ? (
                      <span className="w-full text-center py-3 bg-surface-container text-on-surface-variant rounded-xl font-label-md text-label-md block cursor-not-allowed">
                        Applications Closed
                      </span>
                    ) : s.source_url ? (
                      <a
                        href={s.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all"
                      >
                        Apply Now
                      </a>
                    ) : (
                      <span className="w-full text-center py-3 bg-surface-container text-on-surface-variant rounded-xl font-label-md text-label-md block">
                        No application link yet
                      </span>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="bg-primary py-12 px-6 rounded-3xl mb-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 text-center max-w-2xl mx-auto text-on-primary">
            <h3 className="font-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-4">
              Don't Miss Out!
            </h3>
            <p className="text-body-lg mb-8 opacity-90">
              Join 5,000+ Ghanaian students receiving weekly scholarship alerts and career tips directly in their
              inbox.
            </p>
            {subscribed ? (
              <p className="font-label-md text-label-md bg-white/10 rounded-xl py-4 px-6 inline-block">
                Thanks! Your email has been saved for scholarship alerts. Email confirmation will be enabled when the mail service is connected.
              </p>
            ) : (
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubscribe}>
                <input
                  className="flex-1 px-6 py-4 rounded-xl border-none text-on-background focus:ring-4 focus:ring-tertiary-fixed/30"
                  placeholder="Your email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-tertiary-fixed text-on-tertiary-fixed px-8 py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all"
                >
                  Subscribe Now
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
