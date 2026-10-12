# E-CR Portal — UI/UX & Frontend Specification

**Product:** E-CR Portal — *Academic Operations* (Class Representative Portal, v2.4)
**Scope of this document:** Frontend only. Every screen is **static / hardcoded**. No API calls, no auth, no real state beyond local UI state (tabs, toggles, dropdowns, modals).
**Source of truth:** The five mockup screenshots (Login, Dashboard, Class Details, CR Join Requests, Profile).
**Legend:** Items marked **(inferred)** are not visible in the screenshots and are specified so the app has no dead links. Pixel values are approximations measured from a ~1440px-wide desktop design.

---

## 0. Table of Contents

1. Product overview
2. Recommended tech stack
3. Project structure
4. Routes & navigation map
5. Design tokens (theme)
6. Typography
7. Layout system & app shell
8. Shared component library
9. Page specs
   - 9.1 Login
   - 9.2 Dashboard
   - 9.3 Class Details
   - 9.4 CR Join Requests
   - 9.5 Profile
   - 9.6 Announcements (inferred)
   - 9.7 Settings (inferred)
10. Hardcoded mock data
11. Interaction, states & motion
12. Responsive behavior
13. Accessibility
14. Known inconsistencies in the mockups (and the decision)
15. Build order & acceptance checklist

---

## 1. Product overview

E-CR is a portal where **Class Representatives (CRs)** coordinate between students of a section and faculty: publishing notices, managing the class routine, reviewing CR join/nomination requests, and tracking attendance and course info.

**Roles shown in the UI**

| Role | Where seen | Notes |
|---|---|---|
| Student / Class Rep | Login tab 1, all logged-in screens | Default role. The logged-in persona is **Syeda Dillir Hossain**, shown with a `Head CR · Dept. of CSE` chip |
| Faculty / Admin | Login tab 2 | Login only; no faculty screens are designed. Selecting it just changes the tab highlight |

**Design personality:** clean, academic, trustworthy. Deep royal-blue brand colour on a very light blue-grey canvas, white rounded cards, small uppercase "eyebrow" labels, pill chips for status, soft shadows. Information-dense but airy.

---

## 2. Recommended tech stack

The mockups are framework-agnostic, but this stack is the fastest way to reproduce them exactly.

| Concern | Choice | Why |
|---|---|---|
| Build | **Vite + React 18 + TypeScript** | Fast, simple, great for a university project |
| Styling | **Tailwind CSS 3.4** with CSS variables for tokens | Utility classes match the card/chip-heavy design |
| Routing | **React Router v6** | Nested layout routes for the app shell |
| Icons | **lucide-react** | Outline icons with consistent 1.5–2px stroke, matches mockups |
| Font | **Inter** (Google Fonts, weights 400/500/600/700/800) | Matches the geometric sans in the designs |
| Charts | None. The attendance ring and progress bars are pure SVG/CSS | Keep dependencies minimal |
| State | `useState` only (tabs, toggles, modals) | Everything else is hardcoded |

Plain HTML/CSS/JS or Next.js works too; the component and token structure below carries over unchanged.

---

## 3. Project structure

```
ecr-portal/
├─ index.html
├─ tailwind.config.ts
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx                      # <RouterProvider/>
│  ├─ routes.tsx                   # route table (section 4)
│  ├─ styles/
│  │  ├─ tokens.css                # CSS variables (section 5)
│  │  └─ globals.css               # Tailwind layers + base styles
│  ├─ data/                        # ALL hardcoded content (section 10)
│  │  ├─ user.ts
│  │  ├─ dashboard.ts
│  │  ├─ course.ts
│  │  ├─ crRequests.ts
│  │  └─ profile.ts
│  ├─ layouts/
│  │  ├─ AppShell.tsx              # sidebar + topbar + <Outlet/>
│  │  └─ AuthLayout.tsx            # login backdrop
│  ├─ components/
│  │  ├─ shell/ Sidebar.tsx, SidebarItem.tsx, Topbar.tsx, GlobalSearch.tsx, RoleChip.tsx, NotificationBell.tsx, UserMenu.tsx
│  │  ├─ ui/    Card.tsx, Button.tsx, Chip.tsx, StatusPill.tsx, Avatar.tsx, Tabs.tsx, SegmentedControl.tsx,
│  │  │         ProgressBar.tsx, RingProgress.tsx, Toggle.tsx, Checkbox.tsx, TextField.tsx, PasswordField.tsx,
│  │  │         IconTile.tsx, Breadcrumb.tsx, Select.tsx, Badge.tsx, InfoRow.tsx, SectionHeader.tsx, FileAttachment.tsx
│  │  └─ domain/ StatCard.tsx, AnnouncementItem.tsx, NoticeCard.tsx, ClassSessionCard.tsx, CourseRow.tsx,
│  │            CRRequestCard.tsx, GovernanceList.tsx, RosterOfficer.tsx, QuickActionRow.tsx, RoutineTimeline.tsx
│  └─ pages/
│     ├─ Login.tsx
│     ├─ Dashboard.tsx
│     ├─ ClassDetails.tsx
│     ├─ CRJoinRequests.tsx
│     ├─ Profile/ index.tsx, PersonalInfoTab.tsx, AcademicRecordsTab.tsx, SecurityTab.tsx
│     ├─ Announcements.tsx         # inferred
│     ├─ Settings.tsx              # inferred
│     └─ NotFound.tsx
└─ public/ (logo.svg, campus.jpg, avatars)
```

---

## 4. Routes & navigation map

| Path | Page | Layout | Sidebar highlight | In mockups? |
|---|---|---|---|---|
| `/` | Redirect → `/login` | – | – | – |
| `/login` | Login | AuthLayout | – | ✅ |
| `/dashboard` | Dashboard | AppShell | Dashboard | ✅ |
| `/class-details` | Class Details | AppShell | Class Details | ✅ |
| `/cr-join-requests` | CR Join Requests | AppShell | CR Join Requests | ✅ |
| `/announcements` | Announcements | AppShell | Announcements | (inferred) |
| `/profile` | Profile → default tab `personal` | AppShell | Profile | ✅ |
| `/profile/academic-records` | Profile · Academic Records tab | AppShell | Profile | tab visible, content inferred |
| `/profile/security` | Profile · Security & Settings tab | AppShell | Profile | tab visible, content inferred |
| `/settings` | Settings | AppShell | Settings | (inferred) |
| `*` | NotFound | AppShell | – | (inferred) |

**Hardcoded auth behavior:** the `Sign In to E-CR →` button simply navigates to `/dashboard` (no validation). `Logout` in the sidebar navigates to `/login`.

**Sidebar structure (exact order)**

```
[Logo] E-CR  [PORTAL badge]
       Academic Operations

WORKSPACE
  Dashboard            icon: layout-grid        → /dashboard
  Class Details        icon: monitor / book-open→ /class-details
  CR Join Requests  ③  icon: user-plus          → /cr-join-requests   (count badge = 3)
  Announcements        icon: megaphone          → /announcements
  Profile              icon: user               → /profile

SYSTEM
  Settings             icon: settings           → /settings

(bottom, pinned)
  Logout               icon: log-out, RED text  → /login
```

---

## 5. Design tokens (theme)

Values are sampled from the mockups. Put them in `tokens.css` and map them in `tailwind.config.ts`.

