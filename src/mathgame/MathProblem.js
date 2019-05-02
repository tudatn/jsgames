import React from 'react'

class MathProblem extends React.Component {
  render() {
    return (
      <div className="problem">
        <button className="operand">{this.props.firstOperand}</button>
        <button className="operator">{this.props.operator}</button>
        <button className="operand">{this.props.secondOperand}</button>
      </div>
    )
  }
}

export default MathProblem;
