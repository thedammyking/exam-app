import "core-js/es6/map";
import "core-js/es6/set";
import "raf/polyfill";
import React, { Component } from "react";
import { Context } from "../../containers/Exam";

export default class Status extends Component {
  render() {
    return (
      <Context.Consumer>
        {({
          updateState,
          duration,
          selectedSubject,
          percentComplete,
          backgroundToWhite,
          onSubjectSelect,
          backgroundToRed,
          subjects
        }) => {
          let hours = duration[0];
          let minutes = duration[1];
          let seconds = duration[2];
          return (
            <div className="Status clearfix">
              <div className="card card--subject">
                <div className="subject__name">
                  <p>{selectedSubject.prop.subject}</p>
                </div>
                <div className="drop-button">
                  <i className="fas fa-angle-down" />
                </div>
                <div className="subject__options">
                  {subjects.map((subject, i) => {
                    return (
                      <p
                        onClick={() => {
                          onSubjectSelect(subject);
                          return updateState("questionIndex", 0);
                        }}
                        key={i}
                        className="subject__option"
                      >
                        {subject.subject}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div
                style={{ visibility: "hidden" }}
                className="card card--complete"
              >
                <p className="card__text">
                  <span>{percentComplete}%</span>
                  Complete
                </p>
              </div>
              <div
                className={`card card--time${
                  backgroundToWhite ? ` turn-to-white` : ``
                }${backgroundToRed ? ` turn-to-red` : ``}`}
              >
                <div className="text text__time">
                  <p>{`${hours}hrs : ${minutes}mins : ${seconds}secs`}</p>
                </div>
              </div>
            </div>
          );
        }}
      </Context.Consumer>
    );
  }
}
