// components/SlideRenderer.tsx
// Rendu pur HTML/CSS inline de chaque type de slide (pas de Tailwind)
// Visuels riches : dégradés, patterns, ombres, profondeur

'use client';

import React from 'react';
import type { Slide } from '@/lib/types';
import { MIA } from '@/lib/charter';

interface SlideRendererProps {
  slide: Slide;
  scale?: number;
}

export default function SlideRenderer({ slide, scale }: SlideRendererProps) {
  // Mode artefact : le slide contient du HTML généré par l'IA
  if (slide.htmlContent) {
    return (
      <div
        style={{
          width: MIA.slide.width,
          height: MIA.slide.height,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 0,
          ...(scale ? { transform: `scale(${scale})`, transformOrigin: 'top left' } : {}),
        }}
        dangerouslySetInnerHTML={{ __html: slide.htmlContent }}
      />
    );
  }

  // Mode template : rendu via composants React
  const containerStyle: React.CSSProperties = {
    width: MIA.slide.width,
    height: MIA.slide.height,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: MIA.fonts.body,
    backgroundColor: slide.backgroundColor || MIA.colors.white,
    borderRadius: 0,
    ...(scale ? { transform: `scale(${scale})`, transformOrigin: 'top left' } : {}),
  };

  return (
    <div style={containerStyle}>
      {renderSlideContent(slide)}
    </div>
  );
}

function renderSlideContent(slide: Slide) {
  switch (slide.type) {
    case 'title': return <TitleSlide slide={slide} />;
    case 'partie': return <PartieSlide slide={slide} />;
    case 'sous-partie': return <SousPartieSlide slide={slide} />;
    case 'content': return <ContentSlide slide={slide} />;
    case 'key-figures': return <KeyFiguresSlide slide={slide} />;
    case 'comparison': return <ComparisonSlide slide={slide} />;
    case 'process': return <ProcessSlide slide={slide} />;
    case 'quote': return <QuoteSlide slide={slide} />;
    case 'closing': return <ClosingSlide slide={slide} />;
    default: return <ContentSlide slide={slide} />;
  }
}

// =====================================================
// Éléments décoratifs réutilisables
// =====================================================

function BlueBackground({ variant = 'primary' }: { variant?: 'primary' | 'light' }) {
  const baseColor = variant === 'primary' ? MIA.colors.primary : MIA.colors.primaryLight;
  return (
    <>
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: variant === 'primary'
          ? 'linear-gradient(135deg, #1c42da 0%, #1535b0 40%, #0f2a8a 100%)'
          : 'linear-gradient(135deg, #5872d8 0%, #4a63c9 40%, #3b54ba 100%)',
        zIndex: 0,
      }} />
      {/* Cercle lumineux haut-droit */}
      <div style={{
        position: 'absolute', top: -120, right: -80,
        width: 450, height: 450, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)`,
        zIndex: 0,
      }} />
      {/* Cercle lumineux bas-gauche */}
      <div style={{
        position: 'absolute', bottom: -150, left: -100,
        width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)`,
        zIndex: 0,
      }} />
      {/* Petit cercle décoratif milieu-droit */}
      <div style={{
        position: 'absolute', top: '40%', right: 60,
        width: 180, height: 180, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.08)',
        zIndex: 0,
      }} />
      {/* Ligne géométrique diagonale subtile */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '60%', height: '100%',
        background: 'linear-gradient(135deg, transparent 0%, transparent 49%, rgba(255,255,255,0.03) 49%, rgba(255,255,255,0.03) 51%, transparent 51%)',
        zIndex: 0,
      }} />
      {/* Motif de points subtil en bas à droite */}
      <div style={{
        position: 'absolute', bottom: 40, right: 40,
        width: 120, height: 80, zIndex: 0, opacity: 0.15,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '12px 12px',
      }} />
      {/* Barre latérale gauche lumineuse */}
      <div style={{
        position: 'absolute', left: 0, top: '15%', bottom: '15%',
        width: 4, backgroundColor: `rgba(255,255,255,0.15)`,
        borderRadius: 2, zIndex: 0,
      }} />
    </>
  );
}

