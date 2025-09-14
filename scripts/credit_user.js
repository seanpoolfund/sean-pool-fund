// Usage: node scripts/credit_user.js <user_id> [amount]
// Requires environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Set it before running this script.');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

const userId = process.argv[2];
const amount = process.argv[3] || '100';

if (!userId) {
  console.log('Usage: node scripts/credit_user.js <user_id> [amount]');
  process.exit(1);
}

(async () => {
  try {
    const { data, error } = await supabaseAdmin.rpc('deposit_tokens', { p_user_id: userId, p_amount: amount });
    if (error) {
      console.error('Error:', error);
      process.exit(1);
    }
    console.log('Success:', data);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
