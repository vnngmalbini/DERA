import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'
import { apiGet } from '../services/apiClient'

function FormCard({ form }) {
  return (
    <div className="group bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(13,31,8,0.05)] border border-transparent hover:border-secondary-fixed transition-all duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-md">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-high flex items-center justify-center p-2">
          <Icon name="school" className="text-secondary text-[32px]" />
        </div>
        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-lg font-bold">
          GHS {Number(form.price_ghs).toFixed(0)}
        </span>
      </div>
      <div className="flex-grow space-y-sm">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">{form.title}</h3>
        <p className="text-on-surface-variant text-body-md">{form.institution?.name}</p>
        {form.institution?.type && (
          <div className="flex items-center gap-xs text-on-surface-variant">
            <Icon name="check_circle" className="text-[18px] text-secondary" />
            <span className="text-label-sm capitalize">{form.institution.type.replace(/_/g, ' ')}</span>
          </div>
        )}
      </div>
      <div className="mt-lg grid grid-cols-1 gap-sm">
        <Link
          to={`/purchase?form=${form.id}`}
          className="w-full bg-secondary-fixed text-on-secondary-fixed py-3 rounded-lg font-bold hover:brightness-105 transition-all shadow-sm text-center"
        >
          Buy Now
        </Link>
        <Link
          to={`/sponsorship?form=${form.id}`}
          className="w-full border-2 border-secondary text-secondary py-3 rounded-lg font-bold hover:bg-secondary/5 transition-all text-center"
        >
          Apply for Sponsorship
        </Link>
      </div>
    </div>
  )
}

export default function FormsMarketplace() {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Institution Types')

  useEffect(() => {
    apiGet('/application-forms/')
      .then((data) => setForms(data.results ?? data))
      .catch(() => setLoadError('Could not load application forms right now. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const distinct = new Set(forms.map((f) => f.institution?.type).filter(Boolean))
    return ['All Institution Types', ...distinct]
  }, [forms])

  const filteredForms =
    activeCategory === 'All Institution Types'
      ? forms
      : forms.filter((form) => form.institution?.type === activeCategory)

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
              <p className="text-on-surface-variant font-medium">Browse verified institution application forms.</p>
            </div>
            <div className="flex flex-wrap gap-xs md:justify-end">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full font-label-lg whitespace-nowrap active:scale-95 transition-transform capitalize ${
                    activeCategory === category
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary-container/50'
                  }`}
                >
                  {category.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-on-surface-variant col-span-full text-center py-8">Loading…</p>
            ) : loadError ? (
              <p className="text-error col-span-full text-center py-8">{loadError}</p>
            ) : filteredForms.length > 0 ? (
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
