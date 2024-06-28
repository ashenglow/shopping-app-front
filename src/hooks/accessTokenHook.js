import { useSelector } from "react-redux";

export const getAccessTokenFromStorage = () =>
  localStorage.getItem("accessToken");

export const setAccessTokenToStorage = (accessToken) => {
  localStorage.setItem("accessToken", accessToken);
};

export const removeAccessTokenFromStorage = () => {
  localStorage.removeItem("accessToken");
};
