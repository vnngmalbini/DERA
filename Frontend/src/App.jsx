import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProfileCompletionGate from './components/routing/ProfileCompletionGate'
import RequireRole from './components/routing/RequireRole'
import InstallPrompt from './components/pwa/InstallPrompt'
import OfflineBanner from './components/pwa/OfflineBanner'
import UpdateToast from './components/pwa/UpdateToast'
import DashboardLayout from './components/layout/DashboardLayout'
import PageLayout from './components/layout/PageLayout'
import { DASHBOARD_PAGES } from './config/dashboardRoutes'
import Home from './pages/Home'

// Everything but Home is code-split: most visits only ever touch the
// public site, so the ~30 dashboard/admin pages (and their dependencies)
// shouldn't ship on that first load. Each route's chunk is fetched only
// when a user actually navigates there.
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const ResetPasswordConfirm = lazy(() => import('./pages/ResetPasswordConfirm'))
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'))
const ScholarshipHub = lazy(() => import('./pages/ScholarshipHub'))
const CareerQuiz = lazy(() => import('./pages/CareerQuiz'))
const CareerFieldDetail = lazy(() => import('./pages/CareerFieldDetail'))
const CareerDetail = lazy(() => import('./pages/CareerDetail'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const Stories = lazy(() => import('./pages/Stories'))
const HelpCentre = lazy(() => import('./pages/HelpCentre'))
const FormsMarketplace = lazy(() => import('./pages/FormsMarketplace'))
const Sponsorship = lazy(() => import('./pages/Sponsorship'))
const Donate = lazy(() => import('./pages/Donate'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const PurchaseForm = lazy(() => import('./pages/PurchaseForm'))
const About = lazy(() => import('./pages/About'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const ContactUs = lazy(() => import('./pages/ContactUs'))
const AiChat = lazy(() => import('./pages/AiChat'))
const GrowthLibrarian = lazy(() => import('./pages/GrowthLibrarian'))

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
    </div>
  )
}

// Scoped to the layout's content area, not the whole screen — the
// sidebar/header stay mounted and interactive while a page's own chunk is
// still loading, instead of the entire app vanishing behind a spinner the
// way RouteFallback would.
function PageFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
    </div>
  )
}

// PageLayout (public Header/Footer, or the same DashboardLayout sidebar for
// a logged-in user — see PageLayout.jsx) has to wrap the Suspense boundary,
// not live inside it: every one of these pages is lazy, and PageLayout used
// to be rendered *by* each page component, so its own chunk loading hid the
// chrome behind RouteFallback too. Layout props (`bare`, etc.) differ per
// page, hence the small helper rather than one shared JSX block.
function withPageLayout(Component, layoutProps) {
  return (
    <PageLayout {...layoutProps}>
      <Suspense fallback={<PageFallback />}>
        <Component />
      </Suspense>
    </PageLayout>
  )
}

export default function App() {
  return (
    <ProfileCompletionGate>
      <OfflineBanner />
      <UpdateToast />
      <InstallPrompt />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={withPageLayout(Login, { bare: true })} />
          <Route path="/signup" element={withPageLayout(SignUp, { bare: true })} />
          <Route path="/reset-password/:uid/:token" element={withPageLayout(ResetPasswordConfirm, { bare: true })} />
          <Route path="/complete-profile" element={withPageLayout(CompleteProfile, { bare: true })} />
          <Route path="/scholarships" element={withPageLayout(ScholarshipHub)} />
          <Route path="/career-quiz" element={withPageLayout(CareerQuiz)} />
          <Route path="/career-fields/:careerPathId" element={withPageLayout(CareerFieldDetail)} />
          <Route path="/careers/:careerId" element={withPageLayout(CareerDetail)} />
          <Route path="/courses/:courseId" element={withPageLayout(CourseDetail)} />
          <Route path="/stories" element={withPageLayout(Stories)} />
          <Route path="/help" element={withPageLayout(HelpCentre)} />
          <Route path="/forms" element={withPageLayout(FormsMarketplace)} />
          <Route path="/sponsorship" element={withPageLayout(Sponsorship)} />
          <Route path="/donate" element={withPageLayout(Donate)} />
          <Route path="/search" element={withPageLayout(SearchResults)} />
          <Route path="/purchase" element={withPageLayout(PurchaseForm)} />
          <Route path="/about" element={withPageLayout(About)} />
          <Route path="/how-it-works" element={withPageLayout(HowItWorks)} />
          <Route path="/contact" element={withPageLayout(ContactUs)} />
          <Route path="/ai-chat" element={withPageLayout(AiChat)} />
          <Route path="/growth-librarian" element={withPageLayout(GrowthLibrarian)} />

          {Object.entries(DASHBOARD_PAGES).flatMap(([role, pages]) =>
            Object.entries(pages).map(([path, Component]) => (
              <Route
                key={path}
                path={path}
                element={
                  <RequireRole role={role}>
                    <DashboardLayout role={role}>
                      <Suspense fallback={<PageFallback />}>
                        <Component />
                      </Suspense>
                    </DashboardLayout>
                  </RequireRole>
                }
              />
            )),
          )}
        </Routes>
      </Suspense>
    </ProfileCompletionGate>
  )
}
