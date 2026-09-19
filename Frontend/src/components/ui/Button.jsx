import { Link } from 'react-router-dom'

const VARIANTS = {
  primary:
    'bg-primary text-on-primary shadow-lg hover:shadow-xl active:scale-95',
  outline:
    'border-2 border-outline text-on-surface-variant hover:bg-surface-container active:scale-95',
  white: 'bg-white text-on-surface hover:bg-primary-fixed active:scale-95',
  dark: 'bg-on-tertiary-container text-tertiary-container hover:opacity-90 active:scale-95',
  text: 'text-primary hover:translate-x-2 active:translate-x-1',
}

export default function Button({
  variant = 'primary',
  icon,
  iconPosition = 'right',
  to,
  href,
  className = '',
  children,
  ...props
}) {
  const base =
    variant === 'text'
      ? 'inline-flex items-center gap-2 font-label-md text-label-md transition-transform duration-200 ease-emphasized py-2 -my-2'
      : 'inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full font-label-md text-label-md transition-all duration-200 ease-emphasized'

  const classes = `${base} ${VARIANTS[variant]} ${className}`
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="material-symbols-outlined">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="material-symbols-outlined">{icon}</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button className={classes} {...props}>
      {content}
    </button>
  )
}
