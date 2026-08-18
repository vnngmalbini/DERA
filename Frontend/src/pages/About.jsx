import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'

const PILLARS = [
  {
    icon: 'psychology',
    title: 'Empowerment',
    description:
      'We provide the tools and resources necessary for young people to discover their strengths and take charge of their own professional destinies.',
    variant: 'light',
  },
  {
    icon: 'groups',
    title: 'Community Growth',
    description:
      'Individual success is the engine for collective prosperity. When one young person grows, their entire community rises with them.',
    variant: 'dark',
  },
  {
    icon: 'verified',
    title: 'Integrity & Trust',
    description:
      'Building a reliable bridge to opportunities. Our guidance is rooted in real-world local needs and verified scholarship pathways.',
    variant: 'light',
  },
]

const JOURNEY_STEPS = [
  {
    number: '01',
    title: 'Discover',
    description: 'Take our Career Discovery Quiz to find paths that match your strengths and local needs.',
  },
  {
    number: '02',
    title: 'Apply',
    description: 'Access the Scholarship Hub to find and apply for funding for JHS, SHS, or Tertiary education.',
  },
  {
    number: '03',
    title: 'Grow',
    description:
      'Connect with counselors at the Help Centre and read Inspiration Stories from others who have broken barriers.',
  },
]

function PillarCard({ icon, title, description, variant }) {
  const isDark = variant === 'dark'

  return (
    <div
      className={
        isDark
          ? 'bg-primary-container p-lg rounded-xl shadow-lg flex flex-col gap-md text-white transition-transform duration-300 hover:-translate-y-2'
          : 'bg-surface-container-lowest p-lg rounded-xl shadow-[0px_4px_20px_rgba(13,31,8,0.05)] flex flex-col gap-md transition-transform duration-300 hover:-translate-y-2'
      }
    >
      <div
        className={
          isDark
            ? 'w-12 h-12 bg-secondary rounded-full flex items-center justify-center'
            : 'w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center'
        }
      >
        <Icon name={icon} className={isDark ? 'text-secondary-fixed' : 'text-secondary'} />
      </div>
      <h3 className={isDark ? 'font-headline-sm text-headline-sm' : 'font-headline-sm text-headline-sm text-primary'}>
        {title}
      </h3>
      <p className={isDark ? 'font-body-md text-on-primary-container' : 'font-body-md text-on-surface-variant'}>
        {description}
      </p>
    </div>
  )
}

export default function About() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative w-full h-[618px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1747889268735-31192c2a6df4?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/70 to-black/60" />
        <div className="relative z-20 text-center px-margin-mobile max-w-4xl">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white mb-md drop-shadow-lg">
            DERA - Every Young Person Belongs Here
          </h1>
          <p className="font-body-lg text-white/90 mb-lg max-w-2xl mx-auto drop-shadow-md">
            Empowering the next generation of rural Ghanaian youth through access to knowledge, financial support,
            and meaningful career pathways.
          </p>
          <div className="flex flex-wrap justify-center gap-md">
            <a
              href="#our-story"
              className="bg-secondary-fixed text-on-secondary-fixed font-bold px-lg py-md rounded-lg shadow-lg hover:scale-105 transition-transform inline-block"
            >
              Explore Our Story
            </a>
          </div>
        </div>
      </section>

      {/* Our Story / Movement Section */}
      <section id="our-story" className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
          <div className="order-2 md:order-1">
            <span className="text-secondary font-label-lg uppercase tracking-wider mb-base block">Our Heritage</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-md">
              More Than a Platform; It's a Movement
            </h2>
            <p className="font-body-lg text-on-surface-variant mb-md leading-relaxed">
              DERA is more than a platform; it's a movement. We are dedicated to empowering rural Ghanaian youth with
              tools, scholarships, and career guidance.
            </p>
            <p className="font-body-lg text-on-surface-variant mb-lg leading-relaxed">
              We believe every young person belongs here and that growth lifts the entire community. Our roots are
              deep in the soil of Ghana, and our branches reach for a future where opportunity is not determined by
              geography.
            </p>
            <div className="flex items-center gap-md">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-secondary">10k+</span>
                <span className="font-label-sm text-on-surface-variant">Youth Empowered</span>
              </div>
              <div className="w-[1px] h-12 bg-outline-variant" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-secondary">50+</span>
                <span className="font-label-sm text-on-surface-variant">Rural Communities</span>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative rounded-xl overflow-hidden shadow-xl aspect-square">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1655720348590-c739c860beed?auto=format&fit=crop&w=1200&q=80')",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pb-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-[0px_4px_20px_rgba(13,31,8,0.05)] flex flex-col gap-md">
            <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center">
              <Icon name="flag" className="text-secondary" />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary">Mission</h3>
            <p className="font-body-lg text-on-surface-variant leading-relaxed">
              To transform information into opportunity by equipping young people with the knowledge, guidance,
              resources, and connections they need to discover their potential, access education and career
              opportunities, secure scholarships, and find hope because no dream should die simply because the right
              opportunity was out of reach.
            </p>
          </div>
          <div className="bg-primary-container p-lg rounded-xl shadow-lg flex flex-col gap-md text-white">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="visibility" className="text-secondary-fixed" />
            </div>
            <h3 className="font-headline-sm text-headline-sm">Vision</h3>
            <p className="font-body-lg text-on-primary-container leading-relaxed">
              To create a future where every young person, regardless of their background, location, or
              circumstances, can discover their potential, access the opportunities they need, and confidently build
              a meaningful future.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values - Bento Grid */}
      <section className="bg-surface-container-low py-xl">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-lg">
            <h2 className="font-headline-md text-headline-md text-primary">The DERA Framework</h2>
            <p className="text-on-surface-variant font-body-md max-w-xl mx-auto">
              Our mission is anchored in three core pillars of community-driven progress.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {PILLARS.map((pillar) => (
              <PillarCard key={pillar.title} {...pillar} />
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="text-center mb-lg">
          <h2 className="font-headline-md text-headline-md text-primary">Your Journey to Growth</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {JOURNEY_STEPS.map((step) => (
            <div key={step.number} className="text-center px-md">
              <div className="font-headline-lg text-secondary-container opacity-50 mb-base">{step.number}</div>
              <h4 className="font-headline-sm text-headline-sm mb-base">{step.title}</h4>
              <p className="text-on-surface-variant">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop mb-xl">
        <div className="bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="p-lg md:p-xl md:w-1/2">
            <h2 className="font-headline-md text-headline-md mb-md">Reach Out to the Team</h2>
            <p className="text-on-surface-variant mb-lg">
              Have questions about scholarships or career paths? We're here to help you navigate your journey.
            </p>
            <div className="space-y-md">
              <div className="flex items-center gap-md">
                <Icon name="mail" className="text-secondary" />
                <span className="font-body-md">deravee2602@gmail.com</span>
              </div>
              <div className="flex items-center gap-md">
                <Icon name="call" className="text-secondary" />
                <span className="font-body-md">053 502 2447</span>
              </div>
              <div className="flex items-center gap-md">
                <Icon name="location_on" className="text-secondary" />
                <span className="font-body-md">Kumasi, Ghana</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto relative">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1573164574511-73c773193279?auto=format&fit=crop&w=1200&q=80')",
              }}
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-base rounded-lg shadow-md flex items-center gap-base">
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
              <span className="text-label-sm font-bold">24/7 Live Chat Available</span>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
