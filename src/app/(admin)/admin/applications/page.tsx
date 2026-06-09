"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAdminApplications, approveApplication, rejectApplication,
  type SellerApplication,
} from "@/lib/api/sellerApplication";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [filter,       setFilter]       = useState("");
  const [loading,      setLoading]      = useState(true);
  const [acting,       setActing]       = useState<string | null>(null);

  // Reject modal
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError,  setRejectError]  = useState("");

  // Detail modal
  const [detail, setDetail] = useState<SellerApplication | null>(null);

  const size = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminApplications(page, size, filter || undefined);
      setApplications(res.applications);
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
      await approveApplication(id);
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: "approved" } : a));
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const handleRejectSubmit = async () => {
    if (!rejectModal) return;
    if (!rejectReason.trim() || rejectReason.trim().length < 5) {
      setRejectError("Reason must be at least 5 characters.");
      return;
    }
    setActing(rejectModal.id);
    try {
      await rejectApplication(rejectModal.id, rejectReason.trim());
      setApplications((prev) =>
        prev.map((a) => a.id === rejectModal.id ? { ...a, status: "rejected", rejectionReason: rejectReason.trim() } : a)
      );
      setRejectModal(null);
      setRejectReason("");
      setRejectError("");
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const totalPages = Math.ceil(total / size);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending:  "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
      approved: "text-green-400 bg-green-400/10 border-green-400/30",
      rejected: "text-red-400 bg-red-400/10 border-red-400/30",
    };
    return map[status] ?? "text-[#666] bg-[#111] border-[#222]";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Seller Applications</h1>
          <p className="text-[#555] text-sm mt-1">{total} application{total !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          {(["", "pending", "approved", "rejected"] as const).map((f) => (
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
              {["Applicant", "Business Name", "Type", "Status", "Applied", "Actions"].map((h) => (
                <th key={h} className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-[#444] px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-16 text-[#555]">Loading…</td></tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-[#555]">No applications found.</td></tr>
            ) : applications.map((a) => (
              <tr key={a.id} className="hover:bg-[#111] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-bold text-white">{a.user?.name ?? "—"}</p>
                  <p className="text-[#555] text-xs">{a.user?.email ?? "—"}</p>
                </td>
                <td className="px-4 py-3 font-bold text-[#ccc]">{a.businessName}</td>
                <td className="px-4 py-3 text-[#777] capitalize">{a.businessType}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 border ${statusBadge(a.status)}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#555] text-xs">
                  {new Date(a.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDetail(a)}
                      className="flex items-center gap-1 h-7 px-3 text-[10px] font-black uppercase tracking-wider border border-[#333] text-[#666] hover:text-white hover:border-[#555] transition-colors"
                    >
                      <Eye size={11} /> View
                    </button>

                    {a.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(a.id)}
                          disabled={acting === a.id}
                          className="flex items-center gap-1 h-7 px-3 text-[10px] font-black uppercase tracking-wider bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-40"
                        >
                          <CheckCircle size={11} /> Approve
                        </button>
                        <button
                          onClick={() => { setRejectModal({ id: a.id, name: a.businessName }); setRejectReason(""); setRejectError(""); }}
                          disabled={acting === a.id}
                          className="flex items-center gap-1 h-7 px-3 text-[10px] font-black uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40"
                        >
                          <XCircle size={11} /> Reject
                        </button>
                      </>
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
          <p className="text-xs text-[#555]">Page {page} of {totalPages} · {total} applications</p>
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

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Reject Application</h2>
              <button onClick={() => setRejectModal(null)} className="text-[#555] hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-[#888]">
                Rejecting application from <span className="text-white font-bold">{rejectModal.name}</span>.
                Please provide a clear reason so the applicant can improve.
              </p>
              {rejectError && (
                <p className="text-xs text-red-400">{rejectError}</p>
              )}
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => { setRejectReason(e.target.value); setRejectError(""); }}
                className="w-full bg-[#0a0a0a] border border-[#222] text-sm text-white placeholder:text-[#333] px-3 py-2.5 resize-none focus:outline-none focus:border-accent transition-colors"
                placeholder="e.g., Incomplete business information, invalid PAN number…"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setRejectModal(null)}
                  className="flex-1 h-10 border border-[#333] text-[#777] hover:text-white hover:border-[#555] text-[11px] font-black uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={!!acting}
                  className="flex-1 h-10 bg-red-500/80 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Application Detail</h2>
              <button onClick={() => setDetail(null)} className="text-[#555] hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto space-y-3">
              {[
                { label: "Applicant",        value: `${detail.user?.name ?? "—"} (${detail.user?.email ?? "—"})` },
                { label: "Business Name",    value: detail.businessName    },
                { label: "Business Type",    value: detail.businessType === "individual" ? "Individual / Freelancer" : "Registered Company" },
                { label: "PAN / VAT",        value: detail.panNumber       },
                { label: "Phone",            value: detail.phone           },
                { label: "Business Address", value: detail.businessAddress },
                { label: "Description",      value: detail.description     },
                { label: "Status",           value: detail.status          },
                ...(detail.rejectionReason ? [{ label: "Rejection Reason", value: detail.rejectionReason }] : []),
                { label: "Applied",          value: new Date(detail.createdAt).toLocaleString("en-NP", { dateStyle: "long", timeStyle: "short" }) },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#555]">{label}</span>
                  <span className="text-sm text-[#ccc] leading-relaxed">{value}</span>
                </div>
              ))}
            </div>
            {detail.status === "pending" && (
              <div className="px-6 py-4 border-t border-[#1e1e1e] flex gap-3">
                <button
                  onClick={() => { handleApprove(detail.id); setDetail(null); }}
                  className="flex-1 h-10 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 text-[11px] font-black uppercase tracking-wider transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => { setDetail(null); setRejectModal({ id: detail.id, name: detail.businessName }); setRejectReason(""); setRejectError(""); }}
                  className="flex-1 h-10 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-[11px] font-black uppercase tracking-wider transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
