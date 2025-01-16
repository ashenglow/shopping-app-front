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
import { getAccessTokenFromStorage } from "./hooks/accessTokenHook.js";
import { LOAD_USER_FAIL } from "./constants/userConstants.js";
import { clearAuthState } from "./utils/axiosInstance.js";
import { validateInitialToken } from "./utils/axiosInstance.js";

// Define public routes
const PUBLIC_ROUTES = [
  { path: "/", component: Home },
  { path: "/products", component: Products },
  { path: "/product/:id", component: ProductDetails },
  { path: "/search", component: Search },
  { path: "/contact", component: Contact },
  { path: "/about", component: About },
  { path: "/login", component: LoginSignUp },
  { path: "/oauth2/callback", component: OAuth2RedirectHandler },
  { path: "/api-docs", component: SwaggerDocs },
];

// Define protected routes
const PROTECTED_ROUTES = [
  { path: "/cart", component: Cart },
  { path: "/account", component: Profile },
  { path: "/member/update", component: UpdateProfile },
  { path: "/shipping", component: Shipping },
  { path: "/success", component: OrderSuccess },
  { path: "/orders", component: MyOrders },
  { path: "/order/confirm", component: ConfirmOrder },
  { path: "/order/:id", component: OrderDetails },
];


function App() {
  //test
  const { isAuthenticated, loading, initialized } = useSelector((state) => state.user);
  const dispatch = useDispatch();
 const [isValidatingToken, setIsValidatingToken] = useState(true);

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
    try {
    const isTokenValid = await validateInitialToken();
    if(isTokenValid){
      await dispatch(loadUser());
    }else {
      dispatch({ type: LOAD_USER_FAIL });
      return;
    }
  }catch(error){
    console.error('Auth initialization failed:', error);
    clearAuthState(true);
  }finally{
    setIsValidatingToken(false);
  }
  };
  if (!initialized){
    initAuth();
  }
}, [dispatch, initialized]);



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
        <Route exact path="/api-docs" component={SwaggerDocs} />
         

        {/* All other routes */}
        <Route>
          <>

              <Header initialized={initialized} />   
            <Switch>
            {/* Public Routes */}
            {PUBLIC_ROUTES.map(({ path, component: Component }) => (
                <Route 
                  exact 
                  key={path} 
                  path={path} 
                  render={(props) => 
                    path === "/login" && isAuthenticated ? (
                      <Redirect to="/" />
                    ) : (
                      <Component {...props} />
                    )
                  }
                />
              ))}
        
        {/* Auth Routes */}
        <Route path="/oauth2/callback" component={OAuth2RedirectHandler} />
        <Route 
          exact 
          path="/login" 
          render={(props) => 
            isAuthenticated ? <Redirect to="/" /> : <LoginSignUp {...props} />
          }
        />

        {/* Protected Routes - Only accessible when authenticated */}
        {PROTECTED_ROUTES.map(({ path, component: Component }) => (
                <Route
                  exact
                  key={path}
                  path={path}
                  render={(props) =>
                    !isAuthenticated ? (
                      <Redirect
                        to={{
                          pathname: "/login",
                          state: { from: props.location }
                        }}
                      />
                    ) : isValidatingToken || loading ? (
                      <Loader />
                    ) : (
                      <Component {...props} />
                    )
                  }
                />
              ))}
              {/* Fallback route */}
              <Route component={NotFound} />
            </Switch>

          </>
        </Route>
      </Switch>
        {/* Render Footer except for login page */}
      <Route render={({location}) => {return location.pathname !== '/login' && <Footer />}} />
<FlexibleNotification />
    </Router>
  );
}

export default App;