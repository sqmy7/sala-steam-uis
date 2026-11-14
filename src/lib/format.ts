export function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { dateStyle: 'medium' })
}

export function formatDurationSeconds(totalSeconds: number | null): string {
  if (totalSeconds == null) return '—'
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.round((totalSeconds % 3600) / 60)
  if (hours > 0) return `${hours} h ${minutes} min`
  return `${minutes} min`
}

export function elapsedSince(iso: string): string {
  return formatDurationSeconds((Date.now() - new Date(iso).getTime()) / 1000)
}

export const STATUS_LABEL: Record<string, string> = {
  idle: 'Disponible',
  printing: 'Imprimiendo',
  paused: 'Pausada',
  error: 'En mantenimiento',
  offline: 'Sin conexion',
}

export const STATUS_COLOR: Record<string, string> = {
  idle: 'bg-emerald-600',
  printing: 'bg-sky-600',
  paused: 'bg-amber-600',
  error: 'bg-rose-700',
  offline: 'bg-slate-600',
}
