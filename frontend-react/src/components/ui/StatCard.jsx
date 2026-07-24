const TONES = {
  primary: 'bg-primary text-on-primary',
  'primary-fixed': 'bg-primary-fixed text-on-primary-fixed',
  'secondary-fixed': 'bg-secondary-fixed text-on-secondary-fixed',
}

export default function StatCard({ value, label, tone = 'primary' }) {
  return (
    <div
      className={`min-w-[280px] ${TONES[tone]} p-10 rounded-3xl snap-center text-center flex flex-col items-center`}
    >
      <p className="font-display-lg text-[64px] mb-2">{value}</p>
      <p className="font-headline-md">{label}</p>
    </div>
  )
}
