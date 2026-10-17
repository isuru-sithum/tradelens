import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="text-white p-8">Loading...</p>
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold">You're logged in</h1>
      <p className="mt-2 text-gray-300">Email: {user.email}</p>
    </div>
  )
}

export default App