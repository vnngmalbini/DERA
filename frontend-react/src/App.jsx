import { Routes, Route } from 'react-router-dom'
import ProfileCompletionGate from './components/routing/ProfileCompletionGate'
import RequireRole from './components/routing/RequireRole'
import InstallPrompt from './components/pwa/InstallPrompt'
import OfflineBanner from './components/pwa/OfflineBanner'
import UpdateToast from './components/pwa/UpdateToast'
import { DASHBOARD_PAGES } from './config/dashboardRoutes'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import CompleteProfile from './pages/CompleteProfile'
import ScholarshipHub from './pages/ScholarshipHub'
import CareerQuiz from './pages/CareerQuiz'
import Stories from './pages/Stories'
import HelpCentre from './pages/HelpCentre'
import FormsMarketplace from './pages/FormsMarketplace'
import Sponsorship from './pages/Sponsorship'
import PurchaseForm from './pages/PurchaseForm'
import About from './pages/About'
import HowItWorks from './pages/HowItWorks'
import ContactUs from './pages/ContactUs'
import AiChat from './pages/AiChat'

export default function App() {
  return (
    <ProfileCompletionGate>
      <OfflineBanner />
      <UpdateToast />
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/scholarships" element={<ScholarshipHub />} />
        <Route path="/career-quiz" element={<CareerQuiz />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/help" element={<HelpCentre />} />
        <Route path="/forms" element={<FormsMarketplace />} />
        <Route path="/sponsorship" element={<Sponsorship />} />
        <Route path="/purchase" element={<PurchaseForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/ai-chat" element={<AiChat />} />

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
    </ProfileCompletionGate>
  )
}
