'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Something went wrong
          </h2>
          <p className="text-slate-600 mb-6">{error.message}</p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-[var(--brand-700)] text-white rounded-lg hover:bg-[var(--brand-700-hover)]"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

