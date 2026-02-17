// lib/charter.ts
// Charte graphique MIA — Toutes les constantes visuelles centralisées

export const MIA = {
  // === DIMENSIONS ===
  slide: {
    width: 1280,
    height: 720,
    ratio: '16:9',
    borderRadius: 0, // ANGLES DROITS obligatoires
  },

  // === COULEURS ===
  colors: {
    // Bleus (gamme principale)
    primary: '#1c42da',       // Bleu MIA principal
    primaryMedium: '#3b5bdb', // Bleu intermédiaire
    primaryLight: '#5872d8',  // Bleu clair (sous-parties)
    primaryPale: '#7c8fdb',   // Bleu pâle
    primaryBg: '#f0f4ff',     // Bleu très pâle (fonds)

    // Neutres
    black: '#1a1a1a',         // Noir titres
    textPrimary: '#374151',   // Gris texte
    textSecondary: '#6b7280', // Gris secondaire
    border: '#e5e7eb',        // Gris bordures
    bgLight: '#f8fafc',       // Gris fond léger
    white: '#ffffff',

    // Alertes
    warningBorder: '#f97316',
    warningBg: '#fff7ed',
    warningText: '#c2410c',
  },

  // === TYPOGRAPHIE ===
  fonts: {
    title: "'DM Sans', sans-serif",  // Titres uniquement
    body: "'Lato', sans-serif",      // Tout le reste
  },

  // === STYLES PRÉ-DÉFINIS ===
  styles: {
    // Titre principal (slides blancs)
    h1: {
      fontSize: '38px',
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: '700',
      color: '#1a1a1a',
      margin: '0',
    },
    // Titre partie (slides bleus)
    h1Partie: {
      fontSize: '52px',
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: '700',
      color: 'white',
      margin: '0',
      lineHeight: '1.2',
    },
    // Sous-titre — RÈGLE ABSOLUE : TOUJOURS BLEU #1c42da
    subtitle: {
      fontSize: '22px',
      color: '#1c42da', // NE JAMAIS CHANGER
      fontWeight: '400',
      fontStyle: 'normal', // JAMAIS italique
      margin: '-4px 0 0 0',
    },
    // Sous-titre sur fond bleu
    subtitleOnBlue: {
      fontSize: '22px',
      color: 'rgba(255,255,255,0.8)',
      margin: '20px 0 0 0',
      fontWeight: '400',
    },
    // Corps de texte
    body: {
      fontSize: '16px',
      fontFamily: "'Lato', sans-serif",
      color: '#374151',
      lineHeight: '1.6',
    },
    // Badge pilier
    badge: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1c42da',
      backgroundColor: '#f0f4ff',
      padding: '8px 16px',
      borderRadius: '8px',
    },
    // Badge inline (tags)
    tag: {
      backgroundColor: '#1c42da',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      color: 'white',
      fontWeight: '600',
    },
  },

  // === ÉLÉMENTS RÉCURRENTS ===
  elements: {
    // Barre bleue en bas (OBLIGATOIRE sur slides blancs)
    bottomBar: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: '8px',
      backgroundColor: '#1c42da',
    },
    // Bandeau bleu de message clé
    keyMessage: {
      backgroundColor: '#1c42da',
      borderRadius: '12px',
      padding: '14px 28px',
    },
    // Encart warning orange
    warning: {
      padding: '8px 12px',
      backgroundColor: '#fff7ed',
      border: '2px solid #f97316',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#c2410c',
      fontWeight: '600',
    },
    // Carte avec bordure
    card: {
      border: '2px solid #e5e7eb',
      borderRadius: '16px',
      padding: '20px',
    },
    // Carte mise en avant
    cardHighlight: {
      border: '2px solid #1c42da',
      borderRadius: '16px',
      padding: '20px',
      backgroundColor: '#f8fafc',
    },
    // Cercle icône numéroté
    numberCircle: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#1c42da',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      fontWeight: '800',
    },
  },
} as const;
