import { useRef, useState, type ChangeEvent } from 'react'
import type { InventoryItem, InventoryStatus } from '../../types/api'
import {
  createInventoryItem,
  deleteInventoryItem,
  importInventory,
  updateInventoryItem,
  type InventoryItemPayload,
} from '../../services/staff'

const STATUS_CYCLE: InventoryStatus[] = ['green', 'yellow', 'red']
const STATUS_BUTTON: Record<InventoryStatus, string> = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-rose-500',
}

const EMPTY: InventoryItemPayload = {
  name: '',
  category: 'electronics',
  quantity_total: 0,
  quantity_available: 0,
  status: 'green',
}

export default function InventoryManager({
  items,
  canWrite,
  onChanged,
}: {
  items: InventoryItem[]
  canWrite: boolean
  onChanged: () => void
}) {
  const [form, setForm] = useState<InventoryItemPayload>(EMPTY)
  const [importSummary, setImportSummary] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  async function cycleStatus(item: InventoryItem) {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(item.status) + 1) % STATUS_CYCLE.length]
    await updateInventoryItem(item.id, { status: next })
    onChanged()
  }

  async function handleCreate() {
    if (!form.name) return
    await createInventoryItem(form)
    setForm(EMPTY)
    onChanged()
  }

  async function handleDelete(id: number) {
    if (!window.confirm('¿Borrar este item del inventario?')) return
    try {
      await deleteInventoryItem(id)
      onChanged()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'No se pudo borrar')
    }
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const content = await file.text()
    const format = file.name.endsWith('.json') ? 'json' : 'csv'
    const summary = await importInventory(format, content)
    setImportSummary(`${summary.created} creados, ${summary.updated} actualizados, ${summary.skipped} omitidos`)
    onChanged()
    if (fileInput.current) fileInput.current.value = ''
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">Gestor de inventario dinamico</h2>
        {canWrite && (
          <label className="cursor-pointer rounded bg-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700">
            Importar CSV/JSON
            <input ref={fileInput} type="file" accept=".csv,.json" onChange={handleImport} className="hidden" />
          </label>
        )}
      </div>
      {importSummary && <p className="mb-2 text-sm text-emerald-400">{importSummary}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-1 pr-3">Estado</th>
              <th className="py-1 pr-3">Nombre</th>
              <th className="py-1 pr-3">Categoria</th>
              <th className="py-1 pr-3">Disponible / Total</th>
              {canWrite && <th className="py-1 pr-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-1.5 pr-3">
                  <button
                    disabled={!canWrite}
                    onClick={() => cycleStatus(item)}
                    title="Click para cambiar: verde / amarillo / rojo"
                    className={`h-4 w-4 rounded-full ${STATUS_BUTTON[item.status]} ${canWrite ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
                  />
                </td>
                <td className="py-1.5 pr-3 text-white">{item.name}</td>
                <td className="py-1.5 pr-3">{item.category}</td>
                <td className="py-1.5 pr-3">
                  {item.quantity_available} / {item.quantity_total}
                </td>
                {canWrite && (
                  <td className="py-1.5 pr-3 text-right">
                    <button onClick={() => handleDelete(item.id)} className="text-rose-400 hover:underline">
                      Borrar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canWrite && (
        <div className="mt-4 grid gap-2 border-t border-slate-800 pt-3 sm:grid-cols-5">
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-white sm:col-span-2"
          />
          <select
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-white"
          >
            <option value="electronics">Electronica</option>
            <option value="lego">LEGOs</option>
            <option value="tool">Herramienta</option>
            <option value="other">Otro</option>
          </select>
          <input
            type="number"
            placeholder="Cantidad"
            value={form.quantity_total}
            onChange={(event) => {
              const total = Number(event.target.value)
              setForm({ ...form, quantity_total: total, quantity_available: total })
            }}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-white"
          />
          <button onClick={handleCreate} className="rounded bg-emerald-700 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-600">
            Agregar item
          </button>
        </div>
      )}
    </section>
  )
}
