import Header from './Header'
import MobileBottomNav from './MobileBottomNav'
import Footer from './Footer'
import Fab from './Fab'
import SideNav from './SideNav'
import { useAuth } from '../../context/AuthContext'

/**
 * Shared app chrome for the main product screens.
 * Pass `bare` for chromeless screens (auth, standalone forms) that
 * shouldn't get the header/bottom-nav/footer/fab.
 *
 * Logged-in users get the persistent SideNav instead of the public
 * Header/Footer/MobileBottomNav/Fab chrome, on every non-bare page.
 */
export default function PageLayout({
  children,
  bare = false,
  showFab = true,
  showFooter = true,
  mainClassName = '',
}) {
  const { isLoggedIn } = useAuth()

  if (bare) {
    return <div className="min-h-screen bg-surface text-on-surface">{children}</div>
  }

  if (isLoggedIn) {
    return (
      <SideNav>
        <main className={mainClassName}>{children}</main>
      </SideNav>
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
