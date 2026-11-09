create extension if not exists pgcrypto;

create type user_role as enum ('student','admin');
create type approval_status as enum ('pending','approved','rejected');
create type enrollment_type as enum ('regular','retake','improvement');
create type post_type as enum ('announcement','deadline','exam');
create type post_kind as enum ('general','reschedule','cancel','online');
create type notification_type as enum ('post','deadline','resource','reminder');

create table batches (id uuid primary key default gen_random_uuid(), department text not null, number int not null, unique (department, number));
create table sections (id uuid primary key default gen_random_uuid(), batch_id uuid not null references batches(id) on delete cascade, name text not null, cr_can_approve_signups boolean not null default false, unique (batch_id, name));
create table terms (id uuid primary key default gen_random_uuid(), name text not null unique, is_current boolean not null default false);
create unique index one_current_term on terms (is_current) where is_current;
create table section_terms (section_id uuid references sections(id) on delete cascade, term_id uuid references terms(id) on delete cascade, semester_no smallint not null check (semester_no between 1 and 8), primary key (section_id, term_id));
create table courses (id uuid primary key default gen_random_uuid(), code text not null unique, title text not null);
create table offerings (id uuid primary key default gen_random_uuid(), course_id uuid not null references courses(id), section_id uuid not null references sections(id) on delete cascade, term_id uuid not null references terms(id), faculty_name text not null, unique (course_id, section_id, term_id), unique (id, section_id));
create table users (
  id uuid primary key references auth.users(id) on delete cascade, name text not null, email text not null unique, phone text,
  student_id text unique, role user_role not null default 'student', status approval_status not null default 'pending',
  reject_reason text, section_id uuid references sections(id), admin_scope uuid references batches(id),
  created_at timestamptz not null default now(),
  check (role = 'admin' or (section_id is not null and student_id is not null))
);
create table section_crs (user_id uuid references users(id) on delete cascade, section_id uuid references sections(id) on delete cascade, primary key (user_id, section_id));
create table enrollments (student_id uuid references users(id) on delete cascade, offering_id uuid references offerings(id) on delete cascade, type enrollment_type not null default 'retake', created_at timestamptz not null default now(), primary key (student_id, offering_id));
create table enrollment_requests (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references users(id) on delete cascade,
  offering_id uuid not null references offerings(id) on delete cascade, note text, status approval_status not null default 'pending',
  reject_reason text, decided_by uuid references users(id) on delete set null, decided_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index one_pending_request on enrollment_requests (student_id, offering_id) where status = 'pending';
create table posts (
  id uuid primary key default gen_random_uuid(), section_id uuid not null references sections(id) on delete cascade,
  offering_id uuid, term_id uuid not null references terms(id), type post_type not null, kind post_kind not null default 'general',
  title text not null, body text not null default '', due_at timestamptz, expires_on date, pinned boolean not null default false,
  author_id uuid references users(id) on delete set null, author_name text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  foreign key (offering_id, section_id) references offerings(id, section_id) on delete cascade,
  check (type = 'announcement' or kind = 'general'), check (type = 'announcement' or due_at is not null)
);
create table resources (
  id uuid primary key default gen_random_uuid(), offering_id uuid not null references offerings(id) on delete cascade, title text not null,
  drive_url text not null check (drive_url like 'https://drive.google.com/%' or drive_url like 'https://docs.google.com/%'),
  author_id uuid references users(id) on delete set null, author_name text, created_at timestamptz not null default now()
);
create table schedule_entries (
  id uuid primary key default gen_random_uuid(), section_id uuid not null references sections(id) on delete cascade, term_id uuid not null references terms(id),
  day smallint not null check (day between 0 and 6), start_time time not null, end_time time not null, offering_id uuid not null, room text not null default '',
  foreign key (offering_id, section_id) references offerings(id, section_id) on delete cascade, check (end_time > start_time)
);
create table notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id) on delete cascade, type notification_type not null, ref_id uuid not null, title text, message text, created_at timestamptz not null default now(), read_at timestamptz);
create index on posts (section_id, created_at desc); create index on posts (offering_id); create index on resources (offering_id);
create index on offerings (section_id, term_id); create index on enrollments (offering_id); create index on users (section_id);
create index on schedule_entries (section_id, term_id, day); create index on notifications (user_id, created_at desc);
