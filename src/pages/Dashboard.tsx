import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { useTrades } from '../hooks/useTrades'
import { useState } from 'react'

export default function Dashboard() {
  const { user } = useAuth()
  const { trades, loading, error, refetch } = useTrades()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleLogout() {
    await supabase.auth.signOut()
  }

    async function handleDelete(id: string) {
    const confirmed = window.confirm('Delete this trade? This cannot be undone.')
    if (!confirmed) return

    setDeletingId(id)
    const { error } = await supabase.from('trades').delete().eq('id', id)
    setDeletingId(null)

    if (error) {
      alert('Failed to delete trade: ' + error.message)
    } else {
      refetch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium"
        >
          Log out
        </button>
      </div>

      <p className="text-gray-300 mb-4">Logged in as: {user?.email}</p>

      <Link
        to="/add-trade"
        className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium mb-6"
      >
        + Add Trade
      </Link>
            <Link
        to="/settings"
        className="inline-block bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm font-medium mb-6 ml-3"
      >
        Settings
      </Link>

      <h2 className="text-xl font-semibold mb-3">Your Trades</h2>

      {loading && <p className="text-gray-400">Loading trades...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && trades.length === 0 && (
        <p className="text-gray-400">No trades yet. Add your first trade.</p>
      )}

      {!loading && trades.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Pair</th>
                <th className="py-2 pr-4">Direction</th>
                <th className="py-2 pr-4">Entry</th>
                <th className="py-2 pr-4">Exit</th>
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 pr-4">PnL</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-800">
                  <td className="py-2 pr-4">
                    {new Date(trade.trade_date).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-4">{trade.pair}</td>
                  <td className="py-2 pr-4 capitalize">{trade.direction}</td>
                  <td className="py-2 pr-4">{trade.entry_price}</td>
                  <td className="py-2 pr-4">{trade.exit_price ?? '—'}</td>
                  <td className="py-2 pr-4">{trade.position_size}</td>
                  <td className={`py-2 pr-4 ${trade.pnl !== null && trade.pnl >= 0 ? 'text-green-400' : trade.pnl !== null ? 'text-red-400' : 'text-gray-500'}`}>
                    {trade.pnl !== null ? trade.pnl.toFixed(2) : '—'}
                  </td>
                  <td className="py-2 pr-4 space-x-3">
                    <Link
                      to={`/edit-trade/${trade.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(trade.id)}
                      disabled={deletingId === trade.id}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50 text-sm"
                    >
                      {deletingId === trade.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>     
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}