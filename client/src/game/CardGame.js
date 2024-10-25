import React, { useState, useEffect } from 'react';
import './CardGame.css';

const ANIMATION_DELAY = 800;

const Card = ({ 
  card, 
  faceUp = false, 
  spread = false, 
  onClick = null, 
  isPlayed = false, 
  className = '',
  isPlayable = true 
}) => {
  const suits = {
    'hearts': '♥',
    'diamonds': '♦',
    'clubs': '♣',
    'spades': '♠'
  };

  const getColor = (suit) => {
    return ['hearts', 'diamonds'].includes(suit) ? 'red' : 'black';
  };

  const cardStyles = spread ? {
    position: 'relative',
    transform: 'none'
  } : {
    position: 'absolute',
    transform: `translateY(${card.offset * 8}px)`,
    zIndex: card.offset
  };

  const cardClassNames = `
    card
    ${onClick && isPlayable ? 'clickable' : ''}
    ${isPlayed ? 'played' : ''}
    ${!isPlayable ? 'not-playable' : ''}
    ${className}
  `.trim();

  if (!faceUp) {
    return (
      <div className={`card card-back ${cardClassNames}`} style={cardStyles}>
        <div className="card-back-inner"></div>
      </div>
    );
  }

  return (
    <div 
      className={cardClassNames} 
      style={cardStyles} 
      onClick={isPlayable ? onClick : null}
    >
      <div className={`card-rank ${getColor(card.suit)}`}>
        {card.rank}
      </div>
      <div className={`card-suit ${getColor(card.suit)}`}>
        {suits[card.suit]}
      </div>
    </div>
  );
};

const PlayedCard = ({ card, position, show }) => {
  const className = `played-card played-card-${position} ${show ? 'show' : ''}`;
  return (
    <div className={className}>
      <Card card={card} faceUp={true} />
    </div>
  );
};

const CardGroup = ({ 
  cards, 
  position, 
  faceUp, 
  onCardClick,
  isCardPlayable = () => true 
}) => {
  const isBottom = position === 'bottom';
  const className = `card-group card-group-${position} ${isBottom ? 'spread' : ''}`;

  const cardsWithOffset = cards.map((card, index) => ({
    ...card,
    offset: index
  }));

  return (
    <div className={className}>
      {cardsWithOffset.map((card, index) => (
        <Card 
          key={index} 
          card={card} 
          faceUp={faceUp} 
          spread={isBottom}
          onClick={isBottom ? () => onCardClick(card) : null}
          isPlayable={isCardPlayable(card)}
        />
      ))}
    </div>
  );
};

const getRankValue = (rank) => {
  const values = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 11
  };
  return values[rank] || parseInt(rank);
};

