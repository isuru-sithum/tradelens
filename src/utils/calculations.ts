type PnLInput = {
  direction: 'long' | 'short'
  entryPrice: number
  exitPrice: number | null
  positionSize: number
  fees: number
}

export function calculatePnL({
  direction,
  entryPrice,
  exitPrice,
  positionSize,
  fees,
}: PnLInput): number | null {
  if (exitPrice === null) return null

  const priceDiff =
    direction === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice

  const grossPnL = priceDiff * positionSize
  return grossPnL - fees
}

type RiskInput = {
  direction: 'long' | 'short'
  entryPrice: number
  stopLoss: number | null
  positionSize: number
}

export function calculateRiskAmount({
  direction,
  entryPrice,
  stopLoss,
  positionSize,
}: RiskInput): number | null {
  if (stopLoss === null) return null

  const riskPerUnit =
    direction === 'long' ? entryPrice - stopLoss : stopLoss - entryPrice

  return Math.abs(riskPerUnit) * positionSize
}

type RRInput = {
  direction: 'long' | 'short'
  entryPrice: number
  stopLoss: number | null
  takeProfit: number | null
}

export function calculatePlannedRR({
  direction,
  entryPrice,
  stopLoss,
  takeProfit,
}: RRInput): number | null {
  if (stopLoss === null || takeProfit === null) return null

  const risk =
    direction === 'long' ? entryPrice - stopLoss : stopLoss - entryPrice
  const reward =
    direction === 'long' ? takeProfit - entryPrice : entryPrice - takeProfit

  if (risk <= 0) return null

  return reward / risk
}