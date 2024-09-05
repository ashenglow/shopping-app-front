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
  if (!item) {
    console.error("Item is undefined in CartItemCard");
    return null; // or return a placeholder component
  }
  const imageUrl =
    item.images && item.images.length > 0
      ? item.images[0].url
      : "https://placehold.co/600x400?text=Image\nNot+Available";
  return (
    <div className="container">
      <div className="CartItemCard">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
        <img src={imageUrl} alt={item.name || "Product"} />
        <div>
          <Link to={`/product/${item.id}`}>{item.name}</Link>
          <span>{`Price: ₹${item.price}`}</span>
          <p onClick={() => deleteCartItems(item.id)}>Remove</p>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
