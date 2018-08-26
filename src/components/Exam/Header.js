import "core-js/es6/map";
import "core-js/es6/set";
import "raf/polyfill";
import React, { Component } from "react";
import { Context } from "../../containers/Exam";
import "../../css/Header.css";

export default class Header extends Component {
  render() {
    return (
      <Context.Consumer>
        {({ submitExam }) => (
          <header className="header">
            <div className="header__content clearfix">
              <div className="logo__box">
                <h2 className="logo">Power JAMB</h2>
              </div>
              <div className="nav__box">
                <button
                  onClick={e => {
                    e.preventDefault();
                    return submitExam();
                  }}
                  className="btn finish__btn"
                >
                  <i className="fas fa-exclamation-triangle" />
                  Submit Exam
                </button>
              </div>
            </div>
          </header>
        )}
      </Context.Consumer>
    );
  }
}
