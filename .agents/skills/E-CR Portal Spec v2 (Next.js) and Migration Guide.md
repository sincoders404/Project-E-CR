# E-CR Portal: Spec v2 (Next.js) and Migration Guide

**For:** the AI agent that built the first (bloated) version. **Task:** Cut the existing app down to a small portal for **Announcements, Deadlines, and Resources (Google Drive links)**. Reuse what is good, delete the rest, add what is missing.

**Scope:** Frontend only. All data is hardcoded in `src/data`. No API, no real auth, no database. Only local UI state.

---

## 1. Rules for the agent

1. Do **not** add any package. Only use what is in `package.json` (Next 16, React 19, Tailwind 4, lucide-react).
2. Delete code for removed features. Do not leave it commented out or unused.
3. Keep the existing design look: light blue-grey background, white rounded cards, deep blue brand colour.
4. If something is not in this doc, do not invent it. Ask or leave it out.
5. Every action that would need a backend shows the toast: **"Demo only: not connected yet"**.

## 2. Roles and key terms

| Role | Can do |
| --- | --- |
| **Student** | Read announcements, deadlines, resources. Fill the join form each semester. |
| **CR** | Student powers, plus: post announcements, deadlines, resource links. Approve join requests and tick the student's courses. A CR is a student too. |
| **Admin** | See all classes. Add or remove CRs and students. Approve requests. Open or close the join form per semester. |

- **Class** = one section in one semester (example: *CSE, Batch 54, Sec 2, Spring 2026*). It has many courses.
- **Course** = one subject in a class (example: *CSE 221, Object Oriented Programming, Dr. Rahman*).
- A student joins a **class**. The CR or Admin ticks which **courses** of that class the student takes.
- Each semester the student fills a new join form. Old classes stay visible but muted.

The login page has a role picker (Student, CR, Admin) for the demo. It only decides which hardcoded view opens. Store the chosen role in a simple client context (`RoleProvider`) so the sidebar and pages can read it.

---

## 3. Stack (current `package.json`)

| Need | Use |
| --- | --- |
| Framework | Next.js 16, App Router, TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Icons | `lucide-react` |
| Font | Inter through `next/font/google` |
| State | `useState` and one `RoleProvider` context |

**Tailwind 4 notes**

- No `tailwind.config.ts`. Put tokens in `app/globals.css` using `@import "tailwindcss";` and an `@theme { ... }` block. Example: `--color-brand-700: #0B3FBF;` gives the class `bg-brand-700`.
- **Check:** `package.json` lists `@tailwindcss/turbopack`. Tailwind 4 normally uses `@tailwindcss/postcss` with a `postcss.config.mjs`. Confirm the build works with the current setup. If it does, leave it. If not, switch to `@tailwindcss/postcss`.

**Next.js notes**

- Any file using `useState`, `useEffect`, or click handlers needs `"use client"` at the top. Keep pages as server components when they only render data, and put the interactive parts in small client components.
- Use `next/link` and `usePathname` for the sidebar highlight. Use `useRouter` from `next/navigation` for redirects.
- Dynamic params in Next 16 are async. In a server page use `const { courseId } = await params;`. In a client page use `use(params)` from React.

---

## 4. Folder structure

```
src/
├─ app/
│  ├─ layout.tsx                  # html, body, Inter font, RoleProvider, ToastProvider
│  ├─ globals.css                 # tailwind import + @theme tokens
│  ├─ page.tsx                    # redirect to /login
│  ├─ (auth)/
│  │  ├─ login/page.tsx
│  │  └─ join/page.tsx
│  ├─ (app)/                      # Student + CR
│  │  ├─ layout.tsx               # AppShell (sidebar + topbar)
│  │  ├─ dashboard/page.tsx
│  │  ├─ courses/page.tsx
│  │  ├─ courses/[courseId]/page.tsx
│  │  ├─ announcements/page.tsx
│  │  ├─ requests/page.tsx        # CR only
│  │  ├─ profile/page.tsx
│  │  └─ settings/page.tsx
│  └─ (admin)/
│     ├─ layout.tsx               # AppShell with admin nav
│     └─ admin/
│        ├─ page.tsx              # all classes
│        ├─ classes/[classId]/page.tsx
│        ├─ join-forms/page.tsx
│        ├─ profile/page.tsx      # re-export of the profile page
│        └─ settings/page.tsx     # re-export of the settings page
├─ components/
│  ├─ ui/      Button, Card, Chip, Avatar, Tabs, Toggle, TextField, Select, Modal, Toast, EmptyState
│  ├─ shell/   Sidebar, Topbar
│  └─ domain/  PostCard, PostModal, ScheduleItem, CourseRow, StudentRow, RequestCard
├─ context/    RoleProvider.tsx, ToastProvider.tsx
└─ data/       users.ts, classes.ts, posts.ts, requests.ts
```

