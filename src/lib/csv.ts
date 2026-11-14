export function downloadCsv<T extends object>(filename: string, rows: T[]): void {
  if (rows.length === 0) return
  const headers = Object.keys(rows[0]) as (keyof T)[]
  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? '' : String(value)
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const lines = [headers.join(','), ...rows.map((row) => headers.map((key) => escape(row[key])).join(','))]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
