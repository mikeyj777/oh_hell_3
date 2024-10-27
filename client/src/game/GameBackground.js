import React from 'react';
import './GameBackground.css';

const GameBackground = ({ children }) => {
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
      
      {/* Content area */}
      <div className="game-content">
        {children}
      </div>
    </div>
  );
};

export default GameBackground;