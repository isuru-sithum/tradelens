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
  }
}