import {
  KAKAOPAYMENT_READY_REQUEST,
  KAKAOPAYMENT_READY_SUCCESS,
  KAKAOPAYMENT_READY_FAILURE,
  KAKAOPAYMENT_APPROVE_REQUEST,
  KAKAOPAYMENT_APPROVE_SUCCESS,
  KAKAOPAYMENT_APPROVE_FAILURE,
  CLEAR_PAYMENT_STATE,
} from "../constants/paymentConstants";
import axiosInstance from "../utils/axiosInstance";
const transformKakaopayUrls = (kakaopayResponse) => {
  return {
    pc: kakaopayResponse.next_redirect_pc_url,
    mobile: kakaopayResponse.next_redirect_mobile_url,
    app: kakaopayResponse.next_redirect_app_url,
    default: kakaopayResponse.next_redirect_pc_url, // Using PC URL as default
    androidAppScheme: kakaopayResponse.android_app_scheme,
    iosAppScheme: kakaopayResponse.ios_app_scheme
  };
};
export const initiatePayment = (paymentInfo) => async (dispatch) => {
  try {
    dispatch({ type: KAKAOPAYMENT_READY_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axiosInstance.post(
      `/api/auth/v1/payment/ready?partner_order_id=${paymentInfo.transactionId}`,
      paymentInfo,
      config
    );
    const paymentUrls = transformKakaopayUrls(data);
    dispatch({
      type: KAKAOPAYMENT_READY_SUCCESS,
      payload: {
        tid: data.tid,
        paymentUrls: paymentUrls,
      }
    });
    // open kakao pay window
  } catch (error) {
    dispatch({
      type: KAKAOPAYMENT_READY_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const approvePayment = (paymentInfo) => async (dispatch) => {
  try {
    dispatch({ type: KAKAOPAYMENT_APPROVE_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axiosInstance.post(
      "/api/auth/v1/payment/approve?partner_order_id=" +
        paymentInfo.transactionId +
        "&pg_token=" +
        paymentInfo.pgToken,
      paymentInfo,
      config
    );
    dispatch({ type: KAKAOPAYMENT_APPROVE_SUCCESS, payload: data });

    localStorage.removeItem("transactionId");
  } catch (error) {
    dispatch({
      type: KAKAOPAYMENT_APPROVE_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const clearPaymentState = () => ({
  type: CLEAR_PAYMENT_STATE,
});
