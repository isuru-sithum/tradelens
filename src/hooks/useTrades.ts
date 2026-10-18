import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export type Trade = {
  id: string
  user_id: string
  pair: string
  direction: 'long' | 'short'
  entry_price: number
  exit_price: number | null
  stop_loss: number | null
  take_profit: number | null
  position_size: number
  leverage: number
  fees: number
  pnl: number | null
  risk_amount: number | null
  rr_planned: number | null
  setup: string | null
  followed_plan: boolean | null
  mistakes: string[] | null
  notes: string | null
  trade_date: string
  created_at: string
}

export function useTrades() {
  const { user } = useAuth()
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrades = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('trade_date', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setTrades(data as Trade[])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchTrades()
  }, [fetchTrades])

  return { trades, loading, error, refetch: fetchTrades }
}