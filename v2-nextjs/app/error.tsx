'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Something went wrong
        </h2>
        <p className="text-slate-600 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-[#2A5F7F] text-white rounded-lg hover:bg-[#1E4D6A]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
