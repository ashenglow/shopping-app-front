import "./App.css";
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
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import NotFound from "./component/layout/Not Found/NotFound";
import SwaggerDocs from "./component/Swagger/SwaggerDocs";
import { history } from "./utils/history";
import ScrollToTop from "./utils/ScrollToTop.js";
import FlexibleNotification from "./component/layout/MUI-comp/MuiNotification/FlexibleNotification.js";
import Loader from "./component/layout/Loader/Loader.js";
import OrderPerformanceMetrics from "./component/Monitoring/OrderPerformanceMetrics.js";
import OAuth2RedirectHandler from "./utils/OAuth2RedirectHandler.js";
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
    initAuth();
  
}, [dispatch]);

if(!initialized){
return <Loader/>
}

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router history={history}>
      <ScrollToTop />
      <Switch>
      <Route 
          exact 
          path="/monitoring" 
          component={OrderPerformanceMetrics} 
        />
        {/* API Docs Route */}
        <Route exact path="/api-docs">
          <SwaggerDocs />
        </Route>

        {/* All other routes */}
        <Route>
          <>

              <Header initialized={initialized} />   
            <Switch>
            {/* Public Routes */}
        <Route exact path="/" component={Home} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/product/:id" component={ProductDetails} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/about" component={About} />
        
        {/* Auth Routes */}
        <Route path="/oauth2/callback" component={OAuth2RedirectHandler} />
        <Route 
          exact 
          path="/login" 
          render={(props) => 
            isAuthenticated ? <Redirect to="/" /> : <LoginSignUp {...props} />
          }
        />

        {/* Protected Routes */}
        <ProtectedRoute path="/cart" component={Cart} />
        <ProtectedRoute path="/account" component={Profile} />
        <ProtectedRoute path="/member/update" component={UpdateProfile} />
        <ProtectedRoute path="/shipping" component={Shipping} />
        <ProtectedRoute path="/success" component={OrderSuccess} />
        <ProtectedRoute path="/orders" component={MyOrders} />
        <ProtectedRoute path="/order/confirm" component={ConfirmOrder} />
        <ProtectedRoute path="/order/:id" component={OrderDetails} />
        <Route component={NotFound} />

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