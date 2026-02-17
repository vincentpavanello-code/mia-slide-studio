// components/SlideRenderer.tsx
// Rendu pur HTML/CSS inline de chaque type de slide (pas de Tailwind)
// Ce composant est utilisé à la fois pour l'affichage canvas et l'export PDF

'use client';

import React from 'react';
import type { Slide } from '@/lib/types';
import { MIA } from '@/lib/charter';

interface SlideRendererProps {
  slide: Slide;
  scale?: number;
}

export default function SlideRenderer({ slide, scale }: SlideRendererProps) {
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
    case 'title':
      return <TitleSlide slide={slide} />;
    case 'partie':
      return <PartieSlide slide={slide} />;
    case 'sous-partie':
      return <SousPartieSlide slide={slide} />;
    case 'content':
      return <ContentSlide slide={slide} />;
    case 'key-figures':
      return <KeyFiguresSlide slide={slide} />;
    case 'comparison':
      return <ComparisonSlide slide={slide} />;
    case 'process':
      return <ProcessSlide slide={slide} />;
    case 'quote':
      return <QuoteSlide slide={slide} />;
    case 'closing':
      return <ClosingSlide slide={slide} />;
    default:
      return <ContentSlide slide={slide} />;
  }
}

// =====================================================
// Éléments décoratifs réutilisables
// =====================================================

function BlueDecorativeCircles() {
  return (
    <>
      {/* Cercle haut-droit */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.06)',
        }}
      />
      {/* Cercle bas-gauche */}
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 350,
          height: 350,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}
      />
    </>
  );
}

function BottomBar() {
  return <div style={MIA.elements.bottomBar} />;
}

// =====================================================
// 1. Slide Titre (couverture)
// =====================================================

function TitleSlide({ slide }: { slide: Slide }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <BlueDecorativeCircles />

      <div
        style={{
          textAlign: 'center',
          zIndex: 1,
          padding: '0 80px',
        }}
      >
        <h1
          style={{
            fontSize: '56px',
            fontFamily: MIA.fonts.title,
            fontWeight: '700',
            color: 'white',
            margin: '0 0 20px 0',
            lineHeight: '1.15',
          }}
        >
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p
            style={{
              ...MIA.styles.subtitleOnBlue,
              fontSize: '24px',
            }}
          >
            {slide.subtitle}
          </p>
        )}

        {slide.data?.date && (
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '16px',
              marginTop: '40px',
              fontFamily: MIA.fonts.body,
            }}
          >
            {slide.data.date}
            {slide.data.client && ` — ${slide.data.client}`}
          </p>
        )}
      </div>
    </div>
  );
}

// =====================================================
// 2. Slide "Partie" (fond bleu #1c42da)
// =====================================================

function PartieSlide({ slide }: { slide: Slide }) {
  const number = slide.data?.number || '1';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <BlueDecorativeCircles />

      {/* Grand numéro décoratif */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 40,
          fontSize: '280px',
          fontFamily: MIA.fonts.title,
          fontWeight: '800',
          color: 'rgba(255,255,255,0.05)',
          lineHeight: '1',
          zIndex: 0,
        }}
      >
        {number}
      </div>

      {/* Badge */}
      {slide.badge && (
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '8px 24px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '24px',
            zIndex: 1,
          }}
        >
          {slide.badge}
        </div>
      )}

      <h1
        style={{
          ...MIA.styles.h1Partie,
          textAlign: 'center',
          zIndex: 1,
          padding: '0 80px',
        }}
      >
        {slide.title}
      </h1>

      {slide.subtitle && (
        <p
          style={{
            ...MIA.styles.subtitleOnBlue,
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {slide.subtitle}
        </p>
      )}
    </div>
  );
}

// =====================================================
// 3. Slide "Sous-partie" (fond bleu #5872d8)
// =====================================================

function SousPartieSlide({ slide }: { slide: Slide }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <BlueDecorativeCircles />

      {/* Badge */}
      {slide.badge && (
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '8px 24px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            letterSpacing: '1px',
            marginBottom: '24px',
            zIndex: 1,
          }}
        >
          {slide.badge}
        </div>
      )}

      <h1
        style={{
          fontSize: '46px',
          fontFamily: MIA.fonts.title,
          fontWeight: '700',
          color: 'white',
          margin: '0',
          textAlign: 'center',
          zIndex: 1,
          padding: '0 80px',
          lineHeight: '1.2',
        }}
      >
        {slide.title}
      </h1>

      {slide.subtitle && (
        <p
          style={{
            ...MIA.styles.subtitleOnBlue,
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {slide.subtitle}
        </p>
      )}

      {/* Ligne décorative centrée en bas */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 80,
          height: 3,
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: 2,
        }}
      />
    </div>
  );
}

// =====================================================
// 4. Slide Contenu (fond blanc)
// =====================================================

