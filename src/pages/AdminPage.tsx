import { useCallback, useEffect, useMemo, useState } from 'react'
import AppShell from '../components/layout/AppShell'
import FiltersBar, { type Filters } from '../components/admin/FiltersBar'
import RoomSwitchControl from '../components/admin/RoomSwitchControl'
import KpiCards from '../components/admin/KpiCards'
import UsageTrendChart, { type UsagePoint } from '../components/admin/UsageTrendChart'
import FilamentByProgramChart, { type ProgramUsage } from '../components/admin/FilamentByProgramChart'
import DonutChart from '../components/admin/DonutChart'
import MiniCalendar, { type CalendarEvent } from '../components/admin/MiniCalendar'
import NotificationsCenter from '../components/admin/NotificationsCenter'
import InventoryManager from '../components/admin/InventoryManager'
import AuditLogTabs from '../components/admin/AuditLogTabs'
import { useAuth } from '../context/AuthContext'
import { getRoomStatus, listPublicPrintHistory } from '../services/public'
import {
  listInventory,
  listLoans,
  listPrintQueueStaff,
  listRoomShifts,
  listStaffAuditLog,
  verifyStaffAuditLog,
  approvePrintQueueRequest,
  rejectPrintQueueRequest,
} from '../services/staff'
import { dismissIncident, getAnalyticsSummary, listIncidents, listPrinters } from '../services/printwatch'
import type {
  AnalyticsSummary,
  InventoryItem,
  Loan,
  PrintQueueRequest,
  PublicPrintHistoryEntry,
  RoomShift,
  RoomStatus,
  StaffAuditLogEntry,
  StaffAuditVerify,
} from '../types/api'
import type { IncidentRead, PrinterRead } from '../services/printwatch'

