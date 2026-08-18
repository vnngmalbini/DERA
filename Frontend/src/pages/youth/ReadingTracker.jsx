import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import Icon from '../../components/ui/Icon'
import FreeBookReaderModal from '../../components/library/FreeBookReaderModal'
import ReflectionModal from '../../components/library/ReflectionModal'
import UnifiedBookCard from '../../components/library/UnifiedBookCard'
import useLibraryCatalog from '../../hooks/useLibraryCatalog'
import { fetchReadingChallenges, fetchReadingStats } from '../../services/libraryService'

const STATUS_FILTERS = [
  ['all', 'All'],
  ['currently_reading', 'Currently Reading'],
  ['want_to_read', 'Want to Read'],
  ['completed', 'Completed'],
  ['favorites', 'Favorites'],
]

function SectionCard({ title, icon, action, children }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-md mb-lg">
      <div className="flex items-center justify-between mb-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
          {icon && <Icon name={icon} className="text-primary" />}
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  )
}

function BadgeChip({ badge }) {
  return (
    <div
      title={badge.description}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-label-sm text-label-sm transition-colors ${
        badge.earned
          ? 'bg-tertiary-container border-transparent text-on-tertiary-container'
          : 'bg-surface-container border-outline-variant/30 text-on-surface-variant/50'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          badge.earned ? 'bg-tertiary text-on-tertiary' : 'bg-outline-variant/20 text-on-surface-variant/40'
        }`}
      >
        <Icon name={badge.icon} className="text-[16px]" filled={badge.earned} />
      </div>
      <div className="min-w-0">
        <p className="font-label-md text-label-md leading-tight">{badge.label}</p>
        {!badge.earned && <p className="text-[11px] leading-tight opacity-80 truncate">{badge.description}</p>}
      </div>
    </div>
  )
}

function ChallengeRow({ challenge }) {
  const pct = Math.min(100, Math.round((challenge.progress.completed / challenge.progress.target) * 100))
  return (
    <div className="py-sm first:pt-0 last:pb-0 border-b border-outline-variant/20 last:border-b-0">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <Icon name={challenge.icon || 'flag'} className="text-primary text-[18px] shrink-0" />
          <p className="font-label-lg text-label-lg text-on-surface truncate">{challenge.title}</p>
        </div>
        <span
          className={`font-label-sm text-label-sm shrink-0 ${
            challenge.progress.is_met ? 'text-tertiary font-semibold' : 'text-on-surface-variant'
          }`}
        >
          {challenge.progress.completed}/{challenge.progress.target}
          {challenge.progress.is_met && ' ✓'}
        </span>
      </div>
      <div className="w-full h-1.5 bg-outline-variant/25 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${challenge.progress.is_met ? 'bg-tertiary' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function ReadingTracker() {
  const {
    catalog,
    myBooks,
    myBooksByBookId,
    categories,
    loading,
    loadError,
    handleAdd,
    handleStartReading,
    handleUpdate,
    handleRemove,
  } = useLibraryCatalog()

  const [stats, setStats] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [view, setView] = useState('library')
  const [statusFilter, setStatusFilter] = useState('all')
  const [reflectionTarget, setReflectionTarget] = useState(null)
  const [readerTarget, setReaderTarget] = useState(null)

  const refreshStats = () => {
    fetchReadingStats().then(setStats)
    fetchReadingChallenges().then((r) => setChallenges(r.results ?? r))
  }

  useEffect(() => {
    refreshStats()
  }, [])

  const catalogBooks = useMemo(() => {
    if (categoryFilter === 'all') return catalog
    return catalog.filter((b) => b.category === categoryFilter)
  }, [catalog, categoryFilter])

  const libraryBooks = useMemo(() => {
    if (statusFilter === 'all') return myBooks
    if (statusFilter === 'favorites') return myBooks.filter((ub) => ub.is_favorite)
    return myBooks.filter((ub) => ub.status === statusFilter)
  }, [myBooks, statusFilter])

  const withRefresh = (fn) => async (...args) => {
    const result = await fn(...args)
    refreshStats()
    return result
  }
  const onAdd = withRefresh(handleAdd)
  const onStartReading = withRefresh(handleStartReading)
  const onUpdate = withRefresh(handleUpdate)
  const onRemove = withRefresh(handleRemove)

  if (loading) {
    return (
      <DashboardLayout role="youth">
        <div className="flex items-center gap-2 text-on-surface-variant py-xl justify-center">
          <Icon name="progress_activity" className="animate-spin" />
          Loading your reading tracker…
        </div>
      </DashboardLayout>
    )
  }

  if (loadError) {
    return (
      <DashboardLayout role="youth">
        <p className="text-error">{loadError}</p>
      </DashboardLayout>
    )
  }

  const earnedBadges = stats?.badges.filter((b) => b.earned) ?? []
  const lockedBadges = stats?.badges.filter((b) => !b.earned) ?? []

  return (
    <DashboardLayout role="youth">
      <DashboardPageHeader
        title="Reading Tracker"
        description="Track what you're reading, reflect on what you finish, and grow your library."
      />

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-lg">
          <DashboardStatCard icon="task_alt" label="Completed" value={stats.books_completed} tone="primary" />
          <DashboardStatCard icon="auto_stories" label="Currently Reading" value={stats.currently_reading} tone="secondary" />
          <DashboardStatCard icon="bookmark" label="Want to Read" value={stats.want_to_read} tone="tertiary" />
          <DashboardStatCard icon="favorite" label="Favorites" value={stats.favorites} tone="error" />
          <DashboardStatCard icon="local_fire_department" label="Week Streak" value={stats.reading_streak_weeks} tone="primary" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats && (
          <SectionCard title="Badges" icon="military_tech">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[...earnedBadges, ...lockedBadges].map((b) => (
                <BadgeChip key={b.key} badge={b} />
              ))}
            </div>
          </SectionCard>
        )}

        {challenges.length > 0 && (
          <SectionCard title="Reading Challenges" icon="flag">
            {challenges.map((c) => (
              <ChallengeRow key={c.id} challenge={c} />
            ))}
          </SectionCard>
        )}
      </div>

      <SectionCard
        title={view === 'library' ? 'My Library' : 'Browse Catalog'}
        icon={view === 'library' ? 'collections_bookmark' : 'storefront'}
        action={
          <div className="flex bg-surface-container rounded-full p-1 shrink-0">
            {[
              ['library', 'My Library'],
              ['browse', 'Browse Catalog'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-colors ${
                  view === key ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        }
      >

        {view === 'library' ? (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-md">
            {STATUS_FILTERS.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-colors ${
                  statusFilter === key
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container text-on-surface-variant hover:bg-secondary-container/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-md">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant hover:bg-secondary-container/20'
              }`}
            >
              All Categories
            </button>
            {categories.map(([value, label]) => (
              <button
                key={value}
                onClick={() => setCategoryFilter(value)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-colors ${
                  categoryFilter === value
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container text-on-surface-variant hover:bg-secondary-container/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {view === 'library' && libraryBooks.length === 0 ? (
          <div className="text-center py-xl">
            <Icon name="auto_stories" className="text-4xl text-on-surface-variant/40 mb-2" />
            <p className="text-on-surface-variant">Nothing here yet.</p>
            <button onClick={() => setView('browse')} className="text-primary font-label-md text-label-md hover:underline mt-1">
              Browse the catalog to add your first book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(view === 'library' ? libraryBooks : catalogBooks).map((item) => {
              const book = view === 'library' ? { ...item.book, kind: 'book' } : item
              const userBook = view === 'library' ? item : myBooksByBookId.get(item.id)
              return (
                <UnifiedBookCard
                  key={`${book.kind}-${book.id}`}
                  book={book}
                  userBook={userBook}
                  onAdd={onAdd}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                  onMarkComplete={setReflectionTarget}
                  onStartReading={onStartReading}
                  onRead={setReaderTarget}
                />
              )
            })}
          </div>
        )}
      </SectionCard>

      {reflectionTarget && (
        <ReflectionModal
          userBook={reflectionTarget}
          onClose={() => setReflectionTarget(null)}
          onSave={(payload) => onUpdate(reflectionTarget, payload)}
        />
      )}

      {readerTarget && <FreeBookReaderModal book={readerTarget} onClose={() => setReaderTarget(null)} />}
    </DashboardLayout>
  )
}
