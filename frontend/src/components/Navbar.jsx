// Tailwind-styled top navigation (mobile + dark mode toggle)

import { useEffect, useState, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // Init theme from localStorage or system
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initialDark = saved ? saved === 'dark' : prefersDark;
    setDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = useMemo(() => {
    const base = [
      { to: '/expense', label: 'Expenses' },
      { to: '/budget', label: 'Budgets' },
      { to: '/saving', label: 'Savings' },
      { to: '/blog', label: 'Blog' },
      { to: '/contact', label: 'Contact' },
      { to: '/about', label: 'About' },
    ];
    if (user?.role === 'ADMIN') base.push({ to: '/admin/dashboard', label: 'Admin' });
    return base;
  }, [user?.role]);

  const navLink = ({ isActive }) =>
    [
      'px-3 py-2 rounded-md text-sm font-medium transition',
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
    ].join(' ');

  const userInitial = (user?.name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/60 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Brand + Desktop Nav */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white text-sm font-semibold">PF</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">PFM</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={navLink}>
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {dark ? (
                // Sun
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2m14 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                // Moon
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
            </button>

            {/* Auth buttons / user */}
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white">
                  <span className="h-7 w-7 rounded-full bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-700 flex items-center justify-center text-xs font-semibold">
                    {userInitial}
                  </span>
                  <span className="truncate max-w-[160px]">{user?.name || user?.email}</span>
                </Link>
                <button
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 text-white font-medium px-3 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 text-white font-medium px-3 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-md bg-gray-900 text-white font-medium px-3 py-2 hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden mt-3 grid grid-cols-1 gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navLink} onClick={() => setMenuOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => { setMenuOpen(false); onLogout(); }}
                className="w-full text-left px-3 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-md bg-gray-900 text-white font-medium hover:bg-black transition">
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}