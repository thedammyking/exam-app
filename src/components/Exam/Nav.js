import "core-js/es6/map";
import "core-js/es6/set";
import "raf/polyfill";
import React, { Component } from "react";
import { Context } from "../../containers/Exam";

export default class Nav extends Component {
  render() {
    return (
      <Context.Consumer>
        {({
          changeQuestion,
          subjects,
          selectedSubject: { questions, prop },
          onSubjectSelect,
          questionIndex
        }) => (
          <div className="Nav clearfix">
            <div className="all-question">
              <p>
                Question {questionIndex + 1}
                <span>
                  <i className="fas fa-angle-down" />
                </span>
              </p>
              <div className="question__options">
                {questions.map((item, i) => (
                  <p
                    onClick={() => {
                      return changeQuestion("to", i);
                    }}
                    key={i}
                    className={`question__option${
                      item.answer !== "" ? ` selected__option` : ``
                    }`}
                  >
                    {i + 1}
                  </p>
                ))}
              </div>
            </div>
            <div className="question__nav">
              <button
                onClick={e => {
                  e.preventDefault();
                  return changeQuestion("prev");
                }}
                className="btn btn__prev"
                disabled={questionIndex === 0}
              >
                <span>
                  <i className="fas fa-angle-left" />
                </span>
                Previous
              </button>
              <button
                onClick={e => {
                  e.preventDefault();
                  return changeQuestion("next");
                }}
                className="btn btn__next"
                disabled={questionIndex === questions.length - 1}
              >
                Next
                <span>
                  <i className="fas fa-angle-right" />
                </span>
              </button>
            </div>
            <div className="select--subject clearfix">
              <div className="subject__name">
                <p>{prop.subject}</p>
              </div>
              <div className="drop-button">
                <i className="fas fa-angle-down" />
              </div>
              <div className="subject__options">
                {subjects.map((subject, i) => {
                  return (
                    <p
                      onClick={() => onSubjectSelect(subject)}
                      key={i}
                      className="subject__option"
                    >
                      {subject.subject}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Context.Consumer>
    );
  }
}
