import { createContext, useContext, useEffect, useState } from 'react'
import { apiGet, apiPost, clearTokens, getRefreshToken, setTokens } from '../services/apiClient'

const AuthContext = createContext(null)

function deriveProfileComplete(user) {
  if (!user) return undefined
  switch (user.role) {
    case 'youth':
      return !!(user.youth_profile?.education_level && user.youth_profile?.region)
    case 'counselor':
      return !!user.counselor_profile?.institution
    case 'donor':
      return !!user.donor_profile?.donor_type
    default:
      return true
  }
}

// Flattens the nested role-profile object into the flat camelCase shape
// several existing dashboard pages/forms already read (user.fullName,
// user.educationLevel, etc.) — keeps those pages working against real data
// without requiring them to be rewired in this pass.
function flattenProfile(user) {
  const p = user.youth_profile || user.counselor_profile || user.donor_profile || {}
  return {
    fullName: p.full_name,
    dateOfBirth: p.date_of_birth,
    region: p.region,
    district: p.district,
    educationLevel: p.education_level,
    // `institution` is the display name; `institutionId` is the raw FK,
    // kept around so edit forms can pre-select the right option.
    institution: p.institution_name || '',
    institutionId: p.institution || '',
    gender: p.gender,
    roleTitle: p.role_title,
    organization: p.organization,
    donorType: p.donor_type,
  }
}

function withDerived(user) {
  if (!user) return null
  return { ...user, ...flattenProfile(user), profileComplete: deriveProfileComplete(user) }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      if (!getRefreshToken()) {
        setLoading(false)
        return
      }
      try {
        const me = await apiGet('/auth/me/')
        setUser(withDerived(me))
      } catch {
        clearTokens()
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  async function login(email, password) {
    const tokens = await apiPost('/auth/token/', { email, password })
    setTokens(tokens)
    const me = await apiGet('/auth/me/')
    const derivedUser = withDerived(me)
    setUser(derivedUser)
    return derivedUser
  }

  async function register(payload) {
    const result = await apiPost('/auth/register/', payload)
    return result
  }

  function logout() {
    clearTokens()
    setUser(null)
  }

  async function refreshUser() {
    const me = await apiGet('/auth/me/')
    setUser(withDerived(me))
    return me
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
