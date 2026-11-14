import AppShell from '../components/layout/AppShell'
import InventoryCatalog from '../components/student/InventoryCatalog'
import PrinterMonitorGrid from '../components/student/PrinterMonitorGrid'
import PrintHistoryTable from '../components/student/PrintHistoryTable'
import PrintQueuePanel from '../components/student/PrintQueuePanel'
import PrintRequestForm from '../components/student/PrintRequestForm'
import QrCodePanel from '../components/student/QrCodePanel'
import RoomStatusBanner from '../components/student/RoomStatusBanner'

export default function StudentPage() {
  return (
    <AppShell title="Sala STEAM UIS Barrancabermeja" subtitle="Impresion 3D, inventario y turnos en vivo">
      <div className="space-y-6">
        <RoomStatusBanner />
        <PrinterMonitorGrid />
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <PrintQueuePanel />
          <QrCodePanel />
        </div>
        <PrintRequestForm />
        <InventoryCatalog />
        <PrintHistoryTable />
      </div>
    </AppShell>
  )
}
