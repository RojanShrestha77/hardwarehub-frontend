import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface Review {
  _id: string;
  productId: string;
  userId: { _id: string; name: string; username?: string };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data: { reviews: Review[]; avgRating: number; pagination: { page: number; size: number; total: number; totalPages: number } };
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: Review;
}

export const getProductReviews = (productId: string, page = 1, size = 10) =>
  axiosInstance.get<ReviewsResponse>(API.REVIEWS.PRODUCT(productId), { params: { page, size } }).then((r) => r.data);

export const createReview = (productId: string, rating: number, comment: string) =>
  axiosInstance.post<ReviewResponse>(API.REVIEWS.PRODUCT(productId), { rating, comment }).then((r) => r.data);

export const getMyReviews = () =>
  axiosInstance.get<{ success: boolean; data: Review[] }>(API.REVIEWS.MY_REVIEWS).then((r) => r.data);

export const updateReview = (id: string, rating?: number, comment?: string) =>
  axiosInstance.patch<ReviewResponse>(API.REVIEWS.UPDATE(id), { rating, comment }).then((r) => r.data);

export const deleteReview = (id: string) =>
  axiosInstance.delete(API.REVIEWS.DELETE(id)).then((r) => r.data);
