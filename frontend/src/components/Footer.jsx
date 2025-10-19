// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="container py-6 text-center text-gray-500">
        © {new Date().getFullYear()} Personal Finance
      </div>
    </footer>
  );
}