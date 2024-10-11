import React, { Fragment, useEffect } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { getOrderDetails } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { clearError } from "../../actions/errorAction";

const OrderDetails = () => {
  const { order, loading } = useSelector((state) => state.orderDetails);
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();
  const { message: errorMessage, type: errorType } = useSelector(
    (state) => state.error
  );
  // const orderId = parseInt(id);

  useEffect(() => {
    if (errorMessage) {
      alert.error(errorMessage);
      dispatch(clearError());
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, alert, errorMessage, id]);
  return (
    <div className="container">
      {loading ? (
        <Loader />
      ) : (
        order && (
          <Fragment>
            <MetaData title="Order Details" />
            <div className="orderDetailsPage">
              <div className="orderDetailsContainer">
                <Typography component="h1">
                  Order #{order && order.orderId}
                </Typography>
                <Typography>Shipping Info</Typography>
                <div className="orderDetailsContainerBox">
                  <div className="orderDetailsContainerBox-2">
                    <p>Name:</p>
                    <span>{order.name && order.name}</span>
                  </div>
                  {/* <div>
                  <p>Phone:</p>
                  <span>
                    {order.shippingInfo && order.shippingInfo.phoneNo}
                  </span>
                </div> */}
                  <div className="orderDetailsContainerBox-2">
                    <p>Address:</p>
                    {order.address && (
                      
                        <span>{`${order.address.city} ${order.address.street}, ${order.address.zipcode}`}</span>
                      
                    )}
                  </div>
                </div>
                <Typography>Payment</Typography>
                <div className="orderDetailsContainerBox">
                  {/* <div>
                  <p
                    className={
                      order.paymentInfo &&
                      order.paymentInfo.status === "succeeded"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {order.paymentInfo &&
                    order.paymentInfo.status === "succeeded"
                      ? "PAID"
                      : "NOT PAID"}
                  </p>
                </div> */}

                  <div className="orderDetailsContainerBox-2">
                    <p>Amount:</p>
                    <span>{order.totalPrice && order.totalPrice}</span>
                  </div>
                </div>

                <Typography>Order Status</Typography>
                <div className="orderDetailsContainerBox">
                  <div>
                    <p
                      className={
                        order.status && order.status === "Delivered"
                          ? "greenColor"
                          : "redColor"
                      }
                    >
                      {order.status && order.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="orderDetailsCartItems">
                <Typography>Order Items:</Typography>
                <div className="orderDetailsCartItemsContainer">
                  {order.orderItems &&
                    order.orderItems.map((item) => (
                      <div key={item.id}>
                        <img src={item.images[0].url} alt="Product" />
                        <Link to={`/product/${item.id}`}>{item.name}</Link>{" "}
                        <span>
                          {item.count} X ₹{item.price} ={" "}
                          <b>₹{item.price * item.count}</b>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Fragment>
        )
      )}
    </div>
  );
};

export default OrderDetails;
