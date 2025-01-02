import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  CLEAR_ERRORS,
  CLEAR_ORDER_STATE,
} from "../constants/orderConstants";

import axiosInstance from "../utils/axiosInstance";
import { setError } from "./errorAction";

// Create Order
export const createOrder = (orderItems) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  dispatch({ type: CREATE_ORDER_REQUEST });

  try {
    const { data } = await axiosInstance.post(
      '/api/auth/v1/order/new',
      orderItems,
      config
    );

    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error creating order";
    dispatch(setError(errorMessage, CREATE_ORDER_FAIL));
  }
};

// My Orders
export const myOrders = () => async (dispatch) => {
  try {
    dispatch({ type: MY_ORDERS_REQUEST });

    const { data } = await axiosInstance.get("/api/auth/v1/orders/me");

    dispatch({ type: MY_ORDERS_SUCCESS, payload: data.content });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error getting orders";
    dispatch(setError(errorMessage, MY_ORDERS_FAIL));
  }
};

// Get All Orders (admin)
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ORDERS_REQUEST });

    const { data } = await axiosInstance.get("/api/v1/admin/orders");

    dispatch({ type: ALL_ORDERS_SUCCESS, payload: data.orders });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error getting orders";
    dispatch(setError(errorMessage, ALL_ORDERS_FAIL));
  }
};

// Update Order
// export const updateOrder = (id, order) => async (dispatch) => {
//   try {
//     dispatch({ type: UPDATE_ORDER_REQUEST });

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };
//     const { data } = await axiosInstance.put(
//       `/api/v1/admin/order/${id}`,
//       order,
//       config
//     );

//     dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data.success });
//   } catch (error) {
//     dispatch({
//       type: UPDATE_ORDER_FAIL,
//       payload: error.response.data.message,
//     });
//   }
// };

// Delete Order
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ORDER_REQUEST });

    const { data } = await axiosInstance.delete(
      `/api/auth/v1/order/${id}/cancel`
    );

    dispatch({ type: DELETE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error deleting order";
    dispatch(setError(errorMessage, DELETE_ORDER_FAIL));
  }
};

// Get Order Details
export const getOrderDetails = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { data } = await axiosInstance.get(`/api/auth/v1/order/${orderId}`);
    console.log(data);
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error getting order";
    dispatch(setError(errorMessage, ORDER_DETAILS_FAIL));
  }
};

export const clearOrderState  = () => ({
  type: CLEAR_ORDER_STATE,
});
// // Clearing Errors
// export const clearErrors = () => async (dispatch) => {
//   dispatch({ type: CLEAR_ERRORS });
// };
