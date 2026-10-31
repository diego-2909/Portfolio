-- =============================================================================
-- Codes courts choisis à la main (diego-cortes.dev/cg, diego-cortes.dev/alten…)
-- À exécuter une fois si schema.sql a déjà été lancé avant ce changement :
-- Supabase → SQL Editor → New query → coller → Run.
-- =============================================================================

-- Codes de 2 à 20 caractères : lettres minuscules, chiffres et tirets.
alter table public.links drop constraint if exists links_code_check;
alter table public.links add constraint links_code_check
  check (code ~ '^[a-z0-9][a-z0-9-]{1,19}$' and code not in ('admin', 'assets'));

-- La fonction de suivi accepte désormais ces codes (jusqu'à 20 caractères).
create or replace function public.track(p_code text, p_session text, p_event text, p_detail text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_link uuid;
begin
  if p_event not in ('open', 'project', 'cv', 'lang') then
    return;
  end if;

  select id into v_link from public.links where code = lower(left(p_code, 20));
  if v_link is null then
    return;
  end if;

  if (select count(*) from public.visits where session_id = left(p_session, 40)) >= 200 then
    return;
  end if;

  insert into public.visits (link_id, session_id, event, detail)
  values (v_link, left(p_session, 40), p_event, left(p_detail, 80));
end;
$$;

revoke all on function public.track(text, text, text, text) from public;
grant execute on function public.track(text, text, text, text) to anon, authenticated;