export default function AdminPage() {
  const { user } = useAuth()
  const canWrite = user?.role === 'admin' || user?.role === 'encargado'

  const [filters, setFilters] = useState<Filters>({ days: 30, printerId: null })
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null)
  const [printers, setPrinters] = useState<PrinterRead[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [queueRequests, setQueueRequests] = useState<PrintQueueRequest[]>([])
  const [openIncidents, setOpenIncidents] = useState<IncidentRead[]>([])
  const [auditLog, setAuditLog] = useState<StaffAuditLogEntry[]>([])
  const [auditVerify, setAuditVerify] = useState<StaffAuditVerify | null>(null)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [roomShifts, setRoomShifts] = useState<RoomShift[]>([])
  const [printHistory, setPrintHistory] = useState<PublicPrintHistoryEntry[]>([])

  const refresh = useCallback(() => {
    getRoomStatus().then(setRoomStatus).catch(() => {})
    listPrinters().then(setPrinters).catch(() => {})
    getAnalyticsSummary(filters.printerId ?? undefined, filters.days).then(setAnalytics).catch(() => {})
    listPrintQueueStaff().then(setQueueRequests).catch(() => {})
    listIncidents('unclosed').then(setOpenIncidents).catch(() => {})
    listStaffAuditLog().then(setAuditLog).catch(() => {})
    verifyStaffAuditLog().then(setAuditVerify).catch(() => {})
    listInventory().then(setInventory).catch(() => {})
    listLoans().then(setLoans).catch(() => {})
    listRoomShifts().then(setRoomShifts).catch(() => {})
    listPublicPrintHistory(200).then(setPrintHistory).catch(() => {})
    setLastSync(new Date())
  }, [filters.days, filters.printerId])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 30_000)
    return () => clearInterval(interval)
  }, [refresh])

  const pendingRequests = useMemo(() => queueRequests.filter((request) => request.status === 'pending'), [queueRequests])
  const decidedRequests = useMemo(
    () => queueRequests.filter((request) => request.status === 'approved' || request.status === 'queued'),
    [queueRequests],
  )

  const usageTrend: UsagePoint[] = useMemo(() => {
    if (!analytics) return []
    const byDay = new Map<string, number>()
    for (const job of analytics.jobs) {
      const day = job.started_at.slice(0, 10)
      byDay.set(day, (byDay.get(day) ?? 0) + job.duration_s / 3600)
    }
    return Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, hours]) => ({ date: date.slice(5), hours: Math.round(hours * 100) / 100 }))
  }, [analytics])

  const filamentByProgram: ProgramUsage[] = useMemo(() => {
    const since = Date.now() - filters.days * 24 * 60 * 60 * 1000
    const byProgram = new Map<string, number>()
    for (const request of decidedRequests) {
      if (new Date(request.created_at).getTime() < since) continue
      if (!request.weight_g) continue
      byProgram.set(request.program, (byProgram.get(request.program) ?? 0) + request.weight_g)
    }
    return Array.from(byProgram.entries()).map(([program, grams]) => ({ program, grams }))
  }, [decidedRequests, filters.days])

  const filamentTypeDonut = useMemo(() => {
    const byType = new Map<string, number>()
    for (const request of decidedRequests) {
      if (!request.weight_g) continue
      const key = request.filament_type ?? 'Sin especificar'
      byType.set(key, (byType.get(key) ?? 0) + request.weight_g)
    }
    return Array.from(byType.entries()).map(([name, value]) => ({ name, value }))
  }, [decidedRequests])

  const statusDonut = useMemo(() => {
    if (!analytics) return []
    return Object.entries(analytics.status_counts).map(([name, value]) => ({ name, value }))
  }, [analytics])

  const totalFilamentGrams = useMemo(
    () => decidedRequests.reduce((sum, request) => sum + (request.weight_g ?? 0), 0),
    [decidedRequests],
  )
  const studentsAttended = useMemo(
    () => new Set(decidedRequests.map((request) => request.student_uis_code)).size,
    [decidedRequests],
  )

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = []
    for (const shift of roomShifts) {
      events.push({ date: new Date(shift.opened_at), label: `Sala abierta por ${shift.opened_by_name}`, kind: 'turno' })
      if (shift.closed_at) events.push({ date: new Date(shift.closed_at), label: `Sala cerrada por ${shift.closed_by_name}`, kind: 'turno' })
    }
    for (const request of decidedRequests) {
      if (request.decided_at) {
        events.push({ date: new Date(request.decided_at), label: `Turno: ${request.piece_name} (${request.student_name})`, kind: 'impresion' })
      }
    }
    return events
  }, [roomShifts, decidedRequests])

  return (
    <AppShell
      title="Dashboard de Gestion y Operacion - Sala STEAM UIS Barrancabermeja"
      subtitle={user ? `Sesion de ${user.username}` : undefined}
    >
      <div className="space-y-6">
        <RoomSwitchControl status={roomStatus} canWrite={!!canWrite} onChanged={refresh} />
        <FiltersBar filters={filters} onChange={setFilters} printers={printers} lastSync={lastSync} />

        <KpiCards
          printHours={analytics?.totals.print_hours ?? null}
          occupancyPct={
            analytics?.totals.print_hours != null ? Math.min(100, (analytics.totals.print_hours / (filters.days * 24)) * 100) : null
          }
          filamentGrams={totalFilamentGrams}
          studentsAttended={studentsAttended}
          loansCount={loans.length}
          successRatePct={analytics?.totals.success_rate != null ? analytics.totals.success_rate * 100 : null}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <UsageTrendChart data={usageTrend} />
          <FilamentByProgramChart data={filamentByProgram} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <DonutChart title="Tipos de filamento usados" data={filamentTypeDonut} />
          <DonutChart title="Estado de las impresiones" data={statusDonut} />
          <MiniCalendar events={calendarEvents} />
        </div>

        <NotificationsCenter
          pendingRequests={pendingRequests}
          openIncidents={openIncidents}
          onApprove={async (id) => {
            await approvePrintQueueRequest(id)
            refresh()
          }}
          onReject={async (id, note) => {
            await rejectPrintQueueRequest(id, note)
            refresh()
          }}
          onDismissIncident={async (id) => {
            await dismissIncident(id)
            refresh()
          }}
        />

        <InventoryManager items={inventory} canWrite={!!canWrite} onChanged={refresh} />

        <AuditLogTabs auditLog={auditLog} auditVerify={auditVerify} printHistory={printHistory} loans={loans} />
      </div>
    </AppShell>
  )
}
