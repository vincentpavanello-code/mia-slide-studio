'use client';

import React, { useState, useCallback } from 'react';
import SlideRenderer from '@/components/SlideRenderer';
import {
  createSlideByType,
  TEMPLATE_LIST,
} from '@/lib/templates';
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
  const [aiSlideType, setAiSlideType] = useState<SlideType>('content');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

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

  // AI generation
  const handleGenerate = useCallback(async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          slideType: aiSlideType,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors de la génération');
      }

      const data: GenerateResponse = await res.json();

      // Create a new slide populated with AI data
      const newSlide = createSlideByType(aiSlideType);
      newSlide.title = data.title || newSlide.title;
      newSlide.subtitle = data.subtitle || newSlide.subtitle;
      if (data.badge) newSlide.badge = data.badge;

      newSlide.data = {
        ...newSlide.data,
        ...(data.figures && { figures: data.figures }),
        ...(data.columns && { columns: data.columns }),
        ...(data.steps && { steps: data.steps }),
        ...(data.quote && { quote: data.quote }),
        ...(data.keyMessage && { keyMessage: data.keyMessage }),
        ...(data.bulletPoints && { bulletPoints: data.bulletPoints }),
        ...(data.number && { number: data.number }),
      };

      setSlides(prev => [...prev, newSlide]);
      setActiveIndex(slides.length); // jump to new slide
      setAiPrompt('');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsGenerating(false);
    }
  }, [aiPrompt, aiSlideType, slides.length]);

  // Calculate scale to fit canvas in viewport
  const canvasScale = 0.65;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
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
            <select
              value={aiSlideType}
              onChange={(e) => setAiSlideType(e.target.value as SlideType)}
              style={{
                backgroundColor: '#2a2a4a',
                border: '1px solid #3a3a5a',
                borderRadius: 6,
                color: 'white',
                padding: '8px 12px',
                fontSize: 13,
                outline: 'none',
              }}
            >
              {TEMPLATE_LIST.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isGenerating) handleGenerate();
              }}
              placeholder="Décris le slide que tu veux... Ex: Un slide avec 3 chiffres clés sur l'adoption de l'IA"
              style={{
                flex: 1,
                backgroundColor: '#2a2a4a',
                border: '1px solid #3a3a5a',
                borderRadius: 6,
                color: 'white',
                padding: '8px 14px',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !aiPrompt.trim()}
              style={{
                backgroundColor: isGenerating ? '#3b5bdb' : MIA.colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '8px 20px',
                fontSize: 14,
                fontWeight: 600,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating || !aiPrompt.trim() ? 0.6 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {isGenerating ? 'Génération...' : 'Générer'}
            </button>
            {aiError && (
              <span style={{ color: '#f97316', fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {aiError}
              </span>
            )}
          </div>
        </div>

        {/* Right panel - Properties (placeholder for Phase 2) */}
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
                <div style={readOnlyStyle}>{activeSlide.type}</div>
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

              {/* Bullet Points editing for content slides */}
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

              {/* Key Message editing */}
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
        MIA Slide Studio — Phase 1 | Slide {activeIndex + 1}/{slides.length}
      </div>
    </div>
  );
}

// Shared inline styles for the property panel (Tailwind-free)
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
