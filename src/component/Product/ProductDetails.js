import "./ProductDetails.css";
import React, { Fragment, useEffect, useState, useContext, useCallback } from "react";
import Carousel from "react-material-ui-carousel";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails, newReview } from "../../actions/productAction";
import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartAction";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@mui/material";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import { loadUser } from "../../actions/userAction";
import { useUserInfo } from "../../utils/userContext";
import ConfirmPopup from "../layout/ConfirmPopup/ConfirmPopup";
import { clearError } from "../../actions/errorAction";

const ProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const userInfo = useUserInfo();
  const { product, loading } = useSelector((state) => state.productDetails);
  const { success } = useSelector((state) => state.newReview);
  const { message: errorMessage, type: errorType } = useSelector(
    (state) => state.error
  );

  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  const increaseQuantity = () => {
    if (product.stockQuantity <= count) return;
    setCount(count + 1);
  };

  const decreaseQuantity = () => {
    if (1 >= count) return;
    setCount(count - 1);
  };

  const addToCartHandler = useCallback(() => {
    setIsLoadingBtn(true);
    dispatch(addItemsToCart(match.params.id, count));
    
    setShowConfirmPopup(true);
    setTimeout(() => setShowConfirmPopup(false), 2000);
    setTimeout(() => setIsLoadingBtn(false), 1000);
  }, [dispatch, match.params.id, count]);

  const submitReviewToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);


  const reviewSubmitHandler = useCallback(() => {
    const formData = {
      userId: null,
      username: "",
      rating,
      comment,
      productId: match.params.id,
    };
    dispatch(newReview(match.params.id, formData));
    setOpen(false);
  }, [dispatch, rating, comment, match.params.id]);


  useEffect(() => {
    if (errorMessage) {
      alert.error(errorMessage);
      dispatch(clearError());
    }
  }, [dispatch, errorMessage, alert]);

  //get product details
  useEffect(() => {
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id]);

  //add review
  useEffect(() => {
    if (success) {
      dispatch({ type: NEW_REVIEW_RESET });
      alert.success("Review posted successfully");
      // dispatch(getProductDetails(match.params.id));
    }
  }, [dispatch, alert, success, match.params.id]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product.id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button className="quantityBtn" onClick={decreaseQuantity}>-</button>
                   <input readOnly type="number" value={count} />
                    <button className="quantityBtn" onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    className={`submitBtn ${isLoadingBtn ? "loading" : ""}`}
                    disabled={product.stockQuantity < 1  || isLoadingBtn}
                    onClick={addToCartHandler}
                  >
                   {isLoadingBtn ? "Adding..." : "Add to Cart"}
                  </button>
                  {showConfirmPopup && <ConfirmPopup message="Added to cart" />}
                </div>

                <p>
                  Status:
                  <b
                    className={
                      product.stockQuantity < 1 ? "redColor" : "greenColor"
                    }
                  >
                    {product.stockQuantity < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitBtn">
                Submit Review
              </button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
