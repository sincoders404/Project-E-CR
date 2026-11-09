create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, name, email, phone, student_id, section_id, role, status)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), new.email,
    new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'student_id',
    nullif(new.raw_user_meta_data->>'section_id', '')::uuid,
    coalesce((new.raw_app_meta_data->>'role')::user_role, 'student'::user_role),
    case when new.raw_app_meta_data->>'status' = 'approved' then 'approved'::approval_status else 'pending'::approval_status end);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create or replace function check_cr() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from users where id = new.user_id and role = 'student' and section_id = new.section_id) then
    raise exception 'A CR must be a student of that section';
  end if;
  return new;
end $$;
create trigger section_crs_check before insert or update on section_crs for each row execute function check_cr();

create or replace function post_defaults() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.term_id := coalesce((select term_id from offerings where id = new.offering_id), (select id from terms where is_current));
    new.author_name := (select name from users where id = new.author_id);
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger posts_defaults before insert or update on posts for each row execute function post_defaults();

create or replace function resource_defaults() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.author_name := coalesce(new.author_name, (select name from users where id = new.author_id));
  return new;
end $$;
create trigger resources_defaults before insert on resources for each row execute function resource_defaults();

create or replace function notify_post() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into notifications (user_id, type, ref_id, title, message)
  select distinct a.uid, case when new.type = 'deadline' then 'deadline'::notification_type else 'post'::notification_type end,
    new.id, new.title, new.body
  from (select id as uid from users where status = 'approved' and role = 'student' and section_id = new.section_id
    union select student_id from enrollments where new.offering_id is not null and offering_id = new.offering_id and type in ('regular','retake')) a
  where a.uid is distinct from new.author_id;
  return new;
end $$;
create trigger posts_notify after insert on posts for each row execute function notify_post();

create or replace function notify_resource() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into notifications (user_id, type, ref_id, title, message)
  select distinct a.uid, 'resource'::notification_type, new.id, new.title, new.drive_url
  from (select u.id as uid from users u join offerings o on o.section_id = u.section_id where o.id = new.offering_id and u.status = 'approved' and u.role = 'student'
    union select student_id from enrollments where offering_id = new.offering_id and type in ('regular','retake')) a
  where a.uid is distinct from new.author_id;
  return new;
end $$;
create trigger resources_notify after insert on resources for each row execute function notify_resource();

create or replace function decide_signup(p_user uuid, p_approve boolean, p_reason text default null)
returns void language plpgsql security definer set search_path = public as $$
declare u users; s sections;
begin
  select * into u from users where id = p_user and status = 'pending' and role = 'student';
  if not found then raise exception 'No pending sign-up'; end if;
  select * into s from sections where id = u.section_id;
  if not (is_admin() or (is_cr_of(u.section_id) and s.cr_can_approve_signups)) then raise exception 'Not allowed'; end if;
  update users set status = case when p_approve then 'approved'::approval_status else 'rejected'::approval_status end,
    reject_reason = case when p_approve then null else p_reason end where id = p_user;
end $$;

create or replace function decide_enrollment_request(p_request uuid, p_approve boolean, p_reason text default null)
returns void language plpgsql security definer set search_path = public as $$
declare r enrollment_requests;
begin
  select * into r from enrollment_requests where id = p_request and status = 'pending';
  if not found then raise exception 'No pending request'; end if;
  if not (is_admin() or is_cr_of(offering_section(r.offering_id))) then raise exception 'Not allowed'; end if;
  update enrollment_requests set status = case when p_approve then 'approved'::approval_status else 'rejected'::approval_status end,
    reject_reason = case when p_approve then null else p_reason end, decided_by = auth.uid(), decided_at = now() where id = p_request;
  if p_approve then insert into enrollments (student_id, offering_id, type) values (r.student_id, r.offering_id, 'retake') on conflict do nothing; end if;
end $$;
revoke execute on function decide_signup, decide_enrollment_request from public, anon;
grant execute on function decide_signup, decide_enrollment_request to authenticated;
