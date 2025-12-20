-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create organizations table
create table if not exists public.organizations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  type text,
  team_strength text,
  logo text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for organizations
alter table public.organizations enable row level security;

create policy "Users can view their own organizations"
  on public.organizations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own organizations"
  on public.organizations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own organizations"
  on public.organizations for update
  using (auth.uid() = user_id);

-- 2. Create projects table
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  description text,
  doc_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_updated timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for projects
alter table public.projects enable row level security;

create policy "Users can view projects of their organizations"
  on public.projects for select
  using (
    exists (
      select 1 from public.organizations
      where organizations.id = projects.org_id
      and organizations.user_id = auth.uid()
    )
  );

create policy "Users can insert projects into their organizations"
  on public.projects for insert
  with check (
    exists (
      select 1 from public.organizations
      where organizations.id = projects.org_id
      and organizations.user_id = auth.uid()
    )
  );

create policy "Users can update projects of their organizations"
  on public.projects for update
  using (
    exists (
      select 1 from public.organizations
      where organizations.id = projects.org_id
      and organizations.user_id = auth.uid()
    )
  );

create policy "Users can delete projects of their organizations"
  on public.projects for delete
  using (
    exists (
      select 1 from public.organizations
      where organizations.id = projects.org_id
      and organizations.user_id = auth.uid()
    )
  );

-- 3. Create documents table
create table if not exists public.documents (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  name text not null,
  size text,
  type text,
  status text default 'uploaded',
  storage_path text not null,
  file_format text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for documents
alter table public.documents enable row level security;

create policy "Users can view documents of their projects"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Users can insert documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update their documents"
  on public.documents for update
  using (auth.uid() = user_id);

create policy "Users can delete their documents"
  on public.documents for delete
  using (auth.uid() = user_id);

-- 4. Storage bucket setup
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Authenticated users can upload documents"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.role() = 'authenticated');

create policy "Authenticated users can view documents"
  on storage.objects for select
  using (bucket_id = 'documents' and auth.role() = 'authenticated');

create policy "Users can update their own documents"
  on storage.objects for update
  using (bucket_id = 'documents' and auth.uid() = owner);

create policy "Users can delete their own documents"
  on storage.objects for delete
  using (bucket_id = 'documents' and auth.uid() = owner);