### 5.1 Colour

```css
:root {
  /* Brand */
  --brand-900: #0A2A8A;   /* pressed / gradient dark end */
  --brand-700: #0B3FBF;   /* PRIMARY: buttons, active nav, links, progress fill */
  --brand-600: #1D4ED8;   /* hover on primary */
  --brand-500: #2F63E8;   /* gradient light end, focus ring */
  --brand-100: #E4EBFF;   /* icon tile bg, soft chip bg */
  --brand-50:  #F0F4FF;   /* tinted card inner bg (announcement rows, course rows) */

  /* Surfaces */
  --canvas:      #F4F6FD;  /* page background (very light lavender-blue) */
  --surface:     #FFFFFF;  /* cards, sidebar, topbar */
  --surface-alt: #F6F8FF;  /* nested rows inside cards */
  --border:      #E3E8F5;  /* hairlines, card borders */
  --border-strong:#CBD5EE; /* inputs on focus-less state, dividers */

  /* Text */
  --text-900: #0F172A;  /* headings, key numbers */
  --text-700: #334155;  /* body */
  --text-500: #64748B;  /* secondary, captions */
  --text-400: #94A3B8;  /* placeholders, eyebrow labels */

  /* Semantic */
  --success-600:#12915A; --success-100:#DDF6EA;   /* Active CR, On Duty, Live Now, Good Standing */
  --warning-600:#C2610C; --warning-100:#FFEBD2;   /* "2 In Review", pending */
  --danger-600: #D92D20; --danger-100: #FDE4E1;   /* Urgent Notice, Action needed, Reject, Logout */
  --info-600:   #0B3FBF; --info-100:   #E4EBFF;   /* Section / Course chips */
  --amber-100:  #FFF3C4; --amber-600:#B7791F;     /* amber icon tile (Join Queue clipboard) */
  --purple-100: #EDE7FF; --purple-600:#6D4AE0;    /* "Aspiring CR Nominee" chip, ex-sub chips */
  --slate-chip: #E9EDF7;                          /* neutral chips: "Head CR Candidate" etc. */
}
```

**Dark mode:** not present in mockups. Out of scope; tokens are structured so it can be added later by overriding the variables.

### 5.2 Gradients

| Name | Value | Used on |
|---|---|---|
| `--grad-brand` | `linear-gradient(135deg, #0A2A8A 0%, #1D4ED8 55%, #2F63E8 100%)` | Login left panel |
| `--grad-notice` | `linear-gradient(135deg, #0B3FBF 0%, #1E55E0 100%)` | Dashboard "CR Special Notice" card |

### 5.3 Radius, shadow, spacing

| Token | Value | Used on |
|---|---|---|
| `--r-xs` | 6px | Small chips, tags |
| `--r-sm` | 8px | Inputs inner elements, small buttons |
| `--r-md` | 12px | Buttons, inputs, nested rows, icon tiles |
| `--r-lg` | 16px | Cards |
| `--r-xl` | 20px | Hero cards, login card |
| `--r-full` | 999px | Pills, avatars, toggle |
| `--shadow-card` | `0 1px 2px rgba(15,23,42,.04), 0 4px 16px rgba(30,64,175,.06)` | Cards |
| `--shadow-pop` | `0 8px 30px rgba(15,23,42,.12)` | Dropdowns, modals |
| `--shadow-login` | `0 20px 60px rgba(30,64,175,.15)` | Login card |

**Spacing scale (4px base):** 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40. Card padding is **20–24px**; gap between cards **20–24px**; gap between rows inside a card **12px**.

### 5.4 Tailwind mapping (excerpt)

```ts
theme: { extend: {
  colors: {
    brand: { 50:'#F0F4FF',100:'#E4EBFF',500:'#2F63E8',600:'#1D4ED8',700:'#0B3FBF',900:'#0A2A8A' },
    canvas:'#F4F6FD', border:'#E3E8F5',
    ink: { 900:'#0F172A',700:'#334155',500:'#64748B',400:'#94A3B8' },
    success:{100:'#DDF6EA',600:'#12915A'}, warning:{100:'#FFEBD2',600:'#C2610C'}, danger:{100:'#FDE4E1',600:'#D92D20'},
  },
  borderRadius: { md:'12px', lg:'16px', xl:'20px' },
  boxShadow: { card:'0 1px 2px rgba(15,23,42,.04),0 4px 16px rgba(30,64,175,.06)', pop:'0 8px 30px rgba(15,23,42,.12)' },
  fontFamily: { sans:['Inter','system-ui','sans-serif'] },
}}
```

---

## 6. Typography

Font: **Inter**. Numbers use `font-variant-numeric: tabular-nums` in stats and times.

| Style | Size / Line | Weight | Colour | Used for |
|---|---|---|---|---|
| Display (Login hero) | 36 / 42 | 800 | white | "Better Class. Better University." |
| H1 page title | 28–30 / 36 | 800 | text-900 | "Good Morning, Syeda! 👋", "CSE 221 — Object Oriented Programming", "Syeda Dillir Hossain" (24) |
| H2 section title | 18 / 24 | 700 | text-900 | "Recent Announcements", "Current Semester Courses", "Institutional Credentials" |
| H3 card title | 16 / 22 | 700 | text-900 | Notice title, course name, request name |
| Stat value | 28–32 / 36 | 800 | text-900 | "94.8%", "Top 5%", "6 Courses", "42 Students", "92%" |
| Body | 14 / 20 | 400–500 | text-700 | Paragraphs, descriptions |
| Small | 13 / 18 | 400–500 | text-500 | Meta lines, sub-labels |
| Caption | 12 / 16 | 500 | text-500 | Timestamps, footers |
| Eyebrow | 11 / 14 | 700, uppercase, +0.06em tracking | text-400 | "TOTAL ATTENDANCE", "NEXT UPCOMING CLASS", "AUTHORIZED ACCESS", "CAPACITY" |
| Chip text | 11–12 / 14 | 600 | per chip | All chips |
| Button | 14 / 20 | 600 | – | All buttons |

---

## 7. Layout system & app shell

### 7.1 Shell grid (all pages except Login)

```
┌──────────────┬──────────────────────────────────────────────────────┐
│              │ TOPBAR  (height 64, sticky, white, bottom border)     │
│   SIDEBAR    ├──────────────────────────────────────────────────────┤
│   width 220  │                                                      │
│   white      │   MAIN  padding 24–32, bg canvas, scrolls vertically │
│   sticky     │   content max-width ≈ 1180 (fluid below)             │
│   full-height│                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
```

### 7.2 Sidebar details

- Width **220px**, white, right border `--border`, padding 16.
- **Brand block** (top): 36×36 rounded-12 brand-700 tile with white graduation-cap icon; to its right "**E-CR**" (16/700) followed by a tiny `PORTAL` outlined badge (9px, 700, brand-700 text on brand-100 bg, radius 4); beneath, "Academic Operations" (12/ text-500).
- **Section labels** `WORKSPACE`, `SYSTEM`: eyebrow style, margin-top 20, margin-bottom 8.
- **Nav item:** height 40, radius 12, padding 0 12, icon 18px + 12px gap + label 14/500.
  - Default: text-700, transparent.
  - Hover: bg `--brand-50`.
  - **Active:** bg `--brand-700`, text white, icon white, label 600. (Solid blue pill, no left bar.)
  - **Count badge** (CR Join Requests): right-aligned, 20×20 pill, bg brand-100, text brand-700, 11/700, value "3". On the active item it inverts (white pill, brand text).
