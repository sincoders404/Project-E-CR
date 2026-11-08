# E-CR Portal: Spec v3 (Frontend)

**For:** the AI agent building the Next.js frontend. This replaces v1 and v2. **Scope:** Frontend only. All data is hardcoded, but shaped like the future database tables so the swap to a real database is easy. No API, no real auth. **Main idea:** The app does four things: Announcements (with deadlines and exams), Resources (Google Drive links), the Class Routine, and approvals for joining courses. Nothing else.

---

## 1. Rules for the agent

1. Do not add any package. Use only Next 16, React 19, Tailwind 4, lucide-react.
2. Delete code for removed features. No commented-out or unused code.
3. Keep the current look: light blue-grey canvas, white rounded cards, deep blue brand colour (tokens in section 6).
4. Do not invent features or fields that are not in this doc.
5. Every action that needs a backend shows the toast: **Demo only: not connected yet**. Local UI state may still change (a card moves tabs, a row disappears).
6. **All reads go through functions in `src/data/queries.ts`.** Pages never filter raw data themselves. The access rules in section 5 live only in that file, so a later database swap changes one place.
7. Use one fixed demo date constant `TODAY` (2026-11-09) for expiry and deadline logic. Do not call `new Date()` for this.

---

## 2. People and terms

| Role | What they are |
| --- | --- |
| **Student** | Belongs to exactly one home section (example: CSE 33-A). Reads everything for their courses. Can request a retake. |
| **CR** | A student who is also listed as a CR of a section. Usually 2 CRs per section. Posts, uploads, edits the routine, approves requests for their own section only. |
| **Admin** | Not a student. No section, no student ID. There can be several. In the MVP every admin sees everything. A scope field (batch coordinator) exists in the data but is not used yet. |

- **Batch** = department + number (CSE 33). **Section** = a batch + a letter (33-A). Shown as `CSE 33-A`.
- **Term** = a calendar term (Fall 2026). **Semester number** = 1 to 8, the study semester a section is in during a term.
- **Course** = catalog subject (Linear Algebra). **Offering** = one course taught in one section in one term, with a faculty name. Posts, resources, and the routine all hang off an offering.
- **Retake** = a student takes a course with another section. An approved retake gives them access to that one offering only.
- A student's regular courses come from their home section automatically each term. For the MVP they can see all of them.

The login page has a role picker (Student, CR, Admin). It loads a hardcoded persona so each view can be tested.

---

## 3. Stack notes

- Next.js 16 App Router, TypeScript, React 19, Tailwind 4 with tokens in `@theme` inside `app/globals.css`, lucide-react, Inter via `next/font/google`.
- Files with `useState` or click handlers need `"use client"`. Dynamic params are async (`await params` in server pages, `use(params)` in client pages).
- Keep one `RoleProvider` context (current persona) and one `ToastProvider`.
- Check that the build works with `@tailwindcss/turbopack`. If not, use `@tailwindcss/postcss`.

---

## 4. Routes and folders

```
src/app/
  layout.tsx, globals.css, page.tsx (redirect to /login)
  (auth)/login, signup
  (app)/layout.tsx            AppShell for Student and CR
    dashboard, announcements, notifications
    courses, courses/[offeringId]
    offerings, offerings/[courseId]      retake flow
    routine, classmates, profile, settings
    cr          CR dashboard (CR only)
    requests    retake requests (CR only)
  (admin)/layout.tsx          AppShell for Admin
    admin, admin/signups
    admin/sections/[sectionId]
    admin/setup, admin/admins
    admin/profile, admin/settings   (reuse the same page components)
src/components/ui, shell, domain
src/context/ RoleProvider, ToastProvider
src/data/ types.ts, mock.ts, queries.ts
```

**Sidebars**

- **Student:** Dashboard, Announcements, Courses, Routine, Classmates, Profile, Settings, Logout.
- **CR:** CR Dashboard (landing page after login), Requests (count badge), then every student item.
- **Admin:** Dashboard, Sign-ups (count badge), Setup, Admins, Profile, Settings, Logout.

