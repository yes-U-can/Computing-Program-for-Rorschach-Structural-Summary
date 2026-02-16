'use client';

import { useCallback, useEffect, useState } from 'react';

type CreditTx = {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
};

type CreditsResponse = {
  creditBalance: number;
  recentTransactions: CreditTx[];
};

export default function CreditBalancePanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<CreditTx[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/credits');
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || 'Failed to load credits');
      }
      const data = (await res.json()) as CreditsResponse;
      setBalance(data.creditBalance || 0);
      setTransactions(Array.isArray(data.recentTransactions) ? data.recentTransactions : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load credits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <div className="h-20 animate-pulse rounded-md bg-slate-100" />;
  }

  if (error) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-medium text-slate-500">Credit Balance</p>
        <p className="mt-1 text-2xl font-bold text-slate-800">{balance.toLocaleString()}</p>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500">Recent Transactions</p>
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-500">No transactions yet.</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((tx) => (
              <li key={tx.id} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-700">{tx.type}</p>
                  <p className={`text-xs font-semibold ${tx.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.amount >= 0 ? '+' : ''}
                    {tx.amount}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">Balance: {tx.balanceAfter}</p>
                {tx.description && <p className="mt-0.5 text-[11px] text-slate-500">{tx.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
