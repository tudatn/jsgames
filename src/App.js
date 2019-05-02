import React from 'react';
import './App.css';
import MathGameBoard from './mathgame/MathGameBoard.js'

function App() {
  return (
    <div className="App">
      <h2>Hello, Emily!</h2>
      <MathGameBoard attempsLimit='3' target='10'/>
    </div>
  );
}

export default App;
