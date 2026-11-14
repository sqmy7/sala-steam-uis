# Sala STEAM UIS Barrancabermeja

Dashboard dual (vista publica para estudiantes + panel de administracion para encargados y
coordinacion) de la Sala STEAM de la Universidad Industrial de Santander, sede Barrancabermeja:
estado de la sala, monitor en vivo de las dos Creality Hi, cola de turnos de impresion 3D por
codigo QR, catalogo de inventario, log permanente de impresiones, KPIs, graficos, calendario de
turnos y bitacora de auditoria.

Este repositorio es **solo el frontend estatico** (React + TypeScript + Vite + Tailwind),
publicado en GitHub Pages. No tiene backend propio ni base de datos: habla por HTTP con el
backend real de **PrintWatch** ([`DeteccionImpresion3d`](https://github.com/sqmy7/DeteccionImpresion3d)),
extendido con los endpoints de la Sala STEAM (`/api/v1/room`, `/inventory`, `/loans`,
`/print-queue`, `/staff-audit`, `/public/*`). Ningun dato de impresoras, incidentes o cuentas vive
aqui ni se versiona en este repo.

## Arquitectura

```
Estudiante (celular, QR)          Encargado / Coordinador / Admin
        │                                    │
        ▼                                    ▼
   Vista publica (sin login)          Panel de administracion (login)
        │                                    │
        └────────────────┬───────────────────┘
                          ▼
        Backend PrintWatch extendido (FastAPI, en el portatil del operador)
        /api/v1/public/*   -> sin login (impresoras, cola, historial)
        /api/v1/room,...   -> login encargado/admin/coordinador
        /api/v1/printers,/analytics,/incidents -> login (contrato original de PrintWatch)
```

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # ajusta VITE_API_BASE_URL si el backend no esta en localhost:8000
npm run dev
```

## Build y despliegue

`npm run build` genera `dist/`. `.github/workflows/deploy.yml` lo publica automaticamente en
GitHub Pages en cada push a `main`. La URL del backend en produccion se configura sin tocar
codigo: **Settings → Secrets and variables → Actions → Variables → `VITE_API_BASE_URL`**.

Mientras el backend no este expuesto fuera de la LAN (p. ej. con un Cloudflare Tunnel), el sitio
publicado no mostrara datos en vivo fuera de la sala - el build y el despliegue funcionan igual.

## Roles

| Rol | Acceso |
|---|---|
| Estudiante | Sin cuenta: vista publica (`/`), formulario QR publico |
| `encargado` | Panel completo: abrir/cerrar sala, inventario, prestamos, aprobar/rechazar cola |
| `coordinador` | Panel de solo lectura: KPIs, graficos, bitacoras (sin escritura) |
| `admin` | Todo lo anterior, es el mismo rol que ya usa PrintWatch para pausar/cancelar impresiones |
