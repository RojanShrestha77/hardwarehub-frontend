import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import * as api from "@/lib/api/notifications";

interface NotificationState {
  items: api.Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: { page: number; size: number; total: number; totalPages: number } | null;
}

const initial: NotificationState = { items: [], unreadCount: 0, loading: false, error: null, pagination: null };

export const fetchNotifications = createAsyncThunk("notifications/fetch", async ({ page = 1, size = 20 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
  try { return (await api.getNotifications(page, size)).data; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed to load notifications"); }
});

export const fetchUnreadCount = createAsyncThunk("notifications/unreadCount", async (_, { rejectWithValue }) => {
  try { return (await api.getUnreadCount()).data.count; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed"); }
});

export const markNotificationRead = createAsyncThunk("notifications/markRead", async (id: string, { rejectWithValue }) => {
  try { await api.markAsRead(id); return id; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed"); }
});

export const markAllNotificationsRead = createAsyncThunk("notifications/markAllRead", async (_, { rejectWithValue }) => {
  try { await api.markAllAsRead(); return true; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed"); }
});

export const deleteNotification = createAsyncThunk("notifications/delete", async (id: string, { rejectWithValue }) => {
  try { await api.deleteNotification(id); return id; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed"); }
});

export const deleteAllNotifications = createAsyncThunk("notifications/deleteAll", async (_, { rejectWithValue }) => {
  try { await api.deleteAllNotifications(); return true; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed"); }
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchNotifications.pending,  (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchNotifications.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
    b.addCase(fetchNotifications.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload.notifications;
      s.pagination = a.payload.pagination;
      s.unreadCount = a.payload.notifications.filter((n) => !n.isRead).length;
    });
    b.addCase(fetchUnreadCount.fulfilled, (s, a) => { s.unreadCount = a.payload; });
    b.addCase(markNotificationRead.fulfilled, (s, a) => {
      const n = s.items.find((i) => i._id === a.payload);
      if (n && !n.isRead) { n.isRead = true; s.unreadCount = Math.max(0, s.unreadCount - 1); }
    });
    b.addCase(markAllNotificationsRead.fulfilled, (s) => {
      s.items.forEach((n) => (n.isRead = true));
      s.unreadCount = 0;
    });
    b.addCase(deleteNotification.fulfilled, (s, a) => {
      const n = s.items.find((i) => i._id === a.payload);
      if (n && !n.isRead) s.unreadCount = Math.max(0, s.unreadCount - 1);
      s.items = s.items.filter((i) => i._id !== a.payload);
    });
    b.addCase(deleteAllNotifications.fulfilled, (s) => { s.items = []; s.unreadCount = 0; });
  },
});

export default notificationSlice.reducer;
export const selectNotifications  = (s: RootState) => s.notifications.items;
export const selectUnreadCount    = (s: RootState) => s.notifications.unreadCount;
export const selectNotifLoading   = (s: RootState) => s.notifications.loading;
export const selectNotifPagination = (s: RootState) => s.notifications.pagination;
