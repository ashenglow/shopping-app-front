import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  SAVE_SHIPPING_INFO_REQUEST,
  SAVE_SHIPPING_INFO_SUCCESS,
  SAVE_SHIPPING_INFO_FAILURE,
  UPDATE_CART_ITEM_OPTIMISTIC,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  GET_CART_ITEMS_REQUEST,
  GET_CART_ITEMS_SUCCESS,
  GET_CART_ITEMS_FAILURE,
  CLEAR_CART_REQUEST,
  CLEAR_CART_SUCCESS,
  CLEAR_CART_FAILURE,
  SELECT_ALL_CART_ITEMS,
  UNSELECT_ALL_CART_ITEMS,
} from "../constants/cartConstants";
import axiosInstance from "../utils/axiosInstance";
import { setError } from "./errorAction";

// Add to Cart
export const addItemsToCart = (itemId, count) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  dispatch({ type: ADD_TO_CART_REQUEST });
  try {
    const { data } = await axiosInstance.post(
      `/api/auth/v1/cart/${itemId}`,
      count,
      config
    );
    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error adding item";
    dispatch(setError(errorMessage, ADD_TO_CART_FAILURE));
  }
};

//GET CART ITEMS
export const getCartItems = () => async (dispatch) => {
  dispatch({ type: GET_CART_ITEMS_REQUEST });
  try {
    const { data } = await axiosInstance.get('/api/auth/v1/mycart');
    dispatch({
      type: GET_CART_ITEMS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error getting item";
    dispatch(setError(errorMessage, GET_CART_ITEMS_FAILURE));
  }
};

// REMOVE FROM CART
export const removeItemsFromCart = (itemIds) => async (dispatch) => {
  dispatch({ type: REMOVE_CART_ITEM_REQUEST });
  try {
    const { data } = await axiosInstance.delete(
      '/api/auth/v1/cart',
      {data: itemIds}
    );
    dispatch({
      type: REMOVE_CART_ITEM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error removing item";
    dispatch(setError(errorMessage, REMOVE_CART_ITEM_FAILURE));
  }
};


// UPDATE CART ITEM
export const updateCartItem =
  (itemId, updatedItem, newCount) => async (dispatch) => {
    //[updatedItem.product]: updatedItem, dynamic key
    dispatch({
      type: UPDATE_CART_ITEM_OPTIMISTIC,
      payload: {
        id: itemId,
        newCount,
      },
    });
    try {
      // Send the update request to the server
      const { data } = await axiosInstance.put(
        `/api/auth/v1/cart/update/${itemId}`,
        { count: newCount },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Handle the successful response from the server
      dispatch({
        type: UPDATE_CART_ITEM_SUCCESS,
        payload: { id: itemId, newCount },
      });
    } catch (error) {
      // Handle the error response from the server
      const errorMessage =
        error.response?.data?.message || "Error updating item";
      dispatch(setError(errorMessage, UPDATE_CART_ITEM_FAILURE));
    }
  };

  export const clearCart = () => async (dispatch) => {
    dispatch({ type: CLEAR_CART_REQUEST });
    try {
      await axiosInstance.delete('/api/auth/v1/cart/clear');
      dispatch({ type: CLEAR_CART_SUCCESS });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error clearing cart";
      dispatch(setError(errorMessage, CLEAR_CART_FAILURE));
    }
  };

  export const selectAllCartItems = () => ({
    type: SELECT_ALL_CART_ITEMS
  })

  export const unselectAllCartItems = () => ({
    type: UNSELECT_ALL_CART_ITEMS
  });