import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface WishlistItem {
  productId: {
    _id: string;
    id: string;
    name: string;
    price: number;
    originalPrice: number | null;
    category: string;
    brand: string;
    stock: number;
    imageUrl: string | null;
    badge: string | null;
    rating: string;
    reviewCount: number;
  };
  addedAt: string;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    userId: string;
    items: WishlistItem[];
    itemCount: number;
  };
}

export const getWishlist = () =>
  axiosInstance.get<WishlistResponse>(API.WISHLIST.BASE).then((r) => r.data);

export const addToWishlist = (productId: string) =>
  axiosInstance.post<WishlistResponse>(API.WISHLIST.BASE, { productId }).then((r) => r.data);

export const removeFromWishlist = (productId: string) =>
  axiosInstance.delete<WishlistResponse>(API.WISHLIST.ITEM(productId)).then((r) => r.data);

export const clearWishlist = () =>
  axiosInstance.delete<WishlistResponse>(API.WISHLIST.CLEAR).then((r) => r.data);
