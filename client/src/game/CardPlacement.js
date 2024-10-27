import React from 'react';
import { getSuit, getRank } from './Cards';
import './CardGameAndPlacement.css';

const CardPlacement = ({ cards }) => {
  const hands = cards.getHands();
  const numPlayers = hands.length;

  // Helper function to get card display info
  const getCardDisplay = (cardNumber) => {
    const suits = ['♣', '♦', '♥', '♠'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    const suit = getSuit(cardNumber);
    const rank = getRank(cardNumber) - 2; // Subtract 2 because ranks array is 0-based
    
    return {
      suit: suits[suit],
      rank: ranks[rank],
      color: suit === 1 || suit === 2 ? 'red' : 'black'
    };
  };

  // Calculate positions based on number of players
  const getPlayerPositions = () => {
    switch(numPlayers) {
      case 4:
        return [0, 1, 2, 3]; // Bottom, Right, Top, Left
      case 5:
        return [0, 1, 2, 3, 4]; // Bottom, Right, Top, Left, Top-Right
      case 6:
        return [0, 1, 2, 3, 4, 5]; // Bottom, Right, Top, Left, Top-Right, Top-Left
      case 7:
        return [0, 1, 2, 3, 4, 5, 6]; // Bottom, Right, Top, Left, Top-Right, Top-Left, Bottom-Right
      default:
        return [0, 1, 2, 3];
    }
  };

  // Component for card corners
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

  return (
    <div className="card-groups-container">
      {/* Play area with trump card */}
      <div className="play-area">
        {cards.getTrump() !== null && (
          <div className="card trump-card">
            <CardCorners {...getCardDisplay(cards.getTrump())} />
          </div>
        )}
      </div>

      {/* Player hands */}
      {hands.map((hand, playerIndex) => {
        const positions = getPlayerPositions();
        return (
          <div 
            key={`player-${playerIndex}`}
            className={`card-group card-group-position-${positions[playerIndex]}`}
          >
            {hand.map((card, cardIndex) => {
              const displayInfo = getCardDisplay(card);
              return (
                <div 
                  key={`card-${playerIndex}-${cardIndex}`}
                  className="card"
                >
                  <CardCorners {...displayInfo} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default CardPlacement;