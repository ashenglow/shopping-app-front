import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";

const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  return (
    <Link className="productCard" to={`/product/${product.id}`}>
      <div className="productCard__imageContainer">
        <img
          className="productCard__image"
          src={product.images[0].url}
          alt={product.name}
        />
      </div>
      <div className="productCard__content">
        <h3 className="productCard__name">{product.name}</h3>
        <span className="productCard__price">₹{product.price}</span>
        <div className="productCard__rating">
          <Rating {...options} />{" "}
          <span className="productCardSpan">
            ({product.numOfReviews} Reviews)
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
