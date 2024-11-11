import React, { Fragment, useEffect, useState,useCallback  } from "react";
import "./Products.css";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { Accordion, AccordionSummary, AccordionDetails, ToggleButton, ToggleButtonGroup, Box,Chip, Divider, Typography, Slider, Grid, Container, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getProduct } from "../../actions/productAction";
import { clearError } from "../../actions/errorAction";
import { useTheme } from "@mui/material/styles";
import CategoryChips from "../layout/MUI-comp/CategoryChips";
import MuiPagination from "../layout/MUI-comp/Pagination/MuiPagination";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';


const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

const priceRanges = [
  { label: "All Prices", value: "0-999999"},
  { label: "₩5,000 이하", value: "0-5000" },
  { label: "₩5,000 - ₩10,000", value: "5000-10000" },
  { label: "₩10,000 - ₩15,000", value: "10000-15000" },
  { label: "₩15,000 - ₩20,000", value: "15000-20000" },
  { label: "₩20,000 - ₩25,000", value: "20000-25000" },
  { label: "₩25,000 이상", value: "25000-999999" },
]
const ratingRanges = [
  { label: "All Ratings", value: 0 },
  { 
    label: <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {[...Array(4)].map((_, i) => (
        <StarIcon key={i} sx={{ fontSize: '16px', color: '#faaf00' }} />
      ))}
    </Box>,
    value: 4 
  },
  { 
    label: <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {[...Array(3)].map((_, i) => (
        <StarIcon key={i} sx={{ fontSize: '16px', color: '#faaf00' }} />
      ))}
    </Box>,
    value: 3 
  },
  { 
    label: <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {[...Array(2)].map((_, i) => (
        <StarIcon key={i} sx={{ fontSize: '16px', color: '#faaf00' }} />
      ))}
    </Box>,
    value: 2 
  }
]
const Products = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentPage, setCurrentPage] = useState(0);
  const [priceRange, setPriceRange] = useState("0-999999");
  const [price, setPrice] = useState([0, 999999]);
  const [category, setCategory] = useState("");
  const { message: errorMessage, type: errorType } = useSelector(
    (state) => state.error
  );
  const [ratings, setRatings] = useState(0);
  const categories = ["TAKJU", "YAKJU", "SOJU", "BEER", "WINE"];

  const handlePriceChange = (value) => {
    setPriceRange(value);
    const [min, max] = value.split('-').map(Number);
    setPrice([min, max]);
  };
  
  const handleRatingChange = (value) => {
    setRatings(value);
  };
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
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);

    const params = new URLSearchParams();
    params.append("page", currentPage);
    params.append("minPrice", minPrice);
    params.append("maxPrice", maxPrice);
    params.append("category", category);
    params.append("ratings", Number(ratings));

    const query = params.toString();

    dispatch(getProduct(query));
  }, [dispatch, currentPage, priceRange, category, ratings, alert]);

  const FilterSection = () => (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }} fontWeight="500">
          Price Range
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {priceRanges.map((range) => (
            <Chip
              key={range.value}
              label={range.label}
              onClick={() => handlePriceChange(range.value)}
              color={priceRange === range.value ? "primary" : "default"}
              variant={priceRange === range.value ? "filled" : "outlined"}
              sx={{
                borderRadius: '16px',
                '&:hover': {
                  backgroundColor: priceRange === range.value ? 
                    'primary.main' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }} fontWeight="500">
          Ratings
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {ratingRanges.map((range) => (
            <Chip
              key={range.value}
              label={range.label}
              onClick={() => handleRatingChange(range.value)}
              color={ratings === range.value ? "primary" : "default"}
              variant={ratings === range.value ? "filled" : "outlined"}
              sx={{
                borderRadius: '16px',
                '&:hover': {
                  backgroundColor: ratings === range.value ? 
                    'primary.main' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            />
          ))}
        </Box>
      </Box>
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
