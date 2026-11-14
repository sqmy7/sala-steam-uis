import { api } from './apiClient'
import type {
  InventoryItem,
  Loan,
  PrintQueueRequest,
  RoomShift,
  RoomStatus,
  StaffAuditLogEntry,
  StaffAuditVerify,
} from '../types/api'

// --- sala ---
export const openRoom = (note?: string) => api.post<RoomShift>('/api/v1/room/open', note ? { note } : undefined, true)
export const closeRoom = (note?: string) => api.post<RoomShift>('/api/v1/room/close', note ? { note } : undefined, true)
export const listRoomShifts = (limit = 100) => api.get<RoomShift[]>(`/api/v1/room/shifts?limit=${limit}`, true)
export const getRoomStatusAuthenticated = () => api.get<RoomStatus>('/api/v1/room/status')

// --- inventario ---
export const listInventory = () => api.get<InventoryItem[]>('/api/v1/inventory', true)
export interface InventoryItemPayload {
  name: string
  category: string
  description?: string | null
  quantity_total: number
  quantity_available: number
  status: string
  status_note?: string | null
}
export const createInventoryItem = (payload: InventoryItemPayload) =>
  api.post<InventoryItem>('/api/v1/inventory', payload, true)
export const updateInventoryItem = (id: number, payload: Partial<InventoryItemPayload>) =>
  api.patch<InventoryItem>(`/api/v1/inventory/${id}`, payload, true)
export const deleteInventoryItem = (id: number) => api.del(`/api/v1/inventory/${id}`, true)
export const importInventory = (format: 'csv' | 'json', content: string) =>
  api.post<{ created: number; updated: number; skipped: number; errors: { row: number; error: string }[] }>(
    '/api/v1/inventory/import',
    { format, content },
    true,
  )

// --- prestamos ---
export const listLoans = (status?: string) => api.get<Loan[]>(`/api/v1/loans${status ? `?status_filter=${status}` : ''}`, true)
export const createLoan = (payload: {
  item_id: number
  quantity: number
  borrower_name: string
  borrower_uis_code: string
  due_at?: string | null
  note?: string | null
}) => api.post<Loan>('/api/v1/loans', payload, true)
export const returnLoan = (id: number, note?: string) =>
  api.post<Loan>(`/api/v1/loans/${id}/return`, note ? { note } : undefined, true)

// --- cola de impresion ---
export const listPrintQueueStaff = (status?: string) =>
  api.get<PrintQueueRequest[]>(`/api/v1/print-queue${status ? `?status=${status}` : ''}`, true)
export const approvePrintQueueRequest = (id: number, note?: string) =>
  api.post<PrintQueueRequest>(`/api/v1/print-queue/${id}/approve`, note ? { note } : undefined, true)
export const rejectPrintQueueRequest = (id: number, note: string) =>
  api.post<PrintQueueRequest>(`/api/v1/print-queue/${id}/reject`, { note }, true)
export const linkPrintQueueRequestToJob = (id: number, printJobId: number) =>
  api.post<PrintQueueRequest>(`/api/v1/print-queue/${id}/link-job`, { print_job_id: printJobId }, true)

// --- bitacora de auditoria ---
export const listStaffAuditLog = (limit = 200) => api.get<StaffAuditLogEntry[]>(`/api/v1/staff-audit?limit=${limit}`, true)
export const verifyStaffAuditLog = () => api.get<StaffAuditVerify>('/api/v1/staff-audit/verify', true)
