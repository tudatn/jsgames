import React from 'react'

class MathDifficultyLevel extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onLevelSelectionChange(e.target.innerText);
  }

  render() {
    let className = 'levelOption';
    if (this.props.selected) {
      className += ' active';
    }
    return (
      <button className={className} onClick={this.handleClick}>{this.props.level}</button>
    )
  }
}

export default MathDifficultyLevel;
