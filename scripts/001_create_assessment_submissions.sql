-- Create assessment_submissions table to store all assessment data
create table if not exists public.assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  
  -- Lead information
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  consent_given boolean not null default false,
  
  -- Assessment answers
  age_range text,
  net_worth text,
  investment_portfolio text,
  primary_goal text,
  tax_strategy text,
  estate_plan text,
  fee_structure text,
  risk_tolerance text,
  diversification text,
  rebalancing text,
  financial_advisor text,
  advisor_communication text,
  investment_performance text,
  
  -- Results
  score integer,
  qualification_status text check (qualification_status in ('qualified', 'not-qualified')),
  
  -- Timestamps
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on email for faster lookups
create index if not exists idx_assessment_submissions_email on public.assessment_submissions(email);

-- Create index on created_at for sorting
create index if not exists idx_assessment_submissions_created_at on public.assessment_submissions(created_at desc);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.assessment_submissions;

create trigger set_updated_at
  before update on public.assessment_submissions
  for each row
  execute function public.handle_updated_at();
