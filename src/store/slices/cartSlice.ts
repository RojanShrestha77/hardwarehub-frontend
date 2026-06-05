import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { cartApi, type CartItem, type CartResponse } from "@/lib/api/cart";

interface CartState {
  items:   CartItem[];
  total:   number;
  count:   number;
  loading: boolean;
  error:   string | null;
}

const initialState: CartState = {
  items:   [],
  total:   0,
  count:   0,
  loading: false,
  error:   null,
};

// ─── Async Thunks (backend-synced) ────────────────────────────────────────────

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      return await cartApi.getCart();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }: { productId: string; quantity?: number }, { rejectWithValue }) => {
    try {
      return await cartApi.addToCart(productId, quantity);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      return await cartApi.updateItem(productId, quantity);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update cart");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      return await cartApi.removeItem(productId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove item");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      return await cartApi.clearCart();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to clear cart");
    }
  }
);

// ─── Helper to apply backend response ────────────────────────────────────────
const applyCart = (state: CartState, cart: CartResponse) => {
  state.items   = cart.items;
  state.total   = cart.total;
  state.count   = cart.count;
  state.loading = false;
  state.error   = null;
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartLocal(state) {
      state.items   = [];
      state.total   = 0;
      state.count   = 0;
      state.error   = null;
    },
  },
  extraReducers: (builder) => {
    const pending  = (state: CartState) => { state.loading = true; state.error = null; };
    const rejected = (state: CartState, action: any) => {
      state.loading = false;
      state.error   = action.payload as string;
    };

    builder
      .addCase(fetchCart.pending,       pending)
      .addCase(fetchCart.fulfilled,     (s, a) => applyCart(s, a.payload))
      .addCase(fetchCart.rejected,      rejected)

      .addCase(addToCart.pending,       pending)
      .addCase(addToCart.fulfilled,     (s, a) => applyCart(s, a.payload))
      .addCase(addToCart.rejected,      rejected)

      .addCase(updateCartItem.pending,  pending)
      .addCase(updateCartItem.fulfilled,(s, a) => applyCart(s, a.payload))
      .addCase(updateCartItem.rejected, rejected)

      .addCase(removeFromCart.pending,  pending)
      .addCase(removeFromCart.fulfilled,(s, a) => applyCart(s, a.payload))
      .addCase(removeFromCart.rejected, rejected)

      .addCase(clearCart.pending,       pending)
      .addCase(clearCart.fulfilled,     (s, a) => applyCart(s, a.payload))
      .addCase(clearCart.rejected,      rejected);
  },
});

export const { clearCartLocal } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) => state.cart.count;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.total;
export const selectCartLoading= (state: { cart: CartState }) => state.cart.loading;
export const selectCartError  = (state: { cart: CartState }) => state.cart.error;

export default cartSlice.reducer;
