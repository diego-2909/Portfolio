-- =============================================================================
-- Liens uniques par recruteur — schéma Supabase
-- À exécuter une seule fois : Supabase → SQL Editor → New query → coller → Run.
-- =============================================================================

-- E-mail du compte administrateur (le seul qui pourra voir et créer les liens).
-- Si tu utilises une autre adresse pour te connecter à la page /admin, change-la ici
-- (deux occurrences, dans les règles plus bas) avant d'exécuter le script.
--   d.cortes@me.com

-- -----------------------------------------------------------------------------
-- 1. Les liens : un par candidature
-- -----------------------------------------------------------------------------
create table if not exists public.links (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique check (code ~ '^[a-z0-9]{6,12}$'),
  company     text not null check (char_length(company) between 1 and 120),
  note        text check (char_length(note) <= 500),
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 2. Les visites : ce qui se passe quand quelqu'un ouvre un lien
--    event : 'open' (ouverture), 'project' (aperçu d'un projet ouvert),
--            'cv' (CV téléchargé), 'lang' (changement de langue)
--    Aucune adresse IP ni donnée personnelle n'est enregistrée.
-- -----------------------------------------------------------------------------
create table if not exists public.visits (
  id          bigint generated always as identity primary key,
  link_id     uuid not null references public.links(id) on delete cascade,
  session_id  text not null check (char_length(session_id) <= 40),
  event       text not null check (event in ('open', 'project', 'cv', 'lang')),
  detail      text check (char_length(detail) <= 80),
  created_at  timestamptz not null default now()
);
create index if not exists visits_link_id_idx on public.visits (link_id, created_at desc);

-- -----------------------------------------------------------------------------
-- 3. Sécurité : personne ne lit ni n'écrit directement dans les tables,
--    sauf l'administrateur connecté.
-- -----------------------------------------------------------------------------
alter table public.links  enable row level security;
alter table public.visits enable row level security;

drop policy if exists links_admin_all on public.links;
create policy links_admin_all on public.links
  for all to authenticated
  using ((auth.jwt() ->> 'email') = 'd.cortes@me.com')
  with check ((auth.jwt() ->> 'email') = 'd.cortes@me.com');

drop policy if exists visits_admin_read on public.visits;
create policy visits_admin_read on public.visits
  for select to authenticated
  using ((auth.jwt() ->> 'email') = 'd.cortes@me.com');

-- -----------------------------------------------------------------------------
-- 4. La seule porte d'entrée publique : enregistrer une visite
--    pour un code qui existe. Un code inconnu est ignoré sans erreur.
--    Le visiteur ne peut rien lire : ni les entreprises, ni les autres visites.
-- -----------------------------------------------------------------------------
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

  select id into v_link from public.links where code = lower(left(p_code, 12));
  if v_link is null then
    return;
  end if;

  -- Garde-fou contre l'abus : au plus 200 événements par session.
  if (select count(*) from public.visits where session_id = left(p_session, 40)) >= 200 then
    return;
  end if;

  insert into public.visits (link_id, session_id, event, detail)
  values (v_link, left(p_session, 40), p_event, left(p_detail, 80));
end;
$$;

revoke all on function public.track(text, text, text, text) from public;
grant execute on function public.track(text, text, text, text) to anon, authenticated;
