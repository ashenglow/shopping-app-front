import { SET_ERROR, CLEAR_ERROR } from "../constants/errorConstants";

const initialState = {
  message: null,
  type: null,
};

export const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        message: action.payload.message,
        type: action.payload.type,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        message: null,
        type: null,
      };
    default:
      return state;
  }
};
