import React from 'react';
import GameBackground from './GameBackground';
import DealCards from './DealCards';
import CardPlacement from './CardPlacement';
import './CardGameAndPlacement.css';

const CardGame = () => {
  const dealCards = new DealCards(4, 3);

  return (
    <div className="card-game-container">
      <GameBackground />
      <div className="game-content">
        <CardPlacement cards={dealCards.cards} />
      </div>
    </div>
  );
};

export default CardGame;