import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const EXEMPT_PATHS = ['/complete-profile', '/login']

/**
 * Blocks navigation to any route until a freshly-registered user finishes
 * their Complete Profile form. `user.profileComplete` is `false` only right
 * after sign-up (see AuthContext); existing logins are unaffected until the
 * real backend starts returning that flag on its own.
 */
export default function ProfileCompletionGate({ children }) {
  const { isLoggedIn, user } = useAuth()
  const location = useLocation()

  const mustCompleteProfile = isLoggedIn && user?.profileComplete === false
  if (mustCompleteProfile && !EXEMPT_PATHS.includes(location.pathname)) {
    return <Navigate to="/complete-profile" replace />
  }

  return children
}
