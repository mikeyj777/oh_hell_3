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

  const getMaxCards = (players) => {
    return Math.floor(52 / players);
  };

  // Position maps for correct clockwise dealing order
  const getPositionClass = (index, totalPlayers) => {
    const baseClass = 'card-group';
    
    const positionMaps = {
      4: {
        0: 'position-p4-0', // Bottom
        1: 'position-p4-1', // Left
        2: 'position-p4-2', // Top
        3: 'position-p4-3'  // Right
      },
      5: {
        0: 'position-p5-0', // Bottom
        1: 'position-p5-1', // Left
        2: 'position-p5-2', // Top-left
        3: 'position-p5-3', // Top-right
        4: 'position-p5-4'  // Right
      },
      6: {
        0: 'position-p6-0', // Bottom
        1: 'position-p6-4', // Left-bottom
        2: 'position-p6-1', // Left-top
        3: 'position-p6-2', // Top
        4: 'position-p6-3', // Right-top
        5: 'position-p6-5'  // Right-bottom
      },
      7: {
        0: 'position-p7-0', // Bottom
        1: 'position-p7-5', // Left-bottom
        2: 'position-p7-1', // Left-top
        3: 'position-p7-2', // Top-left
        4: 'position-p7-3', // Top-right
        5: 'position-p7-4', // Right-top
        6: 'position-p7-6'  // Right-bottom
      }
    };

    return `${baseClass} ${positionMaps[totalPlayers][index]}`;
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