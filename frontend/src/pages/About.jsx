export default function About() {
  return (
    <div className="px-4 md:px-6">
      <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur shadow-xl p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">About</h2>
        <p className="text-gray-700 dark:text-gray-300">
          This Personal Finance Management app helps you track expenses, plan budgets, and reach savings goals.
          It uses JWT security, supports Google login, and integrates with WSO2 API Manager.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h12M4 17h8" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Track expenses</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Add, categorize, and analyze spending.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 16h10M4 8h8" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Plan budgets</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Set limits and monitor progress.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-6-6h12" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Savings goals</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Define targets and track growth.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-gray-500/10 text-gray-700 dark:text-gray-300 flex items-center justify-center">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5v9.75A2.25 2.25 0 0118 19.5H6A2.25 2.25 0 013.75 17.25V7.5zM7.5 7.5v-1.5a4.5 4.5 0 019 0V7.5" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Secure & integrated</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">JWT auth, Google login, WSO2 API Manager.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}