- **Logout:** pinned to bottom, separated by a top border, red text/icon (`--danger-600`), hover bg `--danger-100`.

### 7.3 Topbar details (left → right)

1. **Global search** (flex-1, max-width ≈ 440): height 40, radius 12, bg `--brand-50`, no border, search icon left, placeholder `Search classes, student ID, notices, schedules...` (13/ text-400).
2. Spacer.
3. **Role chip:** pill, white bg + 1px `--border`, small shield-check icon in brand-700, text `Head CR · Dept. of CSE` (12/600).
4. **Notification bell:** 36px icon button, 8px red dot (`--danger-600`) at top-right.
5. **User block:** right-aligned two-line text: name `Syeda Dillir Hossain` (14/700) and `ID: 2021-1-60-042` (11/ text-500); followed by a 36px round avatar in brand-700 with white user icon.

### 7.4 Page header pattern

Most pages start with: *optional breadcrumb/eyebrow chips → H1 → one-line subtitle (text-500) → right-aligned action buttons.* Spacing: 4px between eyebrow and H1, 6px between H1 and subtitle, 24px before the first card row.

---

## 8. Shared component library

For each component: anatomy → variants → exact styling.

### 8.1 `Card`
White bg, `--r-lg` (16), `--shadow-card`, 1px `--border` optional, padding 20–24. Variants: `default`, `tinted` (bg `--brand-50`, no shadow; used for nested rows), `accent-left` (4px brand-700 left border; used by Election Status card), `gradient` (Dashboard special notice).

### 8.2 `Button`

| Variant | Style | Examples |
|---|---|---|
| `primary` | bg brand-700, white text, radius 12, height 40, padding 0 16, hover brand-600, active brand-900 | Edit Profile, Nominate Student, View Syllabus, Sign In to E-CR →, Accept, Message CR, Download |
| `secondary` / outline | white bg, 1px `--border-strong`, text-700, hover bg brand-50 | Digital ID, Decision Log, Routine PDF |
| `soft` | bg brand-100, text brand-700 | Update, Create Account (white variant on tinted strip) |
| `danger-soft` | bg `--danger-100`, text `--danger-600` | Reject |
| `ghost` / link | no bg, brand-700 text, 600 weight, arrow icon after | Track →, Browse →, View Profile →, Complete Appraisals →, Re-verify |
| `icon` | 36–40 square, radius 12, bg brand-50 | Copy, call, mail, download, bookmark |

Sizes: `sm` height 32 / 13px; `md` 40 / 14px (default); `lg` 48 / 15px (Sign In button is `lg`, full-width).

### 8.3 `Chip` / `Badge` / `StatusPill`
Height 22–24, padding 0 8–10, radius 6 (rect chip) or full (pill), text 11–12/600. Optional leading icon or dot (6px).

| Variant | Bg / Text | Used for |
|---|---|---|
| `info` | brand-100 / brand-700 | `SECTION 2 (CSE 221)`, `2nd Year • 4th Semester`, `CSE 221`, `4th Semester + 2nd Year`, `3.0 Cr`, `CORE CURRICULUM`, `Section CSE-221` |
| `neutral` | slate-chip / text-700 | `Head CR Candidate`, `Assistant CR Candidate`, `Section 2 · Cohort A`-style tags |
| `purple` | purple-100 / purple-600 | `Aspiring CR Nominee` (with small user-plus icon) |
| `success` | success-100 / success-600 (+ green dot) | `Active CR`, `Live Now`, `Active` (routine), `Status: Active` |
| `warning` | warning-100 / warning-600 | `2 In Review`, `Verification Pending` (with blue dot variant), `Pending Review` |
| `danger` | danger-100 / danger-600 | `Important Notice`, `Urgent Notice`, `Action needed` text, `Urgent (2)` count |
| `outline-count` | brand-100 pill with number | tab counts `Pending 2`, `Approved 5`, `Rejected 1`, `Notice Board 3` |

### 8.4 `Avatar`
Sizes 32 / 36 / 40 / 56 / 88. Variants: **photo** (rounded-16 square for profile hero, 88px, with a small camera icon button overlapping bottom-right), **initials** (rounded-12 square, bg brand-100, text brand-700, 700 weight, e.g. `FA`, `NJ`, `TH`, `TM`), **round icon** (topbar). Optional presence dot (10px green, white 2px ring) bottom-right.

### 8.5 `StatCard` (Dashboard & Class Details top rows)
Card with: top row = eyebrow label (left) + optional chip (right) **or** icon tile (right); then big value; then sub-line; then optional footer row separated by a hairline with left meta + right link. Icon tile = 40×40, radius 12, soft-colour bg with matching icon.

### 8.6 `IconTile`
40×40 (or 36), radius 12. Colours: brand (blue), amber, green, red, purple soft backgrounds with 20px icons in the 600 shade.

### 8.7 `Tabs`
Two styles:
1. **Underline-less pill tabs inside a rounded container** (Profile page top): container white, radius 12, 1px border, padding 4; tabs = icon + label 13/600; active = white bg with 1px border + brand text + subtle shadow; inactive = text-500.
2. **Filter tabs with counts** (Join Requests, Class Details notice board, Announcements): container bg brand-50 radius 12 padding 4; active tab white + shadow; each shows a count pill.

### 8.8 `SegmentedControl`
Login role switch: two equal segments in a brand-50 rounded-12 container; active = white, radius 10, icon + brand-700 text, light shadow.

### 8.9 `ProgressBar`
Height 8, radius full, track `--brand-100`, fill `--brand-700`. Variants: with right-aligned label (`Presence`), thick 10px (Peer Endorsement), small 6px (course presence).

### 8.10 `RingProgress`
SVG circle, 48×48 (Dashboard/Profile attendance) or 96×96 (Class Details). Stroke 6–8 round caps, track `--brand-100`, value stroke `--brand-700`, optional centered icon (small clipboard icon at 48px) or centered text (`92%` at 96px).

### 8.11 `TextField` / `PasswordField`
Height 48, radius 12, bg `--brand-50`, 1px transparent border (focus: 2px `--brand-500` ring + white bg), leading 18px icon in text-400, 14px text. Password field has trailing eye / eye-off toggle button (toggles local state only). Label above: 13/600 text-900, margin-bottom 8.

### 8.12 `Checkbox`
18×18, radius 4, checked = brand-700 fill with white check. Label 13/ text-700.

### 8.13 `Toggle`
44×24 pill. On = brand-700 track + white knob right. Off = `--border-strong` track.

### 8.14 `InfoRow` (Profile credentials)
Row card: bg `--brand-50`, radius 12, padding 12–14; leading 36px icon tile (white bg), then stacked: eyebrow-ish label (11/ text-500) + value (14/600 text-900); optional trailing icon button (copy, call).

### 8.15 `FileAttachment`
Row with 1px border, radius 12, padding 10–12: leading file icon, filename 13/600 + size/type caption 11, trailing `Download` button (primary sm on Dashboard) or download icon button (Class Details).

### 8.16 `SectionHeader`
Row: optional leading icon (brand-700, 18px) + H2 title + optional subtitle line (12/ text-500) + right-aligned action (`Filter` ghost button with sliders icon, tabs, or link).

