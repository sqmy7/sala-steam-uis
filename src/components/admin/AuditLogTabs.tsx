import { useMemo, useState, type ReactNode } from 'react'
import type { Loan, PublicPrintHistoryEntry, StaffAuditLogEntry, StaffAuditVerify } from '../../types/api'
import { downloadCsv } from '../../lib/csv'
import { downloadPdfTable } from '../../lib/pdf'
import { formatDateTime } from '../../lib/format'

type Tab = 'audit' | 'prints' | 'loans'

interface Props {
  auditLog: StaffAuditLogEntry[]
  auditVerify: StaffAuditVerify | null
  printHistory: PublicPrintHistoryEntry[]
  loans: Loan[]
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'audit', label: 'Log de auditoria del sistema' },
  { id: 'prints', label: 'Log de impresiones e incidentes' },
  { id: 'loans', label: 'Historial de prestamos' },
]

export default function AuditLogTabs({ auditLog, auditVerify, printHistory, loans }: Props) {
  const [tab, setTab] = useState<Tab>('audit')
  const [search, setSearch] = useState('')

  const filteredAudit = useMemo(
    () => auditLog.filter((entry) => `${entry.actor_name} ${entry.action_type}`.toLowerCase().includes(search.toLowerCase())),
    [auditLog, search],
  )
  const filteredPrints = useMemo(
    () => printHistory.filter((entry) => `${entry.file_name} ${entry.student_name ?? ''}`.toLowerCase().includes(search.toLowerCase())),
    [printHistory, search],
  )
  const filteredLoans = useMemo(
    () => loans.filter((loan) => `${loan.borrower_name} ${loan.borrower_uis_code}`.toLowerCase().includes(search.toLowerCase())),
    [loans, search],
  )

  function exportCsv() {
    if (tab === 'audit') downloadCsv('bitacora-auditoria.csv', filteredAudit)
    if (tab === 'prints') downloadCsv('log-impresiones.csv', filteredPrints)
    if (tab === 'loans') downloadCsv('historial-prestamos.csv', filteredLoans)
  }

  function exportPdf() {
    if (tab === 'audit') {
      downloadPdfTable(
        'bitacora-auditoria.pdf', 'Bitacora de auditoria - Sala STEAM',
        ['Fecha', 'Encargado', 'Accion', 'Detalle'],
        filteredAudit.map((e) => [formatDateTime(e.ts), e.actor_name, e.action_type, JSON.stringify(e.detail ?? {})]),
      )
    }
    if (tab === 'prints') {
      downloadPdfTable(
        'log-impresiones.pdf', 'Log de impresiones - Sala STEAM',
        ['Fecha', 'Pieza', 'Estudiante', 'Impresora', 'Estado'],
        filteredPrints.map((e) => [formatDateTime(e.started_at), e.file_name, e.student_name ?? '—', e.printer_name, e.status]),
      )
    }
    if (tab === 'loans') {
      downloadPdfTable(
        'historial-prestamos.pdf', 'Historial de prestamos - Sala STEAM',
        ['Entrega', 'Estudiante', 'Codigo UIS', 'Cantidad', 'Estado'],
        filteredLoans.map((l) => [formatDateTime(l.delivered_at), l.borrower_name, l.borrower_uis_code, String(l.quantity), l.status]),
      )
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded px-3 py-1.5 text-sm ${tab === t.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder="Buscar..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-white"
          />
          <button onClick={exportCsv} className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">
            Exportar CSV
          </button>
          <button onClick={exportPdf} className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">
            Exportar PDF
          </button>
        </div>
      </div>

      {tab === 'audit' && (
        <div className="mt-3">
          {auditVerify && (
            <p className={`mb-2 text-xs ${auditVerify.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
              Cadena de integridad: {auditVerify.ok ? `intacta (${auditVerify.entries_checked} registros)` : 'ROTA - revisar'}
            </p>
          )}
          <Table
            head={['Fecha', 'Encargado', 'Rol', 'Accion', 'Detalle']}
            rows={filteredAudit.map((e) => [
              formatDateTime(e.ts),
              e.actor_name,
              e.actor_role,
              e.action_type,
              <code key="d" className="text-xs text-slate-500">
                {JSON.stringify(e.detail ?? {})}
              </code>,
            ])}
          />
        </div>
      )}
      {tab === 'prints' && (
        <div className="mt-3">
          <Table
            head={['Fecha', 'Pieza', 'Estudiante', 'Impresora', 'Estado']}
            rows={filteredPrints.map((e) => [
              formatDateTime(e.started_at), e.file_name, e.student_name ?? '—', e.printer_name,
              e.had_incident ? 'Incidente IA' : e.status,
            ])}
          />
        </div>
      )}
      {tab === 'loans' && (
        <div className="mt-3">
          <Table
            head={['Entrega', 'Estudiante', 'Codigo UIS', 'Cantidad', 'Devolucion', 'Estado']}
            rows={filteredLoans.map((l) => [
              formatDateTime(l.delivered_at), l.borrower_name, l.borrower_uis_code, String(l.quantity),
              formatDateTime(l.returned_at), l.status,
            ])}
          />
        </div>
      )}
    </section>
  )
}

function Table({ head, rows }: { head: string[]; rows: (string | ReactNode)[][] }) {
  return (
    <div className="max-h-96 overflow-auto">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 bg-slate-900 text-slate-500">
          <tr>
            {head.map((h) => (
              <th key={h} className="py-1 pr-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-300">
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-1.5 pr-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={head.length} className="py-3 text-center text-slate-500">
                Sin registros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
