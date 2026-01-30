import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the auth token in headers
apiClient.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
