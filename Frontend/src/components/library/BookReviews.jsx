import { useEffect, useState } from 'react'
import { fetchBookReviews } from '../../services/libraryService'
import StarRating from './StarRating'

export default function BookReviews({ bookId }) {
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
