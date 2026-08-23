import { useCallback, useEffect, useState } from 'react'
import { fetchMyBooks, removeMyBook, updateMyBook } from '../services/libraryService'

/**
 * A youth's own reading tracker entries — want-to-read/currently-reading/
 * completed, for both curated books (book set) and Self Development Library
 * free books (free_book set instead). Discovering and adding new books
 * happens on the Self Development Library page itself; this hook only
 * manages what's already tracked.
 */
export default function useMyBooks() {
  const [myBooks, setMyBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    return fetchMyBooks()
      .then((res) => {
        setMyBooks(res.results ?? res)
        setLoadError('')
      })
      .catch(() => setLoadError('Could not load your reading tracker right now.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleUpdate = useCallback(async (userBook, payload) => {
    const updated = await updateMyBook(userBook.id, payload)
    setMyBooks((prev) => prev.map((ub) => (ub.id === updated.id ? updated : ub)))
    return updated
  }, [])

  const handleRemove = useCallback(async (userBook) => {
    await removeMyBook(userBook.id)
    setMyBooks((prev) => prev.filter((ub) => ub.id !== userBook.id))
  }, [])

  return { myBooks, loading, loadError, reload: load, handleUpdate, handleRemove }
}
