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
import { LOAD_USER_FAIL } from "../constants/userConstants";
const baseURL = process.env.REACT_APP_API_URL;
const frontendURL = process.env.REACT_APP_FRONTEND_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, //크로스 도메인 요청 시 쿠키 전송 허용
});
let isRefreshing = false;
let failedQueue = [];


// Paths that require authentication
const AUTH_PATHS = ['/api/auth/', '/api/admin/'];

// Paths that handle authentication or are public
const UNPROTECTED_PATHS = [
  '/api/v1/login',
  '/api/v1/register',
  '/api/v1/refresh',
  '/oauth2/authorization',
  '/login/oauth2/code',
  '/api/public/'
];



export const clearAuthState = (silent = false) => {
  removeAccessTokenFromStorage();
  localStorage.removeItem("userId");
  localStorage.removeItem("nickname");
  delete axios.defaults.headers.common["Authorization"];

  if(!silent){
    store.dispatch(showNotification("Session expired. Please log in again.", "error"));
  }
}

export const validateInitialToken  = async () => {
  const token = getAccessTokenFromStorage();
  if(!token) return false;
  try {
    //try to make a request to validate the token
    await axiosInstance.get('/api/auth/v1/me');
    return true;
} catch (error) {
  clearAuthState(true);
  return false;
}
}

const isAuthRequired = (url) => {
  return AUTH_PATHS.some((path) => url.includes(path));
};

const isUnprotectedPath = (url) => {
  return UNPROTECTED_PATHS.some((path) => url.includes(path));
};

// Check if current path is public
const isPublicPath = () => {
  const publicPaths = ['/products', '/product', '/search', '/contact', '/about', '/login', '/oauth2/callback', '/api-docs','/monitoring'];
  const pathname = window.location.pathname;
  
  // Exact match for root path
  if (pathname === '/') return true;
  
  // For other paths, check if it starts with the path and is followed by end or /
  return publicPaths.some(path => pathname.startsWith(path + '/') || pathname === path);
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

const getToken = () => {
  const token = getAccessTokenFromStorage() || store.getState().user.accessToken;
  return token; 
}
axiosInstance.interceptors.request.use(
  (config) => {
    // don't add token for public endpoints
    // all other endpoints, try to add token if it exists
    if(!isUnprotectedPath(config.url)){
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
    const isPublic = isPublicPath();

    if (!error.response) {
      if(!isPublic){
        store.dispatch(showNotification("Network Error. Please check your network.", "error" ));  
      }
      return Promise.reject(error);
    }

    if (isUnprotectedPath(originalRequest.url)){
      return Promise.reject(error);
    }

    // Only handle 401 errors for protected routes
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("401 error detected, originalRequest:", originalRequest.url);
      originalRequest._retry = true;
      // Don't retry if it's a refresh token request
      // Check if currently refreshing
      if (isRefreshing) {
        try {
            // Wait for the refresh to complete
            return new Promise((resolve) => {
                failedQueue.push((token) => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    resolve(axiosInstance(originalRequest));
                });
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    isRefreshing = true;

      // Handle refresh token for other requests
      try {
        
         // Dispatch refresh action and get the data directly
         const tokenData = await axiosInstance.get('/api/v1/refresh');
         console.log("Token refresh response:", tokenData);
 
         if (!tokenData || !tokenData.data.accessToken) {
           throw new Error("No access token received from refresh");
         }
 
         // Update token in storage and headers
         const newToken = tokenData.data.accessToken;
         setAccessTokenToStorage(newToken);
         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
 
         console.log("Retrying original request with new token");
         return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        clearAuthState(true);
        store.dispatch({ type: LOAD_USER_FAIL });

        if (!isPublic) {
          history.push('/login');
          store.dispatch(showNotification("Session expired. Please log in again.", "error"));
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response.status >= 400 && !isPublic) {
      store.dispatch(showNotification(error.response?.data?.message || "An error occurred", "error"));
    } 

    return Promise.reject(error);
  }
  
);

export default axiosInstance;
