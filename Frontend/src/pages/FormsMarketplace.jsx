import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'
import { apiGet } from '../services/apiClient'

function FormCard({ form }) {
  const hasPrice = form.price_ghs !== null && form.price_ghs !== undefined
  const officialUrl = form.institution?.application_url

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-[0px_2px_12px_rgba(13,31,8,0.04)] hover:shadow-[0px_8px_28px_rgba(13,31,8,0.09)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full overflow-hidden">
      <div className="p-md pb-0 flex items-start justify-between gap-3">
        <div className="w-14 h-14 rounded-xl bg-secondary-container flex items-center justify-center shrink-0">
          <Icon name="account_balance" className="text-on-secondary-container text-[26px]" />
        </div>
        {form.institution?.type && (
          <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-label-sm font-semibold capitalize whitespace-nowrap">
            {form.institution.type.replace(/_/g, ' ')}
          </span>
        )}
      </div>

      <div className="flex-grow p-md space-y-1">
        <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug">{form.institution?.name}</h3>
        <p className="text-on-surface-variant text-body-sm">{form.title}</p>
        {form.institution?.region && (
          <p className="text-on-surface-variant/70 text-label-sm flex items-center gap-1 pt-1">
            <Icon name="location_on" className="text-[14px]" />
            {form.institution.region} Region
          </p>
        )}
      </div>

      <div className="px-md pb-md pt-2 mt-auto border-t border-outline-variant/30">
        {hasPrice && (
          <div className="flex items-center justify-between py-3">
            <span className="text-label-sm text-on-surface-variant uppercase tracking-wide font-semibold">
              Application Fee
            </span>
            <span className="text-headline-sm font-bold text-secondary">GHS {Number(form.price_ghs).toFixed(0)}</span>
          </div>
        )}
        <div className="grid grid-cols-1 gap-sm pt-1">
          {officialUrl && (
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-secondary text-on-secondary py-3 rounded-lg font-semibold hover:brightness-105 active:scale-[0.98] transition-all shadow-sm text-center flex items-center justify-center gap-1.5 text-label-lg"
            >
              Apply on Official Site
              <Icon name="open_in_new" className="text-[16px]" />
            </a>
          )}
          <Link
            to={`/sponsorship?form=${form.id}`}
            className="w-full border border-secondary text-secondary py-3 rounded-lg font-semibold hover:bg-secondary/5 active:scale-[0.98] transition-all text-center text-label-lg"
          >
            Apply for Sponsorship
          </Link>
        </div>
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
        <section className="relative rounded-3xl overflow-hidden bg-primary-container text-on-primary min-h-[300px] flex items-center p-md md:p-xl shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-md">
            <div className="inline-flex items-center gap-xs bg-secondary-fixed/20 text-secondary-fixed-dim px-3 py-1 rounded-full border border-secondary-fixed/30">
              <Icon name="verified_user" className="text-[16px]" />
              <span className="text-label-sm uppercase tracking-widest font-bold">Verified Institutions Only</span>
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg leading-tight">
              Apply directly to Ghana&apos;s top institutions.
            </h1>
            <p className="text-body-lg text-on-primary-container opacity-90">
              Every listing links straight to the institution&apos;s own official admissions portal — never a
              third-party form. Need help with the fee? Apply for a sponsorship on any listing.
            </p>
            <div className="flex flex-wrap gap-md pt-base">
              <a
                href="#marketplace"
                className="bg-secondary-fixed text-primary-container px-md py-3 rounded-lg font-bold flex items-center gap-xs hover:shadow-lg transition-shadow"
              >
                Browse Institutions
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
              <p className="text-on-surface-variant font-medium">Real institutions, real official application links.</p>
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
        <section className="bg-surface-container rounded-2xl p-md md:p-lg flex flex-col md:flex-row items-center gap-lg">
          <div className="flex-shrink-0 w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
            <Icon name="volunteer_activism" className="text-[40px]" />
          </div>
          <div className="space-y-sm text-center md:text-left">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Need help covering the fee?</h3>
            <p className="text-body-md text-on-surface-variant max-w-2xl">
              The sponsorship application process is fast and confidential. Once approved, a vetted DERA sponsor
              covers your application fee directly. You only need to focus on your studies and documents.
            </p>
          </div>
          <div className="md:ml-auto shrink-0">
            <Link
              to="/sponsorship"
              className="text-secondary font-bold inline-flex items-center gap-xs hover:underline whitespace-nowrap"
            >
              Learn about Eligibility
              <Icon name="chevron_right" />
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
