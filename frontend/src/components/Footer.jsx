export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 text-center text-gray-600 dark:text-gray-300 text-sm">
        © {new Date().getFullYear()} Personal Finance • All rights reserved
      </div>
    </footer>
  );
}