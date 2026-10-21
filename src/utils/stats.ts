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

export function getWeeklyReview(trades: Trade[]) {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const weekTrades = trades.filter(
    (t) => new Date(t.trade_date) >= oneWeekAgo && t.pnl !== null
  )

  const netPnL = weekTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0)
  const wins = weekTrades.filter((t) => (t.pnl ?? 0) > 0)
  const winRate = weekTrades.length > 0 ? (wins.length / weekTrades.length) * 100 : 0

  // Most common mistake
  const mistakeCounts: Record<string, number> = {}
  for (const t of weekTrades) {
    for (const m of t.mistakes ?? []) {
      mistakeCounts[m] = (mistakeCounts[m] ?? 0) + 1
    }
  }
  const mostCommonMistake =
    Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  // Best and worst performing setup this week
  const setupPnL: Record<string, number> = {}
  for (const t of weekTrades) {
    if (t.setup) {
      setupPnL[t.setup] = (setupPnL[t.setup] ?? 0) + (t.pnl ?? 0)
    }
  }
  const sortedSetups = Object.entries(setupPnL).sort((a, b) => b[1] - a[1])
  const bestSetup = sortedSetups[0]?.[0] ?? null
  const worstSetup = sortedSetups[sortedSetups.length - 1]?.[0] ?? null

  // Rule violations: trades where followed_plan was false
  const ruleViolations = weekTrades.filter((t) => t.followed_plan === false).length

  // Simple improvement suggestions based on the data
  const suggestions: string[] = []

  if (mostCommonMistake) {
    suggestions.push(
      `Your most frequent mistake this week was "${mostCommonMistake}" — consider adding a specific checklist reminder for it.`
    )
  }

  const followedWeek = weekTrades.filter((t) => t.followed_plan === true)
  const brokeWeek = weekTrades.filter((t) => t.followed_plan === false)
  if (followedWeek.length > 0 && brokeWeek.length > 0) {
    const followedAvg =
      followedWeek.reduce((s, t) => s + (t.pnl ?? 0), 0) / followedWeek.length
    const brokeAvg =
      brokeWeek.reduce((s, t) => s + (t.pnl ?? 0), 0) / brokeWeek.length
    if (brokeAvg > followedAvg) {
      suggestions.push(
        'Your rule-breaking trades performed better than your disciplined ones this week — this is worth reviewing carefully rather than taking as encouragement to break rules more often.'
      )
    } else {
      suggestions.push(
        'Trades where you followed your plan outperformed the ones where you didn\'t — a good sign that your current rules are working.'
      )
    }
  }

  if (ruleViolations > 0) {
    suggestions.push(
      `You broke your trading plan on ${ruleViolations} trade${ruleViolations > 1 ? 's' : ''} this week.`
    )
  }

  if (weekTrades.length === 0) {
    suggestions.push('No closed trades this week — nothing to review yet.')
  }

  return {
    tradesCount: weekTrades.length,
    netPnL,
    winRate,
    mostCommonMistake,
    bestSetup,
    worstSetup,
    ruleViolations,
    suggestions,
  }
}