import { SET_ERROR, CLEAR_ERROR } from "../constants/errorConstants";

export const setError = (errorMessage, errorType) => ({
  type: SET_ERROR,
  payload: {
    message: errorMessage,
    type: errorType,
  },
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});
