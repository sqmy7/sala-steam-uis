import { QRCodeSVG } from 'qrcode.react'

export default function QrCodePanel() {
  const url = `${window.location.origin}${import.meta.env.BASE_URL}`

  return (
    <section className="flex flex-col items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
      <h2 className="text-lg font-semibold text-white">Solicitar impresion o prestamo</h2>
      <p className="max-w-xs text-sm text-slate-400">
        Escanea este codigo desde tu celular para llenar el formulario de impresion 3D o consultar el inventario.
      </p>
      <div className="rounded-lg bg-white p-3">
        <QRCodeSVG value={url} size={160} />
      </div>
      <p className="break-all text-xs text-slate-500">{url}</p>
    </section>
  )
}