**Topbar:** search box (left). Right side: **+ New** dropdown (CR only, with *Post* and *Upload resource*), bell with unread count that links to `/notifications`, and the user name with avatar.

---

## 5. Data shapes and access rules

Put these in `src/data/types.ts`. Field names match the planned database tables.

```ts
type User = { id: string; name: string; email: string; studentId?: string; role: 'student' | 'admin'; status: 'pending' | 'approved' | 'rejected'; sectionId?: string; adminScope?: string | null };
type Batch = { id: string; department: string; number: number };
type Section = { id: string; batchId: string; name: string; crCanApproveSignups: boolean };
type Term = { id: string; name: string; isCurrent: boolean };
type SectionTerm = { sectionId: string; termId: string; semesterNo: number };
type Course = { id: string; code: string; title: string };
type Offering = { id: string; courseId: string; sectionId: string; termId: string; facultyName: string };
type SectionCR = { userId: string; sectionId: string };
type Enrollment = { studentId: string; offeringId: string; type: 'regular' | 'retake' | 'improvement' };
type EnrollmentRequest = { id: string; studentId: string; offeringId: string; status: 'pending' | 'approved' | 'rejected'; rejectReason?: string; createdAt: string };
type Post = { id: string; sectionId: string; offeringId?: string; type: 'announcement' | 'deadline' | 'exam'; kind: 'general' | 'reschedule' | 'cancel' | 'online'; title: string; body: string; dueAt?: string; expiresOn?: string; pinned: boolean; authorId: string; createdAt: string };
type Resource = { id: string; offeringId: string; title: string; driveUrl: string; authorId: string; createdAt: string };
type ScheduleEntry = { id: string; sectionId: string; termId: string; day: number; startTime: string; endTime: string; offeringId: string; room: string };
type Notification = { id: string; userId: string; type: 'post' | 'deadline' | 'resource' | 'reminder'; refId: string; createdAt: string; readAt?: string };
```

A post with no `offeringId` goes to the whole section. A CR is a user with a `SectionCR` row. Only retakes need an `Enrollment` row in the MVP.

**Access rules (implement only in `queries.ts`)**

1. **Student sees:** all offerings of their own section, plus offerings where they have an approved retake enrollment. Posts and resources follow the same rule. Whole-section posts are seen only by that section's students.
2. **A retaker** sees only the posts and resources of the retaken offering. Not the rest of that other section.
3. **Expiry:** a post with `expiresOn` is hidden once `TODAY` is after that date.
4. **CR can** create, edit, and delete posts, resources, and routine rows only for sections where they are listed. They can approve retake requests only for offerings of their own section. They can approve first sign-ups only if that section has `crCanApproveSignups` on.
5. **Admin** sees and can change everything.
6. **Friends list** (classmates) shows only users of the student's own section, with name and student ID only.

---

## 6. Design tokens

In `app/globals.css`:

```css
@import 'tailwindcss';
@theme {
  --color-brand-700:#0B3FBF; --color-brand-600:#1D4ED8; --color-brand-100:#E4EBFF; --color-brand-50:#F0F4FF;
  --color-canvas:#F4F6FD; --color-border:#E3E8F5;
  --color-ink-900:#0F172A; --color-ink-700:#334155; --color-ink-500:#64748B; --color-ink-400:#94A3B8;
  --color-success-600:#12915A; --color-success-100:#DDF6EA;
  --color-warning-600:#C2610C; --color-warning-100:#FFEBD2;
  --color-danger-600:#D92D20;  --color-danger-100:#FDE4E1;
  --color-muted:#F1F3F8;
  --radius-md:12px; --radius-lg:16px;
  --shadow-card:0 1px 2px rgba(15,23,42,.04),0 4px 16px rgba(30,64,175,.06);
}
```

Type: page title 26/800, section title 18/700, card title 16/700, body 14, small 13, eyebrow 11/700 uppercase. Card padding 20, gap 20.

**Shell:** sidebar 220px white with a blue pill on the active item and Logout pinned at the bottom in red. Topbar 64px white. Main area max width 1100. Under 768px the sidebar becomes a drawer. Between 768 and 1023px it becomes a 72px icon rail.