### 8.17 `Breadcrumb`
`Academic Operations / Course Details` with a small book icon, 12/ text-500, last item 600, followed by a chip (`Spring 2024`).

### 8.18 `Select` (compact)
Used in Join Requests: `CSE 221 · Sec 2` dropdown, height 36, radius 10, white bg, border, chevron. Sits next to a small filter icon button.

### 8.19 Domain components

**`AnnouncementItem`** — tinted row (brand-50, radius 12, padding 14): top line = tag chips (`Urgent Notice` red / `CME Meeting` blue / `Routine Update` blue + `Lab Session`), course chip, dot-separated timestamp, bookmark icon button right. Title 15/700. Body 13/ text-700, 2 lines clamp. Footer = attachment row **or** meta row (calendar icon + time, `RSVP Details →` link).

**`NoticeCard`** (Class Details) — white card, padding 20: chip row (type + dot + date), bookmark icon right, title 17/700, body 14, optional `FileAttachment`, footer with author avatar + `Farhan Ahmed (Lead CR)` and right-aligned verification text.

**`ClassSessionCard`** — three states: `completed` (bg brand-50, check-circle icon top-right, label `COMPLETED` in small muted caps), `live` (bg brand-700, white text, green `Live Now` pill, location pin + `COMPUTING ANNEX` caps at bottom), `upcoming` (bg brand-50, clock icon, label `UPCOMING`). Each shows time range (11/500), course title (15/700), instructor + room (11/ text-500).

**`CourseRow`** (Profile) — tinted row: 40px initial tile (letter in brand-700 square: `P`, `D`, `M`), course title 15/700 + credit chip (`3.0 Cr`), instructor + room + schedule meta line (11), right side: `96.2%` big (16/800) + `Presence` caption + 6px progress bar + small book icon button.

**`CRRequestCard`** — see 9.4.

**`RosterOfficer`** — 36px initials tile + name (14/700) + role caption (11) + trailing mail icon button.

**`QuickActionRow`** — tinted row (brand-50, radius 12, padding 12) with 36px coloured icon tile, title 14/700, caption 11/ text-500, trailing chevron-right.

**`RoutineTimeline`** — vertical list with coloured dots (brand-700 filled for active, teal/green for lab, grey for optional), connector line, day name 14/700 + status chip, time 15/700 brand, subtitle lines with small icons.

---

## 9. Page specs

All logged-in pages sit inside `AppShell`. Persona and numbers are normalized per section 14.

---

### 9.1 Login — `/login`

**Background:** page canvas `#F7F8FD` (slightly lighter than app canvas), card centered with ≈ 60px margin around.

**Card:** width ≈ 1040px (max-width, fluid on small), radius 20, `--shadow-login`, overflow hidden, **two columns** (left 45% / right 55%), with a **bottom strip** spanning the right column.

#### Left panel (brand panel)
Background `--grad-brand`, padding 32, white text, subtle radial highlights.

Top → bottom:
1. **Logo row:** 40px translucent-white rounded tile with graduation-cap icon; next to it `E-CR` (18/700) + tiny `V2.4` badge (white 20% bg); beneath: `Class Representative Portal` (11/ white 80%).
2. **Term chip:** pill, white 15% bg, dot + `Spring 2026 Academic Coordination` (11/600).
3. **Headline:** `Better Class.` / `Better University.` on two lines (Display 36/800), margin-top 24.
4. **Paragraph:** `Connect effortlessly with course peers, resolve schedule clashes, broadcast official notices, and coordinate with faculty in real-time.` (14/ white 85%, max-width 360).
5. **Photo card** (radius 16, height ≈ 150): campus photo of students walking/sitting, dark gradient overlay at bottom. Bottom-left overlay: check-circle icon + `Verified Department Representatives` (11/700). Bottom-right: tiny text `SEC-A / CSE` (10/600 caps).
6. **Feature tiles row** (glassy panel, white 12% bg, radius 16, padding 12, 3 equal cells with icons above text):
   - Icon share-nodes · **Connect** · `Whole Batch`
   - Icon megaphone · **Communicate** · `Instant Routine`
   - Icon arrows-swap · **Coordinate** · `CR Approvals`
   (title 12/700 white; caption 10 white 70%)
7. **Footer row:** left `Institutional SSO Enabled`, right `Accredited Portal • 2026` (10/ white 70%).

#### Right panel (form)
Padding 40, white.

1. **Top row:** left eyebrow with blue dot `AUTHORIZED ACCESS`; right pill `Server Online: CSE Dept` (brand-100 bg, brand-700 text, dot, 11/600).
2. **Heading:** `Welcome Back!` (H1 30/800), margin-top 24.
3. **Subtitle:** `Sign in to your E-CR account to oversee class schedules and pending notices.` (14/ text-500).
4. **Role switch** (`SegmentedControl`): `Student / Class Rep` (id-badge icon, **active by default**) | `Faculty / Admin` (users icon).
5. **Field 1** — label `University Email or Student ID`; user-circle icon; value shown `21-12345` (prefilled).
6. **Field 2** — label `Password` with right-aligned link `Forgot Password?` (brand-700, 12/600); lock icon; masked value `••••••••••••`; eye-off toggle at right.
7. **Options row:** checked checkbox `Remember my device for 30 days` (left); right tiny shield + `SSL 256-bit` (11/ text-400).
8. **Primary button** (lg, full width): `Sign In to E-CR →`.
9. **Divider:** hairline with centered caps text `OR SIGN IN WITH`.
10. **SSO buttons** (2 equal columns, soft brand-50 bg, radius 12, height 44): `Campus Smartcard` (id-card icon), `EduID SSO` (building icon).

#### Bottom strip (right column only)
bg `--brand-50`, padding 20 40, flex between: left stack `New Representative or Class Member?` (14/700) + `Request student role onboarding or register your section batch.` (12/ text-500); right white button `Create Account` (soft/white, radius 10).

#### Outside the card (footer)
Centered below card, 11/ text-500: left shield icon + `Department of Academic Affairs & Student Governance`; right links separated by `•`: `System Guidelines`, `CR Election Protocols`, `IT Help Desk`.

**Behavior:** role segments toggle local state; password eye toggles type; Sign In → `/dashboard`; Forgot Password / Create Account / SSO buttons are no-ops (or show a toast "Demo only").

---

### 9.2 Dashboard — `/dashboard`

**Header row**
- Left: `Good Morning, Syeda! 👋` (H1) + subtitle `Here's what's happening in your class today and upcoming academic deadlines.`
- Right: **Active-term pill** (white, border, radius full): blue dot + eyebrow `ACTIVE TERM` + brand-100 inner chip `Spring 2026 • CSE 221 (Sec 02)`.

**Row 1 — four `StatCard`s** (grid 4 cols, gap 20)

