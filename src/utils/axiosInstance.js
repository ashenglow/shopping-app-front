import axios from "axios";
import store from "../store";
import {
  getAccessTokenFromStorage,
  setAccessTokenToStorage,
  removeAccessTokenFromStorage,
} from "../hooks/accessTokenHook";
import { history } from "./history";
import { showNotification } from "../actions/notificationAction";
import { refresh } from "../actions/userAction";
import { ref } from "joi";
const baseURL = process.env.REACT_APP_API_URL;
const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, //크로스 도메인 요청 시 쿠키 전송 허용
});
let isRefreshing = false;
let failedQueue = [];

// Add a flag to identify public routes
const isPublicRoute = (url) => {
  return url.includes('/api/public/') || 
         url.includes('/v1/login') || 
         url.includes('/v1/register');
};


const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
const logout = () => {
  removeAccessTokenFromStorage();

    history.push("/login");
 
};
axiosInstance.interceptors.request.use(
  (config) => {
    // Only add token for non-public routes
    if (!isPublicRoute(config.url)) {
      const accessToken = getAccessTokenFromStorage();
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
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
  
      const originalRequest = error.config;

      // Handle network errors
      if (!error.response) {
        store.dispatch(showNotification("Network Error. Please check your network.", "error" ));
        return Promise.reject(error);
      }
      // Handle 401 Unauthorized errors
      if (!isPublicRoute(originalRequest.url) && 
      error.response?.status === 401 && 
      !originalRequest._retry) {
        console.log("refresh token call");
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          }).catch((err) => {
            return Promise.reject(err);
          });
        }
        

        originalRequest._retry = true;
        isRefreshing = true;

        try {
        const response = await refresh();
        const { accessToken } = response.data;

        setAccessTokenToStorage(accessToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
   
      if (!isPublicRoute(originalRequest.url)) {
        store.dispatch(showNotification("Session expired. Please log in again.", "error"));
        removeAccessTokenFromStorage();
        history.push('/login');
      }
      logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  
      if (error.response.status >= 400 && error.response.status < 500) {
        store.dispatch(showNotification(error.response?.data?.message || "An error occurred", "error"));
      } else if (error.response.status >= 500) {
        store.dispatch(showNotification("Server error. Please try again later.", "error"));
      }

      return Promise.reject(error);
    } 
  
);

export default axiosInstance;
