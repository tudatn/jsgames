import React from 'react'
import './MathGameBoard.css'


class MathOperator extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onOperatorSelectionChange(e.target.innerText);
  }

  render() {
    let className = 'operatorOption';
    if (this.props.selected) {
      className += ' active';
    }
    return (
      <button className={className} onClick={this.handleClick}>{this.props.operator}</button>
    )
  }
}

export default MathOperator;
