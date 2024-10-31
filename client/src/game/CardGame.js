import React from 'react';
import GameBackground from './GameBackground';
import DealCards from './DealCards';
import CardPlacement from './CardPlacement';
import CardPlacementTest from './CardPlacementTest';
import './CardGameAndPlacement.css';

const CardGame = () => {
  const dealCards = new DealCards(6, 8);

  return (
    <div className="card-game-container">
      <GameBackground />
      <div className="game-content">
        <div className="game-board">
          <CardPlacementTest cards={dealCards.cards} />
          {/* <CardPlacement cards={dealCards.cards} /> */}
        </div>
      </div>
    </div>
  );
};

export default CardGame;