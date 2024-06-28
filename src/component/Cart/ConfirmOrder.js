import React, { Fragment, useEffect } from "react";
import "./ConfirmOrder.css";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { UserContext } from "../../utils/userContext";
import { useUserInfo } from "../../utils/userContext";
import { createOrder } from "../../actions/orderAction";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";

const ConfirmOrder = ({ history, location }) => {
  const { isUpdated, orderId } = useSelector((state) => state.newOrder);
  const dispatch = useDispatch();
  const alert = useAlert();
  const userInfo = useUserInfo();
  const { selectedItems } = location.state || {};
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.count * item.price,
    0
  );

  // const shippingCharges = subtotal > 1000 ? 0 : 200;

  // const tax = subtotal * 0.18;

  const totalPrice = subtotal;

  // const address = `${delivery.address}`;

  const proceedToPayment = () => {
    const data = selectedItems.map((item) => ({
      itemId: item.itemId,
      count: item.count,
      price: item.price,
    }));
    dispatch(createOrder(userInfo.id, data));
  };

  useEffect(() => {
    if (isUpdated === true) {
      alert.success("Order created successfully");
      history.push(`/order/${orderId}`);
    }
  }, [isUpdated, history, orderId, alert]);
  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{userInfo.name}</span>
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
                    <Link to={`/product/${item.itemId}`}>{item.name}</Link>{" "}
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

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
