export const API = {
  AUTH: {
    REGISTER:        "/api/auth/register",
    LOGIN:           "/api/auth/login",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD:  "/api/auth/reset-password",
  },
  PRODUCTS: {
    LIST:   "/api/products",
    IDS:    "/api/products/ids",
    DETAIL: (id: string) => `/api/products/${id}`,
  },
  CART: {
    BASE: "/api/cart",
    ITEM: (productId: string) => `/api/cart/${productId}`,
  },
  SELLER: {
    REGISTER: "/api/seller",
    PRODUCTS: "/api/seller/products",
    PRODUCT:  (id: string) => `/api/seller/products/${id}`,
  },
  CATEGORIES: {
    GET_ALL:   "/api/categories",
    GET_BY_ID: (id: string) => `/api/categories/${id}`,
  },
  WISHLIST: {
    BASE:    "/api/wishlist",
    ITEM:    (productId: string) => `/api/wishlist/${productId}`,
    CLEAR:   "/api/wishlist/clear/all",
  },
  ORDERS: {
    BASE:      "/api/orders",
    MY_ORDERS: "/api/orders/my-orders",
    DETAIL:    (id: string) => `/api/orders/${id}`,
    CANCEL:    (id: string) => `/api/orders/${id}/cancel`,
  },
  NOTIFICATIONS: {
    BASE:           "/api/notifications",
    UNREAD_COUNT:   "/api/notifications/unread-count",
    MARK_READ:      (id: string) => `/api/notifications/${id}/read`,
    MARK_ALL_READ:  "/api/notifications/mark-all-read",
    DELETE:         (id: string) => `/api/notifications/${id}`,
  },
  REVIEWS: {
    PRODUCT:    (productId: string) => `/api/reviews/product/${productId}`,
    MY_REVIEWS: "/api/reviews/my-reviews",
    UPDATE:     (id: string) => `/api/reviews/${id}`,
    DELETE:     (id: string) => `/api/reviews/${id}`,
  },
};
