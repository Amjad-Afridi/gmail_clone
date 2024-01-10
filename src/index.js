import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Store } from "./Redux/Store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={Store}>
    <GoogleOAuthProvider clientId="749751951330-iuvfo2nvavv504ugpetht76upao9n6dh.apps.googleusercontent.com">
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </GoogleOAuthProvider>
  </Provider>,
);