---

## 7. Pages: sign-in and student

### 7.1 Login `/login`

One centered card (max width 440). Logo, title, role picker (Student, CR, Admin), email or student ID field, password with show and hide, **Sign In**. Link: **New student? Sign up**. A pending persona sees a message: *Your sign-up is waiting for approval.* Student and CR go to `/dashboard` and `/cr`. Admin goes to `/admin`.

### 7.2 Sign up `/signup`

Fields: full name, student ID, email, password, **batch** and **section** (two selects). Submit shows: *Request sent. An admin will approve you soon.* After the first approved login, show a welcome card once on the dashboard: *You are in CSE 33-A, Fall 2026, Semester 8.*

### 7.3 Dashboard `/dashboard`

Top to bottom:

1. **Today's Class Schedule** (full width): rows of today from the routine table (time, course, faculty, room). States: done (muted), now (solid blue), next (light). Active routine notices for today (cancel, reschedule, online) show as small chips beside the matching class or under the list.
2. **Announcements and Deadlines** (left, about 65%): pinned post first (pin icon, soft blue background), then recent posts. Tabs: All, Announcements, Deadlines, Exams. Link **See all** to `/announcements`.
3. **Right column:** **Your CRs** card (names, with an email and phone copy icon), and a **Classmates** card (5 names, link to `/classmates`).

CR sees a **Post** button here, and an **Upload resource** button.

### 7.4 Announcements `/announcements`

All posts the student can see, newest first. Filters: **Term**, **Course**, **Type**. **Pagination**, 10 per page. Empty state when nothing matches. CR sees the **Post** button.

### 7.5 Notifications `/notifications`

List of notifications: icon by type (post, deadline, resource, reminder), one line of text, time, unread dot. Click opens the related item and marks it read. Button **Mark all as read**. The bell shows the unread count.

### 7.6 Courses `/courses`

- **This term:** list of `CourseRow`s (code, title, faculty). Retakes get a small *Retake* chip with the other section's name.
- **Previous terms:** one collapsed dropdown per term, newest first. Opening one lists that term's courses.
- Button **Retake a course** goes to `/offerings`.
- Each row opens `/courses/[offeringId]`.

### 7.7 Course page `/courses/[offeringId]`

Title (code and course name), faculty name, section chip. Tabs: **Announcements** (announcements and exams), **Deadlines**, **Resources** (Drive link cards, button **Open in Drive**). CR also sees **Post** and **Upload resource** buttons here (the course is preselected) and a **Students** tab (roster with a *Retake* chip on retakers).

### 7.8 Retake flow `/offerings`

1. `/offerings`: list of courses from the catalog. Each shows how many sections offer it this term. Search box.
2. `/offerings/[courseId]`: list of sections offering it (section name, faculty, semester). Button **Request** on each.
3. **Request modal:** name and student ID (prefilled, read only), course and section (read only), optional note, **Submit**. Success text: *Request sent. A CR of that section will review it.*
4. A small **My requests** list at the bottom of `/offerings` shows pending, approved, and rejected requests with the reject reason if any. An approved request makes the course appear on `/courses`, showing only that section's posts.

### 7.9 Routine `/routine`