| # | Eyebrow | Chip / tile | Value | Sub | Footer left | Footer right |
|---|---|---|---|---|---|---|
| 1 | `ENROLLED COURSE` (icon tile: brand, terminal/code icon) | chip `Section 02` | **CSE 221** | `Algorithms & Data Structures` | people icon `48 Peers` | `Rm 402B →` |
| 2 | `PRIMARY REPRESENTATIVE` | green chip `Active CR` | avatar `NJ` with green dot + **Nusrat Jahan** | `Student ID: 21-1-60-112` | green check `On Duty` | `Profile ↗` |
| 3 | `REPRESENTATIVE APPLICATIONS` (amber clipboard tile) | orange chip `2 In Review` | **Join Queue** | `Awaiting CR & Faculty sign-off` | `Submitted 2d ago` | `Track →` |
| 4 | `CLASS BULLETIN` (blue bell tile) | red chip `4 Unread` | **New Notices** | `Latest: Midterm Routine updated` | `Updated 45m ago` | `Browse →` |

Card 2's name is the "stat value" at 18/800. Cards 3 and 4 titles are 20/800.

**Row 2 — two columns** (left ≈ 65% / right ≈ 35%, gap 20)

*Left: `Recent Announcements` card*
- Header: megaphone icon + title; right: filter tabs `All (8)` (active), `Urgent (2)`, `Exams`.
- Three `AnnouncementItem`s, 12px apart:
  1. Chips: `Urgent Notice` (red) · `CSE 221` · `45 mins ago`. Title **Midterm Examination Schedule & Syllabus Topics Published**. Body: `The Department of Computer Science has finalized the Midterm timetable. Room allocations for Section 02 will be in Building 3, Hall A. Please…`. Attachment: `CSE221_Spring2026_Midterm_Syllabus.pdf (1.4 MB)` + `Download` button.
  2. Chips: `CR Meeting` · `General` · `3 hours ago`. Title **Class Representative & Faculty Coordination Session**. Body: `All section CRs and co-representatives are requested to join a brief 20-minute alignment session tomorrow at 03:00 PM via Google Meet regarding lab schedule swaps.` Footer: calendar icon `Tomorrow, 3:00 PM` · globe/video icon `Online Meeting`; right `RSVP Details →`.
  3. Chips: `Routine Update` · `Lab Session` · `Yesterday`. Title **Algorithm Lab Session Shifted to Software Lab 302**. Body: `Due to hardware maintenance in Lab 204, Wednesday's 10:30 AM practical algorithm demonstration will take place in Room 302 (Computing Annex). Bring your student badges.`

*Right column (stacked, gap 20)*
1. **CR Special Notice card** (`--grad-notice`, white text, radius 16, padding 20): chip `CR Special Notice` (white 20% bg, megaphone icon) + right text `Today`; title **Assignment 03 Deadline Extension**; quote paragraph `"Following discussion with Course Faculty, the dynamic programming assignment deadline has moved to Friday, 11:59 PM. No further extensions!"`; footer: avatar `NJ` + `Nusrat Jahan (CR)` and right link `Discuss 💬`.
2. **Quick Actions card:** header `Quick Actions` + lightning icon right. Four `QuickActionRow`s:
   - `Class Details` / `Course specs & syllabus` (blue icon) → `/class-details`
   - `Join CR Team` / `Apply as Assistant CR` (green user-plus icon) → `/cr-join-requests`
   - `Class Routine` / `Weekly timetable view` (calendar icon) → `/class-details`
   - `Contact CR` / `Direct query or query request` (chat icon) → opens nothing (no-op)
3. **Class Roster Officers card:** header `Class Roster Officers` + chip `2 CRs`. Rows: `NJ` **Nusrat Jahan** `Lead Representative • Sec 02` ✉ ; `TH` **Tanzim Hossain** `Assistant CR • Lab Affairs` ✉. Footer full-width soft button `View Full Class Directory (48 Students)`.

**Row 3 — Today's Class Schedule card (full width)**
- Header: calendar icon + `Today's Class Schedule`; subtitle `Wednesday, October 15 • 3 Sessions scheduled`; right chip `Week 06`.
- Three `ClassSessionCard`s in a 3-col grid:
  1. **completed** — `08:30 AM – 10:00 AM` · `CSE 221 • Lecture` · `Prof. Tariqul Islam • Rm 402B` · `COMPLETED`.
  2. **live** — `10:30 AM – 12:00 PM` + `Live Now` pill · `CSE 222 • Algorithms Lab` · `Engr. Nusrat Jahan • Rm 302` · location `COMPUTING ANNEX`.
  3. **upcoming** — `02:00 PM – 03:30 PM` · `MAT 205 • Linear Alg` · `Dr. S. Rahman • Rm 501` · `UPCOMING`.

---

### 9.3 Class Details — `/class-details`

**Top bar of page:** breadcrumb `Academic Operations / Course Details` + chip `Spring 2024`; right-aligned buttons `Routine PDF` (secondary, download icon) and `View Syllabus` (primary, book icon).

**Hero card** (white, radius 20, padding 24, 2 columns)
- Left: chips row `CORE CURRICULUM` (info), `4th Semester • 2nd Year`, `3.0 Credits (Theory + Lab)`; H1 **CSE 221 — Object Oriented Programming**; meta line with building icon: `Department of Computer Science & Engineering • Faculty of Science & Technology`.
- Right: tinted card (brand-50, radius 16, padding 16) with clock icon tile and stacked: eyebrow `NEXT UPCOMING CLASS`, **Tomorrow, 10:30 AM** (20/800), `Lab Room 302 • Sec A`.

**Stat row — 4 cards**
| Icon tile | Eyebrow | Value | Caption |
|---|---|---|---|
| people (blue) | `Total Enrolled` | **42** `Students` | green check `100% Registered` |
| monitor (blue) | `Department Code` | **CSE** | `Cohort '21` / `Computer Science` |
| layout (blue) | `Section & Venue` | **Sec A • RM 302** | `Faculty Bldg 2` (blue) |
| calendar (blue) | `Class Cadence` | **Mon, Wed** | `10:30 AM – 12:00 PM` |

**Lead CR strip** (white card, one row, padding 16)
- Avatar photo 48px with small verified badge; **Farhan Ahmed** + chip `Lead Class Representative`; caption `Student ID: 21-12345 • Section A Coordinator • Elected Jan 2024`.
- Right actions: outlined pill buttons `farhan.cr@univ.edu` (mail icon), `+880 1711-209481` (phone icon), primary `Message CR` (chat icon).

**Body — two columns** (left ≈ 66%, right ≈ 34%)

*Left column*
- **Tabs** (filter-tabs style): `Notice Board` `3` (active, megaphone icon) · `Class Members` `42` (people icon) · `Faculty Contacts` `2` (graduation-cap icon).
- **Notice Board content** — 3 `NoticeCard`s:
  1. Chips: red `Important Notice` · `Posted 2 hours ago`. Title **Midterm Lab Assessment Schedule & Submission Guidelines**. Body `All students are required to verify their project repositories on the university GitLab portal before Wednesday midnight. The hands-on evaluation will run during regular lab hours in Room 302. Please ensure your local environments run Java 17 LTS and JavaFX runtime dependencies.` Attachment `CSE221_Lab_Evaluation_Rubric_v2.pdf` — `1.4 MB • PDF Document` with download icon. Footer: avatar `FA` + `Farhan Ahmed (Lead CR)`; right `Verified by Dr. Farhana Akhter`.
  2. Chips: `Schedule Change` (info) · `Oct 2, 2024`. Title **Class Routine Updated: Makeup Class for Object Oriented Design**. Body `Due to the faculty seminar on Thursday, the planned tutorial session has been moved to Monday 12:15 PM in Seminar Hall B. Attendance is mandatory for group project allocations.` Footer: `FA` `Farhan Ahmed (Lead CR)`; right `CSE Coordination Desk`.
  3. Chips: `Academic Resource` · `Sep 28, 2024`. Title **Lab Session Moved to Main Software Lab 302**. Body `All subsequent practical sessions for Section A will occur in Computer Lab 302 with dual monitor setups. Please review Lecture 04 slides uploaded on LMS prior to arrival.`
