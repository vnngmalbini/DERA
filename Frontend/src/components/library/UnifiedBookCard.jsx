import { useState } from 'react'
import Icon from '../ui/Icon'
import StarRating from './StarRating'
import BookReviews from './BookReviews'
import DownloadPdfButton from './DownloadPdfButton'

const STATUS_LABELS = {
  want_to_read: 'Want to Read',
  currently_reading: 'Currently Reading',
  completed: 'Completed',
}

/**
 * One card design for every book in the library, whichever catalog it came
 * from. `book.kind` picks the legally-correct action set:
 *   - 'book'      — curated, copyrighted recommendation: external link +
 *                    full reading-tracker actions (want to read, status,
 *                    favorite, rating, reviews).
 *   - 'free_book' — public-domain classic: read in full right here, plus a
 *                    real PDF download — not trackable, since UserBook has
 *                    no concept of a free-book status.
 * The two share one visual system (accent, badges, layout, button styles)
 * so browsing either the Reading Tracker or the Self Development Library
 * feels like the same product.
 */
export default function UnifiedBookCard({ book, userBook, onAdd, onUpdate, onRemove, onMarkComplete, onStartReading, onRead }) {
  const [showReviews, setShowReviews] = useState(false)
  const [busy, setBusy] = useState(false)
  const isFree = book.kind === 'free_book'

  const run = async (fn) => {
    if (!fn || typeof fn !== 'function') return
    setBusy(true)
    try {
      await fn()
    } finally {
      setBusy(false)
    }
  }

  const handleFavoriteToggle = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!userBook || !onUpdate) return
    run(() => onUpdate(userBook, { is_favorite: !userBook.is_favorite }))
  }

  const handleDelete = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!userBook || !onRemove) return

    const confirmed = window.confirm('Are you sure you want to delete this book from your reading tracker?')
    if (!confirmed) return

    run(() => onRemove(userBook))
  }

  return (
    <article className="group relative bg-surface-container-lowest rounded-2xl border border-outline-variant/25 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200 flex flex-col overflow-hidden h-full">
      <div className={`h-1.5 w-full shrink-0 ${isFree ? 'bg-tertiary' : 'bg-primary'}`} />

      <div className="p-md pb-0 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {book.category_display && (
            <span className="inline-block bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-label-sm text-label-sm">
              {book.category_display}
            </span>
          )}
          {isFree ? (
            <span className="inline-flex items-center gap-1 bg-tertiary-container text-on-tertiary-container px-2.5 py-1 rounded-full font-label-sm text-label-sm">
              <Icon name="public" className="text-[13px]" />
              Free Full Text
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-on-surface-variant/70 px-1 font-label-sm text-label-sm">
              <Icon name="verified" className="text-[13px]" />
              Curated Pick
            </span>
          )}
        </div>
        {userBook && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleFavoriteToggle}
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
              type="button"
              onClick={handleDelete}
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

        {!isFree && (
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
        )}

        {(isFree ? book.description : book.why_recommended) && (
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-2 line-clamp-2">
            {isFree ? book.description : book.why_recommended}
          </p>
        )}

        {isFree && userBook?.total_pages > 0 && (
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1 font-label-sm text-label-sm text-on-surface-variant">
              <span>
                Page {userBook.current_page} of {userBook.total_pages}
              </span>
              <span>{userBook.progress_percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-outline-variant/25 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  userBook.status === 'completed' ? 'bg-tertiary' : 'bg-primary'
                }`}
                style={{ width: `${userBook.progress_percent}%` }}
              />
            </div>
          </div>
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

        <div className="mt-auto space-y-2 pt-2">
          {isFree ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRead(book)}
                className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-2.5 rounded-full flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Icon name="menu_book" className="text-[16px]" />
                Read
              </button>
              <DownloadPdfButton
                book={book}
                className="flex-1 px-3 py-2.5 rounded-full flex items-center justify-center gap-1.5 border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container transition-colors disabled:opacity-60"
              />
            </div>
          ) : userBook ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container">
                  {STATUS_LABELS[userBook.status]}
                </span>
                {userBook.status === 'want_to_read' && (
                  <button
                    onClick={() =>
                      run(async () => {
                        await onUpdate(userBook, { status: 'currently_reading' })
                        if (book.external_link) window.location.href = book.external_link
                      })
                    }
                    disabled={busy}
                    className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-full active:scale-95 transition-transform disabled:opacity-60 inline-flex items-center gap-1"
                  >
                    Start Reading
                    <Icon name="arrow_forward" className="text-[14px]" />
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
              <DownloadPdfButton
                book={book}
                className="w-full px-3 py-2.5 rounded-full flex items-center justify-center gap-1.5 border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container transition-colors disabled:opacity-60"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {book.external_link && (
                  <button
                    onClick={() =>
                      run(async () => {
                        await onStartReading(book)
                        window.location.href = book.external_link
                      })
                    }
                    disabled={busy}
                    className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-2.5 rounded-full flex items-center justify-center gap-1.5 active:scale-95 transition-transform disabled:opacity-60"
                  >
                    Start Reading
                    <Icon name="arrow_forward" className="text-[14px]" />
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
              <DownloadPdfButton
                book={book}
                className="w-full px-3 py-2.5 rounded-full flex items-center justify-center gap-1.5 border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container transition-colors disabled:opacity-60"
              />
            </div>
          )}

          {!isFree && (
            <button
              onClick={() => setShowReviews((v) => !v)}
              className="w-full text-center font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <Icon name={showReviews ? 'expand_less' : 'expand_more'} className="text-[16px]" />
              {showReviews ? 'Hide reviews' : 'Reviews'}
            </button>
          )}
          {!isFree && showReviews && <BookReviews bookId={book.id} />}
        </div>
      </div>
    </article>
  )
}
