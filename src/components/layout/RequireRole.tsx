import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types/api'

export default function RequireRole({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-slate-400">Cargando sesion...</div>
  }
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
