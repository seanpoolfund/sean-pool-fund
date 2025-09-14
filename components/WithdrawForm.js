import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function WithdrawForm({ userId, onWithdraw }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleWithdraw = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .rpc('debit_wallet', { p_user_id: userId, p_amount: parseFloat(amount) })

    if (error) {
      setError(error.message)
    } else {
      onWithdraw(data)
      setAmount('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleWithdraw}>
      <input
        type="number"
        placeholder="Amount to withdraw"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="1"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Withdraw'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
