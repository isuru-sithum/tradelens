import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const location = useLocation()

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/add-trade', label: 'Add Trade' },
    { to: '/weekly-review', label: 'Review' },
    { to: '/settings', label: 'Settings' },
  ]

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-4 md:px-8 py-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-6 flex-wrap">
          <span className="text-lg font-bold text-blue-400">TradeLens</span>

          <div className="flex gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 hidden sm:inline">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm font-medium"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}