function BottomBar() {
  return <div style={{ ...MIA.elements.bottomBar, zIndex: 2 }} />;
}

function WhiteSlideDecor() {
  return (
    <>
      {/* Motif de points discret en haut à droite */}
      <div style={{
        position: 'absolute', top: 28, right: 50,
        width: 60, height: 40, zIndex: 0, opacity: 0.4,
        backgroundImage: `radial-gradient(circle, ${MIA.colors.primary}33 1px, transparent 1px)`,
        backgroundSize: '8px 8px',
      }} />
      {/* Ligne fine décorative sous le header */}
      <div style={{
        position: 'absolute', top: 100, left: 50, right: 50,
        height: 1, backgroundColor: MIA.colors.border, zIndex: 0, opacity: 0.5,
      }} />
    </>
  );
}

// =====================================================
// 1. Slide Titre (couverture)
// =====================================================

function TitleSlide({ slide }: { slide: Slide }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <BlueBackground variant="primary" />

      {/* Bandeau décoratif en haut */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 5,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%)',
        zIndex: 1,
      }} />

      {/* Contenu centré */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 100px',
      }}>
        {/* Petit séparateur au-dessus du titre */}
        <div style={{
          width: 50, height: 3, backgroundColor: 'rgba(255,255,255,0.4)',
          borderRadius: 2, marginBottom: 30,
        }} />

        <h1 style={{
          fontSize: '52px', fontFamily: MIA.fonts.title, fontWeight: '700',
          color: 'white', margin: '0 0 16px 0', lineHeight: '1.15',
          textAlign: 'center', letterSpacing: '-0.5px',
        }}>
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p style={{
            fontSize: '22px', color: 'rgba(255,255,255,0.75)',
            margin: '8px 0 0 0', fontWeight: '300', textAlign: 'center',
            fontFamily: MIA.fonts.body, lineHeight: '1.5',
            maxWidth: 800,
          }}>
            {slide.subtitle}
          </p>
        )}

        {/* Séparateur après sous-titre */}
        <div style={{
          width: 50, height: 3, backgroundColor: 'rgba(255,255,255,0.4)',
          borderRadius: 2, marginTop: 36,
        }} />

        {slide.data?.date && (
          <p style={{
            color: 'rgba(255,255,255,0.45)', fontSize: '15px',
            marginTop: 28, fontFamily: MIA.fonts.body, letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            {slide.data.date}
            {slide.data.client && ` — ${slide.data.client}`}
          </p>
        )}
      </div>

      {/* Ligne en bas */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.05) 100%)',
        zIndex: 1,
      }} />
    </div>
  );
}

// =====================================================
// 2. Slide "Partie" (fond bleu #1c42da)
// =====================================================

function PartieSlide({ slide }: { slide: Slide }) {
  const number = slide.data?.number || '1';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <BlueBackground variant="primary" />

      {/* Grand numéro décoratif */}
      <div style={{
        position: 'absolute', bottom: -30, right: 20,
        fontSize: '320px', fontFamily: MIA.fonts.title, fontWeight: '900',
        color: 'rgba(255,255,255,0.04)', lineHeight: '1', zIndex: 0,
        letterSpacing: '-10px',
      }}>
        {number}
      </div>

      {/* Contenu centré */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 100px',
      }}>
        {/* Badge */}
        {slide.badge && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
            backdropFilter: 'blur(10px)',
            padding: '10px 28px', borderRadius: '24px',
            fontSize: '13px', fontWeight: '700', color: 'white',
            letterSpacing: '3px', textTransform: 'uppercase',
            marginBottom: '28px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            {slide.badge}
          </div>
        )}

        <h1 style={{
          fontSize: '52px', fontFamily: MIA.fonts.title, fontWeight: '700',
          color: 'white', margin: '0', lineHeight: '1.2',
          textAlign: 'center', letterSpacing: '-0.5px',
        }}>
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p style={{
            fontSize: '20px', color: 'rgba(255,255,255,0.65)',
            margin: '20px 0 0 0', fontWeight: '400', textAlign: 'center',
            fontFamily: MIA.fonts.body, lineHeight: '1.5',
            maxWidth: 700,
          }}>
            {slide.subtitle}
          </p>
        )}

        {/* Ligne décorative en bas du texte */}
        <div style={{
          width: 60, height: 3, marginTop: 32,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          borderRadius: 2,
        }} />
      </div>
    </div>
  );
}

