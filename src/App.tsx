import { Navigate, Route, Routes } from 'react-router-dom'
import RequireRole from './components/layout/RequireRole'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import StudentPage from './pages/StudentPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireRole roles={['admin', 'encargado', 'coordinador']}>
            <AdminPage />
          </RequireRole>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