About 17 components in total.

---

## 5. Migration: what to do with the existing code

### 5.1 Delete completely

- Attendance rings, GPA, rank, standing, and course-load stats.
- CR election and endorsement system (Election Status card, peer endorsement bars, statement of intent, CGPA and endorsement chips).
- Guardian info, governance guidelines, cohort capacity, advisor strip.
- Roster Officers card, Faculty Contacts tab, Weekly Routine card, Attendance Health card.
- Profile tabs (Academic Records, Security and Settings), login activity.
- Login hero panel (photo, feature tiles, SSO buttons, footer links).
- Role chip in the topbar, student ID under the name, `PORTAL` badge, `V2.4` badge.
- Dashboard cards: Enrolled Course, Join Queue, New Notices, Quick Actions, all stat cards.
- Components that only served the above: `StatCard`, `RingProgress`, `ProgressBar` (if unused), `IconTile`, `InfoRow`, `SegmentedControl` (keep only if reused for the role picker), `NoticeCard`, `ClassSessionCard`, `RoutineTimeline`, `RosterOfficer`, `QuickActionRow`, `GovernanceList`, `CRRequestCard`, `FileAttachment`, `Breadcrumb`, `Badge`.
- Matching hardcoded data (profile stats, routine, governance, faculty, endorsements).

### 5.2 Keep as is

- Design tokens (colours, radius, shadow) moved into the Tailwind 4 `@theme` block.
- `Button`, `Card`, `Chip`, `Avatar`, `Tabs`, `Toggle`, `TextField`, `Select`, `Modal`, `Toast` (restyle slightly if needed).
- The sidebar and topbar frames (cut their contents, see below).
- The login form fields and password show/hide.

### 5.3 Rewrite

| Existing page | New |
| --- | --- |
| Dashboard | New layout, see 8.2 |
| Class Details | Becomes **Courses** (all semesters), see 8.3 |
| Announcements | One feed for all courses with filters, see 8.5 |
| Profile | Tiny card, see 8.6 |
| CR Join Requests | Simple request cards + course checklist, see 8.9 |
| Login | Single centered card, see 8.1 |
| Sidebar, Topbar | Role-based items, see section 7 |
| Settings | Keep, but trim to 4 toggle rows, see 8.7 |

### 5.4 Add new

- `(auth)/join` form page.
- `PostModal` and `PostCard`.
- `courses/[courseId]` page.
- `RoleProvider` and `ToastProvider`.
- The whole `(admin)` group.
- New data files for classes, semesters, and posts.

### 5.5 Route changes

| Old | New |
| --- | --- |
| `/class-details` | `/courses` and `/courses/[courseId]` |
| `/cr-join-requests` | `/requests` |
| `/profile/academic-records`, `/profile/security` | removed |
| (none) | `/join`, `/admin`, `/admin/classes/[classId]`, `/admin/join-forms` |

Update every `Link`, redirect, and sidebar entry that used the old paths.

### 5.6 Suggested order

1. Move tokens to `@theme`. Confirm the build runs.
2. Add `RoleProvider` and `ToastProvider` in the root layout.
3. Delete everything in 5.1. Fix the broken imports.
4. Rewrite Sidebar and Topbar.
5. Build `PostCard` and `PostModal`.
6. Rewrite Login, add Join form.
7. Rewrite Dashboard, Courses, Course detail, Announcements.
8. Rewrite Join Requests, Profile, Settings.
9. Add the admin group.
10. Run lint and a type check. Remove unused files, components, and data.

---

## 6. Design tokens

Put in `app/globals.css` inside `@theme`.

```css
@import "tailwindcss";

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
  --font-sans:var(--font-inter), system-ui, sans-serif;
}
```

**Type:** Page title 26/800. Section title 18/700. Card title 16/700. Body 14. Small 13. Eyebrow 11/700 uppercase. **Spacing:** card padding 20, gap between cards 20, gap between rows 12.

---

## 7. App shell

- **Sidebar** (220px, white): logo block (cap icon and "E-CR"), nav items 40px tall with a rounded blue pill when active, Logout pinned at the bottom in red.
  - Student: Dashboard, Courses, Announcements, Profile, Settings.
  - CR: the same, plus **Join Requests** (count badge).
  - Admin: Dashboard, Join Forms, Profile, Settings.
- **Topbar** (64px, white): search box on the left. On the right: **Post** button (CR only), bell, name with avatar.
- **Main:** canvas background, padding 24, max width 1100.

At under 768px the sidebar becomes a drawer opened by a hamburger. Between 768 and 1023px it becomes a 72px icon rail.

---

## 8. Pages

### 8.1 Login `/login`

One centered card, max width 440.

- Logo and "Welcome to E-CR".
- Role picker: **Student | CR | Admin**.
- Fields: Student ID or Email (prefilled `21-12345`), Password (show/hide).
- **Sign In** goes to `/dashboard` (Student, CR) or `/admin` (Admin).
- Link: "New this semester? Fill the join form" goes to `/join`.
- Forgot password shows the demo toast.

### 8.2 Dashboard `/dashboard`

Header: "Good Morning, Syeda!" and a pill with the class ("Spring 2026 · Sec 2").

Order, top to bottom:

1. **Today's Class Schedule** (full width). Three `ScheduleItem`s: time, course code and name, teacher, room. States: done (muted), now (solid blue, "Now" chip), next (light).
2. **Recent Announcements** (left, about 65%). Pinned CR special notice first (pin icon, soft blue background), then 4 recent `PostCard`s. Tabs: All, Announcements, Deadlines, Resources. Link: See all.
3. **Right column (about 35%):**
   - **Upcoming Deadlines:** 3 rows (course chip, title, due date).
   - **Contact CR:** avatar, name, email, phone, copy icons.
   - **Classmates:** 5 `StudentRow`s and a link to `/courses`.

### 8.3 Courses `/courses`

Replaces Class Details. Lists all semesters, newest first. A semester `Select` filter sits on the right.

- **Current semester:** highlight card (blue left border, "Current" chip), open by default.
- **Old semesters:** muted card (grey background, "Completed" chip), collapsed by default.
- Each semester has two tabs:
  - **Courses:** `CourseRow`s (code, name, teacher). Each opens `/courses/[courseId]`.
  - **Students:** `StudentRow`s (initials, name, ID). Show 8, then "Show all 42".
- No credits, rooms, attendance, or cadence cards.

### 8.4 Course detail `/courses/[courseId]`

- Breadcrumb text: Courses / CSE 221. Title: code and name. Subtitle: teacher.
- Tabs with counts: **Announcements**, **Deadlines**, **Resources**. Each shows `PostCard`s of that type.
- CR sees a **+ Add** button that opens `PostModal` with this course preselected.

### 8.5 Announcements `/announcements`

- Filters: **Semester** select, **Course** select, type tabs (All, Announcements, Deadlines, Resources), search.
- List of `PostCard`s, newest first. Empty state when nothing matches.

### 8.6 Profile `/profile`

One small card: initials avatar, name, student ID, role chip. Rows: Email, Phone, Class. Buttons: **Edit** (name and phone become inputs, Save shows toast) and **Change Password** (modal with Old, New, Confirm, Submit shows toast). Nothing else.

### 8.7 Settings `/settings`

One card with four rows: Email notifications (on), Push notifications (off), Deadline reminders (on), Language (select, English). Local state only. Note under the card: "Preferences are not saved in this demo."

### 8.8 Join form `/join`

Card, max width 560. Title "Join a Class", subtitle "Fill this form once each semester." Fields: Full name, Student ID, Semester (only open ones), Class, Email, Phone. **Submit Request** shows a success state: "Request sent. Your CR will review it and choose your courses." If the semester is closed, show: "This form is closed for now."

### 8.9 Join Requests `/requests` (CR only)

- Tabs: Pending 2, Approved 5, Rejected 1.
- `RequestCard`: initials, name, ID, class, time sent, **Reject** (danger-soft) and **Approve** (primary).
- **Approve** opens a modal with a **course checklist** (all courses of the class, all ticked by default) and **Confirm**. Confirm moves the card to Approved and updates counts (local state). Reject moves it to Rejected.
- Empty state: "No pending requests. You're all caught up."

### 8.10 Post modal (CR only)

Opened by the topbar **Post** button.

- Type (segmented): **Announcement | Deadline | Resource**.
- Fields: Course, Title, Details.
- Extra by type: Deadline has due date and time. Resource has a Google Drive link and a label. Announcement has a "Pin as special notice" checkbox.
- **Post** closes the modal and shows the demo toast.

### 8.11 Admin Dashboard `/admin`

Title "All Classes", semester select, search. Three small numbers on top (Classes, CRs, Students). Then class cards: name, semester chip, CR names, student count, counts of announcements and deadlines. Click opens the class page.

### 8.12 Admin Class page `/admin/classes/[classId]`

Title with semester chip. Tabs:

- **Overview:** CR list with **Remove**, **Add CR** (modal to pick a student), course list.
- **Students:** `StudentRow`s with **Remove**, **Add Student** (modal with name, ID, course checklist), and a small pending-requests strip with Approve and Reject (same checklist modal).
- **Posts:** the class's `PostCard`s with type tabs. Admin can delete a post (toast).

Remove actions ask for confirmation in a small modal, then remove the row locally.

### 8.13 Join Form Settings `/admin/join-forms`

One row per semester: name, **Open / Closed** toggle, requests received. The toggle changes local state, and `/join` reads the same flag (put the flag in the same context or a data module).

---

## 9. Shared components

**PostCard** is the heart of the app. It shows a type chip, course chip, time, title, short body, then one of:

- Announcement: nothing extra.
- Deadline: due date with calendar icon (red if within 2 days).
- Resource: **Open in Drive** link button.

Pinned CR notices get a pin icon and a soft blue background.

Other components: `Button` (primary, secondary, soft, danger-soft, ghost), `Card` (default, muted, highlight), `Chip`, `Avatar`, `Tabs` (with counts), `Toggle`, `TextField`, `Select`, `Modal` (Esc and backdrop close, focus trapped), `Toast` (bottom right, dark, 3 seconds), `EmptyState`.

---

## 10. Hardcoded data (`src/data`)

```ts
// users.ts
export const student = { name:'Syeda Dillir Hossain', id:'21-12345', role:'CR', email:'dillir.hossain@cse.univ.edu', phone:'+880 1712-345678', classId:'cse-54-s2' };

// classes.ts
export type Course = { id:string; code:string; name:string; teacher:string };
export type ClassGroup = { id:string; name:string; semester:string; current:boolean; joinOpen:boolean; crs:string[]; courses:Course[]; students:{name:string;id:string}[] };

// posts.ts
export type Post = {
  id:string; type:'announcement'|'deadline'|'resource';
  courseId:string; semester:string; title:string; body:string; time:string;
  pinned?:boolean; urgent?:boolean; due?:string; driveUrl?:string; label?:string;
};

// requests.ts
export type JoinRequest = { id:string; name:string; studentId:string; classId:string; sent:string; status:'pending'|'approved'|'rejected' };
```

**Amount needed:** 3 semesters (1 current, 2 old) with 4 courses each. 12 students in the current class, 8 in each old one. 12 posts (at least 2 pinned or urgent, 3 deadlines, 3 resources). 8 join requests (2 pending, 5 approved, 1 rejected). 4 classes for the admin list.

**Keep consistent:** CSE 221 is always *Object Oriented Programming*. The CR is Syeda in every view. Use one term for dates.

---

## 11. Accessibility basics

- Icon-only buttons have `aria-label`.
- Sidebar is `<nav aria-label="Main">` with `aria-current="page"` on the active link.
- Tabs use `tablist`, `tab`, `tabpanel`. Toggles use `role="switch"`.
- Visible focus ring everywhere. Respect `prefers-reduced-motion`.

---

## 12. Done when

- [ ] `npm run build` and `npm run lint` pass with no unused files, components, or data left from the old version.
- [ ] No package was added. No `react-router` imports. No `tailwind.config.ts`.
- [ ] Login role picker opens the right view. Sidebar shows the right items per role.
- [ ] Only the CR sees Join Requests and the Post button.
- [ ] Dashboard order: Today's Class Schedule, Recent Announcements with pinned CR notice, then Deadlines, Contact CR, Classmates.
- [ ] Courses shows every semester, current highlighted, old muted, each with courses and students.
- [ ] Announcements filter by semester, course, and type.
- [ ] Announcements, deadlines, and Drive resources all render through `PostCard`.
- [ ] Join form works and shows the closed message when a semester is closed.
- [ ] Approving a request shows the course checklist and updates counts.
- [ ] Admin can add and remove CRs and students (local state) and toggle join forms.
- [ ] Profile is basic info plus change password. Settings is four toggle rows.
- [ ] No API calls. All content comes from `src/data`.
- [ ] No horizontal page scroll at 1280, 1024, 768, and 390px.

*End of v2.*
