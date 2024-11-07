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
  const { user, isAuthenticated, loading} = useSelector(
    (state) => state.user
  );
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();


    useEffect(() => {
      if (!isAuthenticated && !loading && !refreshing) {
        setRefreshing(true);
        dispatch(refresh())
          .catch(() => {})
          .finally(() => setRefreshing(false));
      }
    }, [dispatch, isAuthenticated, loading, refreshing]);

  if (loading || refreshing) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Route
      {...rest}
      render={(props) => 
        isAuthenticated ? (
          <Component {...props} user={user} />
        ) : (
          <Redirect to={{
            pathname: "/login",
            state: { from: props.location }
          }} />
        )
      }
    />
    </Fragment>
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  allowedRoles: PropTypes.array,
};

export default ProtectedRoute;