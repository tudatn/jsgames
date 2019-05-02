import React from 'react'
import MathOperator from './MathOperator.js'
import MathDifficultyLevel from './MathDifficultyLevel.js'
import MathProblem from './MathProblem.js'
import './MathGameBoard.css'

const OPERATORS = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷'
}

const LEVELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
}

const MINMAX = {
  easyMin: 1,
  easyMax: 100,
  mediumMin: 100,
  mediumMax: 10000,
  hardMin: 1000,
  hardMax: 1000000
}

class MathGameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.changeOperator = this.changeOperator.bind(this);
    this.changeLevel = this.changeLevel.bind(this);
    this.checkResult = this.checkResult.bind(this);
    this.nextProblem = this.nextProblem.bind(this);
    this.state = {
      selectedOperator: OPERATORS.addition,
      selectedLevel: LEVELS.medium,
      score: 0,
      attemps: 0,
      problemNth: 0,
      correctAnswer: false,
      win: false
    }
  }

  componentDidMount() {
    let level = this.state.selectedLevel;
    let operator = this.state.selectedOperator;
    this.getNewProblem(level, operator);
  }

  changeLevel(level) {
    this.setState({ selectedLevel: level });
    this.getNewProblem(level, this.state.selectedOperator);
  }

  changeOperator(operator) {
    this.setState({ selectedOperator: operator });
    this.getNewProblem(this.state.selectedLevel, operator);
  }

  checkResult() {
    let expectedResult = this.getResult();
    let result = Number(document.querySelector('#result').value);
    let score = this.state.score;
    let problemNth = this.state.problemNth;
    let attemps = this.state.attemps;
    if (result === expectedResult) {
      score++;
      this.setState({score: score, correctAnswer: true, problemNth: problemNth + 1, attemps: 0});
      this.getNewProblem(this.state.selectedLevel, this.state.selectedOperator);
    } else {
      if (attemps >= Number(this.props.attempsLimit)) {
        score = 0; // reset
        attemps = 0;
      } else {
        attemps = attemps + 1;
      }
      this.setState({correctAnswer: false, score: score, attemps: attemps});
    }
    this.checkWinner(score);
  }

  checkWinner(score) {
    let currentLevel = this.state.selectedLevel;
    if (currentLevel === LEVELS.medium || currentLevel === LEVELS.hard) {
      if (score === Number(this.props.target)) {
        this.setState({
          win: true
        })
      }
    }
  }

  nextProblem() {
    let level = this.state.selectedLevel;
    let operator = this.state.selectedOperator;
    this.getNewProblem(level, operator);
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  generateProblemOperands(level, operator) {
    var minMax = {min: MINMAX.easyMin, max: MINMAX.easyMax};
    switch(level) {
      case LEVELS.easy:
        minMax = {min: MINMAX.easyMin, max: MINMAX.easyMax};
        break;
      case LEVELS.medium:
        minMax = {min: MINMAX.easyMin, max: MINMAX.mediumMax};
        break;
      default:
        minMax = {min: MINMAX.easyMin, max: MINMAX.hardMax};
        break;
    }
    var firstNumber = this.getRandomInt(minMax.min, minMax.max);
    var secondNumber = this.getRandomInt(minMax.min, minMax.max);
    switch (operator) {
      case OPERATORS.subtraction:
        while (firstNumber < secondNumber) {
          firstNumber = this.getRandomInt(minMax.min, minMax.max);
          secondNumber = this.getRandomInt(minMax.min, minMax.max);
        }
        break;
        case OPERATORS.division:
          while (firstNumber % secondNumber !== 0) {
            firstNumber = this.getRandomInt(minMax.min, minMax.max);
            secondNumber = this.getRandomInt(minMax.min, minMax.max);
          }
          break;
        default: break;
    }
    return {firstOperand: firstNumber, secondOperand: secondNumber};
  }

  getNewProblem(level, operator) {
    var pairOfOperands = this.generateProblemOperands(level, operator);
    document.querySelector('#result').value = ''
    let problemNth = this.state.problemNth;
    this.setState({
      firstOperand: pairOfOperands.firstOperand, secondOperand: pairOfOperands.secondOperand, problemNth: problemNth + 1
    })
  }

  getResult() {
    let firstOp = this.state.firstOperand;
    let secondOp = this.state.secondOperand;
    let op = this.state.selectedOperator;
    switch (op) {
      case OPERATORS.subtraction:
        return firstOp - secondOp;
      case OPERATORS.multiplication:
        return firstOp * secondOp;
      case OPERATORS.division:
        return firstOp / secondOp;
      default:
        return firstOp + secondOp;
    }
  }

  render() {
    const operator = this.state.selectedOperator;
    const level = this.state.selectedLevel;
    const firstOp = this.state.firstOperand;
    const secondOp = this.state.secondOperand;

    const correctResult = this.state.correctAnswer;
    let correctGreeting = (
      <div><h3>{correctResult ? "Correct" : "Try Again"}</h3></div>
    )

    let winnerGreeting;
    const isWin = this.state.win;
    if (isWin) {
      winnerGreeting = (
        <div className="success"><h3>You Win. Enjoy 10 minutes watching Tivi!</h3></div>
      )
    }
    return (
      <div>
        <div className='board-option'>
          <h3>Choose a Math problem</h3>
          <MathOperator operator={OPERATORS.addition} selected={operator === OPERATORS.addition} onOperatorSelectionChange={this.changeOperator} />
          <MathOperator operator={OPERATORS.subtraction} selected={operator === OPERATORS.subtraction} onOperatorSelectionChange={this.changeOperator} />
          <MathOperator operator={OPERATORS.multiplication} selected={operator === OPERATORS.multiplication} onOperatorSelectionChange={this.changeOperator} />
          <MathOperator operator={OPERATORS.division} selected={operator === OPERATORS.division} onOperatorSelectionChange={this.changeOperator} />
        </div>

        <div className='board-option'>
          <h3>Choose difficulty level</h3>
          <MathDifficultyLevel level={LEVELS.easy} selected={level === LEVELS.easy} onLevelSelectionChange={this.changeLevel} />
          <MathDifficultyLevel level={LEVELS.medium} selected={level === LEVELS.medium} onLevelSelectionChange={this.changeLevel} />
          <MathDifficultyLevel level={LEVELS.hard} selected={level === LEVELS.hard} onLevelSelectionChange={this.changeLevel} />
        </div>

        <MathProblem firstOperand={firstOp} secondOperand={secondOp} operator={operator} />

        <input type="text" pattern="\d*" name="result" id="result" defaultValue='' />
        <div className="controller">
          <button className="navButton" onClick={this.checkResult}>Check</button>
          <button className="navButton" onClick={this.nextProblem}>Next</button>
        </div>
        {correctGreeting}
        {winnerGreeting}
        <p>Progress: {this.state.score}/{this.state.problemNth}</p>
      </div>
    )
  }

}

export default MathGameBoard;
