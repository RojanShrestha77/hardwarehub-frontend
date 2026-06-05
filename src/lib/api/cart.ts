import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface CartProduct {
  id:            string;
  name:          string;
  price:         number;
  originalPrice: number | null;
  category:      string;
  brand:         string;
  imageUrl:      string | null;
  stock:         number;
}

export interface CartItem {
  id:        string;
  quantity:  number;
  createdAt: string;
  product:   CartProduct;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
  count: number;
}

export const cartApi = {
  getCart: async (): Promise<CartResponse> => {
    const res = await axiosInstance.get(API.CART.BASE);
    return res.data.data;
  },

  addToCart: async (productId: string, quantity = 1): Promise<CartResponse> => {
    const res = await axiosInstance.post(API.CART.BASE, { productId, quantity });
    return res.data.data;
  },

  updateItem: async (productId: string, quantity: number): Promise<CartResponse> => {
    const res = await axiosInstance.patch(API.CART.ITEM(productId), { quantity });
    return res.data.data;
  },

  removeItem: async (productId: string): Promise<CartResponse> => {
    const res = await axiosInstance.delete(API.CART.ITEM(productId));
    return res.data.data;
  },

  clearCart: async (): Promise<CartResponse> => {
    const res = await axiosInstance.delete(API.CART.BASE);
    return res.data.data;
  },
};
