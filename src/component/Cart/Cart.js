import "./Cart.css";
import React, { Fragment, useEffect, useState } from "react";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import {
  getCartItems,
  removeItemsFromCart,
  updateCartItem,
} from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
import { useUserInfo } from "../../utils/userContext";
import Loader from "../layout/Loader/Loader";
import { clearError } from "../../actions/errorAction";
const Cart = ({ history }) => {
  const dispatch = useDispatch();
  const userInfo = useUserInfo();
  const { message: errorMessage, type: errorType } = useSelector(
    (state) => state.error
  );
  const {
    cartItems,
    updatingItems = {},
    loading,
  } = useSelector((state) => state.cart);
  const [selectedItems, setSelectedItems] = useState([]);
  const isItemUpdating = (itemId) => {
    return updatingItems && updatingItems[itemId] === true;
  };

  const increaseQuantity = (itemId, count) => {
    if (isItemUpdating(itemId)) return;
    const updatedItem = cartItems.find((item) => item.id === itemId);
    if (!updatedItem) {
      console.error(`Item with id ${itemId} not found`);
      return;
    }
    const newQty = count + 1;

    dispatch(updateCartItem(itemId, updatedItem, newQty));
  };

  const decreaseQuantity = (itemId, count) => {
    if (isItemUpdating(itemId)) return;
    const newQty = count - 1;
    if (newQty < 1) {
      return;
    }
    const updatedItem = cartItems.find((item) => item.id === itemId);
    if (!updatedItem) {
      console.error(`Item with id ${itemId} not found`);
      return;
    }

    dispatch(updateCartItem(itemId, updatedItem, newQty));
  };

  const deleteCartItems = (itemId) => {
    dispatch(removeItemsFromCart(itemId));
  };

  const checkoutHandler = () => {
    if (selectedItems.length === 0) {
      return;
    }
    const selectedItemsData = selectedItems.map((item) => ({
      itemId: item.id,
      itemName: item.name,
      count: item.count,
      stockQuantity: item.stockQuantity,
      image: item.images[0].url,
      price: item.price,
    }));
    history.push({
      pathname: "/order/confirm",
      state: { selectedItems: selectedItemsData, userId: userInfo.id },
    });
  };

  const handleItemSelection = (item) => {
    const isSelected = selectedItems.some(
      (selectedItem) => selectedItem.id === item.id
    );
    if (isSelected) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  useEffect(() => {
    dispatch(getCartItems(userInfo.id));
  }, [dispatch, userInfo.id]);

  useEffect(() => {
    console.log("updatingItems:", updatingItems);
  }, [updatingItems]);

  useEffect(() => {
    if (errorMessage) {
      alert.error(errorMessage);
      dispatch(clearError());
    }
  }, [dispatch, errorMessage, alert]);

  return (
    <div className="container">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {cartItems.length === 0 ? (
            <div className="emptyCart">
              <RemoveShoppingCartIcon />

              <Typography>No Product in Your Cart</Typography>
              <Link to="/products">View Products</Link>
            </div>
          ) : (
            <Fragment>
              <div className="cartPage">
                <div className="cartHeader">
                  <p>Product</p>
                  <p>Quantity</p>
                  <p>Subtotal</p>
                </div>

                {cartItems && cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div className="cartContainer" key={item.id}>
                      <CartItemCard
                        item={item}
                        deleteCartItems={deleteCartItems}
                        isUpdating={
                          updatingItems ? updatingItems[item.id] : false
                        }
                        isSelected={selectedItems.some(
                          (selectedItem) => selectedItem.id === item.id
                        )}
                        onSelect={() => handleItemSelection(item)}
                      />
                      <div className="cartInput">
                        <button
                          disabled={item.count <= 1 || isItemUpdating(item.id)}
                          onClick={() => decreaseQuantity(item.id, item.count)}
                        >
                          -
                        </button>
                        <input type="number" value={item.count} readOnly />
                        <button
                          disabled={
                            item.count >= item.stockQuantity ||
                            isItemUpdating(item.id)
                          }
                          onClick={() => increaseQuantity(item.id, item.count)}
                        >
                          +
                        </button>
                      </div>
                      <p className="cartSubtotal">{`₹${
                        item.price * item.count
                      }`}</p>
                    </div>
                  ))
                ) : (
                  <p>Your cart is empty</p>
                )}

                <div className="cartGrossProfit">
                  <div></div>
                  <div className="cartGrossProfitBox">
                    <p>Gross Total</p>
                    <p>{`₹${cartItems.reduce(
                      (acc, item) => acc + item.count * item.price,
                      0
                    )}`}</p>
                  </div>
                  <div></div>
                  <div className="checkOutBtn">
                    <button onClick={checkoutHandler}>Check Out</button>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Cart;
