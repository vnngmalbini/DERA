import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import Icon from '../../components/ui/Icon'
import {
  addBookToTracker,
  fetchBooks,
  fetchBookReviews,
  fetchMyBooks,
  fetchReadingChallenges,
  fetchReadingStats,
  removeMyBook,
  updateMyBook,
} from '../../services/libraryService'

const STATUS_LABELS = {
  want_to_read: 'Want to Read',
  currently_reading: 'Currently Reading',
  completed: 'Completed',
}

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

function StarRating({ value, onChange, readOnly, size = 20 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer active:scale-90 transition-transform'}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
        >
          <Icon
            name="star"
            filled={value >= n}
            style={{ fontSize: size }}
            className={value >= n ? 'text-tertiary' : 'text-outline-variant'}
          />
        </button>
      ))}
    </div>
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

function ReflectionModal({ userBook, onClose, onSave }) {
  const [rating, setRating] = useState(userBook.rating || 0)
  const [review, setReview] = useState(userBook.review || '')
  const [biggestLesson, setBiggestLesson] = useState(userBook.biggest_lesson || '')
  const [applicationPlan, setApplicationPlan] = useState(userBook.application_plan || '')
  const [habitChange, setHabitChange] = useState(userBook.habit_change || '')
  const [saving, setSaving] = useState(false)

  const fieldClass =
    'w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none'

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({
        status: 'completed',
        rating: rating || null,
        review: review || null,
        biggest_lesson: biggestLesson || null,
        application_plan: applicationPlan || null,
        habit_change: habitChange || null,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center px-margin-mobile py-lg">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-outline-variant/30">
        <div className="flex items-start justify-between gap-4 px-lg pt-lg pb-md sticky top-0 bg-surface-container-lowest border-b border-outline-variant/20">
          <div>
            <p className="font-label-sm text-label-sm text-primary uppercase tracking-wide mb-1">
              AI Reading Coach
            </p>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Finished "{userBook.book.title}"?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-error transition-colors shrink-0 -mt-1"
            aria-label="Close"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="px-lg py-md space-y-md">
          <div>
            <label className="font-label-lg text-label-lg text-on-surface block mb-xs">Your rating</label>
            <StarRating value={rating} onChange={setRating} size={26} />
          </div>

          <div>
            <label className="font-label-lg text-label-lg text-on-surface block mb-xs" htmlFor="review">
              Review <span className="text-on-surface-variant font-normal">(visible to other readers)</span>
            </label>
            <textarea
              id="review"
              rows={2}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className={fieldClass}
              placeholder="Would you recommend this book, and to whom?"
            />
          </div>

          <div className="h-px bg-outline-variant/20" />

          <div>
            <label className="font-label-lg text-label-lg text-on-surface block mb-xs">
              What was your biggest lesson from this book?
            </label>
            <textarea rows={2} value={biggestLesson} onChange={(e) => setBiggestLesson(e.target.value)} className={fieldClass} />
          </div>

          <div>
            <label className="font-label-lg text-label-lg text-on-surface block mb-xs">
              How do you plan to apply what you learned?
            </label>
            <textarea rows={2} value={applicationPlan} onChange={(e) => setApplicationPlan(e.target.value)} className={fieldClass} />
          </div>

          <div>
            <label className="font-label-lg text-label-lg text-on-surface block mb-xs">
              What habit will you change after reading this book?
            </label>
            <textarea rows={2} value={habitChange} onChange={(e) => setHabitChange(e.target.value)} className={fieldClass} />
          </div>
        </div>

        <div className="px-lg pb-lg pt-sm flex gap-sm sticky bottom-0 bg-surface-container-lowest">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-primary text-on-primary font-label-lg text-label-lg font-semibold py-3 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-70"
          >
            {saving ? <Icon name="progress_activity" className="animate-spin" /> : <Icon name="check" />}
            Save & Mark Completed
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="px-lg py-3 rounded-full border border-outline-variant text-on-surface-variant font-label-lg text-label-lg font-semibold hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function BookReviews({ bookId }) {
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    fetchBookReviews(bookId).then(setReviews).catch(() => setReviews([]))
  }, [bookId])

  if (reviews === null) {
    return <p className="font-label-sm text-label-sm text-on-surface-variant py-sm">Loading reviews…</p>
  }
  if (reviews.length === 0) {
    return <p className="font-label-sm text-label-sm text-on-surface-variant py-sm">No reviews from other readers yet.</p>
  }
  return (
    <ul className="space-y-sm pt-sm">
      {reviews.map((r) => (
        <li key={r.id} className="border-t border-outline-variant/15 pt-sm first:border-t-0 first:pt-0">
          <div className="flex items-center gap-2 mb-1">
            <StarRating value={r.rating || 0} readOnly size={14} />
            <span className="font-label-sm text-label-sm text-on-surface-variant">{r.reviewer_first_name}</span>
          </div>
          {r.review && <p className="font-body-sm text-body-sm text-on-surface">{r.review}</p>}
        </li>
      ))}
    </ul>
  )
}

