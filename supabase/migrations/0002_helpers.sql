create or replace function app_today() returns date language sql stable as $$ select (now() at time zone 'Asia/Dhaka')::date $$;
create or replace function is_approved() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from users where id = auth.uid() and status = 'approved') $$;
create or replace function is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from users where id = auth.uid() and role = 'admin' and status = 'approved') $$;
create or replace function my_section() returns uuid language sql stable security definer set search_path = public as $$ select section_id from users where id = auth.uid() and status = 'approved' $$;
create or replace function is_cr_of(sec uuid) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from section_crs c join users u on u.id = c.user_id where c.user_id = auth.uid() and c.section_id = sec and u.status = 'approved') $$;
create or replace function offering_section(off uuid) returns uuid language sql stable security definer set search_path = public as $$ select section_id from offerings where id = off $$;
create or replace function can_see_offering(off uuid) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from offerings o where o.id = off and (o.section_id = my_section() or exists (select 1 from enrollments e where e.student_id = auth.uid() and e.offering_id = o.id and e.type in ('regular','retake')))) $$;
create or replace function cr_can_see_student(uid uuid) returns boolean language sql stable security definer set search_path = public as $$
 select exists (select 1 from users u where u.id = uid and is_cr_of(u.section_id))
 or exists (select 1 from enrollment_requests r where r.student_id = uid and is_cr_of(offering_section(r.offering_id)))
 or exists (select 1 from enrollments e where e.student_id = uid and is_cr_of(offering_section(e.offering_id))) $$;
create or replace view classmates as select id, name, student_id, section_id from users where status = 'approved' and role = 'student' and section_id = my_section();
create or replace view my_crs as select u.id, u.name, u.email, u.phone, c.section_id from section_crs c join users u on u.id = c.user_id where c.section_id = my_section() and u.status = 'approved';
create or replace view my_offerings with (security_invoker = true) as select * from offerings where can_see_offering(id);
grant select on classmates, my_crs, my_offerings to authenticated;
