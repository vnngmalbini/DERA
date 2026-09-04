import DashboardLayout from '../../components/layout/DashboardLayout'
import Icon from '../../components/ui/Icon'

const actions = [
  {
    title: 'Restart with a clear plan',
    text: 'Pick one small goal, like re-enrolling, getting a certificate, or starting a short course.',
    icon: 'check_circle',
  },
  {
    title: 'Find learning alternatives',
    text: 'Explore flexible learning options, accelerated programs, and skills that match your pace and goals.',
    icon: 'menu_book',
  },
  {
    title: 'Ask for guidance early',
    text: 'Meet a counselor or mentor to help you choose the right route and avoid getting stuck.',
    icon: 'support_agent',
  },
]

export default function DropoutReentry() {
  return (
    <DashboardLayout role="youth">
      <div className="space-y-6">
        <section className="rounded-2xl bg-gradient-to-br from-secondary-container/20 via-surface-container-lowest to-primary/10 p-5 md:p-7 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
              <Icon name="school" filled />
            </span>
            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Re-entry support</p>
              <h1 className="font-headline-md text-headline-md text-on-surface">Dropout Re-entry</h1>
            </div>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Returning to learning is possible. This space helps you choose a practical route back into education, work, or training.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {actions.map((item) => (
            <article key={item.title} className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container mb-4">
                <Icon name={item.icon} filled />
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">{item.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">{item.text}</p>
            </article>
          ))}
        </section>
      </div>
    </DashboardLayout>
  )
}
