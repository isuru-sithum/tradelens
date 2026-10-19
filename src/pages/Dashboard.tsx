import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { useTrades } from '../hooks/useTrades'
import { useEffect, useState } from 'react'
import { calculateStats } from '../utils/stats'
import FollowedPlanChart from '../components/FollowedPlanChart'

export default function Dashboard() {
  const { user } = useAuth()
  const { trades, loading, error, refetch } = useTrades()

    const [startingBalance, setStartingBalance] = useState<number | null>(null)

  useEffect(() => {
    async function loadBalance() {
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('starting_balance')
        .eq('id', user.id)
        .maybeSingle()

      if (data) setStartingBalance(data.starting_balance)
    }
    loadBalance()
  }, [user])

  const stats = calculateStats(trades)
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


      {!loading && trades.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Total Net PnL</p>
            <p className={`text-xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.totalPnL.toFixed(2)}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Win Rate</p>
            <p className="text-xl font-bold">{stats.winRate.toFixed(1)}%</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Total Trades</p>
            <p className="text-xl font-bold">{stats.totalTrades}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">W / L / BE</p>
            <p className="text-xl font-bold">
              {stats.wins} / {stats.losses} / {stats.breakEven}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Avg Win</p>
            <p className="text-xl font-bold text-green-400">{stats.avgWin.toFixed(2)}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Avg Loss</p>
            <p className="text-xl font-bold text-red-400">{stats.avgLoss.toFixed(2)}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Profit Factor</p>
            <p className="text-xl font-bold">
              {stats.profitFactor !== null ? stats.profitFactor.toFixed(2) : '—'}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Best / Worst Trade</p>
            <p className="text-xl font-bold">
              <span className="text-green-400">
                {stats.bestTrade ? stats.bestTrade.pnl?.toFixed(0) : '—'}
              </span>
              {' / '}
              <span className="text-red-400">
                {stats.worstTrade ? stats.worstTrade.pnl?.toFixed(0) : '—'}
              </span>
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Account Balance</p>
            <p className="text-xl font-bold">
              {startingBalance !== null
                ? (startingBalance + stats.totalPnL).toFixed(2)
                : '—'}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Discipline Score</p>
            <p className="text-xl font-bold">
              {stats.disciplineScore !== null
                ? `${stats.disciplineScore.toFixed(0)}%`
                : '—'}
            </p>
          </div>
        </div>
      )}

      {!loading && trades.length > 0 && (
        <div className="mb-8">
          <FollowedPlanChart
            followedWinRate={stats.followedWinRate}
            brokeWinRate={stats.brokeWinRate}
            followedAvgPnL={stats.followedAvgPnL}
            brokeAvgPnL={stats.brokeAvgPnL}
          />
        </div>
      )}

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