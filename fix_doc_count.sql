-- Create function to increment doc_count
create or replace function increment_doc_count(project_id_param uuid)
returns void as $$
begin
  update public.projects
  set doc_count = doc_count + 1
  where id = project_id_param;
end;
$$ language plpgsql security definer;

-- Create function to decrement doc_count (for when documents are deleted)
create or replace function decrement_doc_count(project_id_param uuid)
returns void as $$
begin
  update public.projects
  set doc_count = greatest(doc_count - 1, 0)
  where id = project_id_param;
end;
$$ language plpgsql security definer;

-- Fix existing project counts (one-time update)
update public.projects p
set doc_count = (
  select count(*)
  from public.documents d
  where d.project_id = p.id
);
