'use client';

import React, { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SlideRenderer from '@/components/SlideRenderer';
import {
  createSlideByType,
  TEMPLATE_LIST,
} from '@/lib/templates';
import { exportSlidesToPDF } from '@/lib/export-pdf';
import type { Slide, SlideType, GenerateResponse } from '@/lib/types';
import { MIA } from '@/lib/charter';

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>(() => [
    createSlideByType('title'),
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);

  // AI prompt state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);

  // PDF export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const activeSlide = slides[activeIndex];

  const addSlide = useCallback((type: SlideType) => {
    const newSlide = createSlideByType(type);
    setSlides(prev => [...prev, newSlide]);
    setActiveIndex(prev => prev + 1);
    setShowTemplates(false);
  }, []);

  const deleteSlide = useCallback((index: number) => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, i) => i !== index));
    setActiveIndex(prev => {
      if (prev >= slides.length - 1) return Math.max(0, prev - 1);
      if (index <= prev) return Math.max(0, prev - 1);
      return prev;
    });
  }, [slides.length]);

  // AI generation — mode artefact (génère du HTML complet)
  const handleGenerate = useCallback(async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError(null);
    setGenerationTime(null);
    const startTime = Date.now();

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors de la génération');
      }

      const data: GenerateResponse = await res.json();
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      setGenerationTime(elapsed);

      const newSlide: Slide = {
        id: uuidv4(),
        type: 'content',
        title: data.title || 'Slide généré',
        elements: [],
        backgroundColor: MIA.colors.white,
        htmlContent: data.html,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSlides(prev => [...prev, newSlide]);
      setActiveIndex(slides.length);
      setAiPrompt('');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsGenerating(false);
    }
  }, [aiPrompt, slides.length]);

  // PDF Export
  const handleExportPDF = useCallback(async () => {
    if (isExporting || slides.length === 0) return;
    setIsExporting(true);
    setExportProgress('Préparation...');

    try {
      // Attendre que le conteneur off-screen soit rendu avec tous les slides
      await new Promise(resolve => setTimeout(resolve, 500));

      const container = pdfContainerRef.current;
      if (!container) throw new Error('Conteneur PDF introuvable');

      const slideElements = Array.from(
        container.querySelectorAll<HTMLElement>('[data-pdf-slide]')
      );

      if (slideElements.length === 0) throw new Error('Aucun slide à exporter');

      await exportSlidesToPDF(
        slideElements,
        'presentation-mia.pdf',
        (current, total) => {
          setExportProgress(`Export slide ${current + 1}/${total}...`);
        },
      );

      setExportProgress(null);
    } catch (err) {
      console.error('PDF export error:', err);
      setExportProgress(null);
      alert(`Erreur export PDF : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, slides]);

  const canvasScale = 0.65;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Conteneur off-screen pour l'export PDF — tous les slides à taille réelle */}
      {isExporting && (
        <div
          ref={pdfContainerRef}
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            zIndex: -1,
            opacity: 1,
          }}
        >
          {slides.map((slide) => (
            <div key={slide.id} data-pdf-slide style={{ marginBottom: 10 }}>
              <SlideRenderer slide={slide} />
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div
        style={{
          height: 56,
          backgroundColor: '#0f0f23',
          borderBottom: '1px solid #2a2a4a',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: MIA.fonts.title,
            fontWeight: 700,
            fontSize: 18,
            color: 'white',
            marginRight: 24,
          }}
        >
          MIA Slide Studio
        </div>

        <button onClick={() => setShowTemplates(!showTemplates)} style={toolbarBtnStyle}>
          + Slide
        </button>
        <button onClick={() => setShowTemplates(!showTemplates)} style={toolbarBtnStyle}>
          Templates
        </button>

        <div style={{ flex: 1 }} />

        {/* Export PDF button */}
        <button
          onClick={handleExportPDF}
          disabled={isExporting || slides.length === 0}
          style={{
            ...toolbarBtnStyle,
            background: isExporting
              ? '#2a2a4a'
              : `linear-gradient(135deg, #dc2626, #b91c1c)`,
            border: 'none',
            color: 'white',
            fontWeight: 600,
            opacity: isExporting ? 0.6 : 1,
            cursor: isExporting ? 'not-allowed' : 'pointer',
            padding: '6px 18px',
          }}
        >
          {isExporting ? (exportProgress || 'Export...') : 'Export PDF'}
        </button>

        <span style={{ color: '#6b7280', fontSize: 13 }}>
          {slides.length} slide{slides.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left panel - Slide list */}
        <div
          style={{
            width: 220,
            backgroundColor: '#12122a',
            borderRight: '1px solid #2a2a4a',
            overflowY: 'auto',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              onClick={() => setActiveIndex(i)}
              style={{
                cursor: 'pointer',
                border: i === activeIndex ? `2px solid ${MIA.colors.primary}` : '2px solid transparent',
                borderRadius: 6,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                <div style={{ transform: `scale(${180 / 1280})`, transformOrigin: 'top left' }}>
                  <SlideRenderer slide={slide} />
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 4,
                  left: 6,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.6)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 3,
                  padding: '1px 5px',
                }}
              >
                {i + 1}
              </div>
              {slide.htmlContent && (
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    left: 6,
                    fontSize: 9,
                    color: 'white',
                    backgroundColor: MIA.colors.primary,
                    borderRadius: 3,
                    padding: '1px 4px',
                    fontWeight: 700,
                  }}
                >
                  IA
                </div>
              )}
              {slides.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSlide(i);
                  }}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Center - Canvas */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a2e',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Template selector overlay */}
          {showTemplates && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 40,
              }}
            >
              <div
                style={{
                  backgroundColor: '#1e1e3a',
                  borderRadius: 12,
                  padding: 32,
                  maxWidth: 800,
                  width: '100%',
                }}
              >
                <h2
                  style={{
                    color: 'white',
                    fontFamily: MIA.fonts.title,
                    fontSize: 24,
                    fontWeight: 700,
                    margin: '0 0 24px 0',
                  }}
                >
                  Choisir un template
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                  }}
                >
                  {TEMPLATE_LIST.map((t) => (
                    <button
                      key={t.type}
                      onClick={() => addSlide(t.type)}
                      style={{
                        padding: '16px',
                        backgroundColor: '#2a2a4a',
                        border: '1px solid #3a3a5a',
                        borderRadius: 8,
                        cursor: 'pointer',
                        textAlign: 'left',
                        color: 'white',
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 15 }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>
                        {t.description}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowTemplates(false)}
                  style={{
                    marginTop: 16,
                    padding: '8px 20px',
                    backgroundColor: 'transparent',
                    border: '1px solid #3a3a5a',
                    borderRadius: 6,
                    color: '#9ca3af',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Generating / Exporting overlay */}
          {(isGenerating || isExporting) && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}
            >
              <div style={{
                width: 48, height: 48, border: '3px solid rgba(255,255,255,0.2)',
                borderTopColor: isExporting ? '#dc2626' : MIA.colors.primary,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              <div style={{ color: 'white', fontSize: 16, fontWeight: 600, fontFamily: MIA.fonts.title }}>
                {isExporting
                  ? (exportProgress || 'Export PDF en cours...')
                  : 'Génération du slide en cours...'}
              </div>
              <div style={{ color: '#9ca3af', fontSize: 13 }}>
                {isExporting
                  ? 'Capture de chaque slide en haute résolution'
                  : "L'IA crée un slide complet avec HTML/CSS"}
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Slide display */}
          {activeSlide && (
            <div
              style={{
                transform: `scale(${canvasScale})`,
                transformOrigin: 'center center',
                boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              }}
            >
              <SlideRenderer slide={activeSlide} />
            </div>
          )}

          {/* AI Prompt Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#0f0f23',
              borderTop: '1px solid #2a2a4a',
              padding: '12px 20px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: `linear-gradient(135deg, ${MIA.colors.primary}, #1535b0)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
              color: 'white',
            }}>
              &#9733;
            </div>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isGenerating) handleGenerate();
              }}
              placeholder="Décris le slide que tu veux... Ex: Un slide avec 3 chiffres clés sur l'adoption de l'IA en entreprise"
              style={{
                flex: 1,
                backgroundColor: '#2a2a4a',
                border: '1px solid #3a3a5a',
                borderRadius: 8,
                color: 'white',
                padding: '10px 16px',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !aiPrompt.trim()}
              style={{
                background: isGenerating
                  ? '#3b5bdb'
                  : `linear-gradient(135deg, ${MIA.colors.primary}, #1535b0)`,
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating || !aiPrompt.trim() ? 0.6 : 1,
                whiteSpace: 'nowrap',
                fontFamily: MIA.fonts.title,
              }}
            >
              {isGenerating ? 'Génération...' : 'Générer avec IA'}
            </button>
            {aiError && (
              <span style={{ color: '#f97316', fontSize: 12, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {aiError}
              </span>
            )}
            {generationTime !== null && !aiError && (
              <span style={{ color: '#4ade80', fontSize: 12, whiteSpace: 'nowrap' }}>
                {generationTime}s
              </span>
            )}
          </div>
        </div>

        {/* Right panel - Properties */}
        <div
          style={{
            width: 280,
            backgroundColor: '#12122a',
            borderLeft: '1px solid #2a2a4a',
            padding: '16px',
            overflowY: 'auto',
            flexShrink: 0,
          }}
        >
          <h3
            style={{
              color: 'white',
              fontFamily: MIA.fonts.title,
              fontSize: 16,
              fontWeight: 700,
              margin: '0 0 16px 0',
            }}
          >
            Propriétés
          </h3>

          {activeSlide && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={labelStyle}>Type</label>
                <div style={readOnlyStyle}>
                  {activeSlide.htmlContent ? 'IA (HTML)' : activeSlide.type}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Titre</label>
                <input
                  type="text"
                  value={activeSlide.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSlides(prev =>
                      prev.map((s, i) =>
                        i === activeIndex ? { ...s, title: val, updatedAt: new Date().toISOString() } : s
                      )
                    );
                  }}
                  style={inputStyle}
                />
              </div>

              {!activeSlide.htmlContent && (
                <>
                  <div>
                    <label style={labelStyle}>Sous-titre</label>
                    <input
                      type="text"
                      value={activeSlide.subtitle || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlides(prev =>
                          prev.map((s, i) =>
                            i === activeIndex ? { ...s, subtitle: val || undefined, updatedAt: new Date().toISOString() } : s
                          )
                        );
                      }}
                      style={inputStyle}
                    />
                  </div>
                  {activeSlide.badge !== undefined && (
                    <div>
                      <label style={labelStyle}>Badge</label>
                      <input
                        type="text"
                        value={activeSlide.badge || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSlides(prev =>
                            prev.map((s, i) =>
                              i === activeIndex ? { ...s, badge: val || undefined, updatedAt: new Date().toISOString() } : s
                            )
                          );
                        }}
                        style={inputStyle}
                      />
                    </div>
                  )}
                  {activeSlide.data?.bulletPoints && (
                    <div>
                      <label style={labelStyle}>Points clés</label>
                      {activeSlide.data.bulletPoints.map((bp, bpi) => (
                        <input
                          key={bpi}
                          type="text"
                          value={bp}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSlides(prev =>
                              prev.map((s, i) => {
                                if (i !== activeIndex) return s;
                                const bulletPoints = [...(s.data?.bulletPoints || [])];
                                bulletPoints[bpi] = val;
                                return { ...s, data: { ...s.data, bulletPoints }, updatedAt: new Date().toISOString() };
                              })
                            );
                          }}
                          style={{ ...inputStyle, marginBottom: 6 }}
                        />
                      ))}
                    </div>
                  )}
                  {activeSlide.data?.keyMessage !== undefined && (
                    <div>
                      <label style={labelStyle}>Message clé</label>
                      <input
                        type="text"
                        value={activeSlide.data.keyMessage || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSlides(prev =>
                            prev.map((s, i) =>
                              i === activeIndex
                                ? { ...s, data: { ...s.data, keyMessage: val }, updatedAt: new Date().toISOString() }
                                : s
                            )
                          );
                        }}
                        style={inputStyle}
                      />
                    </div>
                  )}
                </>
              )}

              {activeSlide.htmlContent && (
                <div style={{
                  backgroundColor: '#1e1e3a', borderRadius: 8,
                  padding: 12, border: '1px solid #2a2a4a',
                }}>
                  <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 8 }}>
                    Slide généré par IA
                  </div>
                  <div style={{ color: '#6b7280', fontSize: 11 }}>
                    {activeSlide.htmlContent.length} caractères HTML
                  </div>
                  <button
                    onClick={() => {
                      const prompt = window.prompt('Nouveau prompt pour régénérer ce slide :');
                      if (!prompt) return;
                      setAiPrompt(prompt);
                    }}
                    style={{
                      marginTop: 8, width: '100%',
                      backgroundColor: '#2a2a4a',
                      border: '1px solid #3a3a5a',
                      borderRadius: 6, color: 'white',
                      padding: '6px 10px', fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Régénérer ce slide
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div
        style={{
          height: 32,
          backgroundColor: '#0f0f23',
          borderTop: '1px solid #2a2a4a',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          fontSize: 12,
          color: '#6b7280',
          flexShrink: 0,
        }}
      >
        MIA Slide Studio | Slide {activeIndex + 1}/{slides.length}
        {activeSlide?.htmlContent && ' | Généré par IA'}
      </div>
    </div>
  );
}

// Shared inline styles
const toolbarBtnStyle: React.CSSProperties = {
  backgroundColor: '#2a2a4a',
  border: '1px solid #3a3a5a',
  borderRadius: 6,
  color: 'white',
  padding: '6px 14px',
  fontSize: 13,
  cursor: 'pointer',
  fontWeight: 500,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#9ca3af',
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#2a2a4a',
  border: '1px solid #3a3a5a',
  borderRadius: 6,
  color: 'white',
  padding: '6px 10px',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
};

const readOnlyStyle: React.CSSProperties = {
  ...inputStyle,
  backgroundColor: '#1e1e3a',
  cursor: 'default',
};
