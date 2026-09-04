import DashboardLayout from '../../components/layout/DashboardLayout'
import Icon from '../../components/ui/Icon'

const supports = [
  {
    title: 'Create a support plan',
    text: 'Map out your school, childcare, and wellbeing needs so you can stay focused without feeling overwhelmed.',
    icon: 'event_note',
  },
  {
    title: 'Build skills that fit your next step',
    text: 'Choose short digital or vocational skills that can lead to flexible income and a brighter career path.',
    icon: 'school',
  },
  {
    title: 'Find safe community support',
    text: 'Connect with mentors, counselors, and peer groups who understand your situation and can guide you.',
    icon: 'groups',
  },
]

export default function TeenMotherSupport() {
  return (
    <DashboardLayout role="youth">
      <div className="space-y-6">
        <section className="rounded-2xl bg-gradient-to-br from-primary/10 via-secondary-container/20 to-surface-container-lowest p-5 md:p-7 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
              <Icon name="pregnant_woman" filled />
            </span>
            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-wider text-primary">Support pathway</p>
              <h1 className="font-headline-md text-headline-md text-on-surface">Teen Mother Support</h1>
            </div>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            You are not behind. This page is designed to help you focus on your next safe, practical step and protect your future.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {supports.map((item) => (
            <article key={item.title} className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container mb-4">
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
