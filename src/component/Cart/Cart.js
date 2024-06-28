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

const Cart = ({ history }) => {
  const dispatch = useDispatch();
  const userInfo = useUserInfo();
  const { cartItems, updatingItems, loading } = useSelector(
    (state) => state.cart
  );
  const [selectedItems, setSelectedItems] = useState([]);

  const increaseQuantity = (itemId, count) => {
    const updatedItem = cartItems.find((item) => item.id === itemId);
    const newQty = count + 1;
    const increasedItem = { ...updatedItem, quantity: newQty };

    dispatch(updateCartItem(itemId, increasedItem, newQty));
  };

  const decreaseQuantity = (itemId, count) => {
    const newQty = count - 1;
    if (newQty < 1) {
      return;
    }
    const updatedItem = cartItems.find((item) => item.id === itemId);
    const decreasedItem = { ...updatedItem, quantity: newQty };
    dispatch(updateCartItem(itemId, decreasedItem, newQty));
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
      count: item.count,
      image: item.images[0].url,
      price: item.price,
    }));
    history.push({
      pathname: "/order/confirm",
      state: { selectedItems: selectedItemsData },
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
  }, []);

  return (
    <div>
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

                {cartItems &&
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
                          disabled={
                            updatingItems ? updatingItems[item.id] : false
                          }
                          onClick={() => decreaseQuantity(item.id, item.count)}
                        >
                          -
                        </button>
                        <input type="number" value={item.count} readOnly />
                        <button
                          disabled={
                            updatingItems ? updatingItems[item.id] : false
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
                  ))}

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
