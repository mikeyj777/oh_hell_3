import React, { useState, useEffect } from 'react';
import { getSuit, getRank } from './Cards';
import './CardGameAndPlacement.css';

const CardPlacementTest = ({ cards }) => {
  console.log('CardPlacementTest rendering');
  
  const hands = cards.getHands();
  const numPlayers = hands.length;
  const [playedCards, setPlayedCards] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const sampleTrick = [
    { value: 0, player: 1},
    { value: 15, player: 2 },
    { value: 27, player: 3 },
    { value: 30, player: 4 },
    { value: 29, player: 5 },
    { value: 50, player: 6 },
    { value: 4, player: 0 },
  ].slice(0, numPlayers);

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

  const startNewTrick = () => {
    console.log('Button clicked - startNewTrick called');
    console.log('Current state before:', { isPlaying, playedCards });
    setPlayedCards([]);
    setIsPlaying(true);  // This should trigger the useEffect
};

useEffect(() => {
  console.log('Effect running', { isPlaying, playedCardsLength: playedCards.length });
  
  if (!isPlaying) {
      console.log('Not playing, skipping effect');
      return;
  }

  // Only proceed if we're playing
  if (playedCards.length < numPlayers) {
      console.log('Setting up timer for next card');
      const timer = setTimeout(() => {
          console.log('Playing card', playedCards.length);
          setPlayedCards(prev => {
              console.log('Adding card:', sampleTrick[prev.length]);
              return [...prev, sampleTrick[prev.length]];
          });
      }, 2000);

      return () => {
          console.log('Clearing timer');
          clearTimeout(timer);
      };
  } else {
      console.log('Trick complete');
      setIsPlaying(false);
  }
}, [isPlaying, playedCards.length, numPlayers]);

  const getPositionClass = (index, totalPlayers) => {
    const baseClass = 'card-group';
    return `${baseClass} position-p${totalPlayers}-${index}`;
  };

  return (
    <div className="game-view" style={{ position: 'relative' }}>
      <div className={`card-groups-container players-${numPlayers}`}>
        {/* Trump card display */}
        <div className="trump-display">
          <div className="trump-label">Trump</div>
          {cards.getTrump() !== null && (
            <div className="card trump-card">
              <CardCorners {...getCardDisplay(cards.getTrump())} />
            </div>
          )}
        </div>

        {/* Play area */}
        <div className="play-area">
          {playedCards.map((card, index) => {
            console.log('Rendering played card', index);
            return (
              <div 
                key={`played-${index}`}
                className={`played-card played-card-position-${card.player}`}
                data-play-order={index}
              >
                <CardCorners {...getCardDisplay(card.value)} />
              </div>
            );
          })}
        </div>

        {/* Player hands */}
        {hands.map((hand, playerIndex) => (
          <div 
            key={`player-${playerIndex}`}
            className={getPositionClass(playerIndex, numPlayers)}
          >
            {hand.map((card, cardIndex) => (
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

      {/* Button positioned below play area */}
      <div style={{
        position: 'absolute',
        top: '200px',
        width: '100%',
        textAlign: 'center',
        marginTop: '20px',
        bottom: '-100px'
      }}>
        <button 
          onClick={startNewTrick}
          style={{
            padding: '8px 16px',
            backgroundColor: isPlaying ? '#ccc' : '#4f46e5',
            color: 'white',
            borderRadius: '4px',
            cursor: isPlaying ? 'not-allowed' : 'pointer',
            border: 'none',
            fontSize: '14px'
          }}
        >
          {isPlaying ? 'Playing Trick...' : 'Play Test Trick'}
        </button>
      </div>
    </div>
  );
};

export default CardPlacementTest;