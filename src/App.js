import "./App.css";
import { useSyncExternalStore } from "react";
import { useEffect, useState } from "react";
import Header from "./component/layout/Header/Header.js";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import cd from "./store";
import { loadUser } from "./actions/userAction";
import { useSelector, useDispatch } from "react-redux";
import Profile from "./component/User/Profile";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
// import Payment from "./component/Cart/Payment";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import NotFound from "./component/layout/Not Found/NotFound";
import axiosInstance from "./utils/axiosInstance";
import UserOptions from "./component/layout/Header/UserOptions";
import SwaggerDocs from "./component/Swagger/SwaggerDocs";
import { history } from "./utils/history";
import { UserContext } from "./utils/userContext";
import ScrollToTop from "./utils/ScrollToTop.js";
import FlexibleNotification from "./component/layout/MUI-comp/MuiNotification/FlexibleNotification.js";
import Loader from "./component/layout/Loader/Loader.js";
import NoAuthHeader from "./component/layout/Header/NoAuthHeader.js";

function App() {
  //test
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const [initialized, setInitialized] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    WebFont.load({
      google: {
        families: [  
          "Open Sans", 
          "Noto Sans",
          "Roboto",
          "Poppins",
          "Sora",
          "Hahmlet",
          "Montserrat",
          "Noto Sans KR",],
      },
    });
  }, []);
 // Silent auth check on app load
 useEffect(() => {
  const initAuth = async () => {
    if (localStorage.getItem('accessToken')) {
      try {
        await dispatch(loadUser());
      } catch (error) {
        console.log("Failed to load user:", error);
      }
    }
    setInitialized(true);
  };

  if (!initialized) {
    initAuth();
  }
}, [dispatch, initialized]);

if(loading){
return <Loader/>
}

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router history={history}>
      <ScrollToTop />
      <Switch>
        {/* API Docs Route */}
        <Route exact path="/api-docs">
          <SwaggerDocs />
        </Route>

        {/* All other routes */}
        <Route>
          <>

              <Header isAuthenticated={isAuthenticated} user={user}/>   
      
           

            {/* 
      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        </Elements>
      )} */}

            <Switch>
            {/* Public Routes */}
        <Route exact path="/" component={Home} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/product/:id" component={ProductDetails} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/about" component={About} />
        
        {/* Auth Routes */}
        <Route 
          exact 
          path="/login" 
          render={(props) => 
            isAuthenticated ? <Redirect to="/" /> : <LoginSignUp {...props} />
          }
        />

        {/* Protected Routes */}
        <ProtectedRoute exact path="/cart" component={Cart} />
        <ProtectedRoute exact path="/account" component={Profile} />
        <ProtectedRoute exact path="/member/update" component={UpdateProfile} />
        <ProtectedRoute exact path="/shipping" component={Shipping} />
        <ProtectedRoute exact path="/success" component={OrderSuccess} />
        <ProtectedRoute exact path="/orders" component={MyOrders} />
        <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
        <ProtectedRoute exact path="/order/:id" component={OrderDetails} />
        <Route component={NotFound} />
              {/* <ProtectedRoute
          exact
          path="/password/update"
          component={UpdatePassword}
          isAuthenticated={isAuthenticated}
        /> */}
              {/* 
        <Route exact path="/password/forgot" component={ForgotPassword} />

        <Route exact path="/password/reset/:token" component={ResetPassword} /> */}

              {/* 
        <ProtectedRoute
          allowedRoles={["ADMIN"]}
          exact
          path="/admin/dashboard"
          component={Dashboard}
        />
        <ProtectedRoute
          exact
          path="/admin/products"
          allowedRoles={["ADMIN"]}
          component={ProductList}
        />
        <ProtectedRoute
          exact
          path="/admin/product"
          allowedRoles={["ADMIN"]}
          component={NewProduct}
        />

        <ProtectedRoute
          exact
          path="/admin/product/:id"
          allowedRoles={["ADMIN"]}
          component={UpdateProduct}
        />
        <ProtectedRoute
          exact
          path="/admin/orders"
          allowedRoles={["ADMIN"]}
          component={OrderList}
        />

        <ProtectedRoute
          exact
          path="/admin/order/:id"
          allowedRoles={["admin"]}
          component={ProcessOrder}
        />
        <ProtectedRoute
          exact
          path="/admin/users"
          allowedRoles={["admin"]}
          component={UsersList}
        />

        <ProtectedRoute
          exact
          path="/admin/user/:id"
          allowedRoles={["ADMIN"]}
          component={UpdateUser}
        />

        <ProtectedRoute
          exact
          path="/admin/reviews"
          allowedRoles={["ADMIN"]}
          component={ProductReviews}
        /> */}

              <Route
                component={
                  window.location.pathname === "/process/payment"
                    ? null
                    : NotFound
                }
              />
              <Redirect to="/" />
            </Switch>

          </>
        </Route>
      </Switch>
      <Route render={({location}) => {return location.pathname !== '/login' && <Footer />}} />
<FlexibleNotification />
    </Router>
  );
}

export default App;