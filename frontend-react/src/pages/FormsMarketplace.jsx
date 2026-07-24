import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'

const CATEGORIES = ['All Categories', 'Universities', 'Nursing Colleges', 'TVET Institutions', 'Training Colleges']

const FORMS = [
  {
    id: 'knust',
    title: 'KNUST Admissions',
    category: 'Universities',
    price: 'GHS 250',
    description: 'Undergraduate and Diploma applications for the 2024/2025 academic session.',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH-2sXbZMd0v60ugCUD0AyfCQFBeCvkIhL32Jnlku47fAaONuv7QTk_bLiN41_hy89Dmd6xg4LeQmd61CCaOnAKHgg6NvVJF8RkSkSTXyzJI53Merx7ViZTIohM8mSlCTV0zmrulVaPWtt2uBmCspV6NRn3ZnoGyeyggwuQxTWZYDDFdwtn7sE_xBgUdSxUnVJbVMSwRR5q0OsGp9EU9L6o6sqZOdSbqooFw4DXhbNIN9DYm-w3bbv',
    alt: 'KNUST logo',
    requirements: ['WASSCE / SSCE Results', 'ID Card (Ghana Card)', 'Birth Certificate'],
  },
  {
    id: 'ug',
    title: 'University of Ghana',
    category: 'Universities',
    price: 'GHS 220',
    description: 'Main campus and city campus undergraduate admission forms.',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArXKHbKpJmYTu2F31YgEWZvQy9-ovK5t0LITvHJi-WYm28XsK_dV5ufrwretnX3TMBmiqkgnIEEzyLk8i7C1nZPUNK8ZDk5kxt2_ToxXrCddXahzxYGGf4Onw_8gHP7qBaWIEo6iaKgRk-QbSvXEF_vQBvDAg0zBfvbw2BmAevUiWlk3gGYBu5D2gK7YWgTS1cFFmNcN6oPx0sGQahE5gu-SNM9MD-EMEJOzMjgkkZqUL-PUXNkp8q',
    alt: 'University of Ghana logo',
    requirements: ['Certified Result Slips', 'Passport Photos (Scan)'],
  },
  {
    id: 'nmtc',
    title: 'Nursing Colleges (NMTC)',
    category: 'Nursing Colleges',
    price: 'GHS 200',
    description: 'National health training portal forms for all public nursing institutions.',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdwBLGLnN31E_pE6SDCltGlWumAszuZaMIlv_AMxGYBTF4QJRYH6gVPbr2ikv8QITUngHlF5J5LJKDegmGfZrInxCghHys2RINq1SP9xPHY_8hZ0QoTHGAh34v_WYrkEUUDedISlVs_fb7VB6H0ikBBSJM-3JR6iR6rNVjicvQmkRusTVXSD4nDjjvK46Rl3Aan04pdzN9fPZWwLSmtA2qKcdKc2mghTTyRUFz3IPoir5dpXhPPJKj',
    alt: 'Nursing college logo',
    requirements: ['Health Certificate', 'Academic Transcript'],
  },
  {
    id: 'tvet',
    title: 'TVET Service Forms',
    category: 'TVET Institutions',
    price: 'GHS 150',
    description: 'Technical and vocational education portal for diploma and certificate courses.',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD6Uz9N2MyVaQqKzEUP5xbhI9x8_3_0jzsFEG2RBs0QJof2G8URH_S5yQKadda_Qc6QQl3aRAqzN9odQq04iZRvhFTqpe5e0eC8RYP_KS6G5_7SchbZnSqCE4aFiiRgORrd0xQj0-W-oZWCw5iN_HmJEADjBPfv4LS_W_ptijklWbBHlX6ODyUw9L0kILeJcbynKTEA3a_X0udbBIcdEqa6a47nQmFbGp6f4lOPnlwmO-exJFDp5AG',
    alt: 'TVET institute logo',
    requirements: ['Proficiency Certificate'],
  },
]

