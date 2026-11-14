import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'

// HashRouter a proposito: GitHub Pages (sitio de proyecto, sin configuracion de servidor) no
// puede reescribir rutas profundas hacia index.html, asi que las rutas van tras un "#" para que
// recargar /#/admin siga funcionando sin un 404 de GitHub Pages.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
