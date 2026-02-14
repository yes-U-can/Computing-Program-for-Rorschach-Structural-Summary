import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">404</h2>
        <p className="text-slate-600 mb-6">Page not found</p>
        <Link
          href="/"
          className="px-4 py-2 bg-[#2A5F7F] text-white rounded-lg hover:bg-[#1E4D6A]"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
