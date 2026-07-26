import Icon from '../ui/Icon'

export default function ContentCard({ icon, title, subtitle, description, tag, actionLabel = 'View Details' }) {
  return (
    <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
          <Icon name={icon} />
        </div>
        {tag && (
          <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full shrink-0">
            {tag}
          </span>
        )}
      </div>
      <div>
        <h4 className="font-headline-md text-headline-md text-on-surface mb-1">{title}</h4>
        {subtitle && <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{subtitle}</p>}
        <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
      </div>
      <button
        type="button"
        disabled
        title="Connects to live data once the backend is wired up"
        className="mt-auto self-start font-label-md text-label-md text-primary opacity-60 cursor-not-allowed flex items-center gap-1"
      >
        {actionLabel}
        <Icon name="arrow_forward" className="text-[16px]" />
      </button>
    </div>
  )
}
