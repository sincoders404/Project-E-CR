# Project-E-CR

## Local Supabase setup

1. Copy `.env.example` to `.env.local` and fill in the Supabase URL and keys.
2. Apply `supabase/migrations/0001_schema.sql` through `0004_triggers_rpc.sql` in order.
3. Configure Supabase Auth for password sign-in and disable email confirmation for the MVP. Students use their student ID; the app generates an internal Supabase email identifier because Supabase Auth requires one.
4. Seed development data with `ECR_SEED_PASSWORD=... npm run seed`. The seed creates test accounts for every mock student, CR, and admin.

The service-role key is server-only. Never expose it in browser code or commit it.

## Test accounts

All seeded accounts use the same password supplied through `ECR_SEED_PASSWORD` and sign in with the Student ID field:

| Role | Student ID | Notes |
|---|---|---|
| Student | `20-11234` | Rafi Ahmed; approved student |
| CR | `20-11001` | Syeda Dillir Hossain; approved student and 33-A CR |
| Admin | `admin-001` | Nasrin Akter; approved administrator |

The CR role is represented by the `section_crs` assignment; it is not a separate user role in the database. Additional seeded students and pending signup accounts are available from `data/mock.ts`.

Student IDs use the university format, for example `CSE03308387` for a student in batch 33 and `CSE032...` for batch 32. The signup form accepts the complete ID as provided by the university.