function ContentSlide({ slide }: { slide: Slide }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 50px 40px 50px',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={MIA.styles.h1}>{slide.title}</h1>
          {slide.subtitle && (
            <p style={MIA.styles.subtitle}>{slide.subtitle}</p>
          )}
        </div>
        {slide.badge && (
          <div style={MIA.styles.badge}>{slide.badge}</div>
        )}
      </div>

      {/* Zone de contenu flexible */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '12px' }}>
        {/* Bullet points */}
        {slide.data?.bulletPoints && slide.data.bulletPoints.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {slide.data.bulletPoints.map((point, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: MIA.colors.primary,
                    marginTop: 7,
                    flexShrink: 0,
                  }}
                />
                <p style={{ ...MIA.styles.body, margin: 0 }}>{point}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bandeau message clé */}
      {slide.data?.keyMessage && (
        <div
          style={{
            ...MIA.elements.keyMessage,
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: MIA.fonts.body,
            marginTop: '16px',
          }}
        >
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

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 50px 40px 50px',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={MIA.styles.h1}>{slide.title}</h1>
        {slide.subtitle && (
          <p style={MIA.styles.subtitle}>{slide.subtitle}</p>
        )}
      </div>

      {/* Grille de chiffres */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {figures.map((fig, i) => (
          <div
            key={i}
            style={{
              ...MIA.elements.card,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              minHeight: '180px',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontFamily: MIA.fonts.title,
                fontWeight: '700',
                color: MIA.colors.primary,
                lineHeight: '1',
                marginBottom: '8px',
              }}
            >
              {fig.value}
              {fig.unit && (
                <span style={{ fontSize: '24px', marginLeft: '4px' }}>
                  {fig.unit}
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: MIA.colors.textSecondary,
                fontFamily: MIA.fonts.body,
                lineHeight: '1.4',
              }}
            >
              {fig.label}
            </div>
          </div>
        ))}
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
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 50px 40px 50px',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={MIA.styles.h1}>{slide.title}</h1>
        {slide.subtitle && (
          <p style={MIA.styles.subtitle}>{slide.subtitle}</p>
        )}
      </div>

      {/* Colonnes */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: '24px',
          alignItems: 'stretch',
        }}
      >
        {columns.map((col, i) => (
          <div
            key={i}
            style={{
              ...(col.highlighted ? MIA.elements.cardHighlight : MIA.elements.card),
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontFamily: MIA.fonts.title,
                fontWeight: '700',
                color: col.highlighted ? MIA.colors.primary : MIA.colors.black,
                margin: '0 0 16px 0',
              }}
            >
              {col.title}
              {col.highlighted && (
                <span
                  style={{
                    ...MIA.styles.tag,
                    marginLeft: '8px',
                    fontSize: '10px',
                    verticalAlign: 'middle',
                  }}
                >
                  Recommandé
                </span>
              )}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {col.items.map((item, j) => (
                <div
                  key={j}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: col.highlighted
                        ? MIA.colors.primary
                        : MIA.colors.textSecondary,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ ...MIA.styles.body, margin: 0 }}>{item}</span>
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
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 50px 40px 50px',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={MIA.styles.h1}>{slide.title}</h1>
        {slide.subtitle && (
          <p style={MIA.styles.subtitle}>{slide.subtitle}</p>
        )}
      </div>

      {/* Étapes horizontales */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                flex: 1,
                maxWidth: '200px',
              }}
            >
              <div style={MIA.elements.numberCircle}>{step.number}</div>
              <h4
                style={{
                  fontSize: '16px',
                  fontFamily: MIA.fonts.title,
                  fontWeight: '700',
                  color: MIA.colors.black,
                  margin: '12px 0 6px 0',
                }}
              >
                {step.title}
              </h4>
              <p
                style={{
                  fontSize: '13px',
                  color: MIA.colors.textSecondary,
                  margin: 0,
                  lineHeight: '1.4',
                  fontFamily: MIA.fonts.body,
                }}
              >
                {step.description}
              </p>
            </div>
            {/* Flèche entre les étapes */}
            {i < steps.length - 1 && (
              <div
                style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor: MIA.colors.border,
                  position: 'relative',
                  flexShrink: 0,
                  marginTop: '-30px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: -4,
                    top: -4,
                    width: 0,
                    height: 0,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                    borderLeft: `8px solid ${MIA.colors.border}`,
                  }}
                />
              </div>
            )}
          </React.Fragment>
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
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 50px 40px 50px',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={MIA.styles.h1}>{slide.title}</h1>
      </div>

      {/* Citation centrée */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 60px',
        }}
      >
        {quote && (
          <>
            <div
              style={{
                fontSize: '60px',
                color: MIA.colors.primary,
                fontFamily: 'Georgia, serif',
                lineHeight: '1',
                marginBottom: '-10px',
              }}
            >
              &ldquo;
            </div>
            <p
              style={{
                fontSize: '26px',
                fontFamily: MIA.fonts.body,
                color: MIA.colors.black,
                textAlign: 'center',
                lineHeight: '1.5',
                fontStyle: 'normal',
                margin: '0 0 24px 0',
              }}
            >
              {quote.text}
            </p>
            <div
              style={{
                fontSize: '16px',
                color: MIA.colors.primary,
                fontWeight: '600',
                fontFamily: MIA.fonts.body,
              }}
            >
              — {quote.author}
            </div>
          </>
        )}
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
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <BlueDecorativeCircles />

      <h1
        style={{
          fontSize: '64px',
          fontFamily: MIA.fonts.title,
          fontWeight: '700',
          color: 'white',
          margin: '0 0 16px 0',
          zIndex: 1,
        }}
      >
        {slide.title}
      </h1>

      {slide.subtitle && (
        <p
          style={{
            ...MIA.styles.subtitleOnBlue,
            fontSize: '24px',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {slide.subtitle}
        </p>
      )}

      {slide.data?.contact && (
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '16px',
            marginTop: '40px',
            fontFamily: MIA.fonts.body,
            zIndex: 1,
          }}
        >
          {slide.data.contact}
        </p>
      )}
    </div>
  );
}
