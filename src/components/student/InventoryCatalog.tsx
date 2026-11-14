import { useEffect, useState } from 'react'
import { listPublicInventory } from '../../services/public'
import type { InventoryCategory, InventoryItemPublic } from '../../types/api'

const CATEGORY_LABEL: Record<InventoryCategory, string> = {
  electronics: 'Electronica',
  lego: 'LEGOs',
  tool: 'Herramientas',
  other: 'Otros',
}

const STATUS_DOT: Record<string, string> = { green: 'bg-emerald-500', yellow: 'bg-amber-500', red: 'bg-rose-500' }

export default function InventoryCatalog() {
  const [items, setItems] = useState<InventoryItemPublic[]>([])
  const [category, setCategory] = useState<InventoryCategory | undefined>(undefined)

  useEffect(() => {
    let active = true
    listPublicInventory(category).then((data) => active && setItems(data)).catch(() => {})
    return () => {
      active = false
    }
  }, [category])

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">Catalogo de componentes disponibles</h2>
        <select
          value={category ?? ''}
          onChange={(event) => setCategory((event.target.value || undefined) as InventoryCategory | undefined)}
          className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-200"
        >
          <option value="">Todas las categorias</option>
          {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Sin items en esta categoria.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-white">{item.name}</span>
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[item.status]}`} title={item.status} />
              </div>
              <p className="text-xs text-slate-500">{CATEGORY_LABEL[item.category]}</p>
              <p className="mt-1 text-slate-300">
                {item.quantity_available} / {item.quantity_total} disponibles
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
