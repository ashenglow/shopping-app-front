import "./Products.css";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import { useAlert } from "react-alert";
import Typography from "@mui/material/Typography";
import MetaData from "../layout/MetaData";
import React, { Fragment, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProduct } from "../../actions/productAction";
import { clearError } from "../../actions/errorAction";
const categories = ["TAKJU", "YAKJU", "SOJU", "BEER", "WINE"];

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

const Products = ({ match }) => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const [currentPage, setCurrentPage] = useState(0);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");
  const { message: errorMessage, type: errorType } = useSelector(
    (state) => state.error
  );
  const [ratings, setRatings] = useState(0);

  const {
    products,
    loading,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const keyword = "";

  const setCurrentPageNo = (e) => {
    setCurrentPage(e - 1);
  };

  const debouncedPriceHandler = useCallback(
    debounce((event, newPrice) => {
      setPrice(newPrice);
    }, 300),
    []
  );

  const priceHandler = (event, newPrice) => {
    debouncedPriceHandler(event, newPrice);
  };
  // let count = filteredProductsCount;
  useEffect(() => {
    if (errorMessage) {
      alert.error(errorMessage);
      dispatch(clearError());
    }
  }, [dispatch, errorMessage, alert]);
  useEffect(() => {
    console.log("Params:", { currentPage, price, category, ratings });
    // Log the parameters to debug
    const params = new URLSearchParams();
    params.append("page", currentPage);
    params.append("minPrice", price[0]);
    params.append("maxPrice", price[1]);
    params.append("category", category);
    params.append("ratings", ratings);
    const query = params.toString();

    dispatch(getProduct(query));
  }, [dispatch, currentPage, price, category, ratings, alert]);

  return (
    <div className="container">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- ECOMMERCE" />
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              <li className="category-link" onClick={() => setCategory("")}>
                ALL
              </li>
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          <div className="paginationBox">
            <Pagination
              activePage={currentPage + 1}
              itemsCountPerPage={resultPerPage}
              totalItemsCount={productsCount}
              onChange={setCurrentPageNo}
              nextPageText="Next"
              prevPageText="Prev"
              firstPageText="1st"
              lastPageText="Last"
              itemClass="page-item"
              linkClass="page-link"
              activeClass="pageItemActive"
              activeLinkClass="pageLinkActive"
            />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Products;