const CardGame = () => {
  const [hands, setHands] = useState({
    top: [],
    right: [],
    bottom: [],
    left: []
  });
  const [playedCards, setPlayedCards] = useState({});
  const [visibleCards, setVisibleCards] = useState({});
  const [winner, setWinner] = useState(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [leadSuit, setLeadSuit] = useState(null);

  const dealCards = () => {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    
    const deck = ranks.flatMap(rank => 
      suits.map(suit => ({ rank, suit }))
    ).sort(() => Math.random() - 0.5);
    
    setHands({
      top: deck.slice(0, 4),
      right: deck.slice(4, 8),
      bottom: deck.slice(8, 12),
      left: deck.slice(12, 16)
    });
    setPlayedCards({});
    setVisibleCards({});
    setWinner(null);
    setRoundComplete(false);
    setIsAnimating(false);
    setLeadSuit(null);
  };

  useEffect(() => {
    dealCards();
  }, []);

  const getPlayableCards = (hand, leadSuit) => {
    if (!leadSuit) return hand; // First player can play any card
    
    // If player has cards of the lead suit, they must play one
    const sameSuitCards = hand.filter(card => card.suit === leadSuit);
    return sameSuitCards.length > 0 ? sameSuitCards : hand;
  };

  const getAIPlay = (hand, leadSuit) => {
    const playableCards = getPlayableCards(hand, leadSuit);
    const randomIndex = Math.floor(Math.random() * playableCards.length);
    return playableCards[randomIndex];
  };

  const determineWinner = (playedCards, leadSuit) => {
    const players = Object.keys(playedCards);
    return players.reduce((winner, player) => {
      if (!winner) return player;
      
      const currentCard = playedCards[player];
      const winningCard = playedCards[winner];
      
      // If current card follows suit
      if (currentCard.suit === leadSuit) {
        // If winning card doesn't follow suit, current card wins
        if (winningCard.suit !== leadSuit) return player;
        // If both follow suit, higher rank wins
        return getRankValue(currentCard.rank) > getRankValue(winningCard.rank) ? player : winner;
      }
      
      // If current card doesn't follow suit but winning card does, winning card stays winner
      if (winningCard.suit === leadSuit) return winner;
      
      // If neither follows suit, higher rank wins
      return getRankValue(currentCard.rank) > getRankValue(winningCard.rank) ? player : winner;
    }, null);
  };

  const animateAIPlays = async (initialPlayedCards) => {
    setIsAnimating(true);
    const newPlayedCards = { ...initialPlayedCards };
    const newVisibleCards = { bottom: true };
    setVisibleCards(newVisibleCards);

    // Set lead suit from the first played card
    const firstPlayedCard = newPlayedCards.bottom;
    const currentLeadSuit = firstPlayedCard.suit;
    setLeadSuit(currentLeadSuit);

    for (const position of ['left', 'top', 'right']) {
      const hand = hands[position];
      if (hand.length > 0) {
        await new Promise(resolve => setTimeout(resolve, ANIMATION_DELAY));
        const playedCard = getAIPlay(hand, currentLeadSuit);
        newPlayedCards[position] = playedCard;
        newVisibleCards[position] = true;
        setVisibleCards({ ...newVisibleCards });
        setPlayedCards({ ...newPlayedCards });
      }
    }

    const newHands = { ...hands };
    Object.keys(newPlayedCards).forEach(position => {
      newHands[position] = newHands[position].filter(
        c => c.rank !== newPlayedCards[position].rank || c.suit !== newPlayedCards[position].suit
      );
    });
    setHands(newHands);

    await new Promise(resolve => setTimeout(resolve, ANIMATION_DELAY));
    const winningPlayer = determineWinner(newPlayedCards, currentLeadSuit);
    setWinner(winningPlayer);
    setRoundComplete(true);
    setIsAnimating(false);
  };

  const handleCardPlay = (card) => {
    if (roundComplete || isAnimating || playedCards.bottom) return;

    // Check if the played card follows suit rules
    const playableCards = getPlayableCards(hands.bottom, leadSuit);
    if (!playableCards.some(c => c.rank === card.rank && c.suit === card.suit)) {
      alert("You must follow suit if possible!");
      return;
    }

    const newPlayedCards = { bottom: card };
    setPlayedCards(newPlayedCards);
    
    // If this is the first card played, set it as the lead suit
    if (!leadSuit) {
      setLeadSuit(card.suit);
    }
    
    animateAIPlays(newPlayedCards);
  };

  const isCardPlayable = (card) => {
    if (!leadSuit) return true;
    const playableCards = getPlayableCards(hands.bottom, leadSuit);
    return playableCards.some(c => c.rank === card.rank && c.suit === card.suit);
  };

  return (
    <div className="game-container">
      <div className="game-board">
        {Object.entries(playedCards).map(([position, card]) => (
          <PlayedCard 
            key={position} 
            position={position} 
            card={card} 
            show={visibleCards[position]}
          />
        ))}

        <CardGroup cards={hands.top} position="top" faceUp={false} />
        <CardGroup cards={hands.right} position="right" faceUp={false} />
        <CardGroup 
          cards={hands.bottom} 
          position="bottom" 
          faceUp={true} 
          onCardClick={handleCardPlay}
          isCardPlayable={isCardPlayable}
        />
        <CardGroup cards={hands.left} position="left" faceUp={false} />

        {winner && (
          <div className="winner-display">
            {winner === 'bottom' ? 'You win!' : `${winner} player wins!`}
          </div>
        )}

        {roundComplete && (
          <button className="new-round-button" onClick={dealCards}>
            New Round
          </button>
        )}

        {isAnimating && (
          <div className="loading-indicator">
            Playing...
          </div>
        )}

        {leadSuit && (
          <div className="lead-suit-indicator">
            Lead Suit: {leadSuit}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardGame;