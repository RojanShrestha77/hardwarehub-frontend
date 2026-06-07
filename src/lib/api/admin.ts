import axiosInstance from "./axios";

const BASE = "/api/admin";

export interface AdminStats {
  totalUsers:     number;
  totalSellers:   number;
  pendingSellers: number;
  totalProducts:  number;
  totalOrders:    number;
  totalRevenue:   number;
  recentOrders:   AdminOrder[];
}

export interface AdminOrder {
  id:               string;
  userId:           string;
  orderNumber:      string;
  status:           string;
  paymentMethod:    string;
  paymentStatus:    string;
  shippingFullName: string;
  subtotal:         number;
  shippingCost:     number;
  tax:              number;
  total:            number;
  createdAt:        string;
  items?:           AdminOrderItem[];
}

export interface AdminOrderItem {
  id:           string;
  productName:  string;
  productImage: string | null;
  price:        number;
  quantity:     number;
}

export interface AdminUser {
  id:         string;
  name:       string;
  email:      string;
  role:       string;
  isApproved: boolean;
  imageUrl:   string | null;
  createdAt:  string;
}

export interface AdminSeller extends AdminUser {
  productCount: number;
}

export interface AdminProduct {
  id:           string;
  name:         string;
  category:     string;
  brand:        string;
  price:        number;
  stock:        number;
  imageUrl:     string | null;
  rating:       string | null;
  reviewCount:  number;
  sellerId:     string;
  createdAt:    string;
}

interface Paginated<T> {
  data: { pagination: { page: number; size: number; total: number; totalPages: number } } & T;
}

// Stats
export const getAdminStats = () =>
  axiosInstance.get<{ success: boolean; data: AdminStats }>(`${BASE}/stats`).then((r) => r.data.data);

// Orders
export const getAdminOrders = (page = 1, size = 15, status?: string) =>
  axiosInstance.get<{ success: boolean; data: { orders: AdminOrder[]; pagination: any } }>(
    `${BASE}/orders`, { params: { page, size, ...(status ? { status } : {}) } }
  ).then((r) => r.data.data);

export const updateOrderStatus = (id: string, status: string) =>
  axiosInstance.patch<{ success: boolean; data: AdminOrder }>(`${BASE}/orders/${id}/status`, { status }).then((r) => r.data.data);

// Users
export const getAdminUsers = (page = 1, size = 15, role?: string) =>
  axiosInstance.get<{ success: boolean; data: { users: AdminUser[]; pagination: any } }>(
    `${BASE}/users`, { params: { page, size, ...(role ? { role } : {}) } }
  ).then((r) => r.data.data);

export const updateAdminUser = (id: string, data: { role?: string; isApproved?: boolean }) =>
  axiosInstance.patch<{ success: boolean; data: AdminUser }>(`${BASE}/users/${id}`, data).then((r) => r.data.data);

export const deleteAdminUser = (id: string) =>
  axiosInstance.delete<{ success: boolean }>(`${BASE}/users/${id}`).then((r) => r.data);

// Sellers
export const getAdminSellers = (page = 1, size = 15, approved?: boolean) =>
  axiosInstance.get<{ success: boolean; data: { sellers: AdminSeller[]; pagination: any } }>(
    `${BASE}/sellers`, { params: { page, size, ...(approved !== undefined ? { approved } : {}) } }
  ).then((r) => r.data.data);

export const approveSeller = (id: string) =>
  axiosInstance.patch<{ success: boolean; data: AdminUser }>(`${BASE}/sellers/${id}/approve`).then((r) => r.data.data);

export const rejectSeller = (id: string) =>
  axiosInstance.patch<{ success: boolean; data: AdminUser }>(`${BASE}/sellers/${id}/reject`).then((r) => r.data.data);

// Products
export const getAdminProducts = (page = 1, size = 15, search?: string) =>
  axiosInstance.get<{ success: boolean; data: { products: AdminProduct[]; pagination: any } }>(
    `${BASE}/products`, { params: { page, size, ...(search ? { search } : {}) } }
  ).then((r) => r.data.data);

export const deleteAdminProduct = (id: string) =>
  axiosInstance.delete<{ success: boolean }>(`${BASE}/products/${id}`).then((r) => r.data);
