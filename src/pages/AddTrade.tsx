import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function AddTrade() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [pair, setPair] = useState('')
  const [direction, setDirection] = useState<'long' | 'short'>('long')
  const [entryPrice, setEntryPrice] = useState('')
  const [exitPrice, setExitPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [positionSize, setPositionSize] = useState('')
  const [fees, setFees] = useState('0')
  const [notes, setNotes] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.from('trades').insert({
      user_id: user?.id,
      pair,
      direction,
      entry_price: parseFloat(entryPrice),
      exit_price: exitPrice ? parseFloat(exitPrice) : null,
      stop_loss: stopLoss ? parseFloat(stopLoss) : null,
      take_profit: takeProfit ? parseFloat(takeProfit) : null,
      position_size: parseFloat(positionSize),
      fees: parseFloat(fees),
      notes: notes || null,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Add Trade</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm mb-1">Pair</label>
          <input
            required
            placeholder="BTC/USDT"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Direction</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as 'long' | 'short')}
            className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Entry Price</label>
            <input
              required
              type="number"
              step="any"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Exit Price</label>
            <input
              type="number"
              step="any"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Stop Loss</label>
            <input
              type="number"
              step="any"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Take Profit</label>
            <input
              type="number"
              step="any"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Position Size</label>
            <input
              required
              type="number"
              step="any"
              value={positionSize}
              onChange={(e) => setPositionSize(e.target.value)}
              className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Fees</label>
            <input
              type="number"
              step="any"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded font-medium"
        >
          {loading ? 'Saving...' : 'Save Trade'}
        </button>
      </form>
    </div>
  )
}