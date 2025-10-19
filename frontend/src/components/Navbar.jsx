// src/components/Navbar.jsx
// Tailwind-styled top navigation

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="brand">PFM</Link>
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/expense" className="nav-link">Expenses</Link>
            <Link to="/budget" className="nav-link">Budgets</Link>
            <Link to="/saving" className="nav-link">Savings</Link>
            <Link to="/blog" className="nav-link">Blog</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/about" className="nav-link">About</Link>
            {user?.role === 'ADMIN' && <Link to="/admin/dashboard" className="nav-link">Admin</Link>}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-gray-900">{user?.name || user?.email}</Link>
              <button className="btn" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}