- Each notice has a bookmark icon button top-right.
- **Class Members / Faculty Contacts tabs (inferred):** simple list cards (avatar initials, name, student ID / email, role chip). Hardcode 6 members and 2 faculty.

*Right column (stacked)*
1. **Weekly Routine** card — header: calendar-grid icon + `Weekly Routine`, right `Spring 2024`. `RoutineTimeline`:
   - **Monday** (active, filled blue dot) · chip `Active` · `10:30 AM – 12:00 PM` · `Theory: OOP & Polymorphism` · `Room 302 • Dr. Farhana Akhter`.
   - **Wednesday** (teal dot) · chip `Lab Hands-on` · `10:30 AM – 12:00 PM` · `Lab Evaluation & JavaFX GUI Building` · `Engr. Tanvir Ahmed`.
   - **Thursday (Optional)** (grey dot) · chip `Office Hour` · `02:00 PM – 03:30 PM` · `Student Query & CR Sync Hour` · `Faculty Room 412`.
2. **Class Attendance Health** card — left `RingProgress` 96px with **92%**; right text `22 of 24 Sessions` (14/700), `Class average quorum is exceptional this semester.` (12), then green `Good Standing • Above 80%`.
3. **Course Resources** card — three tinted link rows with chevron: `Lecture Slide Deck (01-08)`, `Lab Assignment Starter Code`, and `WhatsApp Batch Discussion` (external-link icon, in a bordered row).

---

### 9.4 CR Join Requests — `/cr-join-requests`

**Header**
- Eyebrow chips: `Governance • Term 2024-25` (info) and `Section CSE-221` (neutral).
- H1 **CR Join Requests**; subtitle `Review student nominations and volunteer applications for Class Representative. Coordinate approvals with department guidelines.`
- Right: `Decision Log` (secondary, history icon) and `Nominate Student` (primary, user-plus icon).

**Summary row — 3 cards**
| Eyebrow | Value | Sub | Icon tile |
|---|---|---|---|
| `REVIEW QUEUE` | **2** + red text `Action needed` | `Awaiting Review` | blue clipboard-check |
| `ACTIVE REPS` | **5** + `/ 6 quota` | `Confirmed CRs` | blue people |
| `ARCHIVED` | **1** + `this term` | `Declined Application` | red user-x |

**Body — two columns** (left ≈ 68%, right ≈ 32%)

*Left: requests*
- **Toolbar:** tabs `Pending` `2` (active) · `Approved` `5` · `Rejected` `1`; right: `Select` `CSE 221 · Sec 2` and a filter-sliders icon button.
- **`CRRequestCard` anatomy** (white card, padding 20, radius 16):
  - Top row: initials tile (rounded-12, 40px) · name 16/700 + chips (`CSE 221 • 2nd Year` info, role-candidate chip) · right chip `Pending Review` (dot + warning style). Under name: `ID: 21-12345-1 • Applied 2 days ago` (12/ text-500) with clock icon.
  - **Statement of Intent** block: quote icon + eyebrow `STATEMENT OF INTENT`; italic paragraph inside a tinted box (brand-50, radius 12, padding 14).
  - **Metric chips row:** outlined small chips with icons (`CGPA: 3.88 (Top 5%)`, `14 Peer Endorsements`, `Ex-Sub CR (CSE 110)`).
  - **Actions:** `Reject` (danger-soft, x icon) and `Accept` (primary, check icon), left-aligned side-by-side, ~100px each, height 36.
- Card 1: **FA** · `Farhan Ahmed` · chips `CSE 221 • 2nd Year`, `Head CR Candidate` · `ID: 21-12345-1 • Applied 2 days ago` · statement `"Interested in joining as CR to streamline faculty notices, coordinate exam schedules efficiently, and set up a centralized Google Classroom & WhatsApp communication pipeline for Section 2."` · chips `CGPA: 3.88 (Top 5%)`, `14 Peer Endorsements`, `Ex-Sub CR (CSE 110)`.
- Card 2: **NJ** · `Nusrat Jahan` · chips `CSE 221 • 2nd Year`, `Assistant CR Candidate` · `ID: 21-12348-2 • Applied 3 days ago` · statement `"Eager to maintain accurate lab attendance lists, arrange peer review study groups, and serve as accessible liaison between female student representatives and departmental advisors."` · chips `CGPA: 3.76`, `Robotics Club Executive`, `9 Endorsements`.

*Right column*
1. **Cohort Capacity card** — eyebrow `COHORT CAPACITY`, right pill `Cap: 2 / Sec`. A 2-segment progress bar (1 filled, 1 empty, brand-700). Text: `Section Representation Slots 1 of 2 Appointed` then `1 slot currently active (Tanvir Hasan, Lead CR). 1 open co-representative slot remains available.` Below, a tinted officer row: `TH` · **Tanvir Hasan** · `Lead CR • Appointed Oct 2024` · green check.
2. **CR Governance Guidelines card** — shield icon + title; four check-circle bullets:
   - `Minimum CGPA 3.00:` Nominee must hold good academic standing with no disciplinary flags.
   - `Max 2 CRs per section:` One primary spokesperson and one operational assistant.
   - `Peer Endorsement Quorum:` Minimum 5 supporting endorsements from registered classmates.
   - `Advisor Sync Process:` Approved CRs automatically trigger a notification to Course Instructor Dr. M. Rahman.
   Footer link `View full Academic Constitution →`.
3. **Advisor strip card** (small, tinted): avatar-icon + `Dr. Mahbubur Rahman` + `Section Course Instructor`; trailing mail icon button.

**Hardcoded behavior:** Accept / Reject remove the card from the Pending list locally and update counts (optional; pure `useState`). If you prefer zero logic, make them no-ops with a toast.

---

### 9.5 Profile — `/profile`

**Hero card** (white, radius 20, padding 24)
- Left: 88px rounded-16 **photo** (woman in dark hijab-free professional portrait, any placeholder works) with a camera icon button overlapping bottom-right.
- Middle: **Syeda Dillir Hossain** (H1 24/800) + `ID: 21-12345` pill (brand-100, tiny id icon). Below: `Dept. of Computer Science & Engineering • 2nd Year • 4th Semester` (users icon). Chip row: `SECTION 2 (CSE 221)` (info) and `Aspiring CR Nominee` (purple, user-plus icon).
- Right actions: `Digital ID` (secondary, id-card icon), `Edit Profile` (primary, pencil icon).

**Hero stats row** (3 tinted tiles inside the hero card, below the identity row)
| Eyebrow | Value | Extra | Right visual |
|---|---|---|---|
| `TOTAL ATTENDANCE` | **94.8%** + green `↗ +1.2%` | `38 of 40 lectures joined` | `RingProgress` 48px with clipboard icon |
| `CLASS STANDING` | **Top 5%** + chip `Rank #2` | `Cumulative GPA: 3.92 / 4.00` | brand tile with medal icon |
| `REGISTERED LOAD` | **6 Courses** + `19.5 Credits` | `Spring 2026 Semester` | brand tile with books icon |

