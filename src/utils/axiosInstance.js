import axios from "axios";
import store from "../store";
import {
  getAccessTokenFromStorage,
  setAccessTokenToStorage,
  removeAccessTokenFromStorage,
} from "../hooks/accessTokenHook";
import { history } from "./history";
import { showNotification } from "../actions/notificationAction";
const baseURL = process.env.REACT_APP_API_URL;
const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, //크로스 도메인 요청 시 쿠키 전송 허용
});
let isRefreshing = false;
let refreshSubscribers = [];

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Axios instance baseURL:", axiosInstance.defaults.baseURL);
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
  
      const originalRequest = error.config;

      // Handle network errors
      if (!error.response) {
        store.dispatch(showNotification("Network Error. Please check your network.", "error" ));
        return Promise.reject(error);
      }
      // Handle 401 Unauthorized errors
      if (error.response.status === 401 && !originalRequest._retry) {
        console.log("refresh token call");
        
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshSubscribers.push({ resolve, reject });
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
          const response = await axiosInstance.post("/v1/refresh");
          const newAccessToken = response.data.accessToken;
          setAccessTokenToStorage(newAccessToken);

          axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;

          refreshSubscribers.forEach(({ resolve}) => resolve(newAccessToken));
          refreshSubscribers = [];
          
          isRefreshing = false;
          return axiosInstance(originalRequest);
        } catch (refreshErr) {
         refreshSubscribers.forEach(({ reject }) => reject(refreshErr));
         refreshSubscribers = [];
         removeAccessTokenFromStorage();
         store.dispatch(showNotification("Your session expired. Please login again.", "error" ));
         history.push("/login");

         isRefreshing = false;
         return Promise.reject(refreshErr);
        }
      }else if(error.response.status >= 400 && error.response.status < 500) {
          store.dispatch(showNotification(error.response?.data?.message || "An error occurred", "error" ));
        } else if(error.response.status >= 500) {
          store.dispatch(showNotification( "Server error. Please try again later.", "error" ));
        }
      
      // Handle other errors (non-401 or 401 without retry)

      return Promise.reject(error);
    } 
  
);

export default axiosInstance;
