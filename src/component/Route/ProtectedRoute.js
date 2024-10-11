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
  const { user, isAuthenticated, loading, role } = useSelector(
    (state) => state.user
  );
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const mountedRef = useRef(true);
  const isAuthorized = allowedRoles
    ? allowedRoles.some((roles) => roles.includes(role))
    : true;

  useEffect(() => {

    if (!isAuthenticated && !refreshing) {
      setRefreshing(true);
      dispatch(refresh()).finally(() => {
        if (mountedRef.current) {
          setRefreshing(false);
        }
      });
    }

    return () => {
      mountedRef.current = false;
    };
  }, [dispatch, isAuthenticated, refreshing]);

  useEffect(() => {
    if (!user && !loading && mountedRef.current) {
      dispatch(loadUser());
    }
  }, [user, loading, dispatch]);
  if (loading || refreshing) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Route
        {...rest}
        render={(props) => {
   if(!isAuthorized){
    return <Redirect to="/login" />;
   }
  //  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
  //   return <Redirect to="/" />;
  //  }
  return <Component {...props}  user={user}/>;
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