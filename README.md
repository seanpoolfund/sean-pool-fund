# Sean Pool Fund — Starter (Next.js + Supabase)

This is a small starter repository to help you prototype the Sean Pool Fund UI + simple server-side RPC calls to Supabase (token ledger).

**What is included**
- Next.js frontend with email magic-link authentication (Supabase).
- Simple wallet balance display (reads `wallets` table).
- Example server-side API (`/api/wallet`) that proxies admin RPC calls (requires SUPABASE_SERVICE_ROLE_KEY and SECRET_API_KEY).
- A Node script `scripts/credit_user.js` you can run locally to credit a user's wallet using the Supabase service role key.
- SQL files to create the `wallets` table and stored procedures (run these in Supabase SQL editor).

## Setup (step-by-step)
1. Create a Supabase project (https://supabase.com) and enable Auth (email).
2. In Supabase SQL editor, run the two SQL files:
   - `supabase/sql/create_tables.sql`
   - `supabase/sql/stored_procedures.sql`
3. From Supabase settings -> API, copy:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` (put into Vercel as NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - `SUPABASE_SERVICE_ROLE_KEY` (store securely; use for server-side scripts only)
4. Locally, copy `.env.example` to `.env.local` and fill values (or add in Vercel environment variables):
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - SECRET_API_KEY (pick a strong secret for API proxy calls)
5. Install dependencies:
   ```bash
   npm install
   ```
6. Run dev server:
   ```bash
   npm run dev
   ```
7. To credit a user (test), run:
   ```bash
   node scripts/credit_user.js <user_id> 100
   ```
   The script uses SUPABASE_SERVICE_ROLE_KEY to call the `deposit_tokens` RPC.

## Security notes (IMPORTANT)
- Do **not** expose SUPABASE_SERVICE_ROLE_KEY in client-side code or commit it to GitHub.
- The provided `/api/wallet` route in this starter is a *simple example* and requires a `SECRET_API_KEY` header for calls. In production, secure RPCs properly (server-side auth, role-based policies, rate-limiting, logging).
- This repo is intentionally minimal for prototyping. For production you will need: KYC flows, STK push integration (M-Pesa), proper RBAC, logging, audits, encryption at rest, pen-testing, and institutional custody integrations.

## Next steps I can help with immediately
- Add admin dashboard (list wallets, approve withdrawals).
- Add M-Pesa STK Push server route and webhook handler.
- Create Next.js API route that uses Supabase auth cookies for user actions.
- Create GitHub Actions workflow to auto-deploy to Vercel.

