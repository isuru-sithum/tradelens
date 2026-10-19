import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

type Props = {
  followedWinRate: number | null
  brokeWinRate: number | null
  followedAvgPnL: number | null
  brokeAvgPnL: number | null
}

export default function FollowedPlanChart({
  followedWinRate,
  brokeWinRate,
  followedAvgPnL,
  brokeAvgPnL,
}: Props) {
  const hasData = followedWinRate !== null || brokeWinRate !== null

  if (!hasData) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-gray-400 text-sm">
        Not enough data yet. Mark whether you followed your plan on a few
        trades to see this comparison.
      </div>
    )
  }

  const winRateData = [
    {
      name: 'Followed Plan',
      'Win Rate %': followedWinRate !== null ? Number(followedWinRate.toFixed(1)) : 0,
    },
    {
      name: 'Broke Plan',
      'Win Rate %': brokeWinRate !== null ? Number(brokeWinRate.toFixed(1)) : 0,
    },
  ]

  const pnlData = [
    {
      name: 'Followed Plan',
      'Avg PnL': followedAvgPnL !== null ? Number(followedAvgPnL.toFixed(2)) : 0,
    },
    {
      name: 'Broke Plan',
      'Avg PnL': brokeAvgPnL !== null ? Number(brokeAvgPnL.toFixed(2)) : 0,
    },
  ]

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">
        Performance: Followed Plan vs Broke Plan
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-400 mb-2">Win Rate</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={winRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
              />
              <Bar dataKey="Win Rate %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-2">Average PnL</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pnlData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
              />
              <Bar dataKey="Avg PnL" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}