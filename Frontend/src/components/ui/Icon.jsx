export default function Icon({ name, className = '', filled = false, style, ...props }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1", ...style } : style}
      {...props}
    >
      {name}
    </span>
  )
}
