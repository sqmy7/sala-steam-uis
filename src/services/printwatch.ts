// Los mismos endpoints autenticados de PrintWatch que usa su propio frontend (DeteccionImpresion3d):
// get_current_user solo exige sesion valida, no un rol especifico, asi que encargado/coordinador
// pueden leerlos igual que admin/viewer. No se tocan pause/resume/cancel ni nada de escritura
// aqui: esta vista es de solo lectura (KPIs, graficos, calendario).
import { api } from './apiClient'
import type { AnalyticsSummary } from '../types/api'

export interface PrinterRead {
  id: number
  name: string
  model: string | null
  last_known_status: 'idle' | 'printing' | 'paused' | 'error' | 'offline'
}

export interface PrintJobRead {
  id: number
  printer_id: number
  file_name: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  started_at: string
  ended_at: string | null
  printed_s: number | null
}

export interface IncidentRead {
  id: number
  print_job_id: number
  printer_id: number
  opened_at: string
  reason: string
  mode: string | null
  defect_class: string
  status: 'open' | 'paused' | 'unconfirmed' | 'closed'
  outcome: 'resumed' | 'cancelled' | 'ignored' | 'error' | null
  label: 'unlabeled' | 'correct' | 'false_positive'
  job_file_name?: string | null
}

export const listPrinters = () => api.get<PrinterRead[]>('/api/v1/printers', true)

export const listPrintJobsForPrinter = (printerId: number) =>
  api.get<PrintJobRead[]>(`/api/v1/printers/${printerId}/print-jobs`, true)

export const listIncidents = (state: 'all' | 'unclosed' | 'closed' = 'all', limit = 200) =>
  api.get<IncidentRead[]>(`/api/v1/incidents?state=${state}&limit=${limit}`, true)

export const dismissIncident = (id: number) => api.post<IncidentRead>(`/api/v1/incidents/${id}/dismiss`, undefined, true)

export const getAnalyticsSummary = (printerId?: number, days?: number) => {
  const params = new URLSearchParams()
  if (printerId !== undefined) params.set('printer_id', String(printerId))
  if (days !== undefined) params.set('days', String(days))
  const query = params.toString()
  return api.get<AnalyticsSummary>(`/api/v1/analytics/summary${query ? `?${query}` : ''}`, true)
}
