import axiosInstance from "./axios";
import { API } from "./endpoints";

export type NotificationType = "order" | "product" | "review" | "system" | "admin";

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedId?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: { notifications: Notification[]; pagination: { page: number; size: number; total: number; totalPages: number } };
}

export interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: { count: number };
}

export const getNotifications = (page = 1, size = 20) =>
  axiosInstance.get<NotificationsResponse>(API.NOTIFICATIONS.BASE, { params: { page, size } }).then((r) => r.data);

export const getUnreadCount = () =>
  axiosInstance.get<UnreadCountResponse>(API.NOTIFICATIONS.UNREAD_COUNT).then((r) => r.data);

export const markAsRead = (id: string) =>
  axiosInstance.patch(API.NOTIFICATIONS.MARK_READ(id)).then((r) => r.data);

export const markAllAsRead = () =>
  axiosInstance.patch(API.NOTIFICATIONS.MARK_ALL_READ).then((r) => r.data);

export const deleteNotification = (id: string) =>
  axiosInstance.delete(API.NOTIFICATIONS.DELETE(id)).then((r) => r.data);

export const deleteAllNotifications = () =>
  axiosInstance.delete(API.NOTIFICATIONS.BASE).then((r) => r.data);
