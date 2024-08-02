import React, { Fragment, Suspense, useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { clearError } from "../../actions/errorActions";

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
    const params = new URLSearchParams();
    params.append("page", 0);
    params.append("minPrice", 0);
    params.append("maxPrice", 25000);
    params.append("category", "");
    params.append("ratings", 0);
    const query = params.toString();

    dispatch(getProduct(query));
  }, [dispatch, errorMessage, alert]);
  // useEffect(() => {
  //   if (error) {
  //     alert.error(error);
  //     dispatch(clearErrors());
  //   }

  //   dispatch(getProduct());
  //   console.log(products);
  // }, [dispatch, alert, error]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="ECOMMERCE" />

          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>Scroll</button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
