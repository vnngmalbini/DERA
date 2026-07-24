import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
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
import EarlyWarningDashboard from './pages/admin/EarlyWarningDashboard'
import StudentRoster from './pages/admin/StudentRoster'
import StudentInterventionDetails from './pages/admin/StudentInterventionDetails'
import AnalyticsReports from './pages/admin/AnalyticsReports'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
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
      <Route path="/admin" element={<EarlyWarningDashboard />} />
      <Route path="/admin/roster" element={<StudentRoster />} />
      <Route path="/admin/students/:studentId" element={<StudentInterventionDetails />} />
      <Route path="/admin/reports" element={<AnalyticsReports />} />
    </Routes>
  )
}
