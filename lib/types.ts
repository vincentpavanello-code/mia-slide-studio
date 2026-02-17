// lib/types.ts

import type { CSSProperties } from 'react';

export type SlideType =
  | 'title'           // Slide de titre (couverture)
  | 'partie'          // Slide "Partie" (fond bleu foncé #1c42da)
  | 'sous-partie'     // Slide "Sous-partie" (fond bleu clair #5872d8)
  | 'content'         // Slide de contenu (fond blanc)
  | 'key-figures'     // Chiffres clés (2-4 gros chiffres)
  | 'comparison'      // Comparaison (2-3 colonnes)
  | 'process'         // Process / étapes (1-5 étapes)
  | 'quote'           // Citation
  | 'closing'         // Slide de fin

export interface SlideElement {
  id: string;
  type: 'text' | 'shape' | 'icon' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style: CSSProperties;
  editable: boolean;
  zIndex: number;
}

export interface Slide {
  id: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  badge?: string;
  elements: SlideElement[];
  backgroundColor: string;
  // Données structurées selon le type
  data?: {
    figures?: Array<{ value: string; label: string; unit?: string }>;
    columns?: Array<{ title: string; items: string[]; highlighted?: boolean }>;
    steps?: Array<{ number: number; title: string; description: string }>;
    quote?: { text: string; author: string };
    keyMessage?: string;
    bulletPoints?: string[];
    number?: string;
    date?: string;
    client?: string;
    contact?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Deck {
  id: string;
  name: string;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
}

// Types for AI generation
export interface GenerateRequest {
  prompt: string;
  slideType: SlideType;
  existingData?: Slide['data'];
}

export interface GenerateResponse {
  title: string;
  subtitle?: string;
  badge?: string;
  figures?: Array<{ value: string; label: string; unit?: string }>;
  columns?: Array<{ title: string; items: string[]; highlighted?: boolean }>;
  steps?: Array<{ number: number; title: string; description: string }>;
  quote?: { text: string; author: string };
  keyMessage?: string;
  bulletPoints?: string[];
  number?: string;
}
