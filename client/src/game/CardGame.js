import React, { useState } from 'react';
import GameBackground from './GameBackground';
import DealCards from './DealCards';
import CardPlacement from './CardPlacement';
import './CardGameAndPlacement.css';

const CardGame = () => {
  // Create instance of DealCards with initial game parameters
  const dealCards = new DealCards(4, 3);

  return (
    <div className="card-game-container">
      <GameBackground>
        <div className="game-content">
          <CardPlacement cards={dealCards.cards} />
        </div>
      </GameBackground>
    </div>
  );
};

export default CardGame;