-- Funzione per creare la tabella orari
create or replace function create_orari_table()
returns void
language plpgsql
security definer
as $$
begin
  create table if not exists orari (
    id bigint primary key generated always as identity,
    giorno text not null,
    apertura text not null,
    chiusura text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );
end;
$$;

-- Funzione per creare la tabella prenotazioni
create or replace function create_prenotazioni_table()
returns void
language plpgsql
security definer
as $$
begin
  create table if not exists prenotazioni (
    id uuid primary key default gen_random_uuid(),
    nome text not null,
    giorno text not null,
    persone integer not null,
    timestamp timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );
end;
$$; 