# E-CR Portal: Backend Spec (Supabase)

**For:** the AI agent (and you) wiring the Next.js frontend to a real database. **Depends on:** Frontend Spec v3. All data shapes there stay the same except the small changes in section 9. **Goal:** Replace `/data/mock.ts` and the bodies of `/data/queries.ts` with Supabase. Pages should not change.

**Security rule:** the database is the real wall. Route guards in Next.js are only for a nice experience. Every access rule is enforced by Row Level Security (RLS) in Postgres.

---

## 1. Decisions and assumptions

1. **Login with email and password** (Supabase Auth). Student ID is stored and unique, but is not used to log in yet. See the open decision in section 10.
2. **No email confirmation in the MVP.** The admin approval is the gate. A pending user can log in but sees only a pending screen.
3. **Roles in the database:** `student` and `admin`. A CR is a student with a row in `section_crs`.
4. **Admin scope** (`users.admin_scope`) is stored but not enforced. Every admin sees everything for now.
5. **Regular courses** are not stored per student. A student sees all offerings of their own section. Only retakes get an `enrollments` row. The `improvement` type exists but is not used yet.
6. **Time zone:** the database uses the Asia/Dhaka date for expiry checks.
7. **Resources** are Google Drive links only. No Supabase Storage.

---

## 2. Packages and environment

New packages (the only exception to the no-new-packages rule): `@supabase/supabase-js` and `@supabase/ssr`. Optional dev tools: the Supabase CLI for migrations and type generation.

Environment variables (names may differ slightly in the Supabase dashboard, for example publishable key instead of anon key):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server only, never in client code, never committed
```

---

## 3. Files to add

```
src/lib/supabase/client.ts    browser client (createBrowserClient)
src/lib/supabase/server.ts    server client that reads cookies (createServerClient)
src/lib/supabase/admin.ts     service-role client, server only
src/proxy.ts                  refreshes the session, guards routes
                              (Next 16 calls this file proxy.ts, older versions middleware.ts. Check the Next docs.)
