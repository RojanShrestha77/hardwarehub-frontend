import axiosInstance from "./axios";
import { API } from "./endpoints";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "cash_on_delivery" | "card" | "online" | "khalti";
export type PaymentStatus = "pending_payment" | "paid" | "failed" | "not_required";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  sellerId?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  shippingCost?: number;
  notes?: string;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: { orders: Order[]; pagination: { page: number; size: number; total: number; totalPages: number } };
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export const createOrder = (dto: CreateOrderDto) =>
  axiosInstance.post<OrderResponse>(API.ORDERS.BASE, dto).then((r) => r.data);

export const getMyOrders = (page = 1, size = 10) =>
  axiosInstance.get<OrdersResponse>(API.ORDERS.MY_ORDERS, { params: { page, size } }).then((r) => r.data);

export const getOrderById = (id: string) =>
  axiosInstance.get<OrderResponse>(API.ORDERS.DETAIL(id)).then((r) => r.data);

export const cancelOrder = (id: string) =>
  axiosInstance.patch<OrderResponse>(API.ORDERS.CANCEL(id)).then((r) => r.data);
