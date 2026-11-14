// Backend real de PrintWatch (DeteccionImpresion3d), extendido con los endpoints de la Sala
// STEAM. Mientras no haya un Cloudflare Tunnel configurado, esto apunta a localhost: cambia
// VITE_API_BASE_URL (build-time, vía GitHub Actions repository variable o .env local) sin
// tocar codigo.
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export const SESSION_EXPIRED_MESSAGE = 'Tu sesion caduco. Inicia sesion de nuevo.'
