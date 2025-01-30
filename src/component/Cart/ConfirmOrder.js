import React, { Fragment, useEffect, useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./ConfirmOrder.css";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import { Typography, Box, Grid, Button } from "@mui/material";
import { createOrder, clearOrderState } from "../../actions/orderAction";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader/Loader";
import { v4 as uuidv4 } from "uuid";
import {
  initiatePayment,
  approvePayment,
  clearPaymentState,
} from "../../actions/paymentAction";
import PaymentPopup from "../layout/PaymentPopup/PaymentPopup";
import { clearCart } from "../../actions/cartAction";
import { resetCheckout } from "../../actions/checkoutAction";

const ConfirmOrder = () => {
  const { selectedItems, shippingAddress } = useSelector((state) => state.checkout);
  const { loading: orderLoading, error: orderError,isUpdated, orderId } = useSelector((state) => state.newOrder);
  const { loading: paymentLoading, error: paymentError, paymentUrls, paymentResult } = useSelector(
    (state) => state.payment
  );

  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);

  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.count * item.price,
    0
  );
useEffect(() => {
    if (!selectedItems?.length) {
      history.push("/cart");
    }
    if(!shippingAddress){
      history.push("/shipping")
    }
  }, [selectedItems, shippingAddress, history]);
  // const shippingCharges = subtotal > 1000 ? 0 : 200;

  // const tax = subtotal * 0.18;

  const totalPrice = subtotal;

  // const address = `${delivery.address}`;

  const handlePayment = useCallback(() => {
    if (isPaymentInitiated) return;

    const transactionId = uuidv4();
    localStorage.setItem("transactionId", transactionId);
    const paymentInfo = {
      transactionId,
  
      itemId:
        selectedItems.length > 1
          ? selectedItems.map((item) => item.itemId)
          : selectedItems[0].itemId,
      itemName:
        selectedItems.length > 1
          ? `${selectedItems[0].name}외 ${selectedItems.length - 1}건`
          : selectedItems[0].name,
      quantity: selectedItems.reduce((acc, item) => acc + item.count, 0),
      totalAmount: subtotal,
    };
    dispatch(initiatePayment(paymentInfo));
    setIsPaymentInitiated(true);
    setShowPaymentPopup(true);
  }, [dispatch, selectedItems, subtotal,isPaymentInitiated]);

  const handlePaymentApproval = useCallback(
    (approvalUrl) => {
      const url = new URL(approvalUrl);
      const pgToken = url.searchParams.get("pg_token");
      const partnerOrderId = url.searchParams.get("partner_order_id");
      if (pgToken) {
        dispatch(
          approvePayment({
            transactionId: partnerOrderId,
      
            pgToken,
          })
        );
      } else {
        alert.error("Payment approval failed. Missing required parameters.");
      }
    },
    [dispatch,  alert]
  );



  useEffect(() => {
    if ( paymentResult ) {
      const orderData = {
        orderItems: selectedItems,
        shippingAddress,
      }
      dispatch(createOrder(orderData));
      } 
  }, [paymentResult, dispatch, selectedItems, shippingAddress]); 

  useEffect(() => {
    if (isUpdated && orderId) {
      alert.success("Order created successfully");
      setShowPaymentPopup(false);
      dispatch(resetCheckout());
      dispatch(clearCart());
      dispatch(clearPaymentState());
      dispatch(clearOrderState());
      localStorage.removeItem("transactionId");
      history.push(`/order/${orderId}`);
    }
  }, [isUpdated, history, orderId, alert, dispatch]);

  useEffect(() => {
    if (paymentError || orderError) {
      alert.error(paymentError || orderError);
      setIsPaymentInitiated(false);
      setShowPaymentPopup(false);
      dispatch(clearPaymentState());
      dispatch(clearOrderState());
    }
 
  }, [paymentError, orderError, alert, dispatch]);


  const loading = paymentLoading || orderLoading;

  return (
    <div className="container">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Confirm Order" />
          <CheckoutSteps activeStep={1} />
          <Box maxWidth="lg" mx="auto" p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* Shipping Details */}
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Box mb={3}>
              <Typography>
                {shippingAddress.baseAddress}
                {shippingAddress.detailAddress && `, ${shippingAddress.detailAddress}`}
              </Typography>
              <Typography>
                Zipcode: {shippingAddress.zipcode}
              </Typography>
            </Box>

            {/* Order Items */}
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            {selectedItems.map((item) => (
              <Box key={item.id} mb={2} display="flex" alignItems="center">
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.name} 
                  style={{ width: 50, marginRight: 16 }}
                />
                <Box flex={1}>
                  <Typography>{item.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.count} x ₩{item.price} = ₩{item.count * item.price}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Box border={1} borderColor="grey.300" p={2}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Subtotal:</Typography>
                <Typography>₩{subtotal}</Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePayment}
                disabled={loading || isPaymentInitiated}
              >
                {isPaymentInitiated ? "Processing..." : "Proceed to Payment"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
          {showPaymentPopup && (
            <PaymentPopup
              paymentUrls={paymentUrls}
              onApproval={handlePaymentApproval}
              onClose={() => {
                setShowPaymentPopup(false);
              }}
              showPaymentPopup={showPaymentPopup}
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default ConfirmOrder;
