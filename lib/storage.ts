// lib/storage.ts

import type { Deck } from './types';

const STORAGE_KEY = 'mia-slide-studio';

export function saveDecks(decks: Deck[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

export function loadDecks(): Deck[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveDeck(deck: Deck) {
  const decks = loadDecks();
  const index = decks.findIndex(d => d.id === deck.id);
  if (index >= 0) {
    decks[index] = { ...deck, updatedAt: new Date().toISOString() };
  } else {
    decks.push(deck);
  }
  saveDecks(decks);
}

export function deleteDeck(deckId: string) {
  const decks = loadDecks().filter(d => d.id !== deckId);
  saveDecks(decks);
}

export function getDeck(deckId: string): Deck | undefined {
  return loadDecks().find(d => d.id === deckId);
}
