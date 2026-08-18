import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'

const STEPS = [
  {
    step: 'STEP 01',
    icon: 'search',
    title: 'Discover',
    description:
      'Take our Career Discovery Quiz to find paths that match your strengths and local needs. Uncover opportunities you never knew existed.',
    iconBg: 'bg-secondary-container',
    iconText: 'text-on-secondary-container',
    buttonLabel: 'Take Quiz',
    to: '/career-quiz',
    buttonClassName: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80',
  },
  {
    step: 'STEP 02',
    icon: 'school',
    title: 'Apply',
    description:
      'Access the Scholarship Hub to find and apply for funding for JHS, SHS, or Tertiary education. We bridge the gap between dreams and tuition.',
    iconBg: 'bg-secondary',
    iconText: 'text-on-secondary',
    buttonLabel: 'View Scholarships',
    to: '/scholarships',
    buttonClassName: 'bg-secondary text-on-secondary hover:opacity-90',
  },
  {
    step: 'STEP 03',
    icon: 'record_voice_over',
    title: 'Grow',
    description:
      'Connect with counselors at the Help Centre and read Inspiration Stories from others who have broken barriers. You are never alone in this journey.',
    iconBg: 'bg-secondary-fixed',
    iconText: 'text-on-secondary-fixed',
    buttonLabel: 'Visit Help Centre',
    to: '/help',
    buttonClassName: 'border-2 border-secondary text-secondary hover:bg-secondary/5',
  },
]

function StepCard({ step, icon, title, description, iconBg, iconText, buttonLabel, to, buttonClassName }) {
  return (
    <div className="group bg-surface-container-lowest p-md rounded-lg shadow-[0px_-4px_20px_rgba(13,31,8,0.05)] border border-outline-variant/30 flex flex-col items-start gap-md transition-transform duration-300 hover:-translate-y-1">
      <div
        className={`flex items-center justify-center w-14 h-14 ${iconBg} ${iconText} rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
      >
        <Icon name={icon} className="text-headline-sm" />
      </div>
      <div className="flex flex-col gap-xs">
        <span className="font-label-lg text-label-lg text-secondary font-bold">{step}</span>
        <h2 className="font-headline-sm text-headline-sm text-primary">{title}</h2>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant flex-grow">{description}</p>
      <Link
        to={to}
        className={`w-full text-center py-sm rounded-lg font-label-lg text-label-lg transition-colors active:scale-[0.98] ${buttonClassName}`}
      >
        {buttonLabel}
      </Link>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <PageLayout>
      <div className="pt-xl pb-xl px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
        {/* Hero Section */}
        <section className="mt-lg mb-xl text-center md:text-left grid md:grid-cols-2 gap-lg items-center">
          <div className="flex flex-col gap-sm">
            <span className="text-secondary font-label-lg text-label-lg tracking-widest uppercase">
              The Process
            </span>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary max-w-xl">
              A three-step journey to growth.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mt-sm">
              We empower rural Ghanaian youth with tools, scholarships, and career guidance to lift entire
              communities.
            </p>
          </div>
          <div className="relative h-[300px] md:h-[450px] rounded-xl overflow-hidden shadow-sm">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1758876203819-4cb3eec8e1aa?auto=format&fit=crop&w=1200&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </section>

        {/* Steps Journey */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-lg">
          {STEPS.map((step) => (
            <StepCard key={step.step} {...step} />
          ))}
        </section>

        {/* Bento Grid for Stories and Community */}
        <section className="mt-xl grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-gutter h-auto md:h-[600px]">
          <div className="md:col-span-2 md:row-span-2 bg-primary-container rounded-3xl p-lg relative overflow-hidden flex flex-col justify-end">
            <div className="absolute inset-0 opacity-40">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=1200&q=80')",
                }}
              />
            </div>
            <div className="relative z-10 flex flex-col gap-sm">
              <div className="bg-secondary-fixed w-fit px-sm py-xs rounded-full font-label-sm text-label-sm text-on-secondary-fixed uppercase">
                Success Story
              </div>
              <h3 className="font-headline-md text-headline-md text-on-secondary">
                "DERA changed the trajectory of my village."
              </h3>
              <p className="font-body-md text-body-md text-primary-fixed">
                Read how Kwesi moved from a remote farm to a tech hub in Accra with our SHS scholarship.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 bg-surface-container-high rounded-xl p-md flex flex-col justify-center">
            <div className="flex items-center gap-md">
              <Icon name="volunteer_activism" className="text-[48px] text-secondary" filled />
              <div>
                <h4 className="font-headline-sm text-headline-sm text-primary">Community First</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Formerly DERA, our movement is dedicated to local Ghanaian youth empowerment.
                </p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 bg-secondary-fixed rounded-xl p-md flex flex-col justify-between">
            <Icon name="forum" className="text-[32px] text-on-secondary-fixed" />
            <p className="font-label-lg text-label-lg text-on-secondary-fixed-variant font-bold leading-tight">
              24/7 Anonymous Support Available
            </p>
          </div>
          <div className="md:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-between">
            <Icon name="location_on" className="text-[32px] text-secondary" />
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Location</p>
              <p className="font-label-lg text-label-lg text-primary font-bold">Accra, Ghana</p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
