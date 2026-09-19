import { useEffect, useMemo, useState } from 'react'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'
import FreeBookReaderModal from '../../components/library/FreeBookReaderModal'
import UnifiedBookCard from '../../components/library/UnifiedBookCard'
import useMyBooks from '../../hooks/useMyBooks'
import { fetchFreeBooks } from '../../services/libraryService'

/**
 * Real, public-domain classics from Project Gutenberg — every book here can
 * be read in full or downloaded right on the platform, no external links.
 * The Reading Tracker's own "Browse Catalog" tab is where curated,
 * externally-linked recommendations still live (they're trackable — see
 * UnifiedBookCard — which is a different job from this page).
 */
export default function SelfDevelopmentLibrary() {
  const { myBooks, handleUpdate, handleRemove } = useMyBooks()

  const [freeBooks, setFreeBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [readerTarget, setReaderTarget] = useState(null)

  useEffect(() => {
    fetchFreeBooks()
      .then((res) => setFreeBooks((res.results ?? res).map((b) => ({ ...b, kind: 'free_book' }))))
      .catch(() => setLoadError('Could not load the library right now.'))
      .finally(() => setLoading(false))
  }, [])

  // Automatic reading progress lives on the youth's UserBook for this free
  // book (see FreeBookViewSet.progress) — keyed here so each card can show
  // its own "page X of Y" bar without every card fetching separately.
  const myBooksByFreeBookId = useMemo(() => {
    const map = new Map()
    myBooks.forEach((ub) => ub.free_book && map.set(ub.free_book.id, ub))
    return map
  }, [myBooks])

  const categories = useMemo(() => {
    const seen = new Map()
    freeBooks.forEach((b) => b.category && seen.set(b.category, b.category_display))
    return [...seen.entries()]
  }, [freeBooks])

  const filteredBooks = useMemo(() => {
    if (categoryFilter === 'all') return freeBooks
    return freeBooks.filter((b) => b.category === categoryFilter)
  }, [freeBooks, categoryFilter])

  return (
    <>
      <DashboardPageHeader
        title="Self Development Library"
        description="Free, public-domain classics — read in full or download for free, right here on the platform."
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-on-surface-variant py-xl">
          <Icon name="progress_activity" className="animate-spin" />
          Loading the library…
        </div>
      ) : loadError ? (
        <p className="text-error">{loadError}</p>
      ) : (
        <>
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

          {filteredBooks.length === 0 ? (
            <p className="text-on-surface-variant text-center py-xl">No books in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <UnifiedBookCard
                  key={`${book.kind}-${book.id}`}
                  book={book}
                  userBook={myBooksByFreeBookId.get(book.id)}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                  onRead={setReaderTarget}
                />
              ))}
            </div>
          )}
        </>
      )}

      {readerTarget && <FreeBookReaderModal book={readerTarget} onClose={() => setReaderTarget(null)} />}
    </>
  )
}
