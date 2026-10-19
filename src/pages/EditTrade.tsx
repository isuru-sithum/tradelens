import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { calculatePnL, calculateRiskAmount, calculatePlannedRR } from '../utils/calculations'

export default function EditTrade() {
  const { id } = useParams<{ id: string }>()
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

  const [loadingTrade, setLoadingTrade] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadTrade() {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError(error.message)
      } else if (data) {
        setPair(data.pair)
        setDirection(data.direction)
        setEntryPrice(String(data.entry_price))
        setExitPrice(data.exit_price !== null ? String(data.exit_price) : '')
        setStopLoss(data.stop_loss !== null ? String(data.stop_loss) : '')
        setTakeProfit(data.take_profit !== null ? String(data.take_profit) : '')
        setPositionSize(String(data.position_size))
        setFees(String(data.fees))
        setNotes(data.notes ?? '')
      }
      setLoadingTrade(false)
    }

    if (id) loadTrade()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const entry = parseFloat(entryPrice)
    const exit = exitPrice ? parseFloat(exitPrice) : null
    const sl = stopLoss ? parseFloat(stopLoss) : null
    const tp = takeProfit ? parseFloat(takeProfit) : null
    const size = parseFloat(positionSize)
    const feeAmount = parseFloat(fees)

    const pnl = calculatePnL({ direction, entryPrice: entry, exitPrice: exit, positionSize: size, fees: feeAmount })
    const riskAmount = calculateRiskAmount({ direction, entryPrice: entry, stopLoss: sl, positionSize: size })
    const rrPlanned = calculatePlannedRR({ direction, entryPrice: entry, stopLoss: sl, takeProfit: tp })

    const { error } = await supabase
      .from('trades')
      .update({
        pair,
        direction,
        entry_price: entry,
        exit_price: exit,
        stop_loss: sl,
        take_profit: tp,
        position_size: size,
        fees: feeAmount,
        pnl,
        risk_amount: riskAmount,
        rr_planned: rrPlanned,
        notes: notes || null,
      })
      .eq('id', id)

    setSaving(false)

    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  if (loadingTrade) {
    return <p className="text-white p-8">Loading trade...</p>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Trade</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm mb-1">Pair</label>
          <input
            required
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
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded font-medium"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}