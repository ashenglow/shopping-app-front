import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";

const CartItemCard = ({
  item,
  deleteCartItems,
  isUpdating,
  isSelected,
  onSelect,
}) => {
  return (
    <div className="CartItemCard">
      <input type="checkbox" checked={isSelected} onChange={onSelect} />
      <img src={item.images[0].url} alt="ssa" />
      <div>
        <Link to={`/product/${item.id}`}>{item.name}</Link>
        <span>{`Price: ₹${item.price}`}</span>
        <p onClick={() => deleteCartItems(item.id)}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;
