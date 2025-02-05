import React, { Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { refresh, loadUser } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
const ProtectedRoute = ({
  component: Component,
  allowedRoles,
  axiosInstance,
  ...rest
}) => {
  const { isAuthenticated, loading, initialized} = useSelector(
    (state) => state.user
  );
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();


  return (
    <Fragment>
      <Route
      {...rest}
      render={(props) => {
        // Show loader while checking auth or refreshing token
        if (!initialized) {
          return <Loader />;
        }

        // Redirect to login if not authenticated and refresh failed
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          );
        }
        // Render component if authenticated
        return <Component {...props} />;
      }}
    />
    </Fragment>
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  allowedRoles: PropTypes.array,
};

export default ProtectedRoute;