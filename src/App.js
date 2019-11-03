import React from 'react';
import './App.css';

// Variables //

const MAXDIGIT = 16;

// REGEX //

const operators = /[-+/%*]/;
const endsWithOperators = /[-+/%*]$/;
const endsWithNeg = /-$/;
const endsWithNumber = /[0-9]$/;

// COMPONENTS //

// MAIN //

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: "0",
      formula: "",
      evaluated: false
    };
    this.displayLimit = this.displayLimit.bind(this);
    this.handleNumber = this.handleNumber.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
  };

  // Equals button to execute function //
  
  handleEquals() {
    const cValue = this.state.currentValue;
    const cFormula = this.state.formula;
    if (endsWithNumber.test(cValue)) {
      if (this.state.formula === "") {
        this.setState(state => {
          return {
            formula: cValue,
            currentValue: "",
            evaluated: true
          };
        });
      } else {
        let expression = cFormula + cValue;
        let result =
          // eslint-disable-next-line no-eval
          Math.round(10000000000000000000 * eval(expression)) /
          10000000000000000000;
        this.setState(state => {
          return {
            formula: "",
            currentValue: result.toString(),
            evaluated: true
          };
        });
      }
    };
  };

  // *,+,-,/ handles operator functions //
  
  handleOperator(e) {
    const operator = e.target.value;
    const cValue = this.state.currentValue;
    const cFormula = this.state.formula;
    // if a formula has been evaluated with =, to add to the answer //
    if (this.state.eavaluated === true) {
      this.setState(state => {
        return {
          formula: cFormula + operator,
          currentValue: operator,
          evaluated: false
        };
      });
    } else {
      // if new formula //
      if (!endsWithOperators.test(cValue)) {
        this.setState(state => {
          return {
            previousValue: cValue,
            formula: cFormula + cValue + operator,
            currentValue: operator
          };
        });
      } else if (operator === "-") {
        // faciliates input of negetive values //
        this.setState(state => {
          return {
            formula: cFormula,
            currentValue: operator
          };
        });
      } else {
        // handles input of two or more simaltaneous operators //
        this.setState(state => {
          return {
            formula: cFormula.slice(0, -1) + operator,
            currentValue: operator
          };
        });
      }
    }
  };

  // if the display capacity limit have been reached //
  
  displayLimit() {
    const tempValue = this.state.currentValue;
    this.setState(state => {
      return { 
        currentValue: "MAX CHAR REACHED", 
      };
    });
    setTimeout(() => {
      this.setState(state => {
        return { 
          currentValue: tempValue,
        };
      });
    }, 1000);
  };

  // AC (all clear) button, clears display and function. //
  
  handleClear() {
    this.setState(state => {
      return { 
        currentValue: "0", 
        formula: "" 
      };
    });
  };
  
  // DEL (delete) button, erases last character from current value //

  handleDelete() {
    const value = this.state.currentValue;
    if (value.length === 1) {
      this.setState(state => {
        return { 
          currentValue: "0", 
        };
      });
    } else {
      const newValue = value.slice(0, -1);
      this.setState(state => {
        return { 
          currentValue: newValue, 
        };
      });
    }
  };

  // 0-9, handles number inputs//
  
  handleNumber(e) {
    const value = e.target.value;
    const cValue = this.state.currentValue;
    const cFunction = this.state.formula;
    if (cValue.length <= MAXDIGIT) {
      // as long as screen cappacity has not been reached //
      if (!endsWithNeg.test(cFunction) && cValue === "-") {
        // to facialte entering negetive values //
        this.setState(state => {
          return {
            currentValue: cValue + value,
          };
        });
      } else if (cValue === "0" || operators.test(cValue) || this.state.evaluated === true) {
        // when entered after a 0 or operator //
        this.setState(state => {
          return { 
            currentValue: value, 
          };
        });
      } else {
        this.setState(state => {
          // default //
          return { 
            currentValue: state.currentValue + value, 
          };
        });
      }
    } else {
      // if screen capacity has been reched //
      this.displayLimit();
    }
  };

  // . handles the use of the decimal button //
  
  handleDecimal() {
    const cValue = this.state.currentValue;
    // within screen limit //
    if (cValue.length <= MAXDIGIT) {
      // prevents multiple "."s in one value //
      if (!cValue.includes(".")) {
        // enterd after a number //
        if (!operators.test(cValue)) {
          this.setState(state => {
            return { currentValue: cValue + "." };
          });
        } else {
          // entered with no number before so converted to 0. //
          // eslint-disable-next-line no-unused-vars
          const cFormula = this.state.formula;
          this.setState(state => {
            return { currentValue: "0." };
          });
        }
      }
    } else {
      // screen capacity reached // 
      this.displayLimit();
    }
  };

  render() {
    return (
      <div className="calculator">
        <Display
          display={this.state.currentValue}
          formula={this.state.formula}
        />
        <Buttons
          handleNumber={this.handleNumber}
          handleClear={this.handleClear}
          handleDelete={this.handleDelete}
          handleDecimal={this.handleDecimal}
          handleOperator={this.handleOperator}
          handleEquals={this.handleEquals}
          
        />
      </div>
    );
  }
};

