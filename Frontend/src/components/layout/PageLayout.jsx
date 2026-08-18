import Header from './Header'
import MobileBottomNav from './MobileBottomNav'
import Footer from './Footer'
import Fab from './Fab'
import DashboardLayout from './DashboardLayout'
import { useAuth } from '../../context/AuthContext'

/**
 * Shared app chrome for the main product screens.
 * Pass `bare` for chromeless screens (auth, standalone forms) that
 * shouldn't get the header/bottom-nav/footer/fab.
 *
 * Logged-in users get the same role-scoped DashboardLayout sidebar here as
 * on their `/dashboard/*` routes — not a separate "public" sidebar — so the
 * nav never changes shape just because they clicked Home/Forms
 * Marketplace/etc instead of a dashboard link. `ProfileCompletionGate`
 * (see App.jsx) guarantees `user.profileComplete` by the time any non-bare
 * page reaches this branch, so `user.role` always resolves a real
 * dashboard. (CompleteProfile/AccessDenied render their own SideNav
 * directly for the cases where that guarantee doesn't hold.)
 */
export default function PageLayout({
  children,
  bare = false,
  showFab = true,
  showFooter = true,
  mainClassName = '',
}) {
  const { isLoggedIn, user } = useAuth()

  if (bare) {
    return <div className="min-h-screen bg-surface text-on-surface">{children}</div>
  }

  if (isLoggedIn) {
    return (
      <DashboardLayout role={user?.role}>
        <div className={mainClassName}>{children}</div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <Header />
      <main className={`pt-16 pb-24 md:pb-0 ${mainClassName}`}>{children}</main>
      <MobileBottomNav />
      {showFab && <Fab />}
      {showFooter && <Footer />}
    </>
  )
}
