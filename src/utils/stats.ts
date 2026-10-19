import type { Trade } from '../hooks/useTrades'

export function calculateStats(trades: Trade[]) {
  const closedTrades = trades.filter((t) => t.pnl !== null)

  const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0)

  const wins = closedTrades.filter((t) => (t.pnl ?? 0) > 0)
  const losses = closedTrades.filter((t) => (t.pnl ?? 0) < 0)
  const breakEven = closedTrades.filter((t) => (t.pnl ?? 0) === 0)

  const winRate =
    closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0

  const avgWin =
    wins.length > 0
      ? wins.reduce((sum, t) => sum + (t.pnl ?? 0), 0) / wins.length
      : 0

  const avgLoss =
    losses.length > 0
      ? losses.reduce((sum, t) => sum + (t.pnl ?? 0), 0) / losses.length
      : 0

  const grossProfit = wins.reduce((sum, t) => sum + (t.pnl ?? 0), 0)
  const grossLoss = Math.abs(losses.reduce((sum, t) => sum + (t.pnl ?? 0), 0))
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : null

  const bestTrade =
    closedTrades.length > 0
      ? closedTrades.reduce((best, t) =>
          (t.pnl ?? 0) > (best.pnl ?? 0) ? t : best
        )
      : null

  const worstTrade =
    closedTrades.length > 0
      ? closedTrades.reduce((worst, t) =>
          (t.pnl ?? 0) < (worst.pnl ?? 0) ? t : worst
        )
      : null

  // Followed plan vs broke plan comparison
  const followedTrades = closedTrades.filter((t) => t.followed_plan === true)
  const brokeTrades = closedTrades.filter((t) => t.followed_plan === false)

  const followedWinRate =
    followedTrades.length > 0
      ? (followedTrades.filter((t) => (t.pnl ?? 0) > 0).length /
          followedTrades.length) *
        100
      : null

  const brokeWinRate =
    brokeTrades.length > 0
      ? (brokeTrades.filter((t) => (t.pnl ?? 0) > 0).length /
          brokeTrades.length) *
        100
      : null

  const followedAvgPnL =
    followedTrades.length > 0
      ? followedTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0) /
        followedTrades.length
      : null

  const brokeAvgPnL =
    brokeTrades.length > 0
      ? brokeTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0) /
        brokeTrades.length
      : null

// Discipline score: % of closed trades where the user followed their plan
  const disciplineEligible = closedTrades.filter((t) => t.followed_plan !== null)
  const disciplineScore =
    disciplineEligible.length > 0
      ? (disciplineEligible.filter((t) => t.followed_plan === true).length /
          disciplineEligible.length) *
        100
      : null

  return {
    totalPnL,
    totalTrades: trades.length,
    closedTradesCount: closedTrades.length,
    wins: wins.length,
    losses: losses.length,
    breakEven: breakEven.length,
    winRate,
    avgWin,
    avgLoss,
    profitFactor,
    bestTrade,
    worstTrade,
    followedWinRate,
    brokeWinRate,
    followedAvgPnL,
    brokeAvgPnL,
    disciplineScore,
  }
}

export function getCumulativePnL(trades: Trade[]) {
  const closed = trades
    .filter((t) => t.pnl !== null)
    .slice()
    .sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())

  let running = 0
  return closed.map((t) => {
    running += t.pnl ?? 0
    return {
      date: new Date(t.trade_date).toLocaleDateString(),
      cumulativePnL: Number(running.toFixed(2)),
    }
  })
}

export function getMonthlyPnL(trades: Trade[]) {
  const closed = trades.filter((t) => t.pnl !== null)
  const byMonth: Record<string, number> = {}

  for (const t of closed) {
    const d = new Date(t.trade_date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    byMonth[key] = (byMonth[key] ?? 0) + (t.pnl ?? 0)
  }

  return Object.entries(byMonth)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([month, pnl]) => ({ month, pnl: Number(pnl.toFixed(2)) }))
}

export function getWinLossDistribution(trades: Trade[]) {
  const closed = trades.filter((t) => t.pnl !== null)
  const wins = closed.filter((t) => (t.pnl ?? 0) > 0).length
  const losses = closed.filter((t) => (t.pnl ?? 0) < 0).length
  const breakEven = closed.filter((t) => (t.pnl ?? 0) === 0).length

  return [
    { name: 'Wins', value: wins },
    { name: 'Losses', value: losses },
    { name: 'Break Even', value: breakEven },
  ].filter((d) => d.value > 0)
}

export function getPerformanceBySetup(trades: Trade[]) {
  const closed = trades.filter((t) => t.pnl !== null && t.setup)
  const bySetup: Record<string, number> = {}

  for (const t of closed) {
    const key = t.setup ?? 'Unlabeled'
    bySetup[key] = (bySetup[key] ?? 0) + (t.pnl ?? 0)
  }

  return Object.entries(bySetup).map(([setup, pnl]) => ({
    setup,
    pnl: Number(pnl.toFixed(2)),
  }))
}