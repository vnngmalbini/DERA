import { useMemo, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'

const LEVEL_FILTERS = ['All Levels', 'JHS', 'SHS', 'Tertiary', 'Post-Grad']
const REGION_FILTERS = ['All Regions', 'Greater Accra', 'Ashanti', 'Northern', 'Western', 'Eastern']

const SCHOLARSHIPS = [
  {
    id: 1,
    title: 'Agro-Growth Excellence Grant',
    category: 'Agriculture',
    levelLabel: 'Tertiary Level',
    levels: ['Tertiary'],
    region: 'Ashanti',
    deadline: '2024-10-15',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCBLniXL-ZVNLIwowEy4sp0kuDQ7iKZhzP1C8_ecrPtN4aIhFaSOIRwKtsXdjSSfQ_jC-hjnXj7-o_YJtXmuPHpJrB8aMA_1dQafaUnvx9ZkuXmk_S600t1PJPYQmUcDA_D0vJV0zCl9jxSJiXsUQyP3U_cV6rQQY-vonVxNyDr30CvWy8oVR-FOvmQRGNSvjkTOArnZrXPQPY90x-5RNo7gLSE6UNCssA5RTTsQ5CowWWcQ_GQ2OkC',
    alt: 'A stylized aerial view of a modern Ghanaian agricultural research station, with neat rows of green crops and sustainable irrigation systems.',
    bullets: [
      { icon: 'verified', text: 'Must be enrolled in an Agriculture-related BSc program' },
      { icon: 'event', text: 'Deadline: Oct 15, 2024' },
      { icon: 'payments', text: 'Up to GHC 12,000 per academic year' },
    ],
  },
  {
    id: 2,
    title: 'Women in Tech Future Fund',
    category: 'STEM',
    levelLabel: 'SHS & Tertiary',
    levels: ['SHS', 'Tertiary'],
    region: 'Greater Accra',
    deadline: '2024-11-30',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAoeGNg1uAqobfLmBFu5d5NMmDLr-DBKikJimcJmxOUAVJ33bW7gh9dzXV7PNWXQ2jQfd80UwdlJrezTD2goEXlB4vXKaXIx-Psu4USx3oC_QV6MFyEZvVI2Iw4QO_25EQACrFTPoqzJO6LEahK4fDf8cOO-hXIOEawjWTxaUrQiO_U1omBNksEOgOsFggcWY_0rcgU924yl0XxAWH_X0nHjsEieyS1y5w0hTysfX06zUSE0OsaBQS-',
    alt: 'A high-tech digital interface overlaying a map of Ghana, with glowing data points and circuit-like patterns.',
    bullets: [
      { icon: 'favorite', filled: true, text: 'Specifically for female students in coding or robotics' },
      { icon: 'event', text: 'Deadline: Nov 30, 2024' },
      { icon: 'location_on', text: 'Available Nationwide' },
    ],
  },
  {
    id: 3,
    title: 'Rural Bright Stars Award',
    category: 'General Education',
    levelLabel: 'JHS Level',
    levels: ['JHS'],
    region: 'Northern',
    deadline: '2024-09-20',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCRSqQP7tgVJ2H--1vLzWjyjt1Zd0b7eXXqQVygaik6DYsKf0NbLsx_eKAOpZxhJb4QNxplCBGSrg6gkByH9YVmHkE4iP_DaeI2Ck1olhNDhcSjvqXTUibccTuey3Ktjs7hvc8tO2qnRJSVGvLaonasncLx8aZdWUM2A7Vbz1rUttGPZR7LIpn4JqjpEgVPBUJr3PPLUT5gF1dvN5CegwpDHds-jts2GtCKCoPeElEcIWAkkOlkb0xF',
    alt: 'A group of young JHS students in their uniforms, reading books in a brightly colored, sunlit library room.',
    bullets: [
      { icon: 'stars', text: 'Top performing students from rural districts' },
      { icon: 'event', text: 'Deadline: Sept 20, 2024' },
      { icon: 'package_2', text: 'Covers tuition, books, and uniform' },
    ],
  },
  {
    id: 4,
    title: 'Healers of Tomorrow Grant',
    category: 'Medicine',
    levelLabel: 'Tertiary Level',
    levels: ['Tertiary'],
    region: 'Western',
    deadline: '2024-12-05',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB8DCzA8quO8w4zE8Y8fg_HFRsEcfksAMqo2IKHZbd3A-pAQBLmaRFEIDlsb_5arNwTV9z41v9dyzqQQIaIuW7_JGy3NpZxAd2TR6u3jA2LFT26xqY9Y4iBVFN4AebNJNzdp3CC_OvpXOyb8g7cMm2Ws87RC_7mriOdPnsmdC_q1ZueNUMyjJ29iLsuikgDL10v1KrMRf9Pr9goipxKaKbsbAXnco3SsbqZNfdKgmEhw4t4wfss7jEF',
    alt: 'A minimalist architectural sketch of a hospital building combined with a heartbeat line.',
    bullets: [
      { icon: 'medical_services', text: 'Medical students in final 2 years of study' },
      { icon: 'event', text: 'Deadline: Dec 05, 2024' },
      { icon: 'attach_money', text: 'Full clinical fee coverage' },
    ],
  },
]

export default function ScholarshipHub() {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All Levels')
  const [region, setRegion] = useState('All Regions')
  const [sort, setSort] = useState('Newest')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = SCHOLARSHIPS.filter((s) => {
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q)
      const matchesLevel = level === 'All Levels' || s.levels.includes(level)
      const matchesRegion = region === 'All Regions' || s.region === region
      return matchesSearch && matchesLevel && matchesRegion
    })
    if (sort === 'Deadline') {
      list = [...list].sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    }
    return list
  }, [search, level, region, sort])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg md:text-display-lg text-primary max-w-xl leading-tight">
                Empowering Your Journey Through Education
              </h2>
              <p className="text-body-lg text-on-surface-variant max-w-lg">
                Every Young Person Belongs Here. Find scholarships and grants specifically designed for Ghanaian
                students from JHS to Tertiary levels. Your growth starts here.
              </p>
            </div>
            <div className="flex-1 relative hidden md:block">
              <div className="absolute -top-4 -left-4 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl z-0" />
              <div className="relative z-10 w-full h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  className="w-full h-full object-cover"
                  alt="A group of diverse Ghanaian students sitting together in a vibrant, outdoor study area at a university campus."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDrtXpT5WlGn0svYCmjuwCwzGRdeKdc_ohwLWeOoUfs6zobs6Kz3yVQ9gnfA7TtpnY1SGHAfw7Q7huZ-_QxdPOFrjFJ9injpjVLj28JzZL1XibEryMY4F0eMAtVtXHaAcCzziL5dAs2gPM596m5HzswNf-zebm5Yb74Mlaf2cc3xbOMFeMo0nWAepNfTX_h4zd19W7PA93fr38687j9haLCmR98M8yF--HAzPktaBkJRQ-lffU0kUw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="mb-12">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
            <div className="relative group">
              <Icon
                name="search"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
              />
              <input
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline/40 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md"
                placeholder="Search for scholarships (e.g. Science, Agriculture, Accra)"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
                  <Icon name="school" className="text-[18px]" /> Education Level
                </span>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {LEVEL_FILTERS.map((item) => (
                    <button
                      key={item}
                      onClick={() => setLevel(item)}
                      className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
                        level === item
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-secondary-fixed text-on-secondary-container hover:bg-secondary-container'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
                  <Icon name="map" className="text-[18px]" /> Region
                </span>
                <select
                  className="w-full py-2.5 px-4 rounded-xl border border-outline/40 focus:ring-2 focus:ring-primary focus:border-primary bg-surface font-label-md text-label-md"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {REGION_FILTERS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Results Grid */}
        <section className="mb-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-background">
              Available Scholarships ({filtered.length})
            </h3>
            <button
              className="flex items-center gap-2 text-primary font-label-md text-label-md hover:underline"
              onClick={() => setSort((s) => (s === 'Newest' ? 'Deadline' : 'Newest'))}
            >
              Sort by: {sort} <Icon name="expand_more" />
            </button>
          </div>
          {filtered.length === 0 ? (
            <p className="text-on-surface-variant font-label-md text-label-md py-12 text-center">
              No scholarships match your search. Try a different filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s) => (
                <article
                  key={s.id}
                  className="bg-white rounded-2xl border border-outline-variant/30 flex flex-col transition-all duration-300 hover:shadow-lg"
                >
                  <div className="h-48 w-full overflow-hidden rounded-t-2xl relative">
                    <img className="w-full h-full object-cover" alt={s.alt} src={s.image} />
                    <div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full font-label-sm text-label-sm">
                      {s.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
                        {s.levelLabel}
                      </span>
                      <h4 className="font-headline-md text-headline-md text-on-background mt-1">{s.title}</h4>
                    </div>
                    <div className="space-y-3 mb-6 flex-1">
                      {s.bullets.map((b, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Icon name={b.icon} className="text-primary text-[20px] mt-0.5" filled={b.filled} />
                          <p className="text-label-md text-on-surface-variant leading-tight">{b.text}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all">
                      Apply Now
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
          {filtered.length > 0 && (
            <div className="mt-12 text-center">
              <button className="px-8 py-3 border-2 border-primary text-primary rounded-xl font-label-md text-label-md hover:bg-primary/5 transition-all">
                Show More Scholarships
              </button>
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="bg-primary py-12 px-6 rounded-3xl mb-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 text-center max-w-2xl mx-auto text-on-primary">
            <h3 className="font-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-4">
              Don't Miss Out!
            </h3>
            <p className="text-body-lg mb-8 opacity-90">
              Join 5,000+ Ghanaian students receiving weekly scholarship alerts and career tips directly in their
              inbox.
            </p>
            {subscribed ? (
              <p className="font-label-md text-label-md bg-white/10 rounded-xl py-4 px-6 inline-block">
                Thanks for subscribing! Check your inbox for a confirmation.
              </p>
            ) : (
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubscribe}>
                <input
                  className="flex-1 px-6 py-4 rounded-xl border-none text-on-background focus:ring-4 focus:ring-tertiary-fixed/30"
                  placeholder="Your email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-tertiary-fixed text-on-tertiary-fixed px-8 py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all"
                >
                  Subscribe Now
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
