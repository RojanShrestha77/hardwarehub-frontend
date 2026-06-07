"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/index";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, deleteAllNotifications, selectNotifications, selectNotifLoading, selectUnreadCount } from "@/store/slices/notificationSlice";
import Link from "next/link";
import { Bell, CheckCheck, Trash2, ShoppingBag, Package, Star, Settings, Info } from "lucide-react";
import type { NotificationType } from "@/lib/api/notifications";

const typeIcon = (type: NotificationType) => {
  switch (type) {
    case "order":   return <ShoppingBag size={16} className="text-accent" />;
    case "product": return <Package size={16} className="text-blue-400" />;
    case "review":  return <Star size={16} className="text-yellow-400" />;
    case "admin":   return <Settings size={16} className="text-purple-400" />;
    default:        return <Info size={16} className="text-[#666]" />;
  }
};

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return "Just now";
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

export default function NotificationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const items    = useSelector(selectNotifications);
  const loading  = useSelector(selectNotifLoading);
  const unread   = useSelector(selectUnreadCount);

  useEffect(() => { dispatch(fetchNotifications({})); }, [dispatch]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-[#1e1e1e] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Bell size={28} className="text-accent" /> Notifications
          </h1>
          <p className="text-[#555] text-sm mt-1">
            {unread > 0 ? <><span className="text-accent font-bold">{unread}</span> unread</> : "All caught up"}
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={() => dispatch(markAllNotificationsRead())}
                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#555] hover:text-white border border-[#222] hover:border-[#444] px-4 py-2 transition-colors"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
            <button
              onClick={() => dispatch(deleteAllNotifications())}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#555] hover:text-red-400 border border-[#222] hover:border-red-400/40 px-4 py-2 transition-colors"
            >
              <Trash2 size={13} /> Clear all
            </button>
          </div>
        )}
      </div>

      {loading && items.length === 0 ? (
        <div className="flex justify-center py-20">
          <span className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Bell size={64} className="text-[#333] mb-6" />
          <h2 className="text-xl font-black uppercase text-white mb-2">No notifications</h2>
          <p className="text-[#555] text-sm max-w-sm">You're all caught up. We'll notify you about orders, deals, and updates.</p>
        </div>
      ) : (
        <div className="max-w-3xl space-y-2">
          {items.map((n) => (
            <div
              key={n._id}
              className={`flex items-start gap-4 p-4 border transition-colors ${n.isRead ? "bg-[#0a0a0a] border-[#161616]" : "bg-[#111] border-[#2a2a2a]"}`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-[#1a1a1a] border border-[#222]">
                {typeIcon(n.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm font-bold ${n.isRead ? "text-[#aaa]" : "text-white"}`}>{n.title}</p>
                    <p className="text-sm text-[#666] mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                  {!n.isRead && (
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-accent mt-1.5" />
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-[#444] font-medium">{timeAgo(n.createdAt)}</span>
                  {n.actionUrl && (
                    <Link href={n.actionUrl} className="text-[10px] font-black uppercase tracking-wider text-accent hover:text-accent-hover transition-colors">
                      View →
                    </Link>
                  )}
                  {!n.isRead && (
                    <button onClick={() => dispatch(markNotificationRead(n._id))} className="text-[10px] font-black uppercase tracking-wider text-[#444] hover:text-white transition-colors">
                      Mark read
                    </button>
                  )}
                  <button onClick={() => dispatch(deleteNotification(n._id))} className="text-[10px] font-black uppercase tracking-wider text-[#444] hover:text-red-400 transition-colors ml-auto">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
