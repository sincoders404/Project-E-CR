do $$ declare t text; begin
  foreach t in array array['batches','sections','terms','section_terms','courses','offerings','users','section_crs','enrollments','enrollment_requests','posts','resources','schedule_entries','notifications'] loop
    execute format('alter table %I enable row level security', t);
  end loop;
  foreach t in array array['batches','sections','terms','section_terms','courses','offerings','section_crs','enrollments'] loop
    execute format('create policy admin_all on %I for all to authenticated using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;
create policy read_public on batches for select to anon, authenticated using (true);
create policy read_public on sections for select to anon, authenticated using (true);
create policy read_approved on terms for select to authenticated using (is_approved());
create policy read_approved on section_terms for select to authenticated using (is_approved());
create policy read_approved on courses for select to authenticated using (is_approved());
create policy read_approved on offerings for select to authenticated using (is_approved());
create policy users_read on users for select to authenticated using (id = auth.uid() or is_admin() or cr_can_see_student(id));
create policy users_update_self on users for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
revoke update on users from authenticated; grant update (name, phone) on users to authenticated;
create policy crs_read on section_crs for select to authenticated using (section_id = my_section() or is_cr_of(section_id));
create policy enr_read on enrollments for select to authenticated using (student_id = auth.uid() or is_cr_of(offering_section(offering_id)));
create policy req_read on enrollment_requests for select to authenticated using (student_id = auth.uid() or is_admin() or is_cr_of(offering_section(offering_id)));
create policy req_insert on enrollment_requests for insert to authenticated with check (student_id = auth.uid() and is_approved() and status = 'pending' and offering_section(offering_id) is distinct from my_section());
create policy posts_read on posts for select to authenticated using (is_admin() or is_cr_of(section_id) or (is_approved() and (expires_on is null or expires_on >= app_today()) and ((offering_id is null and section_id = my_section()) or (offering_id is not null and can_see_offering(offering_id)))));
create policy posts_insert on posts for insert to authenticated with check ((is_admin() or is_cr_of(section_id)) and author_id = auth.uid());
create policy posts_update on posts for update to authenticated using (is_admin() or is_cr_of(section_id)) with check (is_admin() or is_cr_of(section_id));
create policy posts_delete on posts for delete to authenticated using (is_admin() or is_cr_of(section_id));
create policy res_read on resources for select to authenticated using (can_see_offering(offering_id) or is_admin() or is_cr_of(offering_section(offering_id)));
create policy res_insert on resources for insert to authenticated with check ((is_admin() or is_cr_of(offering_section(offering_id))) and author_id = auth.uid());
create policy res_update on resources for update to authenticated using (is_admin() or is_cr_of(offering_section(offering_id)));
create policy res_delete on resources for delete to authenticated using (is_admin() or is_cr_of(offering_section(offering_id)));
create policy sch_read on schedule_entries for select to authenticated using (is_admin() or is_cr_of(section_id) or (is_approved() and section_id = my_section()));
create policy sch_write on schedule_entries for all to authenticated using (is_admin() or is_cr_of(section_id)) with check (is_admin() or is_cr_of(section_id));
create policy notif_read on notifications for select to authenticated using (user_id = auth.uid());
create policy notif_update on notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke update on notifications from authenticated; grant update (read_at) on notifications to authenticated;
