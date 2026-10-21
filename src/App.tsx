import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AddTrade from './pages/AddTrade'
import EditTrade from './pages/EditTrade'
import Settings from './pages/Settings'
import WeeklyReview from './pages/WeeklyReview'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route
        path="/add-trade"
        element={
          <ProtectedRoute>
            <AddTrade />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-trade/:id"
        element={
          <ProtectedRoute>
            <EditTrade />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/weekly-review"
        element={
          <ProtectedRoute>
            <WeeklyReview />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App