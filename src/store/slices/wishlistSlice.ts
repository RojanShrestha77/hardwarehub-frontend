import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import * as api from "@/lib/api/wishlist";

interface WishlistState {
  items: api.WishlistItem[];
  itemCount: number;
  loading: boolean;
  error: string | null;
}

const initial: WishlistState = { items: [], itemCount: 0, loading: false, error: null };

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
  try { return (await api.getWishlist()).data; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed to load wishlist"); }
});

export const addToWishlist = createAsyncThunk("wishlist/add", async (productId: string, { rejectWithValue }) => {
  try { return (await api.addToWishlist(productId)).data; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed to add to wishlist"); }
});

export const removeFromWishlist = createAsyncThunk("wishlist/remove", async (productId: string, { rejectWithValue }) => {
  try { return (await api.removeFromWishlist(productId)).data; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed to remove from wishlist"); }
});

export const clearWishlist = createAsyncThunk("wishlist/clear", async (_, { rejectWithValue }) => {
  try { return (await api.clearWishlist()).data; }
  catch (e: any) { return rejectWithValue(e.response?.data?.message ?? "Failed to clear wishlist"); }
});

const setData = (state: WishlistState, data: { items: api.WishlistItem[]; itemCount: number }) => {
  state.items = data.items;
  state.itemCount = data.itemCount;
  state.loading = false;
  state.error = null;
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    [fetchWishlist, addToWishlist, removeFromWishlist, clearWishlist].forEach((thunk) => {
      b.addCase(thunk.pending, (s) => { s.loading = true; s.error = null; });
      b.addCase(thunk.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
    });
    b.addCase(fetchWishlist.fulfilled,     (s, a) => setData(s, a.payload));
    b.addCase(addToWishlist.fulfilled,     (s, a) => setData(s, a.payload));
    b.addCase(removeFromWishlist.fulfilled,(s, a) => setData(s, a.payload));
    b.addCase(clearWishlist.fulfilled,     (s, a) => setData(s, a.payload));
  },
});

export default wishlistSlice.reducer;
export const selectWishlistItems    = (s: RootState) => s.wishlist.items;
export const selectWishlistCount    = (s: RootState) => s.wishlist.itemCount;
export const selectWishlistLoading  = (s: RootState) => s.wishlist.loading;
export const selectIsInWishlist     = (productId: string) => (s: RootState) =>
  s.wishlist.items.some((i) => {
    const pid = typeof i.productId === "string" ? i.productId : i.productId?._id ?? i.productId?.id;
    return pid === productId;
  });
