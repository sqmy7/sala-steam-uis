import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { login as loginRequest, me as meRequest } from '../services/auth'
import { setActiveToken, setUnauthorizedHandler } from '../services/apiClient'
import type { UserRead } from '../types/api'

const STORAGE_KEY = 'sala-steam-token'

interface AuthState {
  user: UserRead | null
  token: string | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserRead | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setActiveToken(null)
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    setActiveToken(token)
    meRequest()
      .then(setUser)
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [token, logout])

  const login = useCallback(async (username: string, password: string) => {
    setError(null)
    try {
      const result = await loginRequest(username, password)
      localStorage.setItem(STORAGE_KEY, result.access_token)
      setActiveToken(result.access_token)
      setToken(result.access_token)
      setUser(await meRequest())
    } catch {
      setError('Usuario o contrasena incorrectos.')
      throw new Error('login failed')
    }
  }, [])

  const value = useMemo(() => ({ user, token, loading, error, login, logout }), [user, token, loading, error, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
