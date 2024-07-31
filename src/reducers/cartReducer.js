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
} from "../constants/cartConstants";
const initialState = {
  cartItems: [],
  delivery: {},
  updatingItems: {},
  loading: false,
};
export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ADD_TO_CART_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case ADD_TO_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_CART_ITEMS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_CART_ITEMS_SUCCESS:
      return {
        ...state,
        cartItems: action.payload,
        loading: false,
      };

    case GET_CART_ITEMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case REMOVE_CART_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case REMOVE_CART_ITEM_SUCCESS:
      return {
        ...state,
        cartItems: state.cartItems.map((i) =>
          i.id === action.payload ? {} : i
        ),
        loading: false,
      };
    case REMOVE_CART_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SAVE_SHIPPING_INFO_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SAVE_SHIPPING_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        delivery: action.payload,
      };

    case SAVE_SHIPPING_INFO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_CART_ITEM_OPTIMISTIC:
      //action.payload is updatedItem from frontend
      const updatedCartItems = state.cartItems.map((i) =>
        i.id === action.payload.id ? action.payload.updatingItem : i
      );
      return {
        ...state,
        cartItems: updatedCartItems,
        updatingItems: {
          ...state.updatingItems,
          [action.payload.id]: true,
        },
      };

    case UPDATE_CART_ITEM_SUCCESS:
      //action.payload is updatedItemId from backend
      return {
        ...state,
        updatingItems: {
          ...state.updatingItems,
          [action.payload]: false,
        },
      };

    case UPDATE_CART_ITEM_FAILURE:
      const failedItemId = action.payload;
      const prevCartItems = state.cartItems.filter(
        (i) => i.id !== failedItemId
      );
      const failedItem = state.cartItems.find((i) => i.id === failedItemId);

      return {
        ...state,
        cartItems: [...prevCartItems, failedItem],
        updatingItems: {
          ...state.updatingItems,
          [failedItemId]: failedItem,
        },
      };

    default:
      return state;
  }
};