- **Weekly table:** columns Day, Time, Course, Room. Read only for students.
- **Routine notices** under or beside the table: posts of kind reschedule, cancel, or online that have not expired. Expired ones disappear.
- CR and admin see **Edit routine**: rows become editable (day, start, end, course picked from the section's offerings, room), add and remove rows, **Save** (toast). Either CR of the section can edit.

### 7.10 Classmates `/classmates`

Plain list of the section's students: initials, name, student ID. Search box. Nothing else.

### 7.11 Profile `/profile`

One small card: name, student ID, section and batch (example: CSE 33-A), current term and semester number. Button **Change Password** opens a modal (old, new, confirm; submit shows the toast). Nothing else. Admin profile shows name and email only.

### 7.12 Settings `/settings`

One card with toggle rows: Email notifications (on), Push notifications (off), Deadline reminders (on), and a Language select (English). Local state only. Note: *Preferences are not saved in this demo.*

---

## 8. Pages: CR

### 8.1 CR Dashboard `/cr`

- Header with section name and term.
- Small number cards: **Pending requests**, **Posts this week**, **Students**.
- **Pending requests** preview (3 rows with Approve and Reject), link to `/requests`.
- **Today's Class Schedule** (same component as the student dashboard).
- **Recent posts and resources** by the section, each with an edit and delete menu.
- Buttons: **Post** and **Upload resource**.

### 8.2 Two forms (modals)

**Post form** (announcement, deadline, exam):

- Type: Announcement, Deadline, Exam.
- Course (select from the section's offerings) or **Whole section**.
- Title and details.
- Due date and time (deadline) or exam date and time (exam).
- Kind tag, for announcements: General, Reschedule, Cancel, Online. New kinds can be added later by adding a value.
- Expiry date (optional, shown for kinds other than General).
- Pin as special notice (checkbox).
- Buttons: Cancel, **Post** (toast).

**Resource form:** Course (select), Title, Google Drive link (placeholder `https://drive.google.com/...`). Buttons: Cancel, **Upload** (toast).

**Where the buttons are:** navbar **+ New** dropdown (Post, Upload resource), Post button on the Dashboard, CR Dashboard, and Announcements page, Upload resource button on the Dashboard, CR Dashboard, and each course page. On a course page, the course is preselected.

### 8.3 Edit and delete

Every post and resource card shows *Posted by (name)*. CRs of that section see a menu with **Edit** (opens the same form filled in) and **Delete** (confirm modal, then the card disappears locally).

### 8.4 Requests `/requests`

- Tabs: **Pending**, **Approved**, **Rejected**. A fourth tab **Sign-ups** shows only if the section's `crCanApproveSignups` is on.
- `RequestCard`: initials, name, student ID, course and section (example: Linear Algebra, 35-A), home section, time sent.
- **Approve** (primary) and **Reject** (danger-soft). Reject opens a small modal with an optional reason.
- Approved and rejected tabs keep the history.
- Empty state: *No pending requests. You're all caught up.*

---

## 9. Pages: Admin

### 9.1 Admin Dashboard `/admin`

Number cards: **Pending sign-ups**, **Sections**, **CRs**, **Students**. Below, a table of sections: name (CSE 33-A), term, semester number, CR names, student count, a small *CRs can approve sign-ups* indicator. Filters: batch, search. Click a row opens the section page.

### 9.2 Sign-ups `/admin/signups`

Tabs Pending, Approved, Rejected. Each row: name, student ID, email, requested section, time. **Approve** and **Reject** (optional reason).

### 9.3 Section page `/admin/sections/[sectionId]`

Title and term chips. Tabs:

- **Overview:** CR list with **Remove**, **Add CR** (pick from the section's students), a toggle **Let CRs approve sign-ups**, and the offerings list.
- **Students:** list with **Remove** and **Add student**. Retakers are marked.
- **Posts:** all posts and resources of the section with type tabs. Admin can delete.
- **Routine:** the weekly table in edit mode.
- **Requests:** retake requests for the section's offerings (admin can approve or reject). Remove actions ask for confirmation, then remove the row locally.

### 9.4 Setup `/admin/setup`

Four tabs, each a simple table with an **Add** modal: **Batches and sections**, **Terms** (with current term mark), **Courses** (code, title), **Offerings** (course, section, term, faculty name).

### 9.5 Admins `/admin/admins`

List of admins (name, email, scope column that shows *All*). **Add admin** and **Remove** with confirm. A small note: *Batch scopes are coming later.*

---

## 10. Components

- **ui:** Button, Card, Chip, Avatar, Tabs, Toggle, TextField, Select, Modal, ConfirmModal, Toast, EmptyState, Pagination.
- **domain:** PostCard (type chip, kind chip, course chip, time, title, body, due or exam date, pin, Posted by, CR menu), ResourceCard (title, Drive button), ScheduleItem, ScheduleTable (view and edit), CourseRow, PersonRow, RequestCard, NotificationItem, FilterBar, PostFormModal, ResourceFormModal.

About 25 components in total. Do not create stat cards, rings, or timelines.

---

## 11. Mock data (`src/data/mock.ts`)

- 1 department (CSE), batches 33 and 35, sections 33-A, 33-B, 35-A.
- 3 terms (Fall 2026 current, Spring 2026, Fall 2025). 33-A is in semester 8 now.
- 8 courses. Offerings for 33-A (5 this term, 4 per old term) and 35-A (4 this term). Faculty names are plain text.
- 12 students in 33-A, 8 in 35-A. Personas: **Student** Rafi Ahmed (33-A, with an approved retake of Linear Algebra in 35-A), **CR** Syeda Dillir Hossain (CR of 33-A, co-CR Tanzim Hossain), **Admin** Nasrin Akter.
- 14 posts (3 pinned or urgent, 3 deadlines, 2 exams, 3 routine notices with expiry, one already expired), 8 resources.
- 10 schedule rows for 33-A, 8 notifications (3 unread), 6 retake requests (2 pending, 3 approved, 1 rejected), 3 pending sign-ups.
- 33-B has `crCanApproveSignups` off, 33-A has it on.

Keep names, courses, and dates consistent across every page.

---

## 12. Remove from the current build

Everything below must be gone. If a file only served these, delete the file.

- Attendance rings, GPA, rank, standing, course load, stat cards.
- Election, endorsements, statement of intent, CGPA chips, governance rules, cohort capacity, advisor strip.
- Guardian info, roster officers, faculty contacts, weekly routine card, attendance card.
- Profile tabs and extra profile fields, login activity, security tab.
- Login hero panel, feature tiles, SSO buttons, footer links, role chip, student ID under the name.
- Dashboard cards: Enrolled Course, Join Queue, New Notices, Quick Actions.
- Old routes `/class-details`, `/cr-join-requests`, `/profile/academic-records`, `/profile/security`.

**Rewrite:** Dashboard, Courses (was Class Details), Announcements, Profile, Requests, Login, Sidebar, Topbar, Settings. **Keep:** tokens, Button, Card, Chip, Avatar, Tabs, Toggle, TextField, Select, Modal, Toast. **Add:** signup, notifications, offerings flow, routine, classmates, CR dashboard, both forms, the whole admin group, `queries.ts`.

---

## 13. Build order

1. Tokens in `@theme`. Confirm the build runs.
2. Types, mock data, and `queries.ts` with the access rules.
3. `RoleProvider`, `ToastProvider`, shells for the three roles.
4. Delete old features (section 12). Fix broken imports.
5. PostCard, ResourceCard, both forms.
6. Login, signup, student Dashboard, Announcements, Notifications.
7. Courses, Course page, Retake flow, Routine, Classmates, Profile, Settings.
8. CR Dashboard and Requests.
9. Admin group.
10. Lint, type check, remove unused files, responsive and accessibility pass.

## 14. Done when

- [ ] `npm run build` and `npm run lint` pass. No unused files, components, or data. No new packages.
- [ ] Role picker opens the right view and sidebar for Student, CR, and Admin.
- [ ] A student sees only their section's content plus approved retake offerings. A retaker sees only the retaken offering's posts.
- [ ] Dashboard order: Today's Class Schedule, Announcements and Deadlines with pinned post, then Your CRs and Classmates.
- [ ] Announcements page has term, course, and type filters, and pagination.
- [ ] Notifications page works, bell shows the unread count.
- [ ] Courses shows this term plus collapsed previous terms. The retake flow works end to end with local state.
- [ ] Routine is a table. Only CRs and admins can edit. Expired notices are hidden.
- [ ] CR has two separate forms, edit and delete on own section's posts, and a Requests page with history and reject reason.
- [ ] Sign-ups tab shows for a CR only when the section allows it.
- [ ] Admin can manage sign-ups, CRs, students, setup lists, and admins (local state).
- [ ] All reads go through `queries.ts`. No API calls.
- [ ] No horizontal page scroll at 1280, 1024, 768, and 390px. Keyboard use works with visible focus.

*End of v3.*
