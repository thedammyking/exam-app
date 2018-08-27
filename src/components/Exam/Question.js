import "core-js/es6/map";
import "core-js/es6/set";
import "raf/polyfill";
import React, { Component } from "react";
//import _ from "lodash";
import Latex from "react-latex";
import { Context } from "../../containers/Exam";

export default class Question extends Component {
  render() {
    return (
      <Context.Consumer>
        {({
          selectedSubject,
          questionIndex,
          onOptionSelect,
          changeQuestion,
          questions
        }) => {
          let question = { ...selectedSubject.questions[questionIndex] };
          let subject = selectedSubject.prop.code;
          let options = { ...question.options };
          return (
            <div className="Question clearfix">
              {question.res !== null && (
                <div className="resources">
                  <h4 className="resourse__title">Resources</h4>
                  <p className="resource">
                    <Latex>{question.res}</Latex>
                  </p>
                </div>
              )}
              <div
                className={`question__answer${
                  question.res === null ? ` no-resource` : ``
                }`}
              >
                <div className="question__text">
                  <p>
                    <Latex>{question.q}</Latex>
                  </p>
                </div>
                <div className="answer__options">
                  {Object.keys(options).map((item, i) => (
                    <div
                      onClick={() => {
                        onOptionSelect(item, question.id, subject);
                      }}
                      key={i}
                      className={`answer__option clearfix${
                        question.answer === item ? ` selected__option` : ``
                      }`}
                    >
                      <div className="__option">{item}</div>
                      <p className="__answer">
                        <Latex>{options[item]}</Latex>
                      </p>
                    </div>
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
            </div>
          );
        }}
      </Context.Consumer>
    );
  }
}
