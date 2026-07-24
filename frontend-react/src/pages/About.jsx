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
        <div className="absolute inset-0 z-0 bg-black/40">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZbd23NM8XquyxX1vH7zBKLnhEYt4UDWTusUM2DK1aRp9IdO2G6ntUlBrwPc33Z1zX7Rr4Qw44NkAWjjKyltb8scOCmi3Gt_WY-sBFKm7-BCm9UaBsq9Y2sa4ZsEA-XAgwjY68JQckLS28YzZXpn11mtk9uLSgtIUkvjFLwsnPug8F55K7u73dNmY2a-TN5x4YlWdMPghTli599nK0usAZ8njvrDwVEMNXHUpbsu24XSPzaFowA88q')",
            }}
          />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-4xl">
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
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfAc65EkP-RjAlIPA0L68nfMrS_PHgUlRJiRABbOrxJtj18NKiOTZgo_UzuH_QGc_8C7FlJWo5YPFza4nTnaHEDfv2YTkAK1S--Q4Sq1lBfb_7DatrzPfgE-W-OtY263N6zRps7li9FG0ii1z6GTtbReETdfNvDwEiVDeS7olj5cHIy9GZwQv4hbbvfoQCDEoy89B5Ayjq7n_czADm5v2CzSvQRON6ws2ipQ5W2zEFvbauZmnIqhiq')",
                }}
              />
            </div>
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
                <span className="font-body-md">hello@dera.com</span>
              </div>
              <div className="flex items-center gap-md">
                <Icon name="call" className="text-secondary" />
                <span className="font-body-md">+233 (0) 24 000 0000</span>
              </div>
              <div className="flex items-center gap-md">
                <Icon name="location_on" className="text-secondary" />
                <span className="font-body-md">Accra, Ghana</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto relative">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEtQ57v2gS0WXkuXJLhk6Oc0Yu_HTfEeKiz5kYkPVC7wPDSDaFp81oKFT8D1pMGcAR_aBTnFllyY4XR9M8eaNzzYQN_iHbkM8xL7B1Drfe1fojfrtC0g8WZ9b8S3D4FGD1IAn06zPuirnzMixE7RQroO8URZhizEkq8YgmtvXKXd4ZvWQV8q2zw4qa_4o725btLgJKsPUoNqgQDlQ-87d4U3eiKQhIj2rqvLBldGRmwvfB9u4Z6xFj')",
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
