import { useTrades } from '../hooks/useTrades'
import { getWeeklyReview } from '../utils/stats'
import Navbar from '../components/Navbar'

export default function WeeklyReview() {
  const { trades, loading } = useTrades()
  const review = getWeeklyReview(trades)

  if (loading) {
    return <p className="text-white p-8">Loading...</p>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Weekly Review</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Trades This Week</p>
          <p className="text-xl font-bold">{review.tradesCount}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Net PnL</p>
          <p className={`text-xl font-bold ${review.netPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {review.netPnL.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Win Rate</p>
          <p className="text-xl font-bold">{review.winRate.toFixed(1)}%</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Rule Violations</p>
          <p className="text-xl font-bold text-red-400">{review.ruleViolations}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Most Common Mistake</p>
          <p className="text-lg font-medium">{review.mostCommonMistake ?? '—'}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Best / Worst Setup</p>
          <p className="text-lg font-medium">
            {review.bestSetup ?? '—'} / {review.worstSetup ?? '—'}
          </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">Suggestions</h2>
        <ul className="space-y-2">
          {review.suggestions.map((s, i) => (
            <li key={i} className="text-gray-300 text-sm flex gap-2">
              <span className="text-blue-400">•</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  )
}