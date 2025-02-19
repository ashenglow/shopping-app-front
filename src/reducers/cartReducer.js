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
const initialState = {
  cartItems: [],
  selectedItems: [], // Added for checkout process
  shippingAddress: null,
  loading: false,
  error: null,
  updatingItems: {}
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
        // ...state,
        // cartItems: state.cartItems.map((i) =>
        //   i.id === action.payload ? {} : i
        // ),
        // loading: false,
        ...state,
        cartItems: state.cartItems.filter((i) => !action.payload.includes(i.id)),
        loading: false,
      };
    case REMOVE_CART_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_CART_ITEM_OPTIMISTIC:
      //action.payload is updatedItem from frontend
      return {
        ...state,
        cartItems: state.cartItems.map((i) =>
          i.id === action.payload.id
            ? { ...i, count: action.payload.newCount }
            : i
        ),
        updatingItems: {
          ...state.updatingItems,
          [action.payload.id]: true,
        },
      };

    case UPDATE_CART_ITEM_SUCCESS:
      console.log("UPDATE_CART_ITEM_SUCCESS", action.payload);
      //action.payload is updatedItemId from backend
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id
            ? { ...item, count: action.payload.newCount }
            : item
        ),
        updatingItems: {
          ...state.updatingItems,
          [action.payload.id]: false,
        },
      };

    case UPDATE_CART_ITEM_FAILURE:
      console.log("UPDATE_CART_ITEM_FAILURE", action.payload);
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id ? { ...item, count: item.count } : item
        ),
        updatingItems: {
          ...state.updatingItems,
          [action.payload.id]: false, // Make sure this is set to false
        },
        error: action.payload.error,
      };
    
   
      case CLEAR_CART_REQUEST:
        return {
          ...state,
          loading: true
        };
      case CLEAR_CART_SUCCESS:
        return {
          ...initialState
        };
      case CLEAR_CART_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      case SELECT_ALL_CART_ITEMS:
        return {
          ...state,
          selectedItems: state.cartItems.map(item => item.id),
        };
      case UNSELECT_ALL_CART_ITEMS:
        return {
          ...state,
          selectedItems: [],
        };  
    default:
      return state;
      
  }
};
