import React from 'react';
import './GameBackground.css';

const GameBackground = () => {
  return (
    <div className="game-container">
      {/* Decorative pattern overlay */}
      <div className="pattern-overlay">
        <div className="dot-pattern" />
      </div>
      
      {/* Header */}
      <header className="game-header">
        <h1>Oh Hell Card Game</h1>
      </header>
    </div>
  );
};

export default GameBackground;