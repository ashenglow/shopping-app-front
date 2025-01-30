import { axiosInstance } from "../utils/axiosInstance";
import { INIT_CHECKOUT_REQUEST, INIT_CHECKOUT_SUCCESS, INIT_CHECKOUT_FAILURE, SET_SHIPPING_ADDRESS_REQUEST, SET_SHIPPING_ADDRESS_SUCCESS, SET_SHIPPING_ADDRESS_FAILURE, SET_CHECKOUT_STEP, RESET_CHECKOUT } from "../constants/checkoutConstants";
import { setError } from "./errorAction";
import history from "../utils/history";
export const initiateCheckout = (selectedItemsData) => async (dispatch) => {
    try{
        dispatch({
            type: INIT_CHECKOUT_REQUEST
        })
        
     
        dispatch({
            type: INIT_CHECKOUT_SUCCESS,
            payload: selectedItemsData
        })
        dispatch({
            type: SET_CHECKOUT_STEP,
            payload: 0
        })

   
    }catch(error){
        dispatch({
            type: INIT_CHECKOUT_FAILURE,
            payload: error.response?.data?.message || "Failed to initiate checkout"
        })
    }
}

export const setShippingAddress = (address) => async (dispatch) => {
    try{
        dispatch({
            type: SET_SHIPPING_ADDRESS_REQUEST
        })
        dispatch({
            type: SET_SHIPPING_ADDRESS_SUCCESS,
            payload: address
        })
        dispatch({
            type: SET_CHECKOUT_STEP,
            payload: 1
        })
        
    }catch(error){
        dispatch({
            type: SET_SHIPPING_ADDRESS_FAILURE,
            payload: error.response?.data?.message || "Failed to save shipping address"
        })
    }
}
    export const resetCheckout = () => ({
        type: RESET_CHECKOUT
    })

