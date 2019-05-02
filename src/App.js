import React from 'react';
import './App.css';
import MathGame from './MathGame.js';

function App() {
  return (
    <div className="App">
      <h2>Hello, Emily!</h2>
      <MathGame attempsLimit="3"/>
    </div>
  );
}

export default App;
