import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { Trade } from '../hooks/useTrades'
import {
  getCumulativePnL,
  getMonthlyPnL,
  getWinLossDistribution,
  getPerformanceBySetup,
} from '../utils/stats'

const PIE_COLORS = ['#10b981', '#ef4444', '#6b7280']

export default function TradeCharts({ trades }: { trades: Trade[] }) {
  const cumulativeData = getCumulativePnL(trades)
  const monthlyData = getMonthlyPnL(trades)
  const distributionData = getWinLossDistribution(trades)
  const setupData = getPerformanceBySetup(trades)

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-base font-semibold mb-4">Cumulative PnL Over Time</h3>
        {cumulativeData.length === 0 ? (
          <p className="text-gray-400 text-sm">No closed trades yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Line
                type="monotone"
                dataKey="cumulativePnL"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-base font-semibold mb-4">Monthly PnL</h3>
        {monthlyData.length === 0 ? (
          <p className="text-gray-400 text-sm">No closed trades yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-base font-semibold mb-4">Win / Loss Distribution</h3>
        {distributionData.length === 0 ? (
          <p className="text-gray-400 text-sm">No closed trades yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {distributionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-base font-semibold mb-4">Performance by Setup</h3>
        {setupData.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No setup data yet. Add a "Setup" when logging trades.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={setupData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" fontSize={11} />
              <YAxis
                type="category"
                dataKey="setup"
                stroke="#9ca3af"
                fontSize={11}
                width={100}
              />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                {setupData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}