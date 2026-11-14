export type UserRole = 'admin' | 'viewer' | 'encargado' | 'coordinador' | 'estudiante'

export interface UserRead {
  id: number
  username: string
  email: string
  role: UserRole
  created_at: string
}

export interface Token {
  access_token: string
  token_type: string
}

// --- /public/* (sin login) ---

export interface PublicCurrentJob {
  file_name: string
  started_at: string
  estimated_layers: number | null
  requester_name: string | null
}

export interface PublicPrinter {
  id: number
  name: string
  status: 'idle' | 'printing' | 'paused' | 'error' | 'offline'
  current_job: PublicCurrentJob | null
  camera_id: number | null
}

export interface PublicQueueEntry {
  id: number
  student_name: string
  piece_name: string
  program: string
  estimated_minutes: number | null
  requested_printer_id: number | null
  status: 'approved' | 'queued'
  created_at: string
}

export interface PublicPrintHistoryEntry {
  job_id: number
  printer_id: number
  printer_name: string
  file_name: string
  student_name: string | null
  started_at: string
  ended_at: string | null
  printed_s: number | null
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  had_incident: boolean
}

export type InventoryCategory = 'electronics' | 'lego' | 'tool' | 'other'
export type InventoryStatus = 'green' | 'yellow' | 'red'

export interface InventoryItemPublic {
  id: number
  name: string
  category: InventoryCategory
  description: string | null
  quantity_total: number
  quantity_available: number
  status: InventoryStatus
}

export interface InventoryItem extends InventoryItemPublic {
  status_note: string | null
  created_at: string
  updated_at: string
}

export interface PrintQueueRequestCreate {
  student_name: string
  student_uis_code: string
  program: string
  piece_name: string
  weight_g?: number | null
  estimated_minutes?: number | null
  filament_type?: string | null
  color?: string | null
  requested_printer_id?: number | null
  contact_email?: string | null
}

// --- vista administrador (con login) ---

export interface RoomShift {
  id: number
  opened_at: string
  opened_by_name: string
  closed_at: string | null
  closed_by_name: string | null
  note: string | null
}

export interface RoomStatus {
  is_open: boolean
  shift: RoomShift | null
}

export type LoanStatus = 'active' | 'returned' | 'overdue'

export interface Loan {
  id: number
  item_id: number
  quantity: number
  borrower_name: string
  borrower_uis_code: string
  authorized_by_name: string
  delivered_at: string
  due_at: string | null
  returned_at: string | null
  status: LoanStatus
  note: string | null
}

export type PrintQueueStatus = 'pending' | 'approved' | 'rejected' | 'queued'

export interface PrintQueueRequest {
  id: number
  created_at: string
  student_name: string
  student_uis_code: string
  program: string
  piece_name: string
  weight_g: number | null
  estimated_minutes: number | null
  filament_type: string | null
  color: string | null
  requested_printer_id: number | null
  status: PrintQueueStatus
  decided_by_name: string | null
  decided_at: string | null
  decision_note: string | null
  print_job_id: number | null
}

export interface StaffAuditLogEntry {
  id: number
  ts: string
  actor_id: number | null
  actor_name: string
  actor_role: string
  action_type: string
  entity_type: string | null
  entity_id: number | null
  detail: Record<string, unknown> | null
  hash: string
}

export interface StaffAuditVerify {
  ok: boolean
  entries_checked: number
  first_broken_id: number | null
  reason: string | null
  last_hash: string | null
}

// --- PrintWatch (impresoras reales, requiere login admin/viewer) ---

export interface AnalyticsTotals {
  jobs: number
  success_rate: number | null
  print_hours: number | null
  layers: number | null
  layers_with_defect: number | null
  defect_rate: number | null
  interventions: number | null
  filament_m: number | null
  cost: number | null
}

export interface AnalyticsJob {
  id: number
  printer_id: number
  file_name: string
  status: string
  started_at: string
  ended_at: string | null
  duration_s: number
  layers: number
  layers_with_defect: number
  defect_rate: number | null
}

export interface AnalyticsSummary {
  totals: AnalyticsTotals
  status_counts: Record<string, number>
  defects_by_class: Record<string, number>
  interventions_by_origin: Record<string, number>
  jobs: AnalyticsJob[]
  currency: string | null
  cost_settings_are_default: boolean | null
}
