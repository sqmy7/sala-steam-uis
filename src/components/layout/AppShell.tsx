import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  encargado: 'Encargado de sala',
  coordinador: 'Coordinador (solo lectura)',
  viewer: 'Visor',
  estudiante: 'Estudiante',
}

export default function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold text-white">{title}</h1>
            {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/" className="rounded px-3 py-1.5 text-slate-300 hover:bg-slate-800">
              Vista publica
            </Link>
            {user ? (
              <>
                <Link to="/admin" className="rounded px-3 py-1.5 text-slate-300 hover:bg-slate-800">
                  Panel
                </Link>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                  {user.username} - {ROLE_LABEL[user.role] ?? user.role}
                </span>
                <button
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                  className="rounded bg-rose-900/60 px-3 py-1.5 text-rose-200 hover:bg-rose-900"
                >
                  Cerrar sesion
                </button>
              </>
            ) : (
              <Link to="/login" className="rounded bg-emerald-700 px-3 py-1.5 font-medium text-white hover:bg-emerald-600">
                Encargados: iniciar sesion
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}
