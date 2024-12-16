-- Create a custom users table with plain text password
create table public.users (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    password text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Create policies
create policy "Users can view their own data"
    on public.users
    for select
    using (auth.uid()::text = id::text);

create policy "Anyone can insert users"
    on public.users
    for insert
    with check (true);

-- Insert a sample user
insert into public.users (email, password)
values ('demo@example.com', 'demo123456');