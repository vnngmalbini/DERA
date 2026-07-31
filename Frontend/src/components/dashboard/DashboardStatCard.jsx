import Icon from '../ui/Icon'

const TONES = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
  error: 'bg-error-container text-on-error-container',
}

export default function DashboardStatCard({ icon, value, label, tone = 'primary' }) {
  return (
    <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-3">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${TONES[tone] ?? TONES.primary}`}>
        <Icon name={icon} />
      </div>
      <div>
        <p className="font-headline-md text-headline-md text-on-surface">{value}</p>
        <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
      </div>
    </div>
  )
}
