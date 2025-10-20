import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import OtpVerify from './pages/OtpVerify';
import Profile from './pages/Profile';
import Expense from './pages/Expense';
import Budget from './pages/Budget';
import Saving from './pages/Saving';
import AdminDashboard from './pages/AdminDashboard';
import BlogPosts from './pages/BlogPosts';
import Contact from './pages/Contact';
import About from './pages/About';

export default function App() {
  const location = useLocation();
  const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/otp-verify'];
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col text-gray-800 dark:text-gray-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <Navbar />

      <main className={isAuthPage ? 'flex-1' : 'flex-1 max-w-7xl mx-auto px-4 md:px-6 py-6'}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
          <Route path="/blog" element={<BlogPosts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          {/* Authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/saving" element={<Saving />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}