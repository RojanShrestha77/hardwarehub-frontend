import axiosInstance from "./axios";

export interface SellerApplication {
  id:              string;
  userId:          string;
  businessName:    string;
  businessType:    "individual" | "company";
  panNumber:       string;
  phone:           string;
  businessAddress: string;
  description:     string;
  status:          "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  createdAt:       string;
  user?: { id: string; name: string; email: string };
}

export interface CreateSellerApplicationData {
  businessName:    string;
  businessType:    "individual" | "company";
  panNumber:       string;
  phone:           string;
  businessAddress: string;
  description:     string;
}

export const applyAsSeller = async (data: CreateSellerApplicationData) => {
  const res = await axiosInstance.post("/api/seller-applications", data);
  return res.data;
};

export const getMyApplication = async () => {
  const res = await axiosInstance.get("/api/seller-applications/me");
  return res.data;
};

// Admin
export const getAdminApplications = async (
  page = 1,
  size = 15,
  status?: string,
): Promise<{ applications: SellerApplication[]; pagination: any }> => {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) params.set("status", status);
  const res = await axiosInstance.get(`/api/seller-applications?${params}`);
  return res.data.data;
};

export const approveApplication = async (id: string) => {
  const res = await axiosInstance.patch(`/api/seller-applications/${id}/approve`);
  return res.data;
};

export const rejectApplication = async (id: string, reason: string) => {
  const res = await axiosInstance.patch(`/api/seller-applications/${id}/reject`, { reason });
  return res.data;
};
