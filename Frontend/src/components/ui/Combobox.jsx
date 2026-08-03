import { useEffect, useRef, useState } from 'react'

/**
 * Type-to-filter select: the user types into a text input and matching
 * options appear below it to click, instead of scrolling a long native
 * <select>. Fires onChange with the same {target:{value}} shape a native
 * select would, so it's a drop-in replacement wherever handleChange(field)
 * expects e.target.value.
 */
export default function Combobox({
  id,
  label,
  required = false,
  value,
  onChange,
  error,
  options = [], // [{ value, label }]
  placeholder = 'Type to search...',
  disabled = false,
}) {
  const selected = options.find((opt) => opt.value === value)
  const [inputText, setInputText] = useState(selected?.label ?? '')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  // Keep the displayed text in sync if the selected value changes from
  // outside (e.g. parent resets it when education level changes), or if the
  // options finish loading after mount (e.g. pre-filling an edit form before
  // the institutions/districts fetch has resolved). Depends on options.length
  // rather than the options array itself, since parent re-renders otherwise
  // recreate that array every time and would re-sync on every keystroke.
  useEffect(() => {
    const match = options.find((opt) => opt.value === value)
    setInputText(match?.label ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options.length])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
        // Revert to the last confirmed selection if the typed text doesn't match anything.
        const match = options.find((opt) => opt.value === value)
        setInputText(match?.label ?? '')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options])

  const filtered =
    inputText.trim() === ''
      ? options
      : options.filter((opt) => opt.label.toLowerCase().includes(inputText.trim().toLowerCase()))

  function selectOption(opt) {
    setInputText(opt.label)
    setIsOpen(false)
    onChange({ target: { value: opt.value } })
  }

  return (
    <div className="space-y-xs relative" ref={containerRef}>
      <label className="block font-label-lg text-label-lg text-on-surface" htmlFor={id}>
        {label} {required && <span className="text-error">*</span>}
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        disabled={disabled}
        value={inputText}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setInputText(e.target.value)
          setIsOpen(true)
          // Typing invalidates the previous confirmed selection until they pick again.
          if (value) onChange({ target: { value: '' } })
        }}
        className={`w-full px-md py-sm rounded-lg border bg-surface focus:outline-none focus:ring-2 transition-all font-body-md text-body-md ${
          error
            ? 'border-error focus:ring-error/20 focus:border-error'
            : 'border-outline-variant focus:ring-secondary-container focus:border-secondary'
        }`}
      />
      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-outline-variant bg-surface shadow-lg">
          {filtered.slice(0, 100).map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(opt)}
                className={`w-full text-left px-md py-2 text-body-md hover:bg-secondary-container/30 ${
                  opt.value === value ? 'bg-secondary-container/40 font-semibold' : ''
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
          {filtered.length > 100 && (
            <li className="px-md py-2 text-label-sm text-on-surface-variant italic">
              Keep typing to narrow down {filtered.length} matches…
            </li>
          )}
        </ul>
      )}
      {isOpen && filtered.length === 0 && (
        <ul className="absolute z-20 mt-1 w-full rounded-lg border border-outline-variant bg-surface shadow-lg">
          <li className="px-md py-2 text-label-sm text-on-surface-variant italic">No matches found.</li>
        </ul>
      )}
      {error && <p className="font-label-sm text-label-sm text-error">{error}</p>}
    </div>
  )
}
