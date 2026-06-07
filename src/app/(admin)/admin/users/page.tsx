"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminUsers, updateAdminUser, deleteAdminUser, type AdminUser } from "@/lib/api/admin";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const ROLES = ["", "user", "seller", "admin"];

const ROLE_BADGE: Record<string, string> = {
  admin:  "text-accent bg-accent/10 border-accent/30",
  seller: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  user:   "text-[#888] bg-[#1a1a1a] border-[#333]",
};

export default function AdminUsersPage() {
  const [users,    setUsers]    = useState<AdminUser[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState<string | null>(null);

  const size = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers(page, size, roleFilter || undefined);
      setUsers(res.users);
      setTotal(res.pagination.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter]);

  useEffect(() => { load(); }, [load]);

  const handleRoleChange = async (userId: string, role: string) => {
    setActing(userId);
    try {
      const updated = await updateAdminUser(userId, { role });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, role: updated.role } : u)));
    } catch (e) {
      console.error(e);
    } finally {
      setActing(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setActing(userId);
    try {
      await deleteAdminUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setTotal((t) => t - 1);
    } catch (e) {
      console.error(e);
    } finally {
      setActing(null);
    }
  };

  const totalPages = Math.ceil(total / size);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Users</h1>
          <p className="text-[#555] text-sm mt-1">{total} registered accounts</p>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="h-9 px-3 bg-[#0f0f0f] border border-[#222] text-sm text-white focus:outline-none focus:border-accent"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r ? r.charAt(0).toUpperCase() + r.slice(1) : "All Roles"}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#0f0f0f] border border-[#1e1e1e] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              {["Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                <th key={h} className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-[#444] px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-16 text-[#555]">Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-16 text-[#555]">No users found.</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-[#111] transition-colors">
                <td className="px-4 py-3 font-bold text-white">{u.name}</td>
                <td className="px-4 py-3 text-[#777]">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 border ${ROLE_BADGE[u.role] ?? "text-[#555] bg-[#1a1a1a] border-[#333]"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#555] text-xs">
                  {new Date(u.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={u.role}
                      disabled={acting === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="h-7 px-2 bg-[#1a1a1a] border border-[#333] text-xs text-white focus:outline-none focus:border-accent disabled:opacity-50 cursor-pointer"
                    >
                      {["user", "seller", "admin"].map((r) => (
                        <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={acting === u.id}
                      className="w-7 h-7 flex items-center justify-center border border-[#333] text-[#555] hover:text-red-400 hover:border-red-400/40 transition-colors disabled:opacity-30"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#555]">Page {page} of {totalPages} · {total} users</p>
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
