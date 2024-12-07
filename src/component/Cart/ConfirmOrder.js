import React, { Fragment, useEffect, useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./ConfirmOrder.css";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
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

const ConfirmOrder = () => {
  const { loading: orderLoading, error: orderError,isUpdated, orderId } = useSelector((state) => state.newOrder);
  const { loading: paymentLoading, error: paymentError, paymentUrls, paymentResult } = useSelector(
    (state) => state.payment
  );
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const location = useLocation();
  const { selectedItems} = location.state || {};
  const orderItems = selectedItems.map((item) => ({
    itemId: item.itemId,
    count: item.count,
    price: item.price,
  }));
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [isOrderCreated, setIsOrderCreated] = useState(false);
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.count * item.price,
    0
  );

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
          ? `${selectedItems[0].itemName}외 ${selectedItems.length - 1}건`
          : selectedItems[0].itemName,
      quantity: selectedItems.reduce((acc, item) => acc + item.count, 0),
      totalAmount: selectedItems.reduce(
        (acc, item) => acc + item.price * item.count,
        0
      ),
    };
    dispatch(initiatePayment(paymentInfo));
    setIsPaymentInitiated(true);
    setShowPaymentPopup(true);
  }, [dispatch, selectedItems, isPaymentInitiated]);

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
    if (paymentResult ) {
      const orderItems = selectedItems.map((item) => ({
        itemId: item.itemId,
        count: item.count,
        price: item.price,
      }));
      dispatch(createOrder(orderItems));

    }
  }, [paymentResult, dispatch, selectedItems ]);

  useEffect(() => {
    if (isUpdated && orderId) {
      alert.success("Order created successfully");
      setShowPaymentPopup(false);
      dispatch(clearCart());
      history.push(`/order/${orderId}`);
      dispatch(clearPaymentState());
      dispatch(clearOrderState());
      localStorage.removeItem("transactionId");
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
          <div className="confirmOrderPage">
            <div>
              <div className="confirmshippingArea">
                <Typography>Shipping Info</Typography>
                <div className="confirmshippingAreaBox">
                  <div>
                    {/* <p>Name:</p>
                <span>{userInfo.name}</span> */}
                  </div>
                  {/* <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div> */}
                  {/* <div>
                <p>Address:</p>
                <span>{address}</span>
              </div> */}
                </div>
              </div>
              <div className="confirmCartItems">
                <Typography>Your Cart Items:</Typography>
                <div className="confirmCartItemsContainer">
                  {selectedItems &&
                    selectedItems.map((item) => (
                      <div key={item.itemId}>
                        <img src={item.image} alt="Product" />
                        <Link to={`/product/${item.itemId}`}>
                          {item.itemName}
                        </Link>{" "}
                        <span>
                          {item.count} X ₹{item.price} ={" "}
                          <b>₹{item.price * item.count}</b>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            {/*  */}
            <div>
              <div className="orderSummary">
                <Typography>Order Summery</Typography>
                <div>
                  <div>
                    <p>Subtotal:</p>
                    <span>₹{subtotal}</span>
                  </div>
                  {/* <div>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div> */}
                </div>

                <div className="orderSummaryTotal">
                  <p>
                    <b>Total:</b>
                  </p>
                  <span>₹{totalPrice}</span>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading || isPaymentInitiated}
                >
                  {isPaymentInitiated
                    ? "Payment Processing..."
                    : "Proceed To Payment"}
                </button>
              </div>
            </div>
          </div>
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
