export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Logo */}
          <h1 className="text-2xl font-bold text-slate-900">
            E-CR
          </h1>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </a>

            <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Classes
            </a>

            <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Notifications
            </a>

            <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Profile
            </a>
          </nav>

        </div>
      </header>


      {/* Dashboard Content */}
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Page Title */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h2>

          <p className="mt-2 text-slate-600">
            Welcome back! Here is an overview of your E-CR activities.
          </p>
        </div>


        {/* Statistics Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {/* Card 1 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              My Classes
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              3
            </p>
          </div>


          {/* Card 2 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Notifications
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              5
            </p>
          </div>


          {/* Card 3 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending Requests
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              2
            </p>
          </div>

        </div>


        {/* Recent Classes */}
        <section className="mt-10">
          
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-slate-900">
              Recent Classes
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Your recently accessed classes.
            </p>
          </div>


          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

            {/* Class 1 */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h4 className="font-semibold text-slate-900">
                  CSE 221 — Data Structures
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Section A
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Active
              </span>
            </div>


            {/* Class 2 */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h4 className="font-semibold text-slate-900">
                  CSE 222 — Database Systems
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Section A
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Active
              </span>
            </div>


            {/* Class 3 */}
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <h4 className="font-semibold text-slate-900">
                  MAT 201 — Mathematics
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Section B
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Active
              </span>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}