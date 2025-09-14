import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function DepositForm({ userId, onDeposit }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDeposit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .rpc('credit_wallet', { p_user_id: userId, p_amount: parseFloat(amount) })

    if (error) {
      setError(error.message)
    } else {
      onDeposit(data)
      setAmount('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleDeposit}>
      <input
        type="number"
        placeholder="Amount to deposit"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="1"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Deposit'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
