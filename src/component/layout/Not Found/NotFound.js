import React from "react";
import "./NotFound.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container">
      <div className="PageNotFound">
        <Typography>Page Not Found </Typography>
        <Link to="/">Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
