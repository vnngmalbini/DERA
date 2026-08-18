import Icon from '../ui/Icon'

export default function StarRating({ value, onChange, readOnly, size = 20 }) {
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
