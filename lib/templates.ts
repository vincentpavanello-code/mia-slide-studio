// lib/templates.ts
// Factory functions pour créer des slides pré-remplis

import { v4 as uuidv4 } from 'uuid';
import type { Slide, SlideType } from './types';
import { MIA } from './charter';

function now() {
  return new Date().toISOString();
}

function makeSlide(overrides: Partial<Slide> & { type: SlideType; title: string }): Slide {
  return {
    id: uuidv4(),
    elements: [],
    backgroundColor: MIA.colors.white,
    createdAt: now(),
    updatedAt: now(),
    ...overrides,
  };
}

export function createTitleSlide(
  title = 'Titre de la présentation',
  subtitle = 'Sous-titre',
): Slide {
  return makeSlide({
    type: 'title',
    title,
    subtitle,
    backgroundColor: MIA.colors.primary,
    data: {
      date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    },
  });
}

export function createPartieSlide(
  title = 'Titre de la partie',
  subtitle = 'Sous-titre optionnel',
  number = '1',
): Slide {
  return makeSlide({
    type: 'partie',
    title,
    subtitle,
    badge: `PARTIE ${number}`,
    backgroundColor: MIA.colors.primary,
    data: { number },
  });
}

export function createSousPartieSlide(
  title = 'Titre de la sous-partie',
  subtitle?: string,
  number = '1.1',
): Slide {
  return makeSlide({
    type: 'sous-partie',
    title,
    subtitle,
    badge: number,
    backgroundColor: MIA.colors.primaryLight,
    data: { number },
  });
}

export function createContentSlide(
  title = 'Titre du contenu',
  subtitle = 'Sous-titre explicatif',
): Slide {
  return makeSlide({
    type: 'content',
    title,
    subtitle,
    backgroundColor: MIA.colors.white,
    data: {
      bulletPoints: ['Point clé 1', 'Point clé 2', 'Point clé 3'],
      keyMessage: 'Message clé à retenir',
    },
  });
}

export function createKeyFiguresSlide(
  title = 'Chiffres clés',
  subtitle = 'Les données essentielles',
): Slide {
  return makeSlide({
    type: 'key-figures',
    title,
    subtitle,
    backgroundColor: MIA.colors.white,
    data: {
      figures: [
        { value: '85%', label: 'des entreprises concernées' },
        { value: '3x', label: 'plus de productivité' },
        { value: '12M', label: "d'utilisateurs actifs" },
      ],
    },
  });
}

export function createComparisonSlide(
  title = 'Comparaison',
  subtitle = 'Analyse comparative',
): Slide {
  return makeSlide({
    type: 'comparison',
    title,
    subtitle,
    backgroundColor: MIA.colors.white,
    data: {
      columns: [
        { title: 'Option A', items: ['Avantage 1', 'Avantage 2', 'Avantage 3'], highlighted: false },
        { title: 'Option B', items: ['Avantage 1', 'Avantage 2', 'Avantage 3'], highlighted: true },
      ],
    },
  });
}

export function createProcessSlide(
  title = 'Notre processus',
  subtitle = 'Les étapes clés',
): Slide {
  return makeSlide({
    type: 'process',
    title,
    subtitle,
    backgroundColor: MIA.colors.white,
    data: {
      steps: [
        { number: 1, title: 'Analyse', description: 'Audit et diagnostic' },
        { number: 2, title: 'Stratégie', description: 'Plan d\'action' },
        { number: 3, title: 'Déploiement', description: 'Mise en œuvre' },
      ],
    },
  });
}

export function createQuoteSlide(
  title = 'Citation',
): Slide {
  return makeSlide({
    type: 'quote',
    title,
    backgroundColor: MIA.colors.white,
    data: {
      quote: {
        text: "L'intelligence artificielle est la nouvelle électricité.",
        author: 'Andrew Ng',
      },
    },
  });
}

export function createClosingSlide(
  title = 'Merci',
  subtitle = 'Des questions ?',
): Slide {
  return makeSlide({
    type: 'closing',
    title,
    subtitle,
    backgroundColor: MIA.colors.primary,
    data: {
      contact: 'contact@mister-ia.com',
    },
  });
}

export function createSlideByType(type: SlideType): Slide {
  switch (type) {
    case 'title':
      return createTitleSlide();
    case 'partie':
      return createPartieSlide();
    case 'sous-partie':
      return createSousPartieSlide();
    case 'content':
      return createContentSlide();
    case 'key-figures':
      return createKeyFiguresSlide();
    case 'comparison':
      return createComparisonSlide();
    case 'process':
      return createProcessSlide();
    case 'quote':
      return createQuoteSlide();
    case 'closing':
      return createClosingSlide();
  }
}

export const TEMPLATE_LIST: Array<{ type: SlideType; label: string; description: string }> = [
  { type: 'title', label: 'Couverture', description: 'Slide de titre avec fond bleu' },
  { type: 'partie', label: 'Partie', description: 'Séparateur de partie (fond bleu foncé)' },
  { type: 'sous-partie', label: 'Sous-partie', description: 'Séparateur de sous-partie (bleu clair)' },
  { type: 'content', label: 'Contenu', description: 'Slide de contenu avec bullet points' },
  { type: 'key-figures', label: 'Chiffres clés', description: '2-4 chiffres clés en grille' },
  { type: 'comparison', label: 'Comparaison', description: '2-3 colonnes comparatives' },
  { type: 'process', label: 'Processus', description: 'Étapes numérotées horizontales' },
  { type: 'quote', label: 'Citation', description: 'Citation avec auteur' },
  { type: 'closing', label: 'Fin', description: 'Slide de conclusion' },
];
