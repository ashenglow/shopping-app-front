import React, { Fragment, Suspense, useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { clearError } from "../../actions/errorAction";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, products } = useSelector((state) => state.products);
  const { message: errorMessage, type: errorType } = useSelector(
    (state) => state.error
  );
  useEffect(() => {
    if (errorMessage) {
      alert.error(errorMessage);
      dispatch(clearError());
    }  
  }, [dispatch, errorMessage, alert]);

  useEffect(() => {
    const params = new URLSearchParams({
      page: 0,
      minPrice: 0,
      maxPrice: 25000,
      category: "",
      ratings: 0,
    });
    const query = params.toString();
    dispatch(getProduct(query));
  }, [dispatch]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Soolé STORE" description="Welcome to Soolé STORE" />
          <div className="home-wrapper">
            <div className="banner">
              <p>Welcome to Soolé STORE</p>
              <h1>FIND AMAZING PRODUCTS BELOW</h1>

              <a href="#container">
                <button>Scroll</button>
              </a>
            </div>
            <div className="home-content" id="container">
              <h2 className="homeHeading">Featured Products</h2>

              <div className="products-container">
                {products &&
                  products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
