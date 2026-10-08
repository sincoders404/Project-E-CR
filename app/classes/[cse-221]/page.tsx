export default function ClassDetails() {
  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900">
            E-CR
          </h1>
        </div>
      </header>


      {/* Class Details */}
      <div className="mx-auto max-w-7xl px-6 py-10">

        <p className="text-sm text-slate-500">
          Class Details
        </p>

        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          CSE 221 — Data Structures
        </h2>

        <p className="mt-2 text-slate-600">
          Section A
        </p>


        {/* Class Information */}
        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

          <h3 className="text-lg font-semibold text-slate-900">
            Class Information
          </h3>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              <strong>Course Code:</strong> CSE 221
            </p>

            <p>
              <strong>Course Name:</strong> Data Structures
            </p>

            <p>
              <strong>Section:</strong> A
            </p>

            <p>
              <strong>Status:</strong> Active
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}