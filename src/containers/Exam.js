import "core-js/es6/map";
import "core-js/es6/set";
import "raf/polyfill";
import React, { Component } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import _ from "lodash";
import { Link } from "react-router-dom";
//import qs from "qs";
import Header from "../components/Exam/Header";
import Status from "../components/Exam/Status";
import Nav from "../components/Exam/Nav";
import Question from "../components/Exam/Question";
import Result from "../components/Result";
import "../css/Exam.css";

export const Context = React.createContext();
const base__url = "http://35.184.129.252:80/api";

export default class Exam extends Component {
  state = {
    duration: "3600",
    backgroundToWhite: false,
    backgroundToRed: false,
    subjects: [],
    selectedSubject: {
      questions: [],
      prop: {}
    },
    percentComplete: 25,
    questions: {},
    result: {},
    errMsg: "",
    user: "",
    showLoader: false,
    showErr: false,
    questionIndex: 0,
    answers: {},
    showResult: false,
    showFinish: false
  };

  componentWillMount() {
    this.initApp();
  }

  updateState = (state, value) => {
    return this.setState({
      [state]: value
    });
  };

  initApp = async () => {
    await this.setState({
      showLoader: true
    });
    await this.getUser();
    await this.getQuestions(this.state.user);
  };

  getUser = () => {
    //const parsed = qs.parse(window.location.search);
    const parsed = window.location.search.slice(1, 20).split("=")[1];
    return this.setState({
      user: parsed
    });
  };

  submitExam = () => {
    let { answers } = this.state;
    this.setState({
      showFinish: true
    })
    return axios({
      method: "post",
      url: `${base__url}/cbt/grade`,
      data: {
        answer: answers
      },
      responseType: "stream"
    })
      .then(resp => {
        return resp.status === 200
          ? resp.data
          : this.setState({
              errMsg:
                "Something went wrong, please check your internet connection and reload the page."
            });
      })
      .then(({ data: { grade, percent }, error }) => {
        if (!error)
          return this.setState(
            {
              result: { grade, percent },
              showResult: true,
              showFinish:false,
            },
            () =>
              axios({
                method: "get",
                url: `https://powerjamb.com.ng/webhook.php?reg=${
                  this.state.user
                }`,
                responseType: "stream"
              })
          );
      })
      .catch(err =>
        this.setState({
          errMsg:
            "Something went wrong, please check your internet connection and reload the page."
        })
      );
  };

  changeQuestion = (type, to) => {
    let {
      questionIndex,
      selectedSubject: { questions }
    } = this.state;

    switch (type) {
      case "next":
        this.setState({
          questionIndex:
            questions.length - 1 === questionIndex
              ? questionIndex
              : questionIndex + 1
        });
        break;
      case "prev":
        this.setState({
          questionIndex: questionIndex > 0 ? questionIndex - 1 : questionIndex
        });
        break;
      case "to":
        this.setState({
          questionIndex: to
        });
        break;
      default:
        break;
    }
  };

  onSubjectSelect = subject => {
    return this.setState({
      selectedSubject: {
        questions: this.state.questions[subject.code],
        prop: subject
      }
    });
  };

  onOptionSelect = (option, questionId, subject) => {
    let { answers, selectedSubject, questionIndex } = this.state;
    let answer = { id: questionId, answer: option };
    let questions = [...selectedSubject.questions];
    let prop = { ...selectedSubject.prop };

    questions[questionIndex].answer = option;

    if (_.isEmpty(answers)) {
      return this.setState({
        answers: {
          [subject]: [answer]
        },
        selectedSubject: {
          questions,
          prop
        }
      });
    }
    if (answers[subject] === undefined)
      return this.setState({
        answers: {
          ...answers,
          [subject]: [answer]
        },
        selectedSubject: {
          questions,
          prop
        }
      });
    let answer_exits = answers[subject].findIndex(item => {
      return item.id === questionId;
    });
    if (answer_exits >= 0) return null;
    return this.setState({
      answers: {
        ...answers,
        [subject]: [...answers[subject], answer]
      },
      selectedSubject: {
        questions,
        prop
      }
    });
  };

  getQuestions = user => {
    return axios({
      method: "get",
      url: `${base__url}/cbt/${user}`,
      responseType: "stream"
    })
      .then(resp => {
        return resp.status === 200
          ? resp.data
          : this.setState({
              errMsg:
                "Something went wrong, please check your internet connection and reload the page."
            });
      })
      .then(({ data }) => {
        if (data.error) {
          return this.setState({
            errMsg: data.message
          });
        }
        let { questions, subjects } = data;
        return this.setState(
          {
            questions,
            subjects,
            selectedSubject: {
              questions: questions[subjects[0].code],
              prop: subjects[0]
            },
            showLoader: false
          },
          () => (this.countDownInterval = setInterval(this.countDown, 1000))
        );
      })
      .catch(err =>
        this.setState({
          showErr: true
        })
      );
  };

  countDown = () => {
    let { duration } = this.state;
    if (duration > 0)
      return this.setState({
        duration: duration - 1,
        backgroundToWhite:
          duration % 600 <= 1 && duration > 601
            ? true
            : duration % 600 >= 599 && duration > 601
              ? true
              : false,
        backgroundToRed: duration <= 600 ? true : false
      });
    if (duration === 0) {
      clearInterval(this.countDownInterval);
      return this.submitExam();
    }
  };

  converToHms = duration => {
    let hours = Math.floor(duration / 3600);
    let minutes = Math.floor((duration - hours * 3600) / 60);
    let seconds = duration - hours * 3600 - minutes * 60;
    seconds = Math.round(seconds * 100) / 100;
    return {
      hours,
      minutes,
      seconds
    };
  };

  loader = () => {
    return (
      <div className="Start">
        <Loader type="TailSpin" color="#fff" height="100" width="100" />
      </div>
    );
  };

  render() {
    let {
      duration,
      backgroundToWhite,
      backgroundToRed,
      subjects,
      selectedSubject,
      percentComplete,
      questions,
      result,
      showLoader,
      errMsg,
      showErr,
      questionIndex,
      answers,
      showResult,
      showFinish
    } = this.state;
    let HMS = this.converToHms(duration);
    return (
      <Context.Provider
        value={{
          duration: [HMS.hours, HMS.minutes, HMS.seconds],
          backgroundToWhite,
          backgroundToRed,
          subjects,
          selectedSubject: selectedSubject,
          onSubjectSelect: this.onSubjectSelect,
          percentComplete,
          questions,
          result,
          questionIndex,
          onOptionSelect: this.onOptionSelect,
          answers,
          changeQuestion: this.changeQuestion,
          updateState: this.updateState,
          submitExam: this.submitExam
        }}
      >
        {showLoader && this.loader()}
        {(showErr || errMsg) && (
          <div className="errMsg">
            <p>
              User does not exist or something went wrong, please
              <Link class="redirect" to="">
                {` register `}
              </Link>
              or check your internet connection and reload the page.
            </p>
          </div>
        )}
        {showResult && <Result />}
        <Header />

        <main className="exam__content">
          {showFinish && <div className="Finish">
            <Loader type="TailSpin" color="#024f8a" height="100" width="100" />
          </div>}
          <Status />
          <Nav />
          <Question />
        </main>
      </Context.Provider>
    );
  }
}
