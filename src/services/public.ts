import { API_BASE_URL } from '../config/api'
import { api } from './apiClient'
import type {
  InventoryCategory,
  InventoryItemPublic,
  PrintQueueRequestCreate,
  PublicPrintHistoryEntry,
  PublicPrinter,
  PublicQueueEntry,
  RoomStatus,
} from '../types/api'

export const listPublicPrinters = () => api.get<PublicPrinter[]>('/api/v1/public/printers')

export function printerSnapshotUrl(printerId: number): string {
  return `${API_BASE_URL}/api/v1/public/printers/${printerId}/snapshot?t=${Date.now()}`
}

export const listPublicQueue = () => api.get<PublicQueueEntry[]>('/api/v1/public/print-queue')

export const listPublicPrintHistory = (limit = 100) =>
  api.get<PublicPrintHistoryEntry[]>(`/api/v1/public/print-history?limit=${limit}`)

export const listPublicInventory = (category?: InventoryCategory) =>
  api.get<InventoryItemPublic[]>(`/api/v1/inventory${category ? `?category=${category}` : ''}`)

export const submitPrintQueueRequest = (payload: PrintQueueRequestCreate) =>
  api.post('/api/v1/print-queue', payload)

export const getRoomStatus = () => api.get<RoomStatus>('/api/v1/room/status')
