import React from 'react';
import { getSuit, getRank } from './Cards';
import './CardGameAndPlacement.css';

const CardPlacement = ({ cards }) => {
  const hands = cards.getHands();
  const numPlayers = hands.length;

  const getCardDisplay = (cardNumber) => {
    const suits = ['♣', '♦', '♥', '♠'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    const suit = getSuit(cardNumber);
    const rank = getRank(cardNumber) - 2;
    
    return {
      suit: suits[suit],
      rank: ranks[rank],
      color: suit === 1 || suit === 2 ? 'red' : 'black'
    };
  };

  const CardCorners = ({ rank, suit, color }) => (
    <>
      <div className={`card-corner top-left ${color}`}>
        <div className="card-rank">{rank}</div>
        <div className="card-suit">{suit}</div>
      </div>
      <div className={`card-corner bottom-right ${color}`}>
        <div className="card-rank">{rank}</div>
        <div className="card-suit">{suit}</div>
      </div>
    </>
  );

  // Get max cards based on number of players
  const getMaxCards = (players) => {
    return Math.floor(52 / players);
  };

  // Get position class based on player index and total players
  const getPositionClass = (index, totalPlayers) => {
    const baseClass = 'card-group';
    
    // Add positioning class based on player count and index
    return `${baseClass} position-p${totalPlayers}-${index}`;
  };

  return (
    <div className={`card-groups-container players-${numPlayers}`}>
      {/* Play area with trump card */}
      <div className="play-area">
        {cards.getTrump() !== null && (
          <div className="card trump-card">
            <CardCorners {...getCardDisplay(cards.getTrump())} />
          </div>
        )}
      </div>

      {/* Player hands */}
      {hands.map((hand, playerIndex) => (
        <div 
          key={`player-${playerIndex}`}
          className={getPositionClass(playerIndex, numPlayers)}
        >
          {hand.slice(0, getMaxCards(numPlayers)).map((card, cardIndex) => (
            <div 
              key={`card-${playerIndex}-${cardIndex}`}
              className="card"
            >
              <CardCorners {...getCardDisplay(card)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CardPlacement;