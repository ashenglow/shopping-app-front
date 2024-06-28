import axios from "axios";
import {
  getAccessTokenFromStorage,
  setAccessTokenToStorage,
  removeAccessTokenFromStorage,
} from "../hooks/accessTokenHook";
import { history } from "./history";
const baseURL = process.env.REACT_APP_API_URL;
const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, //크로스 도메인 요청 시 쿠키 전송 허용
});
let isRefreshing = false;
let refreshSubscribers = [];

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessTokenFromStorage();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  //응답 데이터 처리
  (response) => response,
  //응답 에러 처리
  async (error) => {
    try {
      const originalRequest = error.config;

      // Handle network errors
      if (!error.response) {
        showLoginAlert("Network error. Please try again later.");
        return Promise.reject(error);
      }
      // Handle 401 Unauthorized errors
      if (error.response.status === 401 && !originalRequest._retry) {
        console.log("refresh token call");
        originalRequest._retry = true;
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshSubscribers.push({ resolve, reject });
          }).then(() => axiosInstance(originalRequest));
        }

        isRefreshing = true;

        try {
          const response = await axiosInstance.post("/v1/refresh");
          const newAccessToken = response.data.accessToken;
          refreshSubscribers.forEach((sub) => sub.resolve());
          setAccessTokenToStorage(newAccessToken);
          return axiosInstance(originalRequest);
        } catch (refreshErr) {
          // Check for specific errors indicating invalid refresh token
          if (
            refreshErr.response?.status === 403 ||
            refreshErr.response?.data?.error === "refresh_token_invalid" ||
            refreshErr.response?.headers["x-token-error"] ===
              "refresh_token_invalid"
          ) {
            refreshSubscribers.forEach((sub) => sub.reject(error));
            // Invalid or missing refresh token
            removeAccessTokenFromStorage();
            showLoginAlert("Your session has expired. Please log in again.");
            return Promise.reject(refreshErr);
          }
          // Handle other refresh errors
          showLoginAlert("Error refreshing your session. Please log in again.");
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
          refreshSubscribers = [];
        }
      }
      // Handle other errors (non-401 or 401 without retry)

      return Promise.reject(error);
    } catch (interceptorErr) {
      // Handle any unexpected errors in the interceptor itself
      console.error("Error in axios interceptor:", interceptorErr);
      showLoginAlert("An unexpected error occurred. Please log in again.");
      return Promise.reject(interceptorErr);
    }
  }
);

const showLoginAlert = (message) => {
  const confirmLogin = window.confirm(
    message + "\n\nClick OK to go to the login page."
  );
  if (confirmLogin) {
    // Use history.push for React Router navigation
    history.push("/login");
  }
};

export default axiosInstance;