function FormCard({ form }) {
  return (
    <div className="group bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(13,31,8,0.05)] border border-transparent hover:border-secondary-fixed transition-all duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-md">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-high flex items-center justify-center p-2">
          <img className="w-full h-full object-contain" alt={form.alt} src={form.logo} />
        </div>
        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-lg font-bold">
          {form.price}
        </span>
      </div>
      <div className="flex-grow space-y-sm">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">{form.title}</h3>
        <p className="text-on-surface-variant text-body-md line-clamp-2">{form.description}</p>
        <div className="space-y-2 pt-2">
          {form.requirements.map((req) => (
            <div key={req} className="flex items-center gap-xs text-on-surface-variant">
              <Icon name="check_circle" className="text-[18px] text-secondary" />
              <span className="text-label-sm">{req}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-lg grid grid-cols-1 gap-sm">
        <Link
          to="/purchase"
          className="w-full bg-secondary-fixed text-on-secondary-fixed py-3 rounded-lg font-bold hover:brightness-105 transition-all shadow-sm text-center"
        >
          Buy Now
        </Link>
        <Link
          to="/sponsorship"
          className="w-full border-2 border-secondary text-secondary py-3 rounded-lg font-bold hover:bg-secondary/5 transition-all text-center"
        >
          Apply for Sponsorship
        </Link>
      </div>
    </div>
  )
}

export default function FormsMarketplace() {
  const [activeCategory, setActiveCategory] = useState('All Categories')

  const filteredForms =
    activeCategory === 'All Categories' ? FORMS : FORMS.filter((form) => form.category === activeCategory)

  return (
    <PageLayout>
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-xl">
        {/* Hero Section */}
        <section className="relative rounded-xl overflow-hidden bg-primary-container text-on-primary min-h-[340px] flex items-center p-md md:p-xl shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-md">
            <div className="inline-flex items-center gap-xs bg-secondary-fixed/20 text-secondary-fixed-dim px-3 py-1 rounded-full border border-secondary-fixed/30">
              <Icon name="verified_user" className="text-[16px]" />
              <span className="text-label-sm uppercase tracking-widest font-bold">Empowering Futures</span>
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg leading-tight">
              Your gateway to tertiary education starts here.
            </h1>
            <p className="text-body-lg text-on-primary-container opacity-90">
              DERA connects you to official application forms. Can&apos;t afford the fee? We believe financial status
              shouldn&apos;t block your dreams. Apply for a sponsorship directly on any form.
            </p>
            <div className="flex flex-wrap gap-md pt-base">
              <a
                href="#marketplace"
                className="bg-secondary-fixed text-primary-container px-md py-3 rounded-lg font-bold flex items-center gap-xs hover:shadow-lg transition-shadow"
              >
                Explore All Forms
                <Icon name="arrow_downward" />
              </a>
            </div>
          </div>
        </section>

        {/* Filters & Marketplace */}
        <section id="marketplace" className="space-y-lg scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-md">
            <div className="space-y-xs">
              <h2 className="font-headline-sm text-headline-sm text-secondary">Forms Marketplace</h2>
              <p className="text-on-surface-variant font-medium">
                Browse verified institution forms for the 2024 academic year.
              </p>
            </div>
            <div className="flex flex-wrap gap-xs md:justify-end">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full font-label-lg whitespace-nowrap active:scale-95 transition-transform ${
                    activeCategory === category
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary-container/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.length > 0 ? (
              filteredForms.map((form) => <FormCard key={form.id} form={form} />)
            ) : (
              <p className="text-on-surface-variant col-span-full text-center py-8">
                No forms found in this category yet.
              </p>
            )}
          </div>
        </section>

        {/* Information / Trust Banner */}
        <section className="bg-surface-container rounded-xl p-md md:p-lg flex flex-col md:flex-row items-center gap-lg">
          <div className="flex-shrink-0 w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
            <Icon name="volunteer_activism" className="text-[48px]" />
          </div>
          <div className="space-y-sm text-center md:text-left">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Need a Sponsorship?</h3>
            <p className="text-body-md text-on-surface-variant max-w-2xl">
              The sponsorship application process is fast and confidential. Once approved, DERA pays for your form
              directly to the institution. You only need to focus on your studies and providing the right documents.
            </p>
          </div>
          <div className="md:ml-auto">
            <Link to="/sponsorship" className="text-secondary font-bold inline-flex items-center gap-xs hover:underline">
              Learn about Eligibility
              <Icon name="chevron_right" />
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
