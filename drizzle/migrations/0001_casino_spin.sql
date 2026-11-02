CREATE OR REPLACE FUNCTION public.casino_spin(_user uuid, _stake numeric, _payout numeric)
RETURNS numeric LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE b numeric;
BEGIN
  INSERT INTO wallets(user_id) VALUES (_user) ON CONFLICT (user_id) DO NOTHING;
  SELECT balance INTO b FROM wallets WHERE user_id = _user FOR UPDATE;
  IF b < _stake THEN RAISE EXCEPTION 'Saldo insuficiente'; END IF;
  UPDATE wallets SET balance = balance - _stake + _payout WHERE user_id = _user RETURNING balance INTO b;
  RETURN b;
END $$;
REVOKE ALL ON FUNCTION public.casino_spin(uuid, numeric, numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.casino_spin(uuid, numeric, numeric) TO service_role;