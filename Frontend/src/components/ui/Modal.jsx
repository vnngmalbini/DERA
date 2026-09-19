import { useEffect } from 'react'
import Icon from './Icon'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-margin-mobile animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-surface-container-lowest rounded-xl shadow-xl max-w-md w-full p-md md:p-lg max-h-[85vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-md">
          {title && <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 -m-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