// Display screen component //

class Display extends React.Component {
  render() {
    return (
      <div id="screen">
        <div id="display">
          <p>{this.props.display}</p>
        </div>
        <div id="formula">
          <p>{this.props.formula}</p>
        </div>
      </div>
    );
  }
};

// KeyPad component //

class Buttons extends React.Component {
  render() {
    return (
      <div className="buttons">
        <button
          id="zero"
          value="0"
          className="numbers"
          onClick={this.props.handleNumber}
        >
          0
        </button>
        <button
          id="one"
          value="1"
          className="numbers"
          onClick={this.props.handleNumber}
        >
          1
        </button>
        <button
          id="two"
          value="2"
          className="numbers"
          onClick={this.props.handleNumber}
        >
          2
        </button>
        <button
          id="three"
          value="3"
          className="numbers"
          onClick={this.props.handleNumber}
        >
          3
        </button>
        <button
          id="four"
          value="4"
          className="numbers"
          onClick={this.props.handleNumber}
        >
          4
        </button>
        <button
          id="five"
          value="5"
          className="numbers"
          onClick={this.props.handleNumber}
        >
          5
        </button>
        <button
          id="six"
          value="6"
          className="numbers"
          onClick={this.props.handleNumber}
        >
          6
        </button>
        <button
          id="seven"
          value="7"
          className="numbers"
          onClick={this.props.handleNumber}
        >
          7
        </button>
        <button
          id="eight"
          value="8"
          className="numbers"
          onClick={this.props.handleNumber}
        >
          8
        </button>
        <button
          id="nine"
          value="9"
          className="numbers"
          onClick={this.props.handleNumber}
        >
          9
        </button>
        <button
          id="add"
          value="+"
          className="operators"
          onClick={this.props.handleOperator}
        >
          +
        </button>
        <button
          id="subtract"
          value="-"
          className="operators"
          onClick={this.props.handleOperator}
        >
          -
        </button>
        <button
          id="divide"
          value="/"
          className="operators"
          onClick={this.props.handleOperator}
        >
          /
        </button>
        <button
          id="multiply"
          value="*"
          className="operators"
          onClick={this.props.handleOperator}
        >
          X
        </button>
        <button
          id="equals"
          value="="
          className="enter"
          onClick={this.props.handleEquals}
        >
          =
        </button>
        <button id="clear" value="clear" onClick={this.props.handleClear}>
          AC
        </button>
        <button
          id="decimal"
          value="."
          className="numbers"
          onClick={this.props.handleDecimal}
        >
          .
        </button>
        
        <button id="delete" value="delete" onClick={this.props.handleDelete}>
          DEL
        </button>
      </div>
    );
  }
};

export default App;