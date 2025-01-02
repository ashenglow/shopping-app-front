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
const frontendURL = process.env.REACT_APP_FRONTEND_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, //크로스 도메인 요청 시 쿠키 전송 허용
});
let isRefreshing = false;
let failedQueue = [];


const publicEndpoints = ['/api/public/', '/v1/login', '/v1/register'];
// Authentication-related routes that should not trigger refresh attempts
const authRoutes = [
  '/api/v1/login',
  '/api/v1/register',
  '/api/v1/refresh',
  '/api/v1/logout'
];

const isPublicEndpoint = (url) => {
  return publicEndpoints.some(endpoint => url.includes(endpoint));
}
const isAuthRoute = (url) => {
  return authRoutes.some(route => url.includes(route));
};

const isAuthPage = () => {
  const authPages = ['/login', '/register'];
  return authPages.some(page => window.location.pathname.includes(page));
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

axiosInstance.interceptors.request.use(
  (config) => {
    // don't add token for public endpoints
    if(isPublicEndpoint(config.url)){
      return config;
    }
    // all other endpoints, try to add token if it exists
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
  (response) => {
    if(response.config.url.includes('/api/v1/logout')){
      return response;
    }
    return response;
  },
  //응답 에러 처리
  async (error) => {
  
      const originalRequest = error.config;

      // Handle network errors
      if (!error.response) {
        store.dispatch(showNotification("Network Error. Please check your network.", "error" ));
        return Promise.reject(error);
      }

      // if it's a public endpoint, just return the error
      if(isPublicEndpoint(originalRequest.url)){
        return Promise.reject(error);
      }

      if(originalRequest.url.includes('/api/v1/logout')){
        return Promise.reject(error);
      }

      // don't attempt refresh for auth routes or if we're already retrying
      if (!isAuthRoute(originalRequest.url) && 
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

        // handle refresh token failure - only redirect if not on auth page
     if(refreshError.response?.status === 401 && !isAuthPage()){
       store.dispatch(showNotification("Session expired. Please log in again.", "error"));
       removeAccessTokenFromStorage();
       history.push('/login');
     }   
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