// =====================================================
// 3. Slide "Sous-partie" (fond bleu #5872d8)
// =====================================================

function SousPartieSlide({ slide }: { slide: Slide }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <BlueBackground variant="light" />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 100px',
      }}>
        {/* Badge */}
        {slide.badge && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
            padding: '8px 24px', borderRadius: '24px',
            fontSize: '15px', fontWeight: '700', color: 'white',
            letterSpacing: '1px', marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            {slide.badge}
          </div>
        )}

        <h1 style={{
          fontSize: '44px', fontFamily: MIA.fonts.title, fontWeight: '700',
          color: 'white', margin: '0', textAlign: 'center',
          lineHeight: '1.25', letterSpacing: '-0.3px',
        }}>
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p style={{
            fontSize: '19px', color: 'rgba(255,255,255,0.6)',
            margin: '18px 0 0 0', fontWeight: '400', textAlign: 'center',
            fontFamily: MIA.fonts.body, lineHeight: '1.5',
          }}>
            {slide.subtitle}
          </p>
        )}

        {/* Ligne décorative centrée en bas */}
        <div style={{
          position: 'absolute', bottom: 55, left: '50%', transform: 'translateX(-50%)',
          width: 60, height: 3, borderRadius: 2,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
        }} />
      </div>
    </div>
  );
}

// =====================================================
// 4. Slide Contenu (fond blanc)
// =====================================================

function ContentSlide({ slide }: { slide: Slide }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '36px 56px 48px 56px', position: 'relative',
      backgroundColor: MIA.colors.white,
    }}>
      <WhiteSlideDecor />

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '28px', position: 'relative', zIndex: 1,
      }}>
        <div>
          <h1 style={{
            ...MIA.styles.h1, fontSize: '34px', letterSpacing: '-0.3px',
          }}>
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p style={{
              ...MIA.styles.subtitle, fontSize: '18px', marginTop: '4px',
            }}>
              {slide.subtitle}
            </p>
          )}
        </div>
        {slide.badge && (
          <div style={{
            ...MIA.styles.badge,
            boxShadow: '0 2px 8px rgba(28,66,218,0.1)',
          }}>
            {slide.badge}
          </div>
        )}
      </div>

      {/* Séparateur */}
      <div style={{
        height: 2, background: `linear-gradient(90deg, ${MIA.colors.primary}, ${MIA.colors.primaryPale}40, transparent)`,
        marginBottom: 24, borderRadius: 1, position: 'relative', zIndex: 1,
      }} />

      {/* Zone de contenu flexible */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-start', gap: '14px',
        position: 'relative', zIndex: 1,
      }}>
        {slide.data?.bulletPoints && slide.data.bulletPoints.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {slide.data.bulletPoints.map((point, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '12px 16px', borderRadius: '10px',
                backgroundColor: i % 2 === 0 ? MIA.colors.primaryBg + '80' : 'transparent',
                transition: 'background-color 0.2s',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  backgroundColor: MIA.colors.primary,
                  color: 'white', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '13px', fontWeight: '700',
                  flexShrink: 0, marginTop: 1,
                  fontFamily: MIA.fonts.title,
                }}>
                  {i + 1}
                </div>
                <p style={{
                  ...MIA.styles.body, margin: 0, fontSize: '17px',
                  lineHeight: '1.55', paddingTop: '3px',
                }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bandeau message clé */}
      {slide.data?.keyMessage && (
        <div style={{
          background: `linear-gradient(135deg, ${MIA.colors.primary} 0%, #1535b0 100%)`,
          borderRadius: '12px', padding: '16px 28px',
          color: 'white', fontSize: '16px', fontWeight: '600',
          fontFamily: MIA.fonts.body, marginTop: '16px',
          position: 'relative', zIndex: 1,
          boxShadow: '0 4px 16px rgba(28,66,218,0.25)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', flexShrink: 0,
          }}>
            &#10148;
          </div>
          {slide.data.keyMessage}
        </div>
      )}

      <BottomBar />
    </div>
  );
}

