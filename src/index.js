import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { history } from "./utils/history";
import { ThemeProvider } from '@mui/material/styles';
import theme from "./utils/theme";


const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
};



ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...options}>
          <ThemeProvider theme={theme}>
          <App />
          </ThemeProvider>
        </AlertProvider>
    </Provider>
  </Router>,
  document.getElementById("root")
);
