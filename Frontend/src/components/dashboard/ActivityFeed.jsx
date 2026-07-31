import Icon from '../ui/Icon'

export default function ActivityFeed({ items, title = 'Recent Activity' }) {
  return (
    <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 shadow-sm h-full">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-md">{title}</h3>
      {items.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant">Nothing to show yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-primary">
                <Icon name={item.icon} className="text-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-label-md text-label-md text-on-surface truncate">{item.title}</p>
                  <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">{item.time}</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