function BookCard({ book, userBook, onAdd, onUpdate, onRemove, onMarkComplete, onStartReading }) {
  const [showReviews, setShowReviews] = useState(false)
  const [busy, setBusy] = useState(false)

  const run = async (fn) => {
    setBusy(true)
    try {
      await fn()
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      <div className="p-md pb-0 flex items-start justify-between gap-2">
        <span className="inline-block bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-label-sm text-label-sm">
          {book.category_display}
        </span>
        {userBook && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => run(() => onUpdate(userBook, { is_favorite: !userBook.is_favorite }))}
              disabled={busy}
              aria-label="Toggle favorite"
              className={`p-1.5 rounded-full transition-colors ${
                userBook.is_favorite
                  ? 'text-error hover:bg-error-container/40'
                  : 'text-on-surface-variant/60 hover:text-error hover:bg-error-container/20'
              }`}
            >
              <Icon name="favorite" filled={userBook.is_favorite} className="text-[18px]" />
            </button>
            <button
              onClick={() => run(() => onRemove(userBook))}
              disabled={busy}
              aria-label="Remove from tracker"
              className="p-1.5 rounded-full text-on-surface-variant/60 hover:text-error hover:bg-error-container/20 transition-colors"
            >
              <Icon name="delete" className="text-[18px]" />
            </button>
          </div>
        )}
      </div>

      <div className="p-md pt-2 flex-1 flex flex-col">
        <h4 className="font-headline-sm text-headline-sm text-on-surface leading-tight">{book.title}</h4>
        <p className="font-label-md text-label-md text-on-surface-variant mt-0.5 mb-2">{book.author}</p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 font-label-sm text-label-sm text-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <Icon name="signal_cellular_alt" className="text-[14px]" /> {book.reading_level_display}
          </span>
          {book.estimated_reading_time && (
            <span className="inline-flex items-center gap-1">
              <Icon name="schedule" className="text-[14px]" /> {book.estimated_reading_time}
            </span>
          )}
        </div>

        {book.why_recommended && (
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-2 line-clamp-2">{book.why_recommended}</p>
        )}

        {book.external_link && (
          <a
            href={book.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary hover:underline mb-3 w-fit"
          >
            View Book <Icon name="open_in_new" className="text-[14px]" />
          </a>
        )}

        {userBook?.status === 'completed' && (
          <div className="flex items-center gap-2 mb-3">
            <StarRating value={userBook.rating || 0} readOnly size={16} />
            <button
              onClick={() => onMarkComplete(userBook)}
              className="font-label-sm text-label-sm text-primary hover:underline"
            >
              Edit reflection
            </button>
          </div>
        )}

        <div className="mt-auto space-y-2">
          {userBook ? (
            <div className="flex items-center justify-between gap-2">
              <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container">
                {STATUS_LABELS[userBook.status]}
              </span>
              {userBook.status === 'want_to_read' && (
                <button
                  onClick={() => {
                    if (book.external_link) window.open(book.external_link, '_blank', 'noopener,noreferrer')
                    run(() => onUpdate(userBook, { status: 'currently_reading' }))
                  }}
                  disabled={busy}
                  className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-full active:scale-95 transition-transform disabled:opacity-60 inline-flex items-center gap-1"
                >
                  Start Reading
                  <Icon name="open_in_new" className="text-[14px]" />
                </button>
              )}
              {userBook.status === 'currently_reading' && (
                <button
                  onClick={() => onMarkComplete(userBook)}
                  className="bg-tertiary text-on-tertiary font-label-md text-label-md px-4 py-2 rounded-full active:scale-95 transition-transform"
                >
                  Mark Completed
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {book.external_link && (
                <button
                  onClick={() => {
                    window.open(book.external_link, '_blank', 'noopener,noreferrer')
                    run(() => onStartReading(book))
                  }}
                  disabled={busy}
                  className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-2.5 rounded-full flex items-center justify-center gap-1.5 active:scale-95 transition-transform disabled:opacity-60"
                >
                  Start Reading
                  <Icon name="open_in_new" className="text-[14px]" />
                </button>
              )}
              <button
                onClick={() => run(() => onAdd(book))}
                disabled={busy}
                aria-label="Save to Want to Read"
                title="Want to Read"
                className={`${
                  book.external_link ? 'shrink-0 px-3' : 'flex-1 gap-1.5'
                } py-2.5 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container active:scale-95 transition-transform disabled:opacity-60`}
              >
                <Icon name="add" className="text-[18px]" />
                {!book.external_link && 'Want to Read'}
              </button>
            </div>
          )}

          <button
            onClick={() => setShowReviews((v) => !v)}
            className="w-full text-center font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1"
          >
            <Icon name={showReviews ? 'expand_less' : 'expand_more'} className="text-[16px]" />
            {showReviews ? 'Hide reviews' : 'Reviews'}
          </button>
          {showReviews && <BookReviews bookId={book.id} />}
        </div>
      </div>
    </article>
  )
}

export default function ReadingTracker() {
  const [books, setBooks] = useState([])
  const [myBooks, setMyBooks] = useState([])
  const [stats, setStats] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [view, setView] = useState('library')
  const [statusFilter, setStatusFilter] = useState('all')
  const [reflectionTarget, setReflectionTarget] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchBooks(), fetchMyBooks(), fetchReadingStats(), fetchReadingChallenges()])
      .then(([booksRes, myBooksRes, statsRes, challengesRes]) => {
        setBooks(booksRes.results ?? booksRes)
        setMyBooks(myBooksRes.results ?? myBooksRes)
        setStats(statsRes)
        setChallenges(challengesRes.results ?? challengesRes)
      })
      .catch(() => setLoadError('Could not load your reading tracker right now.'))
      .finally(() => setLoading(false))
  }, [])

  const myBooksByBookId = useMemo(() => {
    const map = new Map()
    myBooks.forEach((ub) => map.set(ub.book.id, ub))
    return map
  }, [myBooks])

  const categories = useMemo(() => {
    const seen = new Map()
    books.forEach((b) => seen.set(b.category, b.category_display))
    return [...seen.entries()]
  }, [books])

  const catalogBooks = useMemo(() => {
    if (categoryFilter === 'all') return books
    return books.filter((b) => b.category === categoryFilter)
  }, [books, categoryFilter])

  const libraryBooks = useMemo(() => {
    if (statusFilter === 'all') return myBooks
    if (statusFilter === 'favorites') return myBooks.filter((ub) => ub.is_favorite)
    return myBooks.filter((ub) => ub.status === statusFilter)
  }, [myBooks, statusFilter])

  const refreshStats = () => {
    fetchReadingStats().then(setStats)
    fetchReadingChallenges().then((r) => setChallenges(r.results ?? r))
  }

  const handleAdd = async (book) => {
    const created = await addBookToTracker(book.id, 'want_to_read')
    setMyBooks((prev) => [created, ...prev])
    refreshStats()
  }

  const handleStartReading = async (book) => {
    const created = await addBookToTracker(book.id, 'currently_reading')
    setMyBooks((prev) => [created, ...prev])
    refreshStats()
  }

  const handleUpdate = async (userBook, payload) => {
    const updated = await updateMyBook(userBook.id, payload)
    setMyBooks((prev) => prev.map((ub) => (ub.id === updated.id ? updated : ub)))
    refreshStats()
  }

  const handleRemove = async (userBook) => {
    await removeMyBook(userBook.id)
    setMyBooks((prev) => prev.filter((ub) => ub.id !== userBook.id))
    refreshStats()
  }

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
              const book = view === 'library' ? item.book : item
              const userBook = view === 'library' ? item : myBooksByBookId.get(item.id)
              return (
                <BookCard
                  key={book.id}
                  book={book}
                  userBook={userBook}
                  onAdd={handleAdd}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                  onMarkComplete={setReflectionTarget}
                  onStartReading={handleStartReading}
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
          onSave={(payload) => handleUpdate(reflectionTarget, payload)}
        />
      )}
    </DashboardLayout>
  )
}
