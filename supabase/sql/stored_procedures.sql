-- Stored procedures for safe deposit/withdraw (run in Supabase SQL editor)

create or replace function public.deposit_tokens(p_user_id uuid, p_amount numeric)
returns void language plpgsql security definer as $$
begin
  if p_amount <= 0 then
    raise exception 'Amount must be positive';
  end if;

  insert into public.wallets(user_id, balance, created_at, updated_at)
    values (p_user_id, p_amount, now(), now())
  on conflict (user_id) do
    update set balance = public.wallets.balance + p_amount,
               updated_at = now();
end;
$$;

create or replace function public.withdraw_tokens(p_user_id uuid, p_amount numeric)
returns void language plpgsql security definer as $$
begin
  if p_amount <= 0 then
    raise exception 'Amount must be positive';
  end if;

  update public.wallets
  set balance = balance - p_amount,
      updated_at = now()
  where user_id = p_user_id and balance >= p_amount;

  if not found then
    raise exception 'Insufficient funds';
  end if;
end;
$$;
