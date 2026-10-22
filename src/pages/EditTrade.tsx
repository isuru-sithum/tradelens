import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { calculatePnL, calculateRiskAmount, calculatePlannedRR } from '../utils/calculations'
import Navbar from '../components/Navbar'

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
  const [leverage, setLeverage] = useState('1')
  const [setup, setSetup] = useState('')
  const [notes, setNotes] = useState('')

  const [checklist, setChecklist] = useState({
    clearSetup: false,
    stopLossSet: false,
    targetSet: false,
    sizeFollowsRisk: false,
    notFomo: false,
    notRevenge: false,
    notChasing: false,
  })
  const [followedPlan, setFollowedPlan] = useState<boolean | null>(null)
  const [mistakes, setMistakes] = useState<string[]>([])

  const MISTAKE_OPTIONS = [
    'No clear setup',
    'Entered without stop loss',
    'Moved stop loss',
    'Ignored risk limit',
    'Oversized position',
    'Early exit',
    'Late exit',
    'Revenge trade',
    'FOMO entry',
    'Chased entry',
    'Overtrading',
    'Ignored trading plan',
  ]

  function toggleMistake(tag: string) {
    setMistakes((prev) =>
      prev.includes(tag) ? prev.filter((m) => m !== tag) : [...prev, tag]
    )
  }

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
        setLeverage(String(data.leverage))
        setSetup(data.setup ?? '')
        setNotes(data.notes ?? '')
        setFollowedPlan(data.followed_plan)
        setMistakes(data.mistakes ?? [])
      }
      setLoadingTrade(false)
    }

    if (id) loadTrade()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const entryNum = parseFloat(entryPrice)
    const sizeNum = parseFloat(positionSize)
    const feesNum = parseFloat(fees)

    if (entryNum <= 0) {
      setError('Entry price must be greater than zero.')
      return
    }
    if (sizeNum <= 0) {
      setError('Position size must be greater than zero.')
      return
    }
    if (feesNum < 0) {
      setError('Fees cannot be negative.')
      return
    }

    setError(null)
    setSaving(true)

    const entry = parseFloat(entryPrice)
    const exit = exitPrice ? parseFloat(exitPrice) : null
    const sl = stopLoss ? parseFloat(stopLoss) : null
    const tp = takeProfit ? parseFloat(takeProfit) : null
    const size = parseFloat(positionSize)
    const feeAmount = parseFloat(fees)

    const leverageNum = parseFloat(leverage) || 1

    const pnl = calculatePnL({
      direction,
      entryPrice: entry,
      exitPrice: exit,
      positionSize: size,
      fees: feeAmount,
      leverage: leverageNum,
    })
    const riskAmount = calculateRiskAmount({ direction, entryPrice: entry, stopLoss: sl, positionSize: size })
    const rrPlanned = calculatePlannedRR({ direction, entryPrice: entry, stopLoss: sl, takeProfit: tp })

    const { error } = await supabase
      .from('trades')
      .update({
        pair,
        direction,
        leverage: leverageNum,
        setup: setup || null,
        entry_price: entry,
        exit_price: exit,
        stop_loss: sl,
        take_profit: tp,
        position_size: size,
        fees: feeAmount,
        pnl,
        risk_amount: riskAmount,
        rr_planned: rrPlanned,
        followed_plan: followedPlan,
        mistakes: mistakes.length > 0 ? mistakes : null,
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-8">
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
              min="0"
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
              min="0"
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
              min="0"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Leverage</label>
          <input
            type="number"
            step="any"
            min="1"
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Use 1 for spot trades.</p>
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

                <div className="border-t border-gray-700 pt-4">
          <h2 className="text-lg font-semibold mb-3">Pre-Trade Checklist</h2>
          <div className="space-y-2">
            {[
              { key: 'clearSetup', label: 'I have a clear setup' },
              { key: 'stopLossSet', label: 'Stop loss is defined' },
              { key: 'targetSet', label: 'Target is defined' },
              { key: 'sizeFollowsRisk', label: 'Position size follows my risk rule' },
              { key: 'notFomo', label: 'I am not entering because of FOMO' },
              { key: 'notRevenge', label: 'I am not revenge trading' },
              { key: 'notChasing', label: 'I am not chasing a move after missing the original entry' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checklist[key as keyof typeof checklist]}
                  onChange={(e) =>
                    setChecklist((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  className="rounded"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Did you follow your plan?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="followedPlan"
                checked={followedPlan === true}
                onChange={() => setFollowedPlan(true)}
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="followedPlan"
                checked={followedPlan === false}
                onChange={() => setFollowedPlan(false)}
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Mistakes (if any)</label>
          <div className="flex flex-wrap gap-2">
            {MISTAKE_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleMistake(tag)}
                className={`text-xs px-3 py-1 rounded-full border ${
                  mistakes.includes(tag)
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
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
    </div>
  )
}