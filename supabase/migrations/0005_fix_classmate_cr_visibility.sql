create or replace function cr_can_see_student(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from users u
    join section_crs c on c.user_id = u.id and c.section_id = u.section_id
    where u.id = uid
      and u.status = 'approved'
  )
  or exists (
    select 1
    from enrollment_requests r
    where r.student_id = uid
      and is_cr_of(offering_section(r.offering_id))
  )
  or exists (
    select 1
    from enrollments e
    where e.student_id = uid
      and is_cr_of(offering_section(e.offering_id))
  )
$$;
