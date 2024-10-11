// import React, { Fragment, useEffect, useRef, useState } from "react";
// import CheckoutSteps from "../Cart/CheckoutSteps";
// import { useSelector, useDispatch } from "react-redux";
// import MetaData from "../layout/MetaData";
// import { Typography } from "@material-ui/core";
// import { useAlert } from "react-alert";
// import {
//   CardNumberElement,
//   CardCvcElement,
//   CardExpiryElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// import axios from "axios";
// import "./payment.css";
// import CreditCardIcon from "@material-ui/icons/CreditCard";
// import EventIcon from "@material-ui/icons/Event";
// import VpnKeyIcon from "@material-ui/icons/VpnKey";
// import { createOrder } from "../../actions/orderAction";
// import { useUserInfo } from "../../utils/userContext";
// import { clearError } from "../../actions/errorAction";

// const Payment = ({ history }) => {
//   const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

//   const dispatch = useDispatch();
//   const alert = useAlert();
//   const stripe = useStripe();
//   const elements = useElements();
//   const payBtn = useRef(null);
//   const userInfo = useUserInfo();
//   const { delivery, cartItems } = useSelector((state) => state.cart);
//   const { message: errorMessage } = useSelector((state) => state.error);
//   const { error: orderError } = useSelector((state) => state.newOrder);
//   const [stripeError, setStripeError] = useState(null);
//   const paymentData = {
//     amount: Math.round(orderInfo.totalPrice * 100),
//   };

//   const order = {
//     delivery,
//     orderItems: cartItems,
//     itemsPrice: orderInfo.subtotal,
//     taxPrice: orderInfo.tax,
//     shippingPrice: orderInfo.shippingCharges,
//     totalPrice: orderInfo.totalPrice,
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     payBtn.current.disabled = true;
//     setStripeError(null);
//     try {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };
//       const { data } = await axios.post(
//         "/api/v1/payment/process",
//         paymentData,
//         config
//       );

//       const client_secret = data.client_secret;

//       if (!stripe || !elements) return;

//       const result = await stripe.confirmCardPayment(client_secret, {
//         payment_method: {
//           card: elements.getElement(CardNumberElement),
//           billing_details: {
//             name: userInfo.name,

//             address: {
//               line1: delivery.address,
//               // city: shippingInfo.city,
//               // state: shippingInfo.state,
//               // postal_code: shippingInfo.pinCode,
//               // country: shippingInfo.country,
//             },
//           },
//         },
//       });

//       if (result.error) {
//         payBtn.current.disabled = false;
//         setStripeError(result.error.message);
//       } else {
//         if (result.paymentIntent.status === "succeeded") {
//           order.paymentInfo = {
//             id: result.paymentIntent.id,
//             status: result.paymentIntent.status,
//           };

//           dispatch(createOrder(order));

//           history.push("/success");
//         } else {
//           setStripeError("There's some issue while processing payment");
//         }
//       }
//     } catch (error) {
//       payBtn.current.disabled = false;
//       setStripeError(
//         error.response?.data?.message ||
//           "An error occurred during payment processing"
//       );
//     }
//   };
//   useEffect(() => {
//     if (errorMessage) {
//       alert.error(errorMessage);
//       dispatch(clearError());
//     }
//     if (orderError) {
//       alert.error(orderError);
//       dispatch(clearError()); // Assuming you've updated orderAction to use the new error handling
//     }
//   }, [dispatch, errorMessage, orderError, alert]);

//   return (
//     <Fragment>
//       <MetaData title="Payment" />
//       <CheckoutSteps activeStep={2} />
//       <div className="paymentContainer">
//         {stripeError && <div className="stripeError">{stripeError}</div>}
//         <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
//           <Typography>Card Info</Typography>
//           <div>
//             <CreditCardIcon />
//             <CardNumberElement className="paymentInput" />
//           </div>
//           <div>
//             <EventIcon />
//             <CardExpiryElement className="paymentInput" />
//           </div>
//           <div>
//             <VpnKeyIcon />
//             <CardCvcElement className="paymentInput" />
//           </div>

//           <input
//             type="submit"
//             value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
//             ref={payBtn}
//             className="paymentFormBtn"
//           />
//         </form>
//       </div>
//     </Fragment>
//   );
// };

// export default Payment;
