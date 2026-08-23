import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  addBookToTracker,
  fetchBooks,
  fetchFreeBooks,
  fetchMyBooks,
  removeMyBook,
  updateMyBook,
} from '../services/libraryService'

/**
 * Backs the Reading Tracker: the curated Book catalog (external link +
 * trackable) merged with the free, public-domain FreeBook catalog (in-app
 * read + PDF download), plus the youth's own tracked UserBook records.
 * (The Self Development Library page only shows free books, so it fetches
 * FreeBook directly instead of using this hook.)
 */
export default function useLibraryCatalog() {
  const [books, setBooks] = useState([])
  const [freeBooks, setFreeBooks] = useState([])
  const [myBooks, setMyBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    return Promise.all([fetchBooks(), fetchFreeBooks(), fetchMyBooks()])
      .then(([booksRes, freeRes, myRes]) => {
        setBooks(booksRes.results ?? booksRes)
        setFreeBooks(freeRes.results ?? freeRes)
        setMyBooks(myRes.results ?? myRes)
        setLoadError('')
      })
      .catch(() => setLoadError('Could not load the library right now.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const myBooksByBookId = useMemo(() => {
    const map = new Map()
    myBooks.forEach((ub) => map.set(ub.book.id, ub))
    return map
  }, [myBooks])

  // One combined, taggable list — a "book" keeps its external-link +
  // tracker actions, a "free_book" keeps its in-app read + PDF download.
  const catalog = useMemo(
    () => [
      ...books.map((b) => ({ ...b, kind: 'book' })),
      ...freeBooks.map((b) => ({ ...b, kind: 'free_book' })),
    ],
    [books, freeBooks],
  )

  const categories = useMemo(() => {
    const seen = new Map()
    catalog.forEach((b) => b.category && seen.set(b.category, b.category_display))
    return [...seen.entries()]
  }, [catalog])

  const handleAdd = useCallback(async (book) => {
    const created = await addBookToTracker(book.id, 'want_to_read')
    setMyBooks((prev) => [created, ...prev])
    return created
  }, [])

  const handleStartReading = useCallback(async (book) => {
    const created = await addBookToTracker(book.id, 'currently_reading')
    setMyBooks((prev) => [created, ...prev])
    return created
  }, [])

  const handleUpdate = useCallback(async (userBook, payload) => {
    const updated = await updateMyBook(userBook.id, payload)
    setMyBooks((prev) => prev.map((ub) => (ub.id === updated.id ? updated : ub)))
    return updated
  }, [])

  const handleRemove = useCallback(async (userBook) => {
    await removeMyBook(userBook.id)
    setMyBooks((prev) => prev.filter((ub) => ub.id !== userBook.id))
  }, [])

  return {
    books,
    freeBooks,
    myBooks,
    catalog,
    categories,
    myBooksByBookId,
    loading,
    loadError,
    reload: load,
    handleAdd,
    handleStartReading,
    handleUpdate,
    handleRemove,
  }
}
