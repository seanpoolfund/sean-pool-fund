import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function TransactionHistory({ userId }) {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      setTransactions(data)
    }

    fetchTransactions()
  }, [userId])

  return (
    <div>
      <h2>Transaction History</h2>
      <ul>
        {transactions.map(tx => (
          <li key={tx.id}>
            {tx.type} - {tx.amount} TOKEN - {new Date(tx.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}
