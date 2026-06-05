import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  mobileMenuOpen: boolean;
  cartDrawerOpen: boolean;
}

const initialState: UIState = {
  mobileMenuOpen: false,
  cartDrawerOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu(state) { state.mobileMenuOpen = !state.mobileMenuOpen; },
    closeMobileMenu(state) { state.mobileMenuOpen = false; },
    toggleCartDrawer(state) { state.cartDrawerOpen = !state.cartDrawerOpen; },
    closeCartDrawer(state) { state.cartDrawerOpen = false; },
  },
});

export const { toggleMobileMenu, closeMobileMenu, toggleCartDrawer, closeCartDrawer } = uiSlice.actions;
export default uiSlice.reducer;
