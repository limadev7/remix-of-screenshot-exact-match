CREATE TABLE public.wallets (
  user_id uuid PRIMARY KEY,
  balance numeric(12,2) NOT NULL DEFAULT 1000,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wallets TO authenticated;
GRANT ALL ON public.wallets TO service_role;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own wallet" ON public.wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  selections jsonb NOT NULL,
  stake numeric(12,2) NOT NULL,
  odd numeric(12,2) NOT NULL,
  potential_return numeric(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz
);
CREATE INDEX bets_user_idx ON public.bets(user_id, created_at DESC);
GRANT SELECT ON public.bets TO authenticated;
GRANT ALL ON public.bets TO service_role;
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bets" ON public.bets FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.place_bet(_user uuid, _selections jsonb, _stake numeric, _odd numeric)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE b numeric; nid uuid;
BEGIN
  INSERT INTO wallets(user_id) VALUES (_user) ON CONFLICT DO NOTHING;
  SELECT balance INTO b FROM wallets WHERE user_id = _user FOR UPDATE;
  IF _stake <= 0 OR _stake > b THEN RAISE EXCEPTION 'Saldo insuficiente'; END IF;
  UPDATE wallets SET balance = balance - _stake WHERE user_id = _user;
  INSERT INTO bets(user_id, selections, stake, odd, potential_return)
  VALUES (_user, _selections, _stake, _odd, round(_stake * _odd, 2)) RETURNING id INTO nid;
  RETURN nid;
END $$;
REVOKE EXECUTE ON FUNCTION public.place_bet(uuid, jsonb, numeric, numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.place_bet(uuid, jsonb, numeric, numeric) TO service_role;

CREATE OR REPLACE FUNCTION public.settle_bet(_bet uuid, _won boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r bets;
BEGIN
  UPDATE bets SET status = CASE WHEN _won THEN 'won' ELSE 'lost' END, settled_at = now()
  WHERE id = _bet AND status = 'pending' RETURNING * INTO r;
  IF FOUND AND _won THEN
    UPDATE wallets SET balance = balance + r.potential_return WHERE user_id = r.user_id;
  END IF;
END $$;
REVOKE EXECUTE ON FUNCTION public.settle_bet(uuid, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.settle_bet(uuid, boolean) TO service_role;

CREATE OR REPLACE FUNCTION public.get_metrics()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'users', (SELECT count(*) FROM wallets),
    'bets', (SELECT count(*) FROM bets),
    'pending', (SELECT count(*) FROM bets WHERE status = 'pending'),
    'won', (SELECT count(*) FROM bets WHERE status = 'won'),
    'lost', (SELECT count(*) FROM bets WHERE status = 'lost'),
    'staked', (SELECT coalesce(sum(stake),0) FROM bets),
    'paid', (SELECT coalesce(sum(potential_return),0) FROM bets WHERE status = 'won'),
    'top', (SELECT coalesce(jsonb_agg(t), '[]'::jsonb) FROM (
      SELECT s->>'pickLabel' AS name, count(*) AS n FROM bets, jsonb_array_elements(selections) s
      WHERE s->>'pick' <> 'draw' GROUP BY 1 ORDER BY 2 DESC LIMIT 5) t)
  )
$$;
GRANT EXECUTE ON FUNCTION public.get_metrics() TO anon, authenticated;