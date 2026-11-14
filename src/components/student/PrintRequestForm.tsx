import { useEffect, useState, type FormEvent } from 'react'
import { listPublicPrinters, submitPrintQueueRequest } from '../../services/public'
import type { PublicPrinter } from '../../types/api'

const FILAMENTS = ['PLA', 'Hyper PLA', 'PETG', 'TPU']

const EMPTY_FORM = {
  student_name: '',
  student_uis_code: '',
  program: '',
  piece_name: '',
  weight_g: '',
  estimated_minutes: '',
  filament_type: FILAMENTS[0],
  color: '',
  requested_printer_id: '',
  contact_email: '',
}

export default function PrintRequestForm() {
  const [printers, setPrinters] = useState<PublicPrinter[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    listPublicPrinters().then(setPrinters).catch(() => {})
  }, [])

  function update<K extends keyof typeof EMPTY_FORM>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus('sending')
    try {
      await submitPrintQueueRequest({
        student_name: form.student_name,
        student_uis_code: form.student_uis_code,
        program: form.program,
        piece_name: form.piece_name,
        weight_g: form.weight_g ? Number(form.weight_g) : null,
        estimated_minutes: form.estimated_minutes ? Number(form.estimated_minutes) : null,
        filament_type: form.filament_type || null,
        color: form.color || null,
        requested_printer_id: form.requested_printer_id ? Number(form.requested_printer_id) : null,
        contact_email: form.contact_email || null,
      })
      setStatus('sent')
      setForm(EMPTY_FORM)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <section className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-6 text-center">
        <h2 className="text-lg font-semibold text-white">Solicitud enviada</h2>
        <p className="mt-2 text-sm text-slate-300">
          Un encargado la revisara pronto. Puedes ver el estado en la cola de turnos de esta misma pagina.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 rounded bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
        >
          Enviar otra solicitud
        </button>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold text-white">Formulario de impresion 3D</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        <Field label="Nombre completo" required value={form.student_name} onChange={(v) => update('student_name', v)} />
        <Field label="Codigo UIS" required value={form.student_uis_code} onChange={(v) => update('student_uis_code', v)} />
        <Field label="Carrera / Proyecto" required value={form.program} onChange={(v) => update('program', v)} />
        <Field label="Nombre de la pieza" required value={form.piece_name} onChange={(v) => update('piece_name', v)} />
        <Field label="Peso estimado (g)" type="number" value={form.weight_g} onChange={(v) => update('weight_g', v)} />
        <Field
          label="Tiempo estimado (min)"
          type="number"
          value={form.estimated_minutes}
          onChange={(v) => update('estimated_minutes', v)}
        />
        <label className="text-sm text-slate-300">
          Tipo de filamento
          <select
            value={form.filament_type}
            onChange={(event) => update('filament_type', event.target.value)}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          >
            {FILAMENTS.map((filament) => (
              <option key={filament} value={filament}>
                {filament}
              </option>
            ))}
          </select>
        </label>
        <Field label="Color" value={form.color} onChange={(v) => update('color', v)} />
        <label className="text-sm text-slate-300">
          Impresora preferida (opcional)
          <select
            value={form.requested_printer_id}
            onChange={(event) => update('requested_printer_id', event.target.value)}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          >
            <option value="">Sin preferencia</option>
            {printers.map((printer) => (
              <option key={printer.id} value={printer.id}>
                {printer.name}
              </option>
            ))}
          </select>
        </label>
        <Field label="Correo de contacto (opcional)" type="email" value={form.contact_email} onChange={(v) => update('contact_email', v)} />

        {status === 'error' && (
          <p className="sm:col-span-2 text-sm text-rose-400">
            No se pudo enviar la solicitud. Verifica tu conexion e intenta de nuevo.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="sm:col-span-2 mt-2 rounded bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {status === 'sending' ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </form>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="text-sm text-slate-300">
      {label}
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-emerald-500"
      />
    </label>
  )
}
