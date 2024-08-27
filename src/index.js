import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { UserInfoProvider } from "./utils/userContext";

import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { history } from "./utils/history";
import { ErrorProvider } from "./utils/ErrorContext";

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
};

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <UserInfoProvider>
        <ErrorProvider>
          <AlertProvider template={AlertTemplate} {...options}>
            <App />
          </AlertProvider>
        </ErrorProvider>
      </UserInfoProvider>
    </Provider>
  </Router>,
  document.getElementById("root")
);
