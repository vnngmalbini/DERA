import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDashboardMeta } from '../../config/dashboardNav'
import AccessDenied from '../../pages/dashboard/AccessDenied'

/**
 * Gate for a single role's dashboard routes. A signed-in user whose role
 * doesn't match is bounced to their own dashboard (not this one); a role
 * we don't recognize at all falls back to an explicit Access Denied page
 * rather than looping.
 */
export default function RequireRole({ role, children }) {
  const { isLoggedIn, user, loading } = useAuth()

  // Wait for the initial silent session-restore (refresh token -> /auth/me/)
  // to finish before deciding to bounce to /login — otherwise a page reload
  // always looks logged-out for the brief moment before that resolves.
  if (loading) return null
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (user?.role === role) return children

  const ownDashboard = getDashboardMeta(user?.role)
  if (ownDashboard) return <Navigate to={ownDashboard.basePath} replace />

  return <AccessDenied />
}
