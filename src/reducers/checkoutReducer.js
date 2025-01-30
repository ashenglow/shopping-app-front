import { INIT_CHECKOUT_REQUEST, INIT_CHECKOUT_SUCCESS, INIT_CHECKOUT_FAILURE, SET_SHIPPING_ADDRESS_REQUEST, SET_SHIPPING_ADDRESS_SUCCESS, SET_SHIPPING_ADDRESS_FAILURE, SET_CHECKOUT_STEP, RESET_CHECKOUT } from "../constants/checkoutConstants";

const initialState = {
    currentStep: 0,
    selectedItems: [],
    shippingAddress: null,
    loading: false,
    error: null,
}

export const checkoutReducer = (state = initialState, action) => {
    switch (action.type) {
      case INIT_CHECKOUT_REQUEST:
      case SET_SHIPPING_ADDRESS_REQUEST:
        return {
            ...state,
            loading: true,
        };
      
      case INIT_CHECKOUT_SUCCESS:
        return {
            ...state,
            loading: false,
            selectedItems: action.payload,
        }  
       case SET_SHIPPING_ADDRESS_SUCCESS:
        return {
            ...state,
            loading: false,
            shippingAddress: action.payload,
        }
       
        case INIT_CHECKOUT_FAILURE:
        case SET_SHIPPING_ADDRESS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }    

        case SET_CHECKOUT_STEP:
          return {
            ...state,
            currentStep: action.payload
          }

        case RESET_CHECKOUT:
            return initialState;

        default:
            return state;  
          
    }
  };  