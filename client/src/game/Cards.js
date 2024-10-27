import React from 'react';

class Cards {
  constructor() {
    // Initialize deck as array of integers 0-51
    this.deck = Array.from({ length: 52 }, (_, i) => i);
    this.hands = [];  // Add property to store hands
    this.trump = null;  // Add property to store trump card
  }

  // Shuffles the deck numShuffles times
  shuffle(numShuffles = 1) {
    for (let shuffle = 0; shuffle < numShuffles; shuffle++) {
      for (let i = this.deck.length - 1; i > 0; i--) {
        // Fisher-Yates shuffle algorithm
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
    }
  }

  // Deals numCards to numPlayers
  deal(numPlayers, numCards) {
    if (numPlayers * numCards > this.deck.length) {
      throw new Error('Not enough cards in deck to deal');
    }

    this.hands = Array(numPlayers).fill().map(() => []);
    
    // Deal one card at a time to each player
    for (let card = 0; card < numCards; card++) {
      for (let player = 0; player < numPlayers; player++) {
        this.hands[player].push(this.deck[card * numPlayers + player]);
      }
    }

    // Remove dealt cards from deck
    this.deck.splice(0, numPlayers * numCards);
    
    // Set trump card after dealing
    this.setTrump();
  }

  setTrump() {
    if (this.deck.length > 0) {
      this.trump = this.deck[0];
      this.deck.splice(0, 1);
    }
  }

  // Getters for component use
  getHands() {
    return this.hands;
  }

  getTrump() {
    return this.trump;
  }

  
  // Helper methods for converting numeric values to strings
  getSuitString(card) {
    const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    return suits[this.getSuit(card)];
  }

  getRankString(card) {
    const ranks = {
      11: 'Jack',
      12: 'Queen',
      13: 'King',
      14: 'Ace'
    };
    const rank = this.getRank(card);
    return ranks[rank] || rank.toString();
  }

  // Get full card name (e.g., "Ace of Spades")
  getCardName(card) {
    return `${this.getRankString(card)} of ${this.getSuitString(card)}`;
  }

  // Get current deck
  getDeck() {
    return this.deck;
  }

  // Get remaining cards count
  getCount() {
    return this.deck.length;
  }

}

const getSuit = (card) => Math.floor(card / 13);
const getRank = (card) => (card % 13) + 2;
export { Cards as default, getSuit, getRank };