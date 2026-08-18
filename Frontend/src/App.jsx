import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProfileCompletionGate from './components/routing/ProfileCompletionGate'
import RequireRole from './components/routing/RequireRole'
import InstallPrompt from './components/pwa/InstallPrompt'
import OfflineBanner from './components/pwa/OfflineBanner'
import UpdateToast from './components/pwa/UpdateToast'
import { DASHBOARD_PAGES } from './config/dashboardRoutes'
import Home from './pages/Home'

// Everything but Home is code-split: most visits only ever touch the
// public site, so the ~30 dashboard/admin pages (and their dependencies)
// shouldn't ship on that first load. Each route's chunk is fetched only
// when a user actually navigates there.
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
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

export default function App() {
  return (
    <ProfileCompletionGate>
      <OfflineBanner />
      <UpdateToast />
      <InstallPrompt />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/scholarships" element={<ScholarshipHub />} />
          <Route path="/career-quiz" element={<CareerQuiz />} />
          <Route path="/career-fields/:careerPathId" element={<CareerFieldDetail />} />
          <Route path="/careers/:careerId" element={<CareerDetail />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/help" element={<HelpCentre />} />
          <Route path="/forms" element={<FormsMarketplace />} />
          <Route path="/sponsorship" element={<Sponsorship />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/purchase" element={<PurchaseForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/ai-chat" element={<AiChat />} />
          <Route path="/growth-librarian" element={<GrowthLibrarian />} />

          {Object.entries(DASHBOARD_PAGES).flatMap(([role, pages]) =>
            Object.entries(pages).map(([path, Component]) => (
              <Route
                key={path}
                path={path}
                element={
                  <RequireRole role={role}>
                    <Component />
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
