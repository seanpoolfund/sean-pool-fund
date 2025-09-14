import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const session = data.session;
      if (session?.user) {
        setUser(session.user);
        loadWallet(session.user.id);
      }
    }).catch(() => {});

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadWallet(session.user.id);
      } else {
        setUser(null);
        setWallet(null);
      }
    });

    return () => {
      mounted = false;
      if (listener && listener.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  async function loadWallet(userId) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading wallet:', error);
        setWallet(null);
      } else if (data) {
        setWallet(data.balance);
      } else {
        setWallet(0);
      }
    } catch (err) {
      console.error(err);
      setWallet(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!email) return alert('Enter an email');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert('Error: ' + error.message);
    else alert('Check your email for a login link!');
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Sean Pool Fund — Starter</h1>

      {!user ? (
        <section>
          <p>Sign in with your email (magic link)</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{padding:8, width: 300}} />
          <button onClick={handleLogin} style={{marginLeft:8, padding:'8px 12px'}}>Send login link</button>
        </section>
      ) : (
        <section>
          <p>Signed in: <strong>{user.email}</strong></p>
          <p>Wallet balance: {loading ? 'Loading...' : (wallet !== null ? `${wallet} TOKEN` : 'Not available — run SQL in Supabase')}</p>
          <button onClick={async () => { await supabase.auth.signOut(); setUser(null); setWallet(null); }}>Sign out</button>
        </section>
      )}

      <hr style={{margin:'20px 0'}} />

      <h3>Developer notes</h3>
      <ol>
        <li>Install deps with <code>npm install</code></li>
        <li>Run dev server: <code>npm run dev</code></li>
        <li>Use <code>node scripts/credit_user.js &lt;user_id&gt; &lt;amount&gt;</code> to credit a user (server-side only).</li>
      </ol>
    </div>
  );
}
