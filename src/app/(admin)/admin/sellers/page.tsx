"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getAdminSellers, approveSeller, rejectSeller, type AdminSeller } from "@/lib/api/admin";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminSellersPage() {
  const searchParams = useSearchParams();
  const [sellers,  setSellers]  = useState<AdminSeller[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [filter,   setFilter]   = useState<"" | "pending" | "approved">(
    searchParams.get("filter") === "pending" ? "pending" : ""
  );
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState<string | null>(null);

  const size = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const approved = filter === "approved" ? true : filter === "pending" ? false : undefined;
      const res = await getAdminSellers(page, size, approved);
      setSellers(res.sellers);
      setTotal(res.pagination.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id: string) => {
    setActing(id);
    try {
      const updated = await approveSeller(id);
      setSellers((prev) => prev.map((s) => (s.id === updated.id ? { ...s, isApproved: true } : s)));
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Reject this seller? They will lose access to sell.")) return;
    setActing(id);
    try {
      const updated = await rejectSeller(id);
      setSellers((prev) => prev.map((s) => (s.id === updated.id ? { ...s, isApproved: false } : s)));
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const totalPages = Math.ceil(total / size);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Sellers</h1>
          <p className="text-[#555] text-sm mt-1">{total} seller accounts</p>
        </div>
        <div className="flex gap-2">
          {(["", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`h-9 px-4 text-[11px] font-black uppercase tracking-wider border transition-colors ${
                filter === f
                  ? "bg-accent text-white border-accent"
                  : "bg-transparent text-[#555] border-[#222] hover:text-white hover:border-[#444]"
              }`}
            >
              {f === "" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-[#1e1e1e] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              {["Name", "Email", "Products", "Status", "Joined", "Actions"].map((h) => (
                <th key={h} className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-[#444] px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-16 text-[#555]">Loading…</td></tr>
            ) : sellers.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-[#555]">No sellers found.</td></tr>
            ) : sellers.map((s) => (
              <tr key={s.id} className="hover:bg-[#111] transition-colors">
                <td className="px-4 py-3 font-bold text-white">{s.name}</td>
                <td className="px-4 py-3 text-[#777]">{s.email}</td>
                <td className="px-4 py-3 text-[#666]">{s.productCount}</td>
                <td className="px-4 py-3">
                  {s.isApproved ? (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 border text-green-400 bg-green-400/10 border-green-400/30">
                      Approved
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 border text-yellow-400 bg-yellow-400/10 border-yellow-400/30">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[#555] text-xs">
                  {new Date(s.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {!s.isApproved && (
                      <button
                        onClick={() => handleApprove(s.id)}
                        disabled={acting === s.id}
                        className="flex items-center gap-1.5 h-7 px-3 text-[10px] font-black uppercase tracking-wider bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-40"
                      >
                        <CheckCircle size={11} /> Approve
                      </button>
                    )}
                    {s.isApproved && (
                      <button
                        onClick={() => handleReject(s.id)}
                        disabled={acting === s.id}
                        className="flex items-center gap-1.5 h-7 px-3 text-[10px] font-black uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40"
                      >
                        <XCircle size={11} /> Revoke
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#555]">Page {page} of {totalPages} · {total} sellers</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center border border-[#222] text-[#555] hover:text-white hover:border-[#444] disabled:opacity-30 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-[#222] text-[#555] hover:text-white hover:border-[#444] disabled:opacity-30 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
