import "core-js/es6/map";
import "core-js/es6/set";
import "raf/polyfill";
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Exam from "./Exam";
import "../css/App.css";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={props => <Exam {...props} />} />
        </Switch>
      </div>
    );
  }
}