// =====================================================
// 5. Slide Chiffres Clés
// =====================================================

function KeyFiguresSlide({ slide }: { slide: Slide }) {
  const figures = slide.data?.figures || [];
  const colors = [
    { bg: '#eef2ff', accent: MIA.colors.primary },
    { bg: '#f0fdf4', accent: '#16a34a' },
    { bg: '#fef3c7', accent: '#d97706' },
    { bg: '#fce7f3', accent: '#db2777' },
  ];

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '36px 56px 48px 56px', position: 'relative',
      backgroundColor: MIA.colors.white,
    }}>
      <WhiteSlideDecor />

      {/* Header */}
      <div style={{ marginBottom: '28px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ ...MIA.styles.h1, fontSize: '34px', letterSpacing: '-0.3px' }}>
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p style={{ ...MIA.styles.subtitle, fontSize: '18px', marginTop: '4px' }}>
            {slide.subtitle}
          </p>
        )}
      </div>

      {/* Séparateur */}
      <div style={{
        height: 2, background: `linear-gradient(90deg, ${MIA.colors.primary}, ${MIA.colors.primaryPale}40, transparent)`,
        marginBottom: 32, borderRadius: 1, position: 'relative', zIndex: 1,
      }} />

      {/* Grille de chiffres */}
      <div style={{
        flex: 1, display: 'flex', gap: '20px',
        alignItems: 'stretch', justifyContent: 'center',
        position: 'relative', zIndex: 1,
      }}>
        {figures.map((fig, i) => {
          const c = colors[i % colors.length];
          return (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', borderRadius: '16px',
              backgroundColor: c.bg, padding: '28px 20px',
              border: `1px solid ${c.accent}20`,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Cercle décoratif en arrière-plan */}
              <div style={{
                position: 'absolute', top: -20, right: -20,
                width: 80, height: 80, borderRadius: '50%',
                backgroundColor: `${c.accent}10`,
              }} />
              <div style={{
                fontSize: '54px', fontFamily: MIA.fonts.title,
                fontWeight: '800', color: c.accent,
                lineHeight: '1', marginBottom: '10px',
                position: 'relative', zIndex: 1,
              }}>
                {fig.value}
                {fig.unit && (
                  <span style={{ fontSize: '24px', marginLeft: '2px', fontWeight: '600' }}>
                    {fig.unit}
                  </span>
                )}
              </div>
              <div style={{
                width: 30, height: 2, backgroundColor: `${c.accent}40`,
                borderRadius: 1, marginBottom: '10px',
              }} />
              <div style={{
                fontSize: '14px', color: MIA.colors.textPrimary,
                fontFamily: MIA.fonts.body, lineHeight: '1.4',
                fontWeight: '500', position: 'relative', zIndex: 1,
              }}>
                {fig.label}
              </div>
            </div>
          );
        })}
      </div>

      <BottomBar />
    </div>
  );
}

// =====================================================
// 6. Slide Comparaison
// =====================================================

