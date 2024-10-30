import React from 'react';
import GameBackground from './GameBackground';
import DealCards from './DealCards';
import CardPlacement from './CardPlacement';
import './CardGameAndPlacement.css';

const CardGame = () => {
  const dealCards = new DealCards(4, 13);

  return (
    <div className="card-game-container">
      <GameBackground />
      <div className="game-content">
        <div className="game-board">
          <CardPlacement cards={dealCards.cards} />
        </div>
      </div>
    </div>
  );
};

export default CardGame;