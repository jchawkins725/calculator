import React from 'react';
import logo from './logo.svg';
import './App.css';

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
  { id: "equals", value: "=", keycode: 13 }
];

class Display extends React.Component {
  render() {
    return (
      <div className="displaycontainer">
        <p id="displayequation" className={this.props.equation === "" ? "hidden" : ""}>{this.props.equation === "" ? this.props.result : this.props.equation}</p>
        <p id="display">{this.props.previousNumber === "" && this.props.currentNumber === "" ? this.props.result : this.props.currentNumber === "" ? this.props.previousNumber : this.props.currentNumber}</p>
      </div>
    )
  }
}
const test = /(x|-|\+|\/)/;

class Buttons extends React.Component {
  render() {
    const value = this.props.value;
    const id = this.props.id;
    return (
      <button id={id} value={value} className={test.test(value) ? "operators" : ""} onClick={value === "AC" ? this.props.clear : value === "." ? this.props.decimal : value === "=" ? this.props.equal : value === "+/-" ? this.props.plusminus : parseInt(value, 10) < 10 ? () => this.props.number(this.props.index) : () => this.props.operator(this.props.index)}>{value}</button>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "0",
      equation: "",
      currentNumber: "",
      previousNumber: "",
      operator: "",
      plusminus: true
    };
    this.handleClear = this.handleClear.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handlePlusMinus = this.handlePlusMinus.bind(this);
  }
  handleClear() {
    this.setState({ equation: "", currentNumber: "", result: "0", previousNumber: "", operator: "", plusminus: true })
  }
  handleNumbers(i) {
    if (allbuttons[i].value === "0" && this.state.currentNumber === "0") {
      return
    }
    else {
      this.setState(prevState => ({ currentNumber: prevState.currentNumber + allbuttons[i].value, operator: "", equation: prevState.equation + allbuttons[i].value}));
    }
  }
  handleDecimal() {
    if (this.state.currentNumber === "") {
      this.setState({ currentNumber: "0.", equation: "0." });
    }
    else if (!this.state.currentNumber.includes(".")) {
      this.setState(prevState => ({ currentNumber: prevState.currentNumber + ".", equation: prevState.equation + "." }));
    }
    else {
      return
    }
  }
  handleOperators(i) {
    if (this.state.equation === "") {
      return
    }
    else if (test.test(this.state.operator)) {
      this.setState(prevState => ({ operator: allbuttons[i].value, equation: prevState.equation.slice(0, prevState.equation.length - 2) + allbuttons[i].value.replace(/x/g, "*") + " " }))
    }
    else {
      this.setState(prevState => ({ operator: allbuttons[i].value, currentNumber: "", equation: prevState.equation + " " + allbuttons[i].value.replace(/x/g, "*") + " ", previousNumber: this.state.currentNumber }));
    }
  }
  handlePlusMinus() {
    const expression = /(\d+)$/;
    const expressiontwo = /(-\d+)$/;
    const expressionthree = /\s(\*|x|-|\+|\/)/;
    if (this.state.currentNumber === "") {
      return
    }
    else {
      if (expressiontwo.test(this.state.equation)) {
        this.setState(prevState => ({ currentNumber: prevState.currentNumber.substr(1), equation: prevState.equation.replace(expressiontwo, this.state.currentNumber.substr(1)) }));
      }
      else {
        this.setState(prevState => ({ currentNumber: "-" + prevState.currentNumber, equation: prevState.equation.replace(expression, "-" + this.state.currentNumber) }));
      }
    }
  }
  handleEquals() {
    if (this.state.equation != "") {
      const solved = eval(this.state.equation)
      this.setState({ result: solved, currentNumber: "", equation: solved, previousNumber: "" })
    }
  }
  render() {
    const buttons = allbuttons.map((x, y) => <Buttons id={x.id} value={x.value} keycode={x.keycode} index={y} clear={this.handleClear} number={this.handleNumbers} decimal={this.handleDecimal} plusminus={this.handlePlusMinus} equal={this.handleEquals} operator={this.handleOperators}/>);
    return (
      <div id="calculator">
        <Display result={this.state.result} currentNumber={this.state.currentNumber} equation={this.state.equation} previousNumber={this.state.previousNumber} />
        <div id="container">
          {buttons}
        </div>
      </div>
    );
  }
}

export default App;