function ComparisonSlide({ slide }: { slide: Slide }) {
  const columns = slide.data?.columns || [];

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '36px 56px 48px 56px', position: 'relative',
      backgroundColor: MIA.colors.white,
    }}>
      <WhiteSlideDecor />

      {/* Header */}
      <div style={{ marginBottom: '28px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ ...MIA.styles.h1, fontSize: '34px', letterSpacing: '-0.3px' }}>
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p style={{ ...MIA.styles.subtitle, fontSize: '18px', marginTop: '4px' }}>
            {slide.subtitle}
          </p>
        )}
      </div>

      <div style={{
        height: 2, background: `linear-gradient(90deg, ${MIA.colors.primary}, ${MIA.colors.primaryPale}40, transparent)`,
        marginBottom: 28, borderRadius: 1, position: 'relative', zIndex: 1,
      }} />

      {/* Colonnes */}
      <div style={{
        flex: 1, display: 'flex', gap: '20px',
        alignItems: 'stretch', position: 'relative', zIndex: 1,
      }}>
        {columns.map((col, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            borderRadius: '16px', padding: '24px',
            border: col.highlighted
              ? `2px solid ${MIA.colors.primary}`
              : `1px solid ${MIA.colors.border}`,
            backgroundColor: col.highlighted ? '#f8faff' : MIA.colors.white,
            boxShadow: col.highlighted
              ? '0 4px 20px rgba(28,66,218,0.12)'
              : '0 2px 8px rgba(0,0,0,0.04)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Bandeau coloré en haut */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 4,
              backgroundColor: col.highlighted ? MIA.colors.primary : MIA.colors.border,
              borderRadius: '16px 16px 0 0',
            }} />

            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: '18px', marginTop: '4px',
            }}>
              <h3 style={{
                fontSize: '19px', fontFamily: MIA.fonts.title, fontWeight: '700',
                color: col.highlighted ? MIA.colors.primary : MIA.colors.black,
                margin: '0',
              }}>
                {col.title}
              </h3>
              {col.highlighted && (
                <span style={{
                  background: `linear-gradient(135deg, ${MIA.colors.primary}, #1535b0)`,
                  padding: '4px 12px', borderRadius: '20px',
                  fontSize: '10px', color: 'white', fontWeight: '700',
                  letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>
                  Recommandé
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {col.items.map((item, j) => (
                <div key={j} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '8px',
                  backgroundColor: col.highlighted ? 'rgba(28,66,218,0.04)' : '#f9fafb',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    backgroundColor: col.highlighted ? MIA.colors.primary + '20' : '#e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '11px',
                    color: col.highlighted ? MIA.colors.primary : MIA.colors.textSecondary,
                    fontWeight: '700',
                  }}>
                    &#10003;
                  </div>
                  <span style={{ ...MIA.styles.body, margin: 0, fontSize: '15px' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomBar />
    </div>
  );
}

// =====================================================
// 7. Slide Process / Étapes
// =====================================================

function ProcessSlide({ slide }: { slide: Slide }) {
  const steps = slide.data?.steps || [];

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '36px 56px 48px 56px', position: 'relative',
      backgroundColor: MIA.colors.white,
    }}>
      <WhiteSlideDecor />

      {/* Header */}
      <div style={{ marginBottom: '28px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ ...MIA.styles.h1, fontSize: '34px', letterSpacing: '-0.3px' }}>
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p style={{ ...MIA.styles.subtitle, fontSize: '18px', marginTop: '4px' }}>
            {slide.subtitle}
          </p>
        )}
      </div>

      <div style={{
        height: 2, background: `linear-gradient(90deg, ${MIA.colors.primary}, ${MIA.colors.primaryPale}40, transparent)`,
        marginBottom: 40, borderRadius: 1, position: 'relative', zIndex: 1,
      }} />

      {/* Ligne de connexion horizontale */}
      <div style={{
        position: 'absolute', zIndex: 1,
        top: '55%', left: `${56 + 40}px`, right: `${56 + 40}px`,
        height: 2, backgroundColor: MIA.colors.border,
      }} />

      {/* Étapes */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: '12px',
        position: 'relative', zIndex: 2, paddingTop: '20px',
      }}>
        {steps.map((step, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', flex: 1, maxWidth: 220,
          }}>
            {/* Cercle numéroté */}
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: `linear-gradient(135deg, ${MIA.colors.primary} 0%, #1535b0 100%)`,
              color: 'white', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '24px', fontWeight: '800',
              fontFamily: MIA.fonts.title,
              boxShadow: '0 4px 16px rgba(28,66,218,0.3)',
              marginBottom: '16px',
              border: '3px solid white',
            }}>
              {step.number}
            </div>

            {/* Carte */}
            <div style={{
              backgroundColor: '#f8faff', borderRadius: '12px',
              padding: '16px 14px', width: '100%',
              border: `1px solid ${MIA.colors.primary}15`,
            }}>
              <h4 style={{
                fontSize: '16px', fontFamily: MIA.fonts.title, fontWeight: '700',
                color: MIA.colors.primary, margin: '0 0 6px 0',
              }}>
                {step.title}
              </h4>
              <p style={{
                fontSize: '13px', color: MIA.colors.textSecondary,
                margin: 0, lineHeight: '1.45', fontFamily: MIA.fonts.body,
              }}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <BottomBar />
    </div>
  );
}

