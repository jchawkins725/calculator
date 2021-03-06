import React from "react";
import "./App.css";

const allbuttons = [
  { id: "clear", value: "AC", keycode: 67 },
  { id: "posneg", value: "+/-", keycode: 77 },
  { id: "divide", value: "/", keycode: 191 },
  { id: "seven", value: "7", keycode: 55 },
  { id: "eight", value: "8", keycode: 56 },
  { id: "nine", value: "9", keycode: 57 },
  { id: "multiply", value: "x", keycode: 88 },
  { id: "four", value: "4", keycode: 52 },
  { id: "five", value: "5", keycode: 53 },
  { id: "six", value: "6", keycode: 54 },
  { id: "subtract", value: "-", keycode: 189 },
  { id: "one", value: "1", keycode: 49 },
  { id: "two", value: "2", keycode: 50 },
  { id: "three", value: "3", keycode: 51 },
  { id: "add", value: "+", keycode: 187 },
  { id: "zero", value: "0", keycode: 48 },
  { id: "decimal", value: ".", keycode: 190 },
  { id: "equals", value: "=", keycode: 13 },
];

class Display extends React.Component {
  render() {
    return (
      <div className="displaycontainer">
        <p id="display">
          {this.props.currentNumber === "" && this.props.equation === undefined
            ? 0
            : this.props.currentNumber !== ""
            ? this.props.currentNumber
            : this.props.equation[0] !== undefined
            ? this.props.equation[0]
            : 0}
        </p>
      </div>
    );
  }
}
const test = /(x|-|\+|\/)/;

class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  handleKeyDown(e) {
    if (e.keyCode === this.props.keycode) {
      const digitRegex = /\d/;
      if (digitRegex.test(parseInt(this.props.value, 10))) {
        if (e.shiftKey === false    ) {
          this.props.number(this.props.index);
        } else if (e.keyCode === 56) {
          this.props.operator(6);
        }
      } else if (test.test(this.props.value)) {
        if (e.shiftKey === true && e.keyCode === 187) {
          this.props.operator(14);
        } else if (e.shiftKey === false && e.keyCode === 187) {
          this.props.equal();
        } else if (e.keyCode !== 187) {
          this.props.operator(this.props.index);
        }
      } else if (this.props.value === "+/-") {
        this.props.plusminus();
      } else if (this.props.value === ".") {
        this.props.decimal();
      } else if (this.props.value === "AC") {
        this.props.clear();
      } else {
        this.props.equal();
      }
    } else if (e.keyCode === 8) {
      this.props.clear();
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }
  render() {
    const value = this.props.value;
    const id = this.props.id;
    return (
      <button
        id={id}
        value={value}
        className={`${test.test(value) ? "operators" : ""}`}
        onClick={
          value === "AC"
            ? this.props.clear
            : value === "."
            ? this.props.decimal
            : value === "="
            ? this.props.equal
            : value === "+/-"
            ? this.props.plusminus
            : parseInt(value, 10) < 10
            ? () => this.props.number(this.props.index)
            : () => this.props.operator(this.props.index)
        }
      >
        {value}
      </button>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "0",
      equationArray: [],
      currentNumber: "",
      operator: "",
      plusminus: true,
    };
    this.handleClear = this.handleClear.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handlePlusMinus = this.handlePlusMinus.bind(this);
  }
  handleClear() {
    this.setState({
      equationArray: [],
      currentNumber: "",
      result: "0",
      operator: "",
      plusminus: true,
    });
  }
  handleNumbers(i) {
    if (allbuttons[i].value === "0" && this.state.currentNumber === "0") {
      return;
    } else {
      if (this.state.operator !== "") {
        this.setState((prevState) => ({
          equationArray: [...prevState.equationArray, this.state.operator],
          operator: "",
        }));
      }
      this.setState((prevState) => ({
        currentNumber: prevState.currentNumber + allbuttons[i].value,
      }));
    }
  }
  handleDecimal() {
    if (this.state.currentNumber === "") {
      this.setState({ currentNumber: "0." });
    } else if (!this.state.currentNumber.includes(".")) {
      this.setState((prevState) => ({
        currentNumber: prevState.currentNumber + ".",
      }));
    } else {
      return;
    }
  }
  handleOperators(i) {
    const current = this.state.currentNumber;
    if (
      this.state.currentNumber === "" &&
      this.state.equationArray.length === 0
    ) {
      return;
    } else {
      if (this.state.equationArray.length > 1) {
        this.equation();
        this.setState({operator: allbuttons[i].value})
      } else if (this.state.currentNumber !== "") {
        this.setState({ equationArray: [Number(current)], currentNumber: "", operator: allbuttons[i].value });
      } else {
        this.setState({
          operator: allbuttons[i].value,
        });
      }
    }
  }
  handlePlusMinus() {
    const expressiontwo = /(-\d+)/;
    if (this.state.currentNumber === "") {
      return;
    } else {
      if (expressiontwo.test(this.state.currentNumber)) {
        this.setState((prevState) => ({
          currentNumber: prevState.currentNumber.substr(1),
        }));
      } else {
        this.setState((prevState) => ({
          currentNumber: "-" + prevState.currentNumber,
        }));
      }
    }
  }
  equation() {
    const equation = this.state.equationArray;
    const current = Number(this.state.currentNumber);
    const solved =
      equation[1] === "+"
        ? equation[0] + current
        : equation[1] === "-"
        ? equation[0] - current
        : equation[1] === "/"
        ? equation[0] / current
        : equation[1] === "x"
        ? equation[0] * current
        : 0;
    this.setState({
      result: solved,
      equationArray: [solved],
      currentNumber: "",
    });
  }
  handleEquals() {
    if (this.state.equationArray <= 1 || this.state.currentNumber === "") {
      return;
    } else {
      this.equation();
    }
  }
  render() {
    const buttons = allbuttons.map((x, y) => (
      <Buttons
        id={x.id}
        value={x.value}
        keycode={x.keycode}
        index={y}
        key={x.id}
        clear={this.handleClear}
        number={this.handleNumbers}
        decimal={this.handleDecimal}
        plusminus={this.handlePlusMinus}
        equal={this.handleEquals}
        operator={this.handleOperators}
      />
    ));
    return (
      <div id="calculator">
        <Display
          result={this.state.result}
          currentNumber={this.state.currentNumber}
          equation={this.state.equationArray}
        />
        <div id="container">{buttons}</div>
      </div>
    );
  }
}

export default App;
