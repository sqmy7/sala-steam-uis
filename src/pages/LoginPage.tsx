import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, login, error, loading } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) return <Navigate to="/admin" replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    try {
      await login(username, password)
      navigate('/admin')
    } catch {
      // el error ya queda en el contexto
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <h1 className="text-xl font-semibold text-white">Sala STEAM UIS Barrancabermeja</h1>
        <p className="mt-1 text-sm text-slate-400">Acceso de encargados, coordinacion y administracion.</p>

        <label className="mt-6 block text-sm text-slate-300">
          Usuario
          <input
            className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-emerald-500"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="mt-4 block text-sm text-slate-300">
          Contrasena
          <input
            type="password"
            className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-emerald-500"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="mt-4 text-center text-xs text-slate-500">
          ¿Eres estudiante? No necesitas cuenta: usa la{' '}
          <a href="#/" className="text-emerald-400 hover:underline">
            vista publica de la sala
          </a>
          .
        </p>
      </form>
    </div>
  )
}
