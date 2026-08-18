import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'
import FreeBookReaderModal from '../../components/library/FreeBookReaderModal'
import ReflectionModal from '../../components/library/ReflectionModal'
import UnifiedBookCard from '../../components/library/UnifiedBookCard'
import useLibraryCatalog from '../../hooks/useLibraryCatalog'

/**
 * Browses the exact same combined catalog as the Reading Tracker's Browse
 * Catalog tab (curated recommendations + free public-domain classics), via
 * the same UnifiedBookCard and the same useLibraryCatalog hook — so a book
 * added or started here shows up in "My Library" on the Reading Tracker
 * too, and vice versa. Progress stats, badges, and challenges stay on the
 * Reading Tracker, which this page links out to.
 */
export default function SelfDevelopmentLibrary() {
  const { catalog, myBooksByBookId, categories, loading, loadError, handleAdd, handleStartReading, handleUpdate, handleRemove } =
    useLibraryCatalog()

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [readerTarget, setReaderTarget] = useState(null)
  const [reflectionTarget, setReflectionTarget] = useState(null)

  const filteredBooks = useMemo(() => {
    if (categoryFilter === 'all') return catalog
    return catalog.filter((b) => b.category === categoryFilter)
  }, [catalog, categoryFilter])

  return (
    <DashboardLayout role="youth">
      <DashboardPageHeader
        title="Self Development Library"
        description="Curated growth reads and free, public-domain classics — read in full or download for free right here, or save a pick to your Reading Tracker."
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
                  userBook={myBooksByBookId.get(book.id)}
                  onAdd={handleAdd}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                  onMarkComplete={setReflectionTarget}
                  onStartReading={handleStartReading}
                  onRead={setReaderTarget}
                />
              ))}
            </div>
          )}

          <p className="text-center text-body-sm text-on-surface-variant mt-lg">
            Tracking your progress, badges, and reading streaks?{' '}
            <Link to="/dashboard/youth/reading-tracker" className="text-primary font-label-sm hover:underline">
              Open your Reading Tracker
            </Link>
            .
          </p>
        </>
      )}

      {reflectionTarget && (
        <ReflectionModal
          userBook={reflectionTarget}
          onClose={() => setReflectionTarget(null)}
          onSave={(payload) => handleUpdate(reflectionTarget, payload)}
        />
      )}

      {readerTarget && <FreeBookReaderModal book={readerTarget} onClose={() => setReaderTarget(null)} />}
    </DashboardLayout>
  )
}
