export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options = [],
}) {
  const inputClasses = `w-full px-md py-sm rounded-lg border bg-surface focus:outline-none focus:ring-2 transition-all font-body-md text-body-md ${
    error
      ? 'border-error focus:ring-error/20 focus:border-error'
      : 'border-outline-variant focus:ring-secondary-container focus:border-secondary'
  }`

  return (
    <div className="space-y-xs">
      <label className="block font-label-lg text-label-lg text-on-surface" htmlFor={id}>
        {label} {required && <span className="text-error">*</span>}
      </label>

      {type === 'select' ? (
        <select id={id} value={value} onChange={onChange} className={inputClasses}>
          <option value="" disabled>
            Select {label.toLowerCase()}
          </option>
          {options.map((opt) => {
            const isObject = typeof opt === 'object' && opt !== null
            const optValue = isObject ? opt.value : opt
            const optLabel = isObject ? opt.label : opt
            return (
              <option key={optValue} value={optValue} disabled={isObject && Boolean(opt.disabled)}>
                {optLabel}
              </option>
            )
          })}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}

      {error && <p className="font-label-sm text-label-sm text-error">{error}</p>}
    </div>
  )
}
