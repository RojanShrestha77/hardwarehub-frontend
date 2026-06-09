import axiosInstance from "./axios";

export const initiateKhaltiPayment = async (orderId: string) => {
  const res = await axiosInstance.post("/api/payment/initiate", { orderId });
  return res.data;
};

export const verifyKhaltiPayment = async (pidx: string) => {
  const res = await axiosInstance.post("/api/payment/verify", { pidx });
  return res.data;
};
