-- Add metadata column to documents table for storing extraction results
alter table public.documents 
add column if not exists metadata jsonb;