**Tabs:** `Personal Info` (user icon, active) · `Academic Records` (graduation-cap icon) · `Security & Settings` (clock-rotate/shield icon).

#### Personal Info tab — layout: 2 columns (left ≈ 40%, right ≈ 60%)

*Left column*
1. **Institutional Credentials card** — header: shield-check icon + title; right pill `Status: Active` (green). `InfoRow`s:
   - mail icon · `Institutional Email` · `dillir.hossain@cse.univ.edu` · trailing copy icon
   - phone icon · `Primary Phone` · `+880 1712-345678`
   - network icon · `Academic Faculty` · `Faculty of Science & Engineering` — then, inside the same row card, three label/value lines: `Curriculum Major` **B.Sc. in CSE**; `Batch Registration` **Spring 2024 (Batch 54)**; `Assigned Section` **Section 2 • Cohort A** (value in brand-700).
   - id icon · `Guardian Contact` · `Dr. M. A. Hossain (Father)` · trailing phone icon button.
   - Footer line: `Last university sync: Today, 09:30 AM` (11/ text-500) + right link `Re-verify` with refresh icon.
2. **Mid-Term Evaluation Window card** (info banner, white with left blue info icon in tinted tile): title `Mid-Term Evaluation Window` (14/700), text `Mid-semester faculty appraisals for Section 2 are now live. Make sure to complete them before October 15, 2026.`, link `Complete Appraisals →`.

*Right column*
1. **Election Status card** (`accent-left` 4px brand-700): eyebrow `ELECTION STATUS` + chip `CSE-221 Spring 2026` (small info chip); title **Class Representative Nomination** (18/800); right pill `• Verification Pending` (brand-100 with blue dot) with link `View CR Guideline →` beneath. Body `Nomination under review by Head CR. Peer endorsements collected: 34 of 48 peers (70.8%).` Then a labeled progress: left `Peer Endorsement Threshold`, right `34 / 48 Votes (Min. 25 required)`, bar at 70.8%.
2. **Current Semester Courses card** — header `Current Semester Courses` + subtitle `Active modules, faculty in-charge & presence ratios`; right `Filter` ghost button (sliders icon). Three `CourseRow`s:
   - **P** · `CSE 221: Object Oriented Programming` · `3.0 Cr` · `Instructor: Prof. Tahmid Rahman • Room 402B • Mon/Wed 10:00 AM` · **96.2%** `Presence` bar
   - **D** · `CSE 222: Data Structures & Algorithms` · `3.0 Cr` · `Instructor: Dr. Farzana Kabir • Lab 304 • Sun/Tue 08:30 AM` · **93.0%** `Presence`
   - **M** · `MAT 201: Linear Algebra & Matrices` · `3.0 Cr` · `Instructor: Prof. Shamsul Haque • Room 201 • Thu 02:00 PM` · **95.0%** `Presence`
   - Footer: centered link `Show all 6 registered courses ⌄` (expands to reveal 3 extra hardcoded rows: `CSE 223 Database Systems`, `CSE 224 Digital Logic Design`, `ENG 101 Technical Writing`).
3. **Account Preferences & Safety card** — header text only. Two tinted tiles side by side:
   - key icon · `Portal Password` · `Changed 45 days ago` · soft button `Update`
   - chat-bubble icon · `SMS Class Alerts` · `Instant reschedule pings` · `Toggle` (**on** by default)

#### Academic Records tab (inferred)
Single column, three cards:
1. **Semester GPA table** — columns `Semester | Credits | GPA | Remarks`; rows `Spring 2024 | 18 | 3.89`, `Summer 2024 | 9 | 4.00`, `Fall 2024 | 18 | 3.92`, `Spring 2025 | 18 | 3.94`; footer row `Cumulative | 63 | 3.92 / 4.00`.
2. **Attendance by course** — reuse `CourseRow`s without instructor lines.
3. **Honors & Activities** — chips: `Dean's List`, `Robotics Club`, `Peer Mentor`.

#### Security & Settings tab (inferred)
Two cards: **Login activity** (3 rows: device, location, time) and **Security options** (`Two-factor authentication` toggle off, `Login alerts` toggle on, `Active sessions` + `Sign out all devices` danger-soft button).

---

### 9.6 Announcements — `/announcements` **(inferred)**

Reuses the Dashboard pattern at full width.
- Header: H1 `Announcements`, subtitle `All official notices for CSE 221 • Section 02`; right primary button `New Announcement` (disabled/no-op).
- Filter tabs `All (8)` · `Urgent (2)` · `Exams` · `Routine` · `Meetings`; search box right.
- List of 8 `AnnouncementItem`s (reuse the 3 from the dashboard + 5 extra hardcoded). Right sidebar: `CR Special Notice` gradient card + `Class Roster Officers` card.

### 9.7 Settings — `/settings` **(inferred)**

- Header: H1 `Settings`, subtitle `Manage portal preferences`.
- Left sub-nav card (`Profile`, `Notifications`, `Appearance`, `Privacy`) and right content card with toggle rows: `Email notifications` (on), `SMS class alerts` (on), `Push notifications` (off), `Compact density` (off), `Language` select (`English`).

---

## 10. Hardcoded mock data

Put in `src/data/`. Use **one** consistent identity (see section 14).

```ts
// user.ts
export const currentUser = {
  name: 'Syeda Dillir Hossain',
  firstName: 'Syeda',
  studentId: '2021-1-60-042',        // shown in topbar
  shortId: '21-12345',               // shown on profile + login placeholder
  role: 'Head CR',
  dept: 'Dept. of CSE',
  year: '2nd Year', semester: '4th Semester',
  section: 'Section 2', sectionLabel: 'SECTION 2 (CSE 221)',
  email: 'dillir.hossain@cse.univ.edu',
  phone: '+880 1712-345678',
  guardian: 'Dr. M. A. Hossain (Father)',
  attendance: { percent: 94.8, delta: '+1.2%', joined: 38, total: 40 },
  standing: { label: 'Top 5%', rank: 2, gpa: '3.92 / 4.00' },
  load: { courses: 6, credits: 19.5, term: 'Spring 2026' },
};

// navigation.ts
export const navMain = [
  { label: 'Dashboard',        to: '/dashboard',        icon: 'LayoutGrid' },
  { label: 'Class Details',    to: '/class-details',    icon: 'Monitor' },
  { label: 'CR Join Requests', to: '/cr-join-requests', icon: 'UserPlus', badge: 3 },
  { label: 'Announcements',    to: '/announcements',    icon: 'Megaphone' },
  { label: 'Profile',          to: '/profile',          icon: 'User' },
];
export const navSystem = [{ label: 'Settings', to: '/settings', icon: 'Settings' }];

// announcements.ts
export type Announcement = {
  id: string; kind: 'urgent' | 'meeting' | 'routine';
  tags: string[]; course?: string; time: string;
  title: string; body: string;
  attachment?: { name: string; size: string };
  meta?: { when: string; where: string; cta: string };
};

// crRequests.ts
export type CRRequest = {
  id: string; initials: string; name: string; yearChip: string; roleChip: string;
  studentId: string; applied: string; statement: string;
  metrics: { icon: string; label: string }[]; status: 'pending' | 'approved' | 'rejected';
};
```

