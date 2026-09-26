import PageLayout from '../components/layout/PageLayout'
import Button from '../components/ui/Button'
import ActionCard from '../components/ui/ActionCard'
import StatCard from '../components/ui/StatCard'
import Icon from '../components/ui/Icon'
import SafeImage from '../components/ui/SafeImage'
import Reveal from '../components/ui/Reveal'
import { imagekitUrl } from '../utils/imagekit'


const QUICK_ACTIONS = [
  { icon: 'school', title: 'Scholarships', description: 'Find local and international funding.', to: '/scholarships' },
  { icon: 'assignment', title: 'Digital Forms', description: 'Access essential government applications.', to: '/forms' },
  { icon: 'auto_stories', title: 'Real Stories', description: 'Hear from youth who made it happen.', to: '/stories' },
  { icon: 'support_agent', title: 'Get Help', description: 'Talk to a career counselor today.', to: '/help' },
]

export default function Home() {
  return (
    <PageLayout forcePublic>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-margin-mobile pb-16 pt-10 md:px-margin-desktop md:pb-24 md:pt-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-[1.02fr_0.98fr] md:gap-14 lg:gap-20">
          <div className="z-10 order-2 md:order-1 md:pt-2">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-container/35 px-3 py-1.5 text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="font-label-sm text-label-sm">A platform built around your next step</span>
            </div>
            <h2 className="max-w-2xl font-display-lg text-display-lg-mobile leading-[1.08] text-on-surface md:text-display-lg">
              Every Young Person <span className="text-primary">Belongs Here.</span>
            </h2>
            <p className="mb-8 mt-6 max-w-xl font-body-lg text-body-lg text-on-surface-variant">
              Empowering rural Ghanaian youth with the tools, scholarships, and career guidance needed to transform
              local communities into global hubs of innovation.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/career-quiz" icon="psychology">
                Take Career Quiz
              </Button>
              <Button variant="outline" to="/about">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative order-1 flex items-center justify-center md:order-2">
            <div className="absolute -right-8 -top-8 -z-10 h-48 w-48 rounded-full bg-tertiary-fixed opacity-40 blur-3xl md:h-72 md:w-72" />
            <div className="relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-[1.75rem] bg-surface-container-high shadow-[0_24px_60px_rgba(31,45,34,0.18)] md:aspect-[5/4]">
              <img
                className="h-full w-full object-cover object-[58%_center]"
                alt="Diverse group of optimistic young Ghanaian students collaborating in a modern, naturally lit agricultural-tech learning hub."
                fetchPriority="high"
                decoding="async"
                sizes="(min-width: 768px) 48vw, 100vw"
                src={imagekitUrl('site/home-hero-1531482615713-2afd69097998.jpg', 'w-1600,q-85')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-md md:left-5 md:top-5">
                <span className="font-label-sm text-label-sm text-on-surface">Learn. Connect. Grow.</span>
              </div>
            </div>
            <div className="absolute -bottom-5 left-4 max-w-[205px] rounded-2xl border border-outline-variant/30 bg-white/95 p-4 shadow-xl backdrop-blur-md md:bottom-5 md:left-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">Active today</span>
              </div>
              <p className="font-headline-md text-headline-md text-on-surface">1,250+</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant leading-tight">
                Students finding their career path today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="bg-inverse-surface py-xl px-margin-mobile md:px-margin-desktop">
        <Reveal className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="font-headline-md text-headline-md text-on-primary-container mb-2">Quick Actions</h3>
            <p className="font-body-md text-body-md text-outline-variant">
              Simple tools for your next move.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard key={action.title} {...action} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Donate CTA */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop">
        <Reveal className="max-w-7xl mx-auto bg-primary-container rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left max-w-xl">
            <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary-container mb-3">
              Help a Young Ghanaian Take Their Next Step
            </h3>
            <p className="font-body-md text-body-md text-on-primary-container/80">
              Your donation covers application fees, scholarships, and mentorship for youth who need it most. Every
              cedi makes a real difference.
            </p>
          </div>
          <Button to="/donate" icon="favorite" className="whitespace-nowrap">
            Donate Now
          </Button>
        </Reveal>
      </section>

      {/* Stories Bento */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <Reveal className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-xl">
              <p className="mb-2 font-label-sm text-label-sm uppercase tracking-[0.12em] text-primary">Community voices</p>
              <h3 className="mb-3 font-display-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
                Real Stories, Real Impact
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                See how DERA is helping students bridge the gap between education and employment across Ghana.
              </p>
            </div>
            <Button variant="text" icon="arrow_forward" to="/stories">
              Explore all stories
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group bg-primary-container flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <SafeImage
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Portrait of Veronica Nakol Ngmalbini, who found her way into tech."
                loading="lazy"
                decoding="async"
                src={imagekitUrl('stories/WhatsApp_Image_2026-07-22_at_21.52.24.jpeg')}
                fallback={<Icon name="auto_stories" className="text-primary text-[120px] opacity-30" />}
              />
              <div className="absolute bottom-0 left-0 z-20 max-w-2xl p-6 md:p-8">
                <span className="mb-4 inline-block rounded-full bg-tertiary-fixed px-3 py-1 font-label-sm text-label-sm text-primary">
                  Technology & Computing Careers
                </span>
                <h4 className="mb-2 font-headline-lg text-white">Veronica Found Her Way Into Tech</h4>
                <p className="mb-5 max-w-lg font-body-md text-white/80">
                  With little experience but a strong desire to learn, Veronica stayed consistent through every
                  challenge and grew her way into a career in tech.
                </p>
                <Button variant="white" to="/stories">Read Veronica's Story</Button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-tertiary-container p-6 text-center md:row-span-2">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-on-tertiary-container text-tertiary-container">
                <Icon name="volunteer_activism" filled className="text-3xl" />
              </div>
              <h4 className="mb-2 font-headline-md text-on-tertiary-container">Community Mentorship</h4>
              <p className="mb-5 max-w-xs font-label-md text-on-tertiary-container/80">
                Connect with 500+ professionals willing to guide your career.
              </p>
              <Button variant="dark" to="/sponsorship">Join as Mentor</Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="py-xl overflow-hidden">
        <Reveal className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar md:grid md:grid-cols-3">
            <StatCard value="500+" label="Scholarships Awarded" tone="primary" />
            <StatCard value="10k+" label="Career Quizzes Taken" tone="primary-fixed" />
            <StatCard value="85%" label="Employment Rate" tone="secondary-fixed" />
          </div>
        </Reveal>
      </section>
    </PageLayout>
  )
}
