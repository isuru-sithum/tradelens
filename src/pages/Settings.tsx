import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Settings() {
  const { user } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [startingBalance, setStartingBalance] = useState('')
  const [riskPerTrade, setRiskPerTrade] = useState('')

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        setError(error.message)
      } else if (data) {
        setDisplayName(data.display_name ?? '')
        setStartingBalance(String(data.starting_balance))
        setRiskPerTrade(String(data.risk_per_trade_percent))
      } else {
        // No profile row exists yet for this user — use sensible defaults
        setStartingBalance('0')
        setRiskPerTrade('1')
      }
      setLoadingProfile(false)
    }

    loadProfile()
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setSaving(true)

    const { error } = await supabase.from('profiles').upsert({
      id: user?.id,
      display_name: displayName || null,
      starting_balance: parseFloat(startingBalance),
      risk_per_trade_percent: parseFloat(riskPerTrade),
      updated_at: new Date().toISOString(),
    })

    setSaving(false)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Settings saved.')
    }
  }

  if (loadingProfile) {
    return <p className="text-white p-8">Loading settings...</p>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm mb-1">Display Name</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Starting Balance (USD)</label>
          <input
            required
            type="number"
            step="any"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Max Risk Per Trade (%)</label>
          <input
            required
            type="number"
            step="any"
            min="0"
            max="100"
            value={riskPerTrade}
            onChange={(e) => setRiskPerTrade(e.target.value)}
            className="w-full rounded bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="text-green-400 text-sm" role="status">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded font-medium"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
      </div>
    </div>
  )
}