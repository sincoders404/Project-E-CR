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
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Dashboard
            </a>

            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Classes
            </a>

            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Notifications
            </a>

            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Profile
            </a>
          </nav>

        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-3xl font-bold text-slate-900">
          Welcome to E-CR
        </h2>

        <p className="mt-2 text-slate-600">
          Electronic Class Representative Management System
        </p>
      </div>

    </main>
  );
}