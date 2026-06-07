import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import * as api from "@/lib/api/orders";

interface OrderState {
  orders: api.Order[];
  currentOrder: api.Order | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  pagination: { page: number; size: number; total: number; totalPages: number } | null;
}

const initial: OrderState = { orders: [], currentOrder: null, loading: false, submitting: false, error: null, pagination: null };

export const fetchMyOrders = createAsyncThunk("orders/fetchMy", async ({ page = 1, size = 10 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
  try { return (await api.getMyOrders(page, size)).data; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed to load orders"); }
});

export const fetchOrderById = createAsyncThunk("orders/fetchById", async (id: string, { rejectWithValue }) => {
  try { return (await api.getOrderById(id)).data; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed to load order"); }
});

export const createOrder = createAsyncThunk("orders/create", async (dto: api.CreateOrderDto, { rejectWithValue }) => {
  try { return (await api.createOrder(dto)).data; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed to place order"); }
});

export const cancelOrder = createAsyncThunk("orders/cancel", async (id: string, { rejectWithValue }) => {
  try { return (await api.cancelOrder(id)).data; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed to cancel order"); }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: initial,
  reducers: { clearCurrentOrder: (s) => { s.currentOrder = null; } },
  extraReducers: (b) => {
    b.addCase(fetchMyOrders.pending,  (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchMyOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
    b.addCase(fetchMyOrders.fulfilled, (s, a) => {
      s.loading = false;
      s.orders = a.payload.orders;
      s.pagination = a.payload.pagination;
    });
    b.addCase(fetchOrderById.pending,  (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchOrderById.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
    b.addCase(fetchOrderById.fulfilled, (s, a) => { s.loading = false; s.currentOrder = a.payload; });
    b.addCase(createOrder.pending,  (s) => { s.submitting = true; s.error = null; });
    b.addCase(createOrder.rejected, (s, a) => { s.submitting = false; s.error = a.payload as string; });
    b.addCase(createOrder.fulfilled, (s, a) => { s.submitting = false; s.currentOrder = a.payload; });
    b.addCase(cancelOrder.fulfilled, (s, a) => {
      s.currentOrder = a.payload;
      const idx = s.orders.findIndex((o) => o._id === a.payload._id);
      if (idx !== -1) s.orders[idx] = a.payload;
    });
  },
});

export default orderSlice.reducer;
export const { clearCurrentOrder } = orderSlice.actions;
export const selectOrders         = (s: RootState) => s.orders.orders;
export const selectCurrentOrder   = (s: RootState) => s.orders.currentOrder;
export const selectOrderLoading   = (s: RootState) => s.orders.loading;
export const selectOrderSubmitting = (s: RootState) => s.orders.submitting;
export const selectOrderError     = (s: RootState) => s.orders.error;
export const selectOrderPagination = (s: RootState) => s.orders.pagination;
