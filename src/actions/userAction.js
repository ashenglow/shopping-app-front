import {
  LOGIN_REQUEST,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAIL,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  PROFILE_EDIT_REQUEST,
  PROFILE_EDIT_SUCCESS,
  PROFILE_EDIT_RESET,
  PROFILE_EDIT_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constants/userConstants";
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import { setError } from "./errorAction";

// Login
export const login = (loginform) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const baseURL = process.env.REACT_APP_API_URL;
    const config = {
      headers: { "Content-Type": "application/json" },
      baseURL: baseURL,
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${baseURL}/api/v1/login`,
      loginform,
      config
    );
    localStorage.setItem("accessToken", data.accessToken);
    dispatch({ type: LOGIN_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    dispatch(setError(errorMessage, LOGIN_FAIL));
  }
};

// Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });
    const baseURL = process.env.REACT_APP_API_URL;
    const config = {
      headers: { "Content-Type": "application/json" },
      baseURL: baseURL,
    };

    const { data } = await axios.post(
      `${baseURL}/api/v1/register`,
      userData,
      config
    );

    dispatch({ type: REGISTER_USER_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Register failed";
    dispatch(setError(errorMessage, REGISTER_USER_FAIL));
  }
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const { data } = await axiosInstance.get(`/api/auth/v1/me`);

    dispatch({ type: LOAD_USER_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error loading user";
    dispatch(setError(errorMessage, LOAD_USER_FAIL));
  }
};

export const refresh = () => async (dispatch) => {
  try {
    dispatch({ type: REFRESH_TOKEN_REQUEST });
    const { data } = await axiosInstance.get(`/api/v1/refresh`);
    localStorage.setItem("accessToken", data.accessToken);
    dispatch({ type: REFRESH_TOKEN_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error refreshing token";
    dispatch(setError(errorMessage, REFRESH_TOKEN_FAIL));
  }
};
// Logout User
export const logout = () => async (dispatch) => {
  try {
    //get이라서 안되나..?
    const { data } = await axiosInstance.post(`/api/v1/logout`);
    localStorage.removeItem("user"); // Clear user from local storage if applicable
    sessionStorage.removeItem("user");
    dispatch({ type: LOGOUT_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error logging out";
    dispatch(setError(errorMessage, LOGOUT_FAIL));
  }
};

// Get editProfile
export const getProfileEdit = () => async (dispatch) => {
  try {
    dispatch({ type: PROFILE_EDIT_REQUEST });

    const { data } = await axiosInstance.get(`/api/auth/v1/member/update`);

    dispatch({ type: PROFILE_EDIT_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error getting profile edit";
    dispatch(setError(errorMessage, PROFILE_EDIT_FAIL));
  }
};

// Update Profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axiosInstance.post(
      `/api/auth/v1/member/update`,
      userData,
      config
    );

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error updating profile";
    dispatch(setError(errorMessage, UPDATE_PROFILE_FAIL));
  }
};

// Update Password
// export const updatePassword = (passwords) => async (dispatch) => {
//   try {
//     dispatch({ type: UPDATE_PASSWORD_REQUEST });

//     const config = { headers: { "Content-Type": "application/json" } };

//     const { data } = await axiosInstance.put(
//       `/api/v1/password/update`,
//       passwords,
//       config
//     );

//     dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
//   } catch (error) {
//     dispatch({
//       type: UPDATE_PASSWORD_FAIL,
//       payload: error.response.data.message,
//     });
//   }
// };

// // Forgot Password
// export const forgotPassword = (email) => async (dispatch) => {
//   try {
//     dispatch({ type: FORGOT_PASSWORD_REQUEST });

//     const config = { headers: { "Content-Type": "application/json" } };

//     const { data } = await axiosInstance.post(
//       `/api/v1/password/forgot`,
//       email,
//       config
//     );

//     dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
//   } catch (error) {
//     dispatch({
//       type: FORGOT_PASSWORD_FAIL,
//       payload: error.response.data.message,
//     });
//   }
// };

// Reset Password
// export const resetPassword = (token, passwords) => async (dispatch) => {
//   try {
//     dispatch({ type: RESET_PASSWORD_REQUEST });

//     const config = { headers: { "Content-Type": "application/json" } };

//     const { data } = await axiosInstance.put(
//       `/api/v1/password/reset/${token}`,
//       passwords,
//       config
//     );

//     dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
//   } catch (error) {
//     dispatch({
//       type: RESET_PASSWORD_FAIL,
//       payload: error.response.data.message,
//     });
//   }
// };

// get All Users
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });
    const { data } = await axiosInstance.get(`/api/v1/admin/users`);

    dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error getting all users";
    dispatch(setError(errorMessage, ALL_USERS_FAIL));
  }
};

// get  User Details
// export const getUserDetails = (id) => async (dispatch) => {
//   try {
//     dispatch({ type: USER_DETAILS_REQUEST });
//     const { data } = await axiosInstance.get(`/api/v1/admin/user/${id}`);

//     dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
//   } catch (error) {
//     dispatch({ type: USER_DETAILS_FAIL, payload: error.response.data.message });
//   }
// };

// Update User
// export const updateUser = (id, userData) => async (dispatch) => {
//   try {
//     dispatch({ type: UPDATE_USER_REQUEST });

//     const config = { headers: { "Content-Type": "application/json" } };

//     const { data } = await axiosInstance.put(
//       `/api/v1/admin/user/${id}`,
//       userData,
//       config
//     );

//     dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
//   } catch (error) {
//     dispatch({
//       type: UPDATE_USER_FAIL,
//       payload: error.response.data.message,
//     });
//   }
// };

// Delete User
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const { data } = await axiosInstance.delete(`/api/v1/admin/user/${id}`);

    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error deleting user";
    dispatch(setError(errorMessage, DELETE_USER_FAIL));
  }
};

// Clearing Errors
// export const clearErrors = () => async (dispatch) => {
//   dispatch({ type: CLEAR_ERRORS });
// };
