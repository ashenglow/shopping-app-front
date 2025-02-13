import React from "react";
import { Link } from "react-router-dom";
import { Rating,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box, } from "@mui/material";
  import OptimizedImage from "../../components/common/OptimizedImage";

const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  return (
    <Card
    component={Link}
    to={`/product/${product.id}`}
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      textDecoration: "none",
      "&:hover": {
        boxShadow: 3,
      },
    }}
  >
   <CardMedia
  sx={{
    position: 'relative',

  }}
>
  <OptimizedImage
    src={product.images[0].url}
    alt={product.name}
    width={300}
    quality={75}
  />
</CardMedia>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h6" component="div" noWrap>
        {product.name}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Rating {...options} size="small" />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          ({product.numOfReviews} Reviews)
        </Typography>
      </Box>
      <Typography variant="h6" color="primary">
        ₹{product.price}
      </Typography>
    </CardContent>
  </Card>
  );
};

export default ProductCard;
