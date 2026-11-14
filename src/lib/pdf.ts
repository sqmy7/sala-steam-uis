import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export function downloadPdfTable(filename: string, title: string, head: string[], rows: (string | number)[][]): void {
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text(title, 14, 16)
  doc.setFontSize(9)
  doc.text(new Date().toLocaleString('es-CO'), 14, 22)
  autoTable(doc, { head: [head], body: rows, startY: 28, styles: { fontSize: 8 } })
  doc.save(filename)
}
