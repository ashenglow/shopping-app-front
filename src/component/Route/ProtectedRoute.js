import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { refresh } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";

const ProtectedRoute = ({
  component: Component,
  allowedRoles,
  axiosInstance,
  ...rest
}) => {
  const { user, isAuthenticated, loading, role } = useSelector(
    (state) => state.user
  );
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const isAuthorized = allowedRoles
    ? allowedRoles.some((roles) => roles.includes(role))
    : true;

  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated && !refreshing) {
      setRefreshing(true);
      dispatch(refresh()).finally(() => {
        if (isMounted) {
          setRefreshing(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, isAuthenticated, refreshing]);

  if (loading || refreshing) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Route
        {...rest}
        render={(props) => {
          return isAuthenticated ? (
            <div>
              <Component {...props} />
            </div>
          ) : (
            <Redirect to="/login" />
          );
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