// =====================================================
// 8. Slide Citation
// =====================================================

function QuoteSlide({ slide }: { slide: Slide }) {
  const quote = slide.data?.quote;

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      position: 'relative', backgroundColor: MIA.colors.white,
    }}>
      {/* Bande colorée latérale gauche */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 8,
        background: `linear-gradient(180deg, ${MIA.colors.primary} 0%, ${MIA.colors.primaryLight} 100%)`,
        zIndex: 1,
      }} />

      {/* Motif décoratif */}
      <div style={{
        position: 'absolute', top: 40, right: 60, opacity: 0.06,
        fontSize: '200px', fontFamily: 'Georgia, serif', color: MIA.colors.primary,
        lineHeight: '1', zIndex: 0,
      }}>
        &ldquo;
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '40px 70px 48px 70px', position: 'relative', zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ ...MIA.styles.h1, fontSize: '30px' }}>
            {slide.title}
          </h1>
        </div>

        <div style={{
          height: 2, background: `linear-gradient(90deg, ${MIA.colors.primary}, ${MIA.colors.primaryPale}40, transparent)`,
          marginBottom: 20, borderRadius: 1,
        }} />

        {/* Citation centrée */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '0 40px',
        }}>
          {quote && (
            <>
              <div style={{
                fontSize: '80px', color: MIA.colors.primary,
                fontFamily: 'Georgia, serif', lineHeight: '0.5',
                marginBottom: '10px', opacity: 0.3,
              }}>
                &ldquo;
              </div>
              <p style={{
                fontSize: '28px', fontFamily: MIA.fonts.body,
                color: MIA.colors.black, textAlign: 'center',
                lineHeight: '1.55', fontStyle: 'normal',
                margin: '0 0 28px 0', fontWeight: '300',
                maxWidth: 900,
              }}>
                {quote.text}
              </p>
              <div style={{
                width: 40, height: 3, backgroundColor: MIA.colors.primary,
                borderRadius: 2, marginBottom: 16,
              }} />
              <div style={{
                fontSize: '16px', color: MIA.colors.primary,
                fontWeight: '700', fontFamily: MIA.fonts.title,
                letterSpacing: '0.5px',
              }}>
                {quote.author}
              </div>
            </>
          )}
        </div>
      </div>

      <BottomBar />
    </div>
  );
}

// =====================================================
// 9. Slide de Fin (closing)
// =====================================================

function ClosingSlide({ slide }: { slide: Slide }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <BlueBackground variant="primary" />

      {/* Grand cercle central décoratif */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500, height: 500, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.06)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350, height: 350, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.04)',
        zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Séparateur avant titre */}
        <div style={{
          width: 50, height: 3, backgroundColor: 'rgba(255,255,255,0.4)',
          borderRadius: 2, marginBottom: 28,
        }} />

        <h1 style={{
          fontSize: '64px', fontFamily: MIA.fonts.title, fontWeight: '700',
          color: 'white', margin: '0 0 12px 0', letterSpacing: '-1px',
        }}>
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p style={{
            fontSize: '22px', color: 'rgba(255,255,255,0.65)',
            margin: '0', fontWeight: '300', textAlign: 'center',
            fontFamily: MIA.fonts.body,
          }}>
            {slide.subtitle}
          </p>
        )}

        {/* Séparateur */}
        <div style={{
          width: 50, height: 3, backgroundColor: 'rgba(255,255,255,0.4)',
          borderRadius: 2, marginTop: 28,
        }} />

        {slide.data?.contact && (
          <p style={{
            color: 'rgba(255,255,255,0.4)', fontSize: '14px',
            marginTop: 36, fontFamily: MIA.fonts.body,
            letterSpacing: '1.5px', textTransform: 'uppercase',
          }}>
            {slide.data.contact}
          </p>
        )}
      </div>
    </div>
  );
}
