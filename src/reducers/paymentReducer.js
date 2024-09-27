import {
  KAKAOPAYMENT_READY_REQUEST,
  KAKAOPAYMENT_READY_SUCCESS,
  KAKAOPAYMENT_READY_FAILURE,
  KAKAOPAYMENT_APPROVE_REQUEST,
  KAKAOPAYMENT_APPROVE_SUCCESS,
  KAKAOPAYMENT_APPROVE_FAILURE,
  CLEAR_PAYMENT_STATE,
} from "../constants/paymentConstants";

const initialState = {
  loading: false,
  error: null,
  paymentUrls: null,
  tid: null,
  paymentResult: null,
  orderId: null,
};

export const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case KAKAOPAYMENT_READY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case KAKAOPAYMENT_READY_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentUrls: action.payload.paymentUrls,
        tid: action.payload.tid,
      };
    case KAKAOPAYMENT_READY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case KAKAOPAYMENT_APPROVE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case KAKAOPAYMENT_APPROVE_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentResult: action.payload,
        orderId: action.payload.orderId,
      };
    case KAKAOPAYMENT_APPROVE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_PAYMENT_STATE:
      return initialState;
    default:
      return state;
  }
};
