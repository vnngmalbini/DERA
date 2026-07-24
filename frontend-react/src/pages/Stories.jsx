import { useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'
import StoryCard from '../components/ui/StoryCard'

const FILTERS = ['All Stories', 'Northern', 'Savannah', 'Upper East', 'Upper West', 'North East']

const STORIES = [
  {
    id: 'amara',
    name: "Amara's Journey to Agri-Tech",
    region: 'Upper East',
    quote: '"I never thought coding could help our village farms until I joined DERA..."',
    alt: 'A portrait of a young Ghanaian woman named Amara, standing confidently in a lush green agricultural field.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjhixd1sTU82Gm76OT5XorZb0sBaonm4ftCWCGuqvA4UaVlikXoeqXtZpmIxlXni5RGk2DIovVYZDZFRMQQwqFCxLP-bJdht_5lH3VUQAZ2KEIgyN2vmQGQthgSiPD_8rPOkMHA9pN9PG4_1tMrqZOhZ2nvu3TLHFynndzKemWVS7eJnF7RyuK3X0UvaCDmG-7rJCj1XzWUtvN6QM_-8fjlcYHj6FGj33MD7RLNm1dH1Y4_YnOKViX',
  },
  {
    id: 'kofi',
    name: 'Kofi Mensah',
    role: 'Solar Engineer',
    region: 'Savannah',
    bio: 'Overcoming power outages in my village was my dream. With the scholarship I received, I built the first community charging station.',
    alt: 'A close-up professional headshot of a smiling young Ghanaian man with short hair.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBlTPeAH35raTKrPXhSzg3FmO6emjaWvcseejwHZEj2XsE_gEMj1wbVmZRGTpjo2Ahu66mYo2o2wYkvpvJQjOf9zPtTkMnGD-9qIJrMxc8fwOkxc6gtxH2zpkF1oOyjMss1oQMJxafX_fm9HJ2qOnC1_1v-mJKS_gKMcfa7qjzbl4n30--W3rtRXLxhUk8UhqO30WYB5rNWqIQLpZuEXbIndBSrD82HtW75XRPWVESyos4nCWilAcg6',
  },
  {
    id: 'fatima',
    name: 'Fatima Zakaria',
    role: 'Software Dev',
    region: 'Northern',
    bio: 'Transitioning from a distant village school to a remote developer role seemed impossible until DERA provided the resources.',
    alt: 'A cheerful portrait of a young woman in a brightly lit indoor space, holding a laptop.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1cQOQW4QfIBkAHORNInxK-Gip2rWQTqGLwyNpgshdb6Ac2pnbFwn1YhX2cehzMwtfYcThf_r7t_b19jnoolFELEjSf56MIThOD6Pha_Cjl0yZApXbwTyovsbxwZQTA5VJJU-iP6T5xco10uJLa7zK0huI1utE1fgl3hFPz9S8ekqIzgekSzdkUG1bI2WzhfXwzRls2cjgVICRAvhKtnc90SCyI9p2xOhe9LC_EpuOzhN0pwUTnHVj',
  },
  {
    id: 'kwesi',
    name: 'Kwesi Boateng',
    role: 'Carpenter',
    region: 'North East',
    bio: "Modern tools changed my craft. DERA's vocational support helped me open my own furniture shop and hire five apprentices.",
    alt: 'Portrait of a determined young man wearing a workshop apron, standing in front of tools.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDswtd1e1DRxQPjJNEwGRnWMjIeUwuP_TcZj9DPH1Y_2Rin_3HSUjJB6StQwCRU-oct9A581iUDbMujqNQswK7n-ng9ljfB99jXkChs2Au_bwB58wPO8WelKi0vsfXC7oPAOChxSKDbICIny1IYtlA5xhcsATLuY7mxtpqCAzkIFGkn0tPJHv9VwIa4lm1zSHKHR5uvMRjKUNpIpbKYWJnJwrGGevt2SHbaWpzEyh0hFBr_QZpXorMV',
  },
]

export default function Stories() {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0])

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        {/* Hero Section */}
        <section className="mb-lg text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full font-label-md text-label-md">
              Community Voices
            </span>
            <h2 className="font-display-lg text-display-lg text-primary leading-tight">
              Real Stories, <br />
              Unfiltered Hope.
            </h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl">
              Every Young Person Belongs Here. Discover how young Ghanaians in rural communities are breaking
              barriers and building futures through the DERA ecosystem.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="h-12 px-8 bg-primary text-white rounded-full font-label-md flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                Share Your Story
                <Icon name="add" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-[40px] -rotate-3 scale-105" />
            <div className="relative aspect-video rounded-[32px] overflow-hidden border-4 border-white shadow-xl">
              <img
                className="w-full h-full object-cover"
                alt="A warm photograph of young Ghanaian students collaborating in a rural but modern learning environment."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvg3J1RMyxxDJB7iLpQG2IU0_u4_4fR7OD9bpSohUA13Neptzx54uS3NQ4gpLJhTcG9fkPwEuAecqUfTrrzcaDVRndYXvTobm2txmIwhGKFWTjplxlR5bYON5FbOTv_Mpu51HFHgNO6hwA3HCJXKcko0TXmpbNeNUVe-zrIcvLo9kTxcT6vqbWSC6qM0kBXyBDdxcRpXmo4K_tGBqcZp-h2Flrs0N0fHWRCZy-NzLKaOFCiBV_Sshu"
              />
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="mb-md overflow-x-auto">
          <div className="flex items-center gap-3 pb-4 min-w-max">
            <span className="text-on-surface font-semibold mr-4">Filter by:</span>
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-full font-label-md transition-all ${
                  activeFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-white border border-outline-variant/30 text-on-surface hover:bg-surface-container'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Stories Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <StoryCard featured story={STORIES[0]} />
          <StoryCard story={STORIES[1]} />
          <StoryCard story={STORIES[2]} />

          {/* Grid Inverted Section (Call to Action) */}
          <article className="md:col-span-8 bg-primary rounded-3xl p-8 flex items-center justify-between text-white overflow-hidden relative">
            <div className="relative z-10 max-w-md space-y-4">
              <h3 className="font-headline-lg text-headline-lg leading-tight">
                Your story can inspire the next generation.
              </h3>
              <p className="text-body-md opacity-90">
                Every success starts with a decision to try. Share your hurdles and how you cleared them.
              </p>
              <button className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform active:scale-95">
                Record My Story
              </button>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-20 transform rotate-12">
              <Icon name="auto_stories" style={{ fontSize: '240px' }} />
            </div>
          </article>

          <StoryCard story={STORIES[3]} />
        </section>

        {/* Inspiration Quote Section */}
        <section className="mt-xl text-center py-16 bg-surface-container/30 rounded-[40px] px-6">
          <Icon name="format_quote" className="text-primary text-5xl opacity-50 mb-6" />
          <p className="font-display-lg text-2xl md:text-3xl text-primary-container font-semibold italic max-w-3xl mx-auto mb-8">
            "Growth is not just about the individual; it's about lifting the entire community as we climb."
          </p>
          <div className="flex flex-col items-center">
            <div className="h-1 w-24 bg-tertiary-fixed-dim rounded-full mb-4" />
            <span className="font-label-md text-on-surface-variant uppercase tracking-widest">
              The DERA Philosophy
            </span>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
