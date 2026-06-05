import axios from "axios";
import { getAuthToken } from "../cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken();
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        // Remove Content-Type header for FormData to let axios set it with boundary
        if (config.data instanceof FormData && config.headers) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
