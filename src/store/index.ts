import { configureStore } from "@reduxjs/toolkit";
import cartReducer         from "./slices/cartSlice";
import uiReducer           from "./slices/uiSlice";
import wishlistReducer     from "./slices/wishlistSlice";
import notificationReducer from "./slices/notificationSlice";
import orderReducer        from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    cart:          cartReducer,
    ui:            uiReducer,
    wishlist:      wishlistReducer,
    notifications: notificationReducer,
    orders:        orderReducer,
  },
});

export type RootState    = ReturnType<typeof store.getState>;
export type AppDispatch  = typeof store.dispatch;
