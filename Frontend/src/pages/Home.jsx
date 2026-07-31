import { Navigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Button from '../components/ui/Button'
import ActionCard from '../components/ui/ActionCard'
import StatCard from '../components/ui/StatCard'
import { useAuth } from '../context/AuthContext'
import { getDashboardMeta } from '../config/dashboardNav'

const QUICK_ACTIONS = [
  { icon: 'school', title: 'Scholarships', description: 'Find local and international funding.', to: '/scholarships' },
  { icon: 'assignment', title: 'Digital Forms', description: 'Access essential government applications.', to: '/forms' },
  { icon: 'auto_stories', title: 'Real Stories', description: 'Hear from youth who made it happen.', to: '/stories' },
  { icon: 'support_agent', title: 'Get Help', description: 'Talk to a career counselor today.', to: '/help' },
]

export default function Home() {
  const { isLoggedIn, user } = useAuth()

  if (isLoggedIn && user?.profileComplete !== false) {
    const dashboard = getDashboardMeta(user.role)
    if (dashboard) return <Navigate to={dashboard.basePath} replace />
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative px-margin-mobile md:px-margin-desktop py-xl overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="z-10 order-2 md:order-1">
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface leading-tight mb-6">
              Every Young Person <span className="text-primary">Belongs Here.</span>
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">
              Empowering rural Ghanaian youth with the tools, scholarships, and career guidance needed to transform
              local communities into global hubs of innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button to="/career-quiz" icon="psychology">
                Take Career Quiz
              </Button>
              <Button variant="outline" to="/about">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative order-1 md:order-2 flex justify-center items-center">
            <div className="absolute -z-10 w-72 h-72 bg-tertiary-fixed rounded-full blur-3xl opacity-30 top-0 right-0" />
            <div className="organic-mask w-full max-w-md aspect-square bg-surface-container-high overflow-hidden shadow-2xl">
              <img
                className="w-full h-full object-cover"
                alt="Diverse group of optimistic young Ghanaian students collaborating in a modern, naturally lit agricultural-tech learning hub."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJWrQgne4aXf375EHr_G6SxRzIgF67xCMxc46Y6TQcq-psvggTIc3djdVamapR0vyn5EyORYsGLYYPO1ZK7lYvkv8XeQ2TBI8FPmx-CpGXS5vXsGYq5MXPOPVpFdbRZPsljNDRCbNyOSXmS1Ae6W25Tyq0QKGnWwFPuAFoEbc7KTas_gSoKa901pd3JVnEw26FmktglvMHN1qvQaLeMKnuAKq0rjPj6Tr5g4tu4sYvVH9OGH_pYDD3"
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-outline-variant/30 max-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-primary rounded-full" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">Active Now</span>
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="font-headline-md text-headline-md text-on-primary-container mb-2">Quick Actions</h3>
            <p className="font-body-md text-body-md text-outline-variant">
              Everything you need to jumpstart your journey.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard key={action.title} {...action} />
            ))}
          </div>
        </div>
      </section>

      {/* Stories Bento */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-xl">
              <h3 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
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
            <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <img
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Portrait of a smiling young Ghanaian woman in professional attire at a cocoa processing facility."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa4fQq1_l3PUXOF60qHhrGmxz_KZTinTXlpYfX-xmQBpqFaMZyBQT92Oen_8dutNt6GJhtYqnSpwH2bDewJ-ADu8vd4lz4oeOlTBLbkUU0Rw7pvXVe06j2hKZrt8MCDF6fZ2behHcaG-iEJpzBs1LCNSsQrb-FybLhQD0nQC4ZDZNLSG1mte98SeGMACpQk5dI-nBoPnsqOHRzzEu6Nq0CpY7wWFCNMr3e2sPdh5dGCF3UGjMAKx9x"
              />
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <span className="bg-tertiary-fixed text-primary font-label-sm text-label-sm px-3 py-1 rounded-full mb-4 inline-block">
                  Agri-Tech Pioneer
                </span>
                <h4 className="font-headline-lg text-white mb-2">Amara's Journey from Kumasi to Global Markets</h4>
                <p className="text-white/80 font-body-md max-w-lg mb-4">
                  See how DERA is helping students bridge the gap between education and employment across Ghana.
                </p>
                <Button variant="white" to="/stories">Read Amara's Story</Button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-outline-variant/20 flex flex-col justify-between group cursor-pointer hover:shadow-md transition-all">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt="Headshot of a young student wearing a traditional woven Ghanaian textile accessory."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMurPNfgevwdBk5zYGNm0APk-o_1Dparz3EIU3WAENcMpIaGj9EqnMfs_iV7f1J_KM7IU5bBupiBEM3upisAKDi3Ysvuah_rKtmtwRQULWBDnU2WxwKFHd0Y7fH0r5bjCXVv-Ip7lr67QcY21_-v-ia5OFbTstE02WjBYsOinlQv79UNQXiJkPsBhTpKhabYqWWyTqodyFPJ-r9cl5dkfQJoi1-FB4LJPetlm2qzru-jPIE8lxVOD8"
                    />
                  </div>
                  <span className="font-label-md text-label-md text-on-surface">Kofi Mensah</span>
                </div>
                <p className="italic text-on-surface-variant">
                  "DERA's career quiz pointed me towards sustainable energy. Now I'm interning at a solar firm."
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-outline font-label-sm">2 days ago</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                  trending_flat
                </span>
              </div>
            </div>
            <div className="bg-tertiary-container p-6 rounded-3xl flex flex-col justify-center text-center items-center">
              <div className="w-16 h-16 bg-on-tertiary-container rounded-full flex items-center justify-center mb-4">
                <span
                  className="material-symbols-outlined text-tertiary-container text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  volunteer_activism
                </span>
              </div>
              <h4 className="font-headline-md text-on-tertiary-container mb-2">Community Mentorship</h4>
              <p className="font-label-md text-on-tertiary-container/80 mb-6">
                Connect with 500+ professionals willing to guide your career.
              </p>
              <Button variant="dark" to="/sponsorship">Join as Mentor</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar md:grid md:grid-cols-3">
            <StatCard value="500+" label="Scholarships Awarded" tone="primary" />
            <StatCard value="10k+" label="Career Quizzes Taken" tone="primary-fixed" />
            <StatCard value="85%" label="Employment Rate" tone="secondary-fixed" />
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
