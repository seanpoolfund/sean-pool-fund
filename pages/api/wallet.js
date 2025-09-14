// Example server-side API that calls Supabase RPCs using the SERVICE ROLE key.
// WARNING: This is a simple example for prototyping. Protect this route with proper auth in production.
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = req.headers['x-secret-key'] || req.body.secret;
  if (!secret || secret !== process.env.SECRET_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { user_id, amount, type } = req.body;
  if (!user_id || !amount || !type) return res.status(400).json({ error: 'Missing fields' });

  try {
    if (type === 'deposit') {
      const { data, error } = await supabaseAdmin.rpc('deposit_tokens', { p_user_id: user_id, p_amount: amount });
      if (error) throw error;
    } else if (type === 'withdraw') {
      const { data, error } = await supabaseAdmin.rpc('withdraw_tokens', { p_user_id: user_id, p_amount: amount });
      if (error) throw error;
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || err });
  }
}
