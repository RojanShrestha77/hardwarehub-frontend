export const API = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
  },
  PRODUCTS: {
    LIST: "/api/products",
    IDS: "/api/products/ids",
    DETAIL: (id: string) => `/api/products/${id}`,
  },
  CART: {
    BASE: "/api/cart",
    ITEM: (productId: string) => `/api/cart/${productId}`,
  },
  SELLER: {
    REGISTER: "/api/seller",
    PRODUCTS: "/api/seller/products",
    PRODUCT: (id: string) => `/api/seller/products/${id}`,
  },
  CATEGORIES: {
    GET_ALL: "/api/categories",
    GET_BY_ID: (id: string) => `/api/categories/${id}`,
  },
};
