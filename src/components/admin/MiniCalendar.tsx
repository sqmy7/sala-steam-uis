import { useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'

export interface CalendarEvent {
  date: Date
  label: string
  kind: 'turno' | 'impresion'
}

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export default function MiniCalendar({ events }: { events: CalendarEvent[] }) {
  const [month, setMonth] = useState(() => new Date())
  const [selected, setSelected] = useState<Date | null>(null)

  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const eventsOn = (day: Date) => events.filter((event) => isSameDay(event.date, day))
  const selectedEvents = selected ? eventsOn(selected) : []

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 capitalize">{format(month, 'MMMM yyyy', { locale: es })}</h3>
        <div className="flex gap-1">
          <button onClick={() => setMonth((m) => subMonths(m, 1))} className="rounded px-2 py-0.5 text-slate-400 hover:bg-slate-800">
            ‹
          </button>
          <button onClick={() => setMonth((m) => addMonths(m, 1))} className="rounded px-2 py-0.5 text-slate-400 hover:bg-slate-800">
            ›
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayEvents = eventsOn(day)
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelected(day)}
              className={`relative rounded py-1.5 text-xs ${
                isSameMonth(day, month) ? 'text-slate-200' : 'text-slate-600'
              } ${selected && isSameDay(day, selected) ? 'bg-emerald-700 text-white' : 'hover:bg-slate-800'}`}
            >
              {format(day, 'd')}
              {dayEvents.length > 0 && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sky-400" />
              )}
            </button>
          )
        })}
      </div>
      <div className="mt-3 border-t border-slate-800 pt-2 text-sm">
        {selected ? (
          selectedEvents.length > 0 ? (
            <ul className="space-y-1 text-slate-300">
              {selectedEvents.map((event, index) => (
                <li key={index}>
                  <span className={event.kind === 'turno' ? 'text-emerald-400' : 'text-sky-400'}>•</span> {event.label}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">Sin eventos este dia.</p>
          )
        ) : (
          <p className="text-slate-500">Selecciona un dia para ver turnos e impresiones.</p>
        )}
      </div>
    </div>
  )
}