src/app/actions/admin.ts      server actions that need the service role (section 6)
src/data/queries.ts           real implementation (section 7)
supabase/migrations/          0001_schema.sql, 0002_helpers.sql, 0003_rls.sql, 0004_triggers_rpc.sql
scripts/seed.ts               creates demo accounts and data from the v3 mock
```

---

## 4. Auth flow

1. **Sign up** (`/signup`): call `supabase.auth.signUp({ email, password, options: { data: { name, student_id, section_id, phone } } })`. A database trigger copies that into `public.users` with `role = student` and `status = pending`.
2. **Pending gate:** after login, the app reads the user row. If `status = pending`, show the pending screen only. If `rejected`, show the reject reason.
3. **Approval:** admin (or a CR where allowed) calls the `decide_signup` function (section 5.4).
4. **First approved login:** show the welcome card (section and semester) once.
5. **Role redirect:** admin goes to `/admin`. A student who has a `section_crs` row goes to `/cr`. Other students go to `/dashboard`.
6. **Route guards** in `proxy.ts`: no session goes to `/login` (except `/login` and `/signup`). `/admin/**` needs `role = admin`. `/cr` and `/requests` need a `section_crs` row. These are for experience only. RLS still blocks real access.
7. **Admins are never created by the sign-up form.** The trigger ignores any role sent from the client. Roles come only from `app_metadata`, which only the service role can set (section 6).

---

## 5. SQL

Run the four blocks in order. Names match the v3 types in snake\_case.

### 5.1 Schema (0001)

```sql
create type user_role as enum ('student','admin');
create type approval_status as enum ('pending','approved','rejected');
create type enrollment_type as enum ('regular','retake','improvement');
create type post_type as enum ('announcement','deadline','exam');
create type post_kind as enum ('general','reschedule','cancel','online');
create type notification_type as enum ('post','deadline','resource','reminder');

create table batches (
  id uuid primary key default gen_random_uuid(),
  department text not null, number int not null,
  unique (department, number));
create table sections (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references batches(id) on delete cascade,
  name text not null,
  cr_can_approve_signups boolean not null default false,
  unique (batch_id, name));
create table terms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_current boolean not null default false);
create unique index one_current_term on terms (is_current) where is_current;
create table section_terms (
  section_id uuid references sections(id) on delete cascade,
  term_id uuid references terms(id) on delete cascade,
  semester_no smallint not null check (semester_no between 1 and 8),
  primary key (section_id, term_id));
create table courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, title text not null);
create table offerings (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id),
  section_id uuid not null references sections(id) on delete cascade,
  term_id uuid not null references terms(id),
  faculty_name text not null,
  unique (course_id, section_id, term_id),
  unique (id, section_id));

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null, email text not null unique, phone text,
  student_id text unique,
  role user_role not null default 'student',
  status approval_status not null default 'pending',
  reject_reason text,
  section_id uuid references sections(id),
  admin_scope uuid references batches(id),
  created_at timestamptz not null default now(),
  check (role = 'admin' or (section_id is not null and student_id is not null)));

create table section_crs (
  user_id uuid references users(id) on delete cascade,
  section_id uuid references sections(id) on delete cascade,
  primary key (user_id, section_id));

create table enrollments (
  student_id uuid references users(id) on delete cascade,
  offering_id uuid references offerings(id) on delete cascade,
  type enrollment_type not null default 'retake',
  created_at timestamptz not null default now(),
  primary key (student_id, offering_id));
create table enrollment_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references users(id) on delete cascade,
  offering_id uuid not null references offerings(id) on delete cascade,
  note text,
  status approval_status not null default 'pending',
  reject_reason text,
  decided_by uuid references users(id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now());
create unique index one_pending_request on enrollment_requests (student_id, offering_id) where status = 'pending';

create table posts (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references sections(id) on delete cascade,
  offering_id uuid,
  term_id uuid not null references terms(id),      -- set by trigger
  type post_type not null,
  kind post_kind not null default 'general',
  title text not null, body text not null default '',
  due_at timestamptz, expires_on date,
  pinned boolean not null default false,
  author_id uuid references users(id) on delete set null,
  author_name text,                                -- set by trigger
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (offering_id, section_id) references offerings(id, section_id) on delete cascade,
  check (type = 'announcement' or kind = 'general'),
  check (type = 'announcement' or due_at is not null));

create table resources (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references offerings(id) on delete cascade,
  title text not null,
  drive_url text not null check (drive_url like 'https://drive.google.com/%' or drive_url like 'https://docs.google.com/%'),
  author_id uuid references users(id) on delete set null,
  author_name text,                                -- set by trigger
  created_at timestamptz not null default now());

create table schedule_entries (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references sections(id) on delete cascade,
  term_id uuid not null references terms(id),
  day smallint not null check (day between 0 and 6),
  start_time time not null, end_time time not null,
  offering_id uuid not null, room text not null default '',
  foreign key (offering_id, section_id) references offerings(id, section_id) on delete cascade,
  check (end_time > start_time));

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type notification_type not null,
  ref_id uuid not null,
  created_at timestamptz not null default now(),
  read_at timestamptz);

create index on posts (section_id, created_at desc);
create index on posts (offering_id);
create index on resources (offering_id);
create index on offerings (section_id, term_id);
create index on enrollments (offering_id);
create index on users (section_id);
create index on schedule_entries (section_id, term_id, day);
create index on notifications (user_id, created_at desc);
```

### 5.2 Helpers and views (0002)

All helpers are `security definer` with a fixed `search_path`, so policies can call them without looping through RLS.

```sql
create function app_today() returns date language sql stable as
$$ select (now() at time zone 'Asia/Dhaka')::date $$;

create function is_approved() returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from users where id = auth.uid() and status = 'approved') $$;

create function is_admin() returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from users where id = auth.uid() and role = 'admin' and status = 'approved') $$;

create function my_section() returns uuid language sql stable security definer set search_path = public as
$$ select section_id from users where id = auth.uid() and status = 'approved' $$;

create function is_cr_of(sec uuid) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from section_crs c join users u on u.id = c.user_id
   where c.user_id = auth.uid() and c.section_id = sec and u.status = 'approved') $$;

create function offering_section(off uuid) returns uuid language sql stable security definer set search_path = public as
$$ select section_id from offerings where id = off $$;

create function can_see_offering(off uuid) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from offerings o where o.id = off and (
     o.section_id = my_section()
     or exists (select 1 from enrollments e where e.student_id = auth.uid()
                and e.offering_id = o.id and e.type in ('regular','retake')))) $$;

create function cr_can_see_student(uid uuid) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from users u where u.id = uid and is_cr_of(u.section_id))
   or exists (select 1 from enrollment_requests r where r.student_id = uid and is_cr_of(offering_section(r.offering_id)))
   or exists (select 1 from enrollments e where e.student_id = uid and is_cr_of(offering_section(e.offering_id))) $$;

-- Views the frontend reads
create view classmates as
  select id, name, student_id, section_id from users
  where status = 'approved' and role = 'student' and section_id = my_section();
create view my_crs as
  select u.id, u.name, u.email, u.phone, c.section_id
  from section_crs c join users u on u.id = c.user_id
  where c.section_id = my_section() and u.status = 'approved';
create view my_offerings with (security_invoker = true) as
  select * from offerings where can_see_offering(id);
grant select on classmates, my_crs, my_offerings to authenticated;
```

`classmates` returns only id, name, and student ID. That is how the rule *friends show nothing else* is enforced.

### 5.3 Row Level Security (0003)

```sql
do $$ declare t text; begin
  foreach t in array array['batches','sections','terms','section_terms','courses','offerings','users','section_crs',
    'enrollments','enrollment_requests','posts','resources','schedule_entries','notifications'] loop
    execute format('alter table %I enable row level security', t);
  end loop;
  -- admins can change reference data directly
  foreach t in array array['batches','sections','terms','section_terms','courses','offerings','section_crs','enrollments'] loop
    execute format('create policy admin_all on %I for all to authenticated using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- Reference data. Batches and sections are public so the sign-up form can list them.
create policy read_public on batches  for select to anon, authenticated using (true);
create policy read_public on sections for select to anon, authenticated using (true);
create policy read_approved on terms         for select to authenticated using (is_approved());
create policy read_approved on section_terms for select to authenticated using (is_approved());
create policy read_approved on courses       for select to authenticated using (is_approved());
create policy read_approved on offerings     for select to authenticated using (is_approved());

-- users: self, admin, or a CR who is allowed to see that student
create policy users_read on users for select to authenticated
  using (id = auth.uid() or is_admin() or cr_can_see_student(id));
create policy users_update_self on users for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
revoke update on users from authenticated;
grant update (name, phone) on users to authenticated;   -- role, status, section stay locked

-- CR lists
create policy crs_read on section_crs for select to authenticated
  using (section_id = my_section() or is_cr_of(section_id));

-- enrollments (writes come only from the decide_enrollment_request function or admins)
create policy enr_read on enrollments for select to authenticated
  using (student_id = auth.uid() or is_cr_of(offering_section(offering_id)));

-- retake requests
create policy req_read on enrollment_requests for select to authenticated
  using (student_id = auth.uid() or is_admin() or is_cr_of(offering_section(offering_id)));
create policy req_insert on enrollment_requests for insert to authenticated
  with check (student_id = auth.uid() and is_approved() and status = 'pending'
              and offering_section(offering_id) is distinct from my_section());

-- posts: students see their section and approved retake offerings, and not expired ones
create policy posts_read on posts for select to authenticated using (
  is_admin() or is_cr_of(section_id)
  or (is_approved() and (expires_on is null or expires_on >= app_today())
      and ((offering_id is null and section_id = my_section())
           or (offering_id is not null and can_see_offering(offering_id)))));
create policy posts_insert on posts for insert to authenticated
  with check ((is_admin() or is_cr_of(section_id)) and author_id = auth.uid());
create policy posts_update on posts for update to authenticated
  using (is_admin() or is_cr_of(section_id)) with check (is_admin() or is_cr_of(section_id));
create policy posts_delete on posts for delete to authenticated
  using (is_admin() or is_cr_of(section_id));

-- resources
create policy res_read on resources for select to authenticated
  using (can_see_offering(offering_id) or is_admin() or is_cr_of(offering_section(offering_id)));
create policy res_insert on resources for insert to authenticated
  with check ((is_admin() or is_cr_of(offering_section(offering_id))) and author_id = auth.uid());
create policy res_update on resources for update to authenticated
  using (is_admin() or is_cr_of(offering_section(offering_id)));
create policy res_delete on resources for delete to authenticated
  using (is_admin() or is_cr_of(offering_section(offering_id)));

-- routine table
create policy sch_read on schedule_entries for select to authenticated
  using (is_admin() or is_cr_of(section_id) or (is_approved() and section_id = my_section()));
create policy sch_write on schedule_entries for all to authenticated
  using (is_admin() or is_cr_of(section_id)) with check (is_admin() or is_cr_of(section_id));

-- notifications: own rows, and only read_at can change
create policy notif_read on notifications for select to authenticated using (user_id = auth.uid());
create policy notif_update on notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke update on notifications from authenticated;
grant update (read_at) on notifications to authenticated;
```

### 5.4 Triggers and functions (0004)

```sql
-- Create the profile when someone signs up. Role and status come only from app_metadata.
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, name, email, phone, student_id, section_id, role, status)
  values (new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'student_id',
    nullif(new.raw_user_meta_data->>'section_id', '')::uuid,
    coalesce((new.raw_app_meta_data->>'role')::user_role, 'student'),
    coalesce((new.raw_app_meta_data->>'status')::approval_status, 'pending'));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- A CR must be a student of that section
create function check_cr() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from users where id = new.user_id and role = 'student' and section_id = new.section_id) then
    raise exception 'A CR must be a student of that section';
  end if;
  return new;
end $$;
create trigger section_crs_check before insert or update on section_crs
  for each row execute function check_cr();

-- Fill term and author name, keep updated_at fresh
create function post_defaults() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.term_id := coalesce((select term_id from offerings where id = new.offering_id),
                            (select id from terms where is_current));
    new.author_name := (select name from users where id = new.author_id);
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger posts_defaults before insert or update on posts
  for each row execute function post_defaults();

create function resource_defaults() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.author_name := (select name from users where id = new.author_id);
  return new;
end $$;
create trigger resources_defaults before insert on resources
  for each row execute function resource_defaults();

-- Notifications: one row per student who can see the new item (author excluded)
create function notify_post() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into notifications (user_id, type, ref_id)
  select distinct a.uid,
         case when new.type = 'deadline' then 'deadline'::notification_type else 'post'::notification_type end,
         new.id
  from (select id as uid from users
         where status = 'approved' and role = 'student' and section_id = new.section_id
        union
        select student_id from enrollments
         where new.offering_id is not null and offering_id = new.offering_id and type in ('regular','retake')) a
  where a.uid is distinct from new.author_id;
  return new;
end $$;
create trigger posts_notify after insert on posts for each row execute function notify_post();

create function notify_resource() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into notifications (user_id, type, ref_id)
  select distinct a.uid, 'resource'::notification_type, new.id
  from (select u.id as uid from users u join offerings o on o.section_id = u.section_id
         where o.id = new.offering_id and u.status = 'approved' and u.role = 'student'
        union
        select student_id from enrollments
         where offering_id = new.offering_id and type in ('regular','retake')) a
  where a.uid is distinct from new.author_id;
  return new;
end $$;
create trigger resources_notify after insert on resources for each row execute function notify_resource();

-- Approve or reject a first sign-up
create function decide_signup(p_user uuid, p_approve boolean, p_reason text default null)
returns void language plpgsql security definer set search_path = public as $$
declare u users; s sections;
begin
  select * into u from users where id = p_user and status = 'pending' and role = 'student';
  if not found then raise exception 'No pending sign-up'; end if;
  select * into s from sections where id = u.section_id;
  if not (is_admin() or (is_cr_of(u.section_id) and s.cr_can_approve_signups)) then
    raise exception 'Not allowed';
  end if;
  update users set
    status = case when p_approve then 'approved'::approval_status else 'rejected'::approval_status end,
    reject_reason = case when p_approve then null else p_reason end
  where id = p_user;
end $$;

-- Approve or reject a retake request. Approval creates the enrollment.
create function decide_enrollment_request(p_request uuid, p_approve boolean, p_reason text default null)
returns void language plpgsql security definer set search_path = public as $$
declare r enrollment_requests;
begin
  select * into r from enrollment_requests where id = p_request and status = 'pending';
  if not found then raise exception 'No pending request'; end if;
  if not (is_admin() or is_cr_of(offering_section(r.offering_id))) then
    raise exception 'Not allowed';
  end if;
  update enrollment_requests set
    status = case when p_approve then 'approved'::approval_status else 'rejected'::approval_status end,
    reject_reason = case when p_approve then null else p_reason end,
    decided_by = auth.uid(), decided_at = now()
  where id = p_request;
  if p_approve then
    insert into enrollments (student_id, offering_id, type) values (r.student_id, r.offering_id, 'retake')
    on conflict do nothing;
  end if;
end $$;

revoke execute on function decide_signup, decide_enrollment_request from public, anon;
grant execute on function decide_signup, decide_enrollment_request to authenticated;
```

---

## 6. Actions that need the service role

Creating or deleting auth users cannot be done with the normal client. Put these in server actions in `src/app/actions/admin.ts` using `admin.ts`. Every action must first check the caller with the normal server client (`select is_admin()`) and stop if it is false.

| Action | What it does |
| --- | --- |
| `createAdmin(name, email, password)` | `auth.admin.createUser` with `app_metadata: { role: 'admin', status: 'approved' }`. |
| `addStudent(name, studentId, email, sectionId)` | Creates the user with `app_metadata: { status: 'approved' }` and the profile data in `user_metadata`. Sends an invite or password reset email. |
| `removeStudent(userId)` | Deletes the auth user. Related rows cascade. Posts keep the author name. |
| `removeAdmin(userId)` | Same as above, and refuses to remove the last admin. |

Adding or removing a CR needs no service role. An admin inserts or deletes a `section_crs` row directly (allowed by the `admin_all` policy, checked by `check_cr`).

---

## 7. Mapping `queries.ts` to Supabase

Keep the same function names as in v3. The pages must not know that the source changed.

| v3 need | Supabase call |
| --- | --- |
| Current user and CR flag | `users` where `id = auth.uid()`, plus `section_crs` count. |
| My courses (this term and old terms) | `my_offerings` view joined with `courses` and `terms`. Retakes are offerings whose `section_id` differs from mine. |
| Announcements page | `posts` with `.select('*, offerings(courses(code,title))', { count: 'exact' })`, filters on `term_id`, offering course, `type`, ordered by `created_at` desc, paged with `.range(from, to)`. RLS already hides what the user must not see. |
| Dashboard lists | Same query, `.limit(8)`. Pinned first. |
| Course page | `posts` and `resources` where `offering_id = :id`. CR roster: `users` where `section_id` = section, plus `enrollments` for that offering. |
| Routine | `schedule_entries` where `term_id` = current term, joined with `offerings(courses(code,title))`. Routine notices: `posts` where `kind <> 'general'`. |
| Classmates | `classmates` view. |
| Your CRs | `my_crs` view. |
| Notifications | `notifications` ordered by `created_at`. Mark read: update `read_at`. |
| Retake flow | Step 1 `courses`. Step 2 `offerings` for that course and current term, joined with `sections`. Submit: insert into `enrollment_requests`. |
| Requests page (CR) | `enrollment_requests` joined with `users` and `offerings`. Decide with `rpc('decide_enrollment_request')`. |
| Sign-ups (admin, or CR if allowed) | `users` where `status = 'pending'`. Decide with `rpc('decide_signup')`. |
| Admin dashboard | `sections` with counts from `users`, `section_crs`, `posts`. |
| Create, edit, delete post or resource | Plain insert, update, delete. RLS decides if it is allowed. |

Pagination example: page 3 with 10 per page is `.range(20, 29)`. Formula: `from = (page - 1) x size`, `to = from + size - 1`.

---

## 8. Seed script

`scripts/seed.ts` runs once with the service role. It must:

1. Insert batches, sections, terms, section\_terms, courses, offerings from the v3 mock data (generate UUIDs and keep a map from the old string ids).
2. Create auth users for the three personas (Rafi, Syeda, Nasrin) and the other students, using `auth.admin.createUser` with the right `app_metadata` and `user_metadata`. Use passwords from a local env value, never hardcoded in the repo.
3. Insert `section_crs`, one approved retake enrollment, posts, resources, schedule rows, and requests.
4. Create the first real admin. This is the only way to get an admin, because the sign-up form cannot.

On the login page, remove the role picker. For development only, show a small hint that lists the seeded demo emails.

---

## 9. Small changes needed in Frontend Spec v3

- `User`: add `phone`. The CR card shows email and phone from `my_crs`.
- `Post`: add `termId` and `authorName`. `Resource`: add `authorName`.
- `EnrollmentRequest`: add `note`.
- Dates are ISO strings from the database. Show them in the Asia/Dhaka time zone.
- Remove the `TODAY` constant from production code. The database decides expiry. Keep it only in the seed.
- Add a pending and rejected screen for users whose status is not approved.
- Sign-up must send `name`, `student_id`, `section_id`, and `phone` as metadata.

---

## 10. Setup steps and open decision

1. Create the Supabase project. Copy the URL and keys into `.env.local`.
2. Run migrations 0001 to 0004 in order (SQL editor, or `supabase db push`).
3. Auth settings: enable email and password, turn off email confirmation for the MVP, set the site URL.
4. Run the seed script.
5. Swap `queries.ts` one page group at a time: auth, courses and posts, notifications, routine, CR pages, admin pages.

**Open decision: login with student ID.** Supabase logs in with email. Two ways to allow student ID: (a) store a fake email like `21-12345@ecr.local` made from the student ID and log in with that, or (b) add a lookup function that turns a student ID into an email. Option (b) leaks which emails exist, so (a) is safer. The default for now is plain email login.

---

## 11. Done when (tests to run with the three personas)

- [ ] A pending user sees only the pending screen and reads no posts.
- [ ] A student cannot insert, edit, or delete a post, resource, or routine row.
- [ ] A student cannot change their own role, status, or section. Only name and phone.
- [ ] A CR of 33-A cannot read, write, or approve anything for 35-A.
- [ ] A CR cannot approve a first sign-up unless `cr_can_approve_signups` is on for that section.
- [ ] A retaker sees posts and resources of the retaken offering only, not the rest of that section.
- [ ] An expired post is hidden from students but still visible to the section's CRs.
- [ ] Approving a retake request creates one enrollment row. Approving twice fails.
- [ ] A new post creates the right number of notifications and none for the author.
- [ ] Classmates returns only name and student ID.
- [ ] A post can only point to an offering of its own section (database rejects a mismatch).
- [ ] The service role key is nowhere in client code or the repo.
- [ ] Every page from v3 still works with no change to its component code.

---

## 12. Later (not in the MVP)

- **Deadline reminders:** a daily scheduled job (pg\_cron or a Supabase Edge Function) that inserts `reminder` notifications for deadlines due within 24 hours.
- **Admin scope:** enforce `admin_scope` inside `is_admin()` style helpers (`admin_can(section)`).
- **Improvement students:** see only `exam` posts. Needs one extra check in `posts_read`.
- **Email or push delivery** of notifications.
- **Audit log** of approvals, removals, and CR changes.

*End of backend spec.*
