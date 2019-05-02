import React from 'react';
import './MathGame.css';

const levelMinMax = {
  easyMin: 1,
  easyMax: 100,
  mediumMin: 100,
  mediumMax: 1000,
  hardMin: 1000,
  hardMax: 10000
}

const level = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
}

const target = 10;

class MathGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {result: 0, firstOperand: 0, secondOperand: 0, operator: '+', correct: false, level: level.easy, score: 0, problemNth: 0, attempts: 0, win: false};
    this.selectDifficultLevel = this.selectDifficultLevel.bind(this);
    this.selectMathProblem = this.selectMathProblem.bind(this);
    this.checkResult = this.checkResult.bind(this);
    this.getNewProblem = this.getNewProblem.bind(this);
  }

  componentDidMount() {
    this.getNewProblem();
  }

  getNewProblem() {
    var pairOfOperands = this.getProblemNumber(this.state.level, this.state.operator);
    document.querySelector('#result').value = '';
    this.setState({
      firstOperand: pairOfOperands.firstOperand, secondOperand: pairOfOperands.secondOperand
    })
  }

  selectDifficultLevel(e) {
    let level = e.target.innerText;
    var pairOfOperands = this.getProblemNumber(level, this.state.operator);
    this.setState({
      firstOperand: pairOfOperands.firstOperand, secondOperand: pairOfOperands.secondOperand, level: level
    })
    if (level !== this.state.level) { this.resetBoard() }
  }

  resetBoard() {
    this.setState({
      score: 0, attempts: 0, problemNth: 0, correct: false, win: false
    })
  }

  checkWinner(score) {
    let currentLevel = this.state.level;
    if (currentLevel === level.medium || currentLevel === level.hard) {
      if (score === target) {
        this.setState({
          win: true
        })
      }
    }
  }

  getProblemNumber(currentLevel, operator) {
    var minMax = {min: levelMinMax.easyMin, max: levelMinMax.easyMax};
    switch(currentLevel) {
      case level.easy:
        minMax = {min: levelMinMax.easyMin, max: levelMinMax.easyMax};
        break;
      case level.medium:
        minMax = {min: levelMinMax.mediumMin, max: levelMinMax.mediumMax};
        break;
      default:
        minMax = {min: levelMinMax.hardMin, max: levelMinMax.hardMax};
        break;
    }
    var firstNumber = this.getRandomInt(minMax.min, minMax.max);
    var secondNumber = this.getRandomInt(minMax.min, minMax.max);
    switch (operator) {
      case '−':
        while (firstNumber < secondNumber) {
          firstNumber = this.getRandomInt(minMax.min, minMax.max);
          secondNumber = this.getRandomInt(minMax.min, minMax.max);
        }
        break;
        case '÷':
          while (firstNumber % secondNumber !== 0) {
            firstNumber = this.getRandomInt(minMax.min, minMax.max);
            secondNumber = this.getRandomInt(minMax.min, minMax.max);
          }
          break;
        default: break;
    }
    return {firstOperand: firstNumber, secondOperand: secondNumber};
  }

  selectMathProblem(e) {
    let operator = e.target.innerText;
    switch(operator) {
      case '−':
        this.setState({ operator: '−' });
        break;
      case '×':
        this.setState({ operator: '×' });
        break;
      case '÷':
        this.setState({ operator: '÷' });
        break;
      default:
        this.setState({ operator: '+' });
        break;
    }

    var pairOfOperands = this.getProblemNumber(this.state.level, operator);
    this.setState({
      firstOperand: pairOfOperands.firstOperand, secondOperand: pairOfOperands.secondOperand
    })
  }

  checkResult() {
    var score = this.state.score;
    var attemps = this.state.attempts;
    let problemNth = this.state.problemNth;
    let result = Number(document.querySelector('#result').value);
    let expectedResult = this.getResult();
    if (result === expectedResult) {
      score++;
      this.setState({score: score, correct: true, problemNth: problemNth + 1, attemps: 0});
      this.getNewProblem();
    } else {
      if (attemps >= Number(this.props.attempsLimit)) {
        score = 0; // reset
        attemps = 0;
      } else {
        attemps = attemps + 1;
      }
      this.setState({correct: false, score: score, attempts: attemps});
    }
    this.checkWinner(score);
  }

  getResult() {
    let firstOp = this.state.firstOperand;
    let secondOp = this.state.secondOperand;
    let op = this.state.operator;
    switch (op) {
      case '−':
        return firstOp - secondOp;
      case '×':
        return firstOp * secondOp;
      case '÷':
        return firstOp / secondOp;
      default:
        return firstOp + secondOp;
    }
  }

  componentWillUnmount() {

  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  render() {
    const correctResult = this.state.correct;
    let correctGreeting = (
      <div><h2>{correctResult ? "Correct" : "Try Again"}</h2></div>
    )

    let winnerGreeting;
    const isWin = this.state.win;
    if (isWin) {
      winnerGreeting = (
        <div className="success"><h2>You Win. Enjoy 10 minutes watching Tivi!</h2></div>
      )
    }

    return (
      <div className="MathGame">
        <h2>This is a Math game for you</h2>
        <h3>Choose a Math problem</h3>
        <div className="gameOption">
          <button className="operatorOption" onClick={this.selectMathProblem}>+</button>
          <button className="operatorOption" onClick={this.selectMathProblem}>&minus;</button>
          <button className="operatorOption" onClick={this.selectMathProblem}>&times;</button>
          <button className="operatorOption" onClick={this.selectMathProblem}>&divide;</button>
        </div>

        <h3>Choose a difficulty level:</h3>
        <div className="gameOption">
          <button className="levelOption" onClick={this.selectDifficultLevel}>{level.easy}</button>
          <button className="levelOption" onClick={this.selectDifficultLevel}>{level.medium}</button>
          <button className="levelOption" onClick={this.selectDifficultLevel}>{level.hard}</button>
        </div>

        <div className="problem">
          <button className="operand">{this.state.firstOperand}</button>
          <button className="operator">{this.state.operator}</button>
          <button className="operand">{this.state.secondOperand}</button>
        </div>
        <div className="result">
          <button className="operator"> = </button>
          <input type="text" pattern="\d*" name="result" id="result" />
        </div>

        <button className="navButton" onClick={this.checkResult}>Check</button>
        <button className="navButton" onClick={this.getNewProblem}>Next</button>
        {correctGreeting}
        {winnerGreeting}
        <div>
          <p>Progress: {this.state.score}/{this.state.problemNth}</p>
          <p>Level: {this.state.level}</p>
        </div>
      </div>
    )
  }
}

export default MathGame;
