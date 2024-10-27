import React from 'react';
import Cards from './Cards';

class DealCards {
  constructor(numPlayers, numCards) {
    this.cards = new Cards();
    this.cards.shuffle(7);
    this.cards.deal(numPlayers, numCards);
  }
}

export default DealCards;