Additional mock rows you will need that aren't spelled out in the screenshots: 5 extra announcements, 6 class members, 2 faculty contacts, 3 extra courses, 5 approved + 1 rejected CR requests (for the tab counts). Keep them short and plausible.

**Images:** `campus.jpg` (login), 1 profile portrait, 1 Farhan portrait. Use royalty-free placeholders; set explicit `width`/`height` to avoid layout shift.

---

## 11. Interaction, states & motion

| Element | Hover | Focus | Active / Selected | Disabled |
|---|---|---|---|---|
| Primary button | bg brand-600, shadow-sm | 2px brand-500 ring offset 2 | bg brand-900 | 50% opacity, no pointer |
| Secondary button | bg brand-50 | same ring | bg brand-100 | 50% |
| Nav item | bg brand-50 | ring inset | solid brand-700 | – |
| Card (clickable) | translateY(-1px), shadow grows | ring | – | – |
| Tab | text-700 | ring | white pill + shadow | – |
| Input | border `--border-strong` | 2px brand-500 ring, bg white | – | bg `--canvas`, text-400 |
| Link | underline on hover | ring | – | – |

- **Transitions:** 150ms ease-out for colour/shadow/transform. Progress bars and the ring animate from 0 → value in 600ms on first mount.
- **Toasts (demo-only actions):** bottom-right, radius 12, dark `#0F172A` bg, white 13px text, 3s auto-dismiss. Message: `Demo only — not connected yet`.
- **Dropdown / modal:** `--shadow-pop`, radius 16, 150ms fade+scale from 0.98.
- **Empty states (Join Requests tabs):** centered icon in brand-100 tile, 14/700 title, 13/ text-500 line, e.g. `No pending requests` / `You're all caught up.`
- **Loading states:** none needed (data is hardcoded). Do not add spinners.
- **Local state only:** active tab, password visibility, role switch, SMS toggle, expanded course list, locally removed request cards, bookmark toggles on notices (filled brand-700 when on).

---

## 12. Responsive behavior

| Breakpoint | Behavior |
|---|---|
| ≥ 1280 | Exact desktop layouts above |
| 1024–1279 | Sidebar stays 220px; 4-col stat rows → 2×2 grid; two-column bodies keep 60/40 |
| 768–1023 | Sidebar collapses to a 72px icon rail (labels hidden, tooltips on hover); body columns stack to 1 col; hero stats 3 → 1 column |
| < 768 | Sidebar becomes an off-canvas drawer opened by a hamburger in the topbar; topbar search collapses to an icon; user block shows avatar only; all grids 1 col; buttons in headers wrap below the title and become full width |
| Login < 900 | Left brand panel hidden except logo + headline strip on top (height ≈ 180); form fills the card |

Tables (Academic Records) scroll horizontally inside their card (`overflow-x:auto`) on small screens.

---

## 13. Accessibility

- Contrast: brand-700 on white = 8.6:1 (AA/AAA). Chip text colours chosen at ≥ 4.5:1 on their backgrounds; verify `warning-600` on `warning-100` after implementation.
- All icon-only buttons need `aria-label` (copy, call, mail, bookmark, notification bell, eye toggle).
- Sidebar is a `<nav aria-label="Main">`; active item gets `aria-current="page"`.
- Tabs use `role="tablist"/"tab"/"tabpanel"` with arrow-key navigation.
- Toggle uses `role="switch"` + `aria-checked`.
- Progress bar and ring use `role="progressbar"` with `aria-valuenow/min/max` and a text label.
- Visible focus ring on every interactive element; never remove outline without replacement.
- Emoji in the greeting is decorative (`aria-hidden`).
- Respect `prefers-reduced-motion`: disable progress animations and card lift.

---

## 14. Known inconsistencies in the mockups (and the decision)

The five screenshots were clearly designed independently, so some data doesn't match. Use these canonical choices so the hardcoded app feels coherent.

| Item | What the screenshots show | Decision |
|---|---|---|
| Logged-in user ID | `21-12345` (profile) vs `2021-1-60-042` (topbar) | Topbar uses `2021-1-60-042`; profile pill and login use short ID `21-12345` (documented as "short ID") |
| Who is the Lead CR | `Nusrat Jahan (Lead Rep)` on Dashboard, `Farhan Ahmed (Lead Class Representative)` on Class Details, `Tanvir Hasan (Lead CR)` on Join Requests | Keep each page's text as designed; they are different contexts/sections in a demo. If you want strict consistency, make **Nusrat Jahan** the Lead CR everywhere and keep Farhan/Nusrat as applicants only |
| Term | `Spring 2026` (Dashboard, Profile) vs `Spring 2024` (Class Details, Notices dated 2024) | Keep as designed, or normalise Class Details to `Spring 2026` and shift notice dates to 2026 |
| Section | `Section 02`, `Sec A`, `Section 2 • Cohort A` | Treat `Sec A` and `Section 2` as the same section in display; labels kept per page |
| Course name for CSE 221 | `Algorithms & Data Structures` (Dashboard) vs `Object Oriented Programming` (Class Details, Profile) | **Recommended:** CSE 221 = Object Oriented Programming everywhere, and change the Dashboard card to `Object Oriented Programming` (and CSE 222 stays Algorithms Lab). The spec above reproduces the original text, so apply this fix if you want consistency |
| Dashboard date | `Wednesday, October 15` | Hardcoded string; leave as is |
| Profile page copy | `Mid-term ... before October 15, 2026` | Leave as is |

Typos to fix when implementing: `Contact CR` caption "Direct query or query request" → **"Direct message or query request"**; `Prof. Tahmid Rahman` etc. are placeholder names and can be changed freely.

---

## 15. Build order & acceptance checklist

### Suggested build order
1. Vite + Tailwind + fonts + `tokens.css`.
2. `ui/` primitives: Button, Chip, Card, Avatar, ProgressBar, RingProgress, Tabs, Toggle, TextField.
3. `AppShell` (Sidebar + Topbar) with the router and placeholder pages.
4. Login page (fully static) → verify against screenshot 5.
5. Dashboard → screenshot 4.
6. Class Details → screenshot 3.
7. CR Join Requests → screenshot 2.
8. Profile (Personal Info) → screenshot 1, then the two inferred tabs.
9. Announcements, Settings, NotFound.
10. Responsive pass, a11y pass, polish (hover/focus/motion).

### Acceptance checklist
- [ ] All 5 designed pages visually match the screenshots at 1440px (spacing, radius, colours, copy verbatim).
- [ ] Sidebar highlights correctly on each route; `CR Join Requests` shows badge `3`.
- [ ] Every link and button in the nav leads somewhere valid or shows the demo toast. No dead clicks, no console errors.
- [ ] Login: role segments, password visibility toggle, and Sign In → `/dashboard` work.
- [ ] Tabs on Join Requests, Class Details, Dashboard (announcements), and Profile switch content.
- [ ] Rings and progress bars render the exact values (94.8%, 92%, 70.8%, 96.2/93/95%).
- [ ] No data fetched from anywhere; all content imported from `src/data`.
- [ ] Layout holds at 1280, 1024, 768, and 390px widths with no horizontal page scroll.
- [ ] Keyboard-only navigation reaches every control with visible focus.
- [ ] Lighthouse accessibility score ≥ 90.

---

*End of specification.*