import "core-js/es6/map";
import "core-js/es6/set";
import "raf/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./css/index.css";
import App from "./containers/App";
import registerServiceWorker from "./registerServiceWorker";

const Router = props => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

ReactDOM.render(Router(), document.getElementById("root"));
registerServiceWorker();
