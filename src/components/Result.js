import "core-js/es6/map";
import "core-js/es6/set";
import "raf/polyfill";
import React, { Component } from "react";
import "../css/Result.css";
//import { Link } from "react-router-dom";
import { Context } from "../containers/Exam";

export default class Result extends Component {
  render() {
    return (
      <Context.Consumer>
        {({ result: { grade, percent }, subjects }) => {
          return (
            <div className="Result">
              <h2 className="page__title">Result</h2>
              <div className="subject__results clearfix">
                {subjects.map((item, i) => {
                  return (
                    <div className={`subject__result subject${i}`}>
                      <h4 className="subject__">{item.subject}</h4>
                      <p className="score">
                        Score: <span>{grade[item.code] || 0}</span>
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="total__score">
                Total: <span>{percent}%</span>
              </div>
              <p className="to-redirect">
                <a href="https://powerjamb.com.ng/dash1/index.php">
                  Back to Dashboard
                </a>
              </p>
            </div>
          );
        }}
      </Context.Consumer>
    );
  }
}
