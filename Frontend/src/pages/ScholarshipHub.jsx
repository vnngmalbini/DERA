import { useEffect, useMemo, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'
import { apiGet } from '../services/apiClient'

function formatDeadline(deadline) {
  if (!deadline) return 'No deadline listed'
  return new Date(deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

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
    return scholarships.filter((s) => {
      const matchesSearch =
        !q ||
        s.title?.toLowerCase().includes(q) ||
        s.provider?.toLowerCase().includes(q) ||
        s.eligibility_criteria?.toLowerCase().includes(q)
      const matchesLevel = level === 'All Levels' || s.education_level === level
      return matchesSearch && matchesLevel
    })
  }, [scholarships, search, level])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg md:text-display-lg text-primary max-w-xl leading-tight">
                Empowering Your Journey Through Education
              </h2>
              <p className="text-body-lg text-on-surface-variant max-w-lg">
                Every Young Person Belongs Here. Find scholarships and grants specifically designed for Ghanaian
                students from JHS to Tertiary levels. Your growth starts here.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="mb-12">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
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
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-background">
              Available Scholarships ({filtered.length})
            </h3>
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
              {filtered.map((s) => (
                <article
                  key={s.id}
                  className="bg-white rounded-2xl border border-outline-variant/30 flex flex-col transition-all duration-300 hover:shadow-lg p-6"
                >
                  <div className="mb-4">
                    {s.education_level && (
                      <span className="inline-block bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full font-label-sm text-label-sm mb-2">
                        {s.education_level}
                      </span>
                    )}
                    <h4 className="font-headline-md text-headline-md text-on-background">{s.title}</h4>
                    {s.provider && (
                      <p className="text-label-md text-on-surface-variant mt-1">{s.provider}</p>
                    )}
                  </div>
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-start gap-3">
                      <Icon name="event" className="text-primary text-[20px] mt-0.5" />
                      <p className="text-label-md text-on-surface-variant leading-tight">
                        Deadline: {formatDeadline(s.deadline)}
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
                  {s.source_url ? (
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
              ))}
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
                Thanks for subscribing! Check your inbox for a confirmation.
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
    </PageLayout>
  )
}
