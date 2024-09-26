import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import {
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ADMIN_PRODUCT_REQUEST,
  ADMIN_PRODUCT_SUCCESS,
  ADMIN_PRODUCT_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  ALL_REVIEW_REQUEST,
  ALL_REVIEW_SUCCESS,
  ALL_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
  // SET_INITIAL_PRODUCTS,
} from "../constants/productConstants";
import { setError } from "./errorAction";
import { updatePagination } from "../component/layout/MUI-comp/Pagination/paginationSlice";

let cachedProducts = {};
// Get All Products
export const getProduct = (query) => async (dispatch) => {

if( cachedProducts[query] ){
  dispatch({
    type: ALL_PRODUCT_SUCCESS,
    payload: cachedProducts[query],
  });
  return;
}
  try {
    dispatch({ type: ALL_PRODUCT_REQUEST });
    const baseURL = process.env.REACT_APP_API_URL;
    const config = {
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    };

    
    let url = `/api/public/v1/products${query ? `?${query}` : ''}`;

    const fullUrl = `${baseURL}${url}`;
    const { data } = await axios.get(fullUrl, config);

    dispatch({
      type: ALL_PRODUCT_SUCCESS,
      payload: data,
    });

    dispatch(updatePagination({
      currentPage: data.number,
      totalPages: data.totalPages,
      pageSize: data.size,
      totalItems: data.totalElements,
    }))
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error getting products";
    dispatch(setError(errorMessage, ALL_PRODUCT_FAIL));
  }
};

// export const fetchProduct =
//   (currentPage = 0, price = [0, 25000], category, ratings = 0) =>
//   async (dispatch) => {
//     try {
//       dispatch({ type: ALL_PRODUCT_REQUEST });
//       const config = {
//         baseURL: "http://localhost:8080",
//       };

//       let link = `/public/v1/products`;

//       if (category) {
//         link = `/public/v1/products?&page=${currentPage}&category=${category}&ratings=${ratings}`;
//       }

//       const { data } = await axios.get(link);

//       dispatch({
//         type: ALL_PRODUCT_SUCCESS,
//         payload: data.data,
//       });
//     } catch (error) {
//       dispatch({
//         type: ALL_PRODUCT_FAIL,
//         payload: error.response.data.message,
//       });
//     }
//   };

// Get All Products For Admin
// export const getAdminProduct = () => async (dispatch) => {
//   try {
//     dispatch({ type: ADMIN_PRODUCT_REQUEST });

//     const { data } = await axiosInstance.get("/api/v1/admin/products");

//     dispatch({
//       type: ADMIN_PRODUCT_SUCCESS,
//       payload: data.data,
//     });
//   } catch (error) {
//     dispatch({
//       type: ADMIN_PRODUCT_FAIL,
//       payload: error.response.data.message,
//     });
//   }
// };

// Create Product
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PRODUCT_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axiosInstance.post(
      `/api/admin/v1/product/new`,
      productData,
      config
    );

    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error creating product";
    dispatch(setError(errorMessage, NEW_PRODUCT_FAIL));
  }
};

// Update Product
// export const updateProduct = (id, productData) => async (dispatch) => {
//   try {
//     dispatch({ type: UPDATE_PRODUCT_REQUEST });

//     const config = {
//       headers: { "Content-Type": "application/json" },
//     };

//     const { data } = await axiosInstance.put(
//       `/api/v1/admin/product/${id}`,
//       productData,
//       config
//     );

//     dispatch({
//       type: UPDATE_PRODUCT_SUCCESS,
//       payload: data.success,
//     });
//   } catch (error) {
//     dispatch({
//       type: UPDATE_PRODUCT_FAIL,
//       payload: error.response.data.message,
//     });
//   }
// };

// Delete Product
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    const { data } = await axiosInstance.delete(
      `/api/v1/admin/product/${id}/delete`
    );

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error deleting product";
    dispatch(setError(errorMessage, DELETE_PRODUCT_FAIL));
  }
};

// Get Products Details
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const baseURL = process.env.REACT_APP_API_URL;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let url = `/api/public/v1/product/${id}`;
    const fullUrl = `${baseURL}${url}`;

    const { data } = await axios.get(fullUrl);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error getting product details";
    dispatch(setError(errorMessage, PRODUCT_DETAILS_FAIL));
  }
};

// NEW REVIEW
export const newReview = (id, reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axiosInstance.put(
      `/api/auth/v1/product/${id}/review`,
      reviewData,
      config
    );

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error creating review";
    dispatch(setError(errorMessage, NEW_REVIEW_FAIL));
  }
};

// Get All Reviews of a Product
export const getAllReviews = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_REVIEW_REQUEST });

    const { data } = await axiosInstance.get(`/api/public/v1/reviews?id=${id}`);

    dispatch({
      type: ALL_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error getting reviews";
    dispatch(setError(errorMessage, ALL_REVIEW_FAIL));
  }
};

// Delete Review of a Product
export const deleteReviews = (reviewId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    const { data } = await axiosInstance.delete(
      `/api/auth/v1/review/delete?id=${reviewId}`
    );

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Error deleting review";
    dispatch(setError(errorMessage, DELETE_REVIEW_FAIL));
  }
};

// Clearing Errors
// export const clearErrors = () => async (dispatch) => {
//   dispatch({ type: CLEAR_ERRORS });
// };
