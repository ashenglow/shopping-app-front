import React, { Fragment, useEffect, useState,useCallback  } from "react";
import "./Products.css";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { Box, Typography, Slider, Grid, Container, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getProduct } from "../../actions/productAction";
import { clearError } from "../../actions/errorAction";
import { useTheme } from "@mui/material/styles";
import CategoryChips from "../layout/MUI-comp/CategoryChips";
import MuiPagination from "../layout/MUI-comp/Pagination/MuiPagination";

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
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentPage, setCurrentPage] = useState(0);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");
  const { message: errorMessage, type: errorType } = useSelector(
    (state) => state.error
  );
  const [ratings, setRatings] = useState(0);
  const categories = ["TAKJU", "YAKJU", "SOJU", "BEER", "WINE"];


  const {
    products,
    loading,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const totalPages = Math.ceil(productsCount / resultPerPage);

  const keyword = "";

  const setCurrentPageNo = (e, page) => {
    setCurrentPage(page - 1);
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

  const FilterSection = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Price
      </Typography>
      <Slider
        value={price}
        onChange={priceHandler}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        min={0}
        max={25000}
      />
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Ratings
      </Typography>
      <Slider
        value={ratings}
        onChange={(event, newRating) => setRatings(newRating)}
        aria-labelledby="continuous-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={0}
        max={5}
      />
    </Box>
  );

  return (
    <div className="container">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- ECOMMERCE" />
          <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Products
          </Typography>
          <Grid container spacing={4}>
            {!isMobile && (
              <Grid item xs={12} md={3}>
                <FilterSection />
              </Grid>
            )}
            <Grid item xs={12} md={isMobile ? 12 : 9}>
              <Box sx={{ mb: 4 }}>
                <CategoryChips
                  categories={categories}
                  selectedCategory={category}
                  onSelectCategory={setCategory}
                />
              </Box>
              {isMobile && <FilterSection />}
              {loading ? (
                <Loader />
              ) : (
                <Fragment>
                  <Grid container spacing={2} justifyContent={isMobile ? "center" : "flex-start"}>
                    {products &&
                      products.map((product) => (
                        <Grid item xs={12} sm={isMobile ? 12 : 6} md={4} lg={3} key={product.id}>
                          <ProductCard product={product} />
                        </Grid>
                      ))}
                  </Grid>
                </Fragment>
              )}
              {resultPerPage < filteredProductsCount && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <MuiPagination
                    count={totalPages}
                    page={currentPage + 1}
                    onChange={setCurrentPageNo}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
        </Fragment>
      )}
    </div>
  );
};

export default Products;
