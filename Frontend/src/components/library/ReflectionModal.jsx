import { useState } from 'react'
import Icon from '../ui/Icon'
import StarRating from './StarRating'

export default function ReflectionModal({ userBook, onClose, onSave }) {
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
