/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OFFICIAL_SLIDES, SITE_METADATA } from '../data/smartCityData';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  Download,
  Presentation,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

interface SlideDeckProps {
  onNavigateToTab: (tab: any) => void;
}

export const SlideDeck: React.FC<SlideDeckProps> = ({ onNavigateToTab }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSlide = OFFICIAL_SLIDES[currentSlideIndex];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < OFFICIAL_SLIDES.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleExportSlides = () => {
    window.print();
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto max-w-none' : ''}`}>
      {/* Top Slide Deck Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>SIH26114 Official Competition Submission</span>
            <span aria-hidden="true">·</span>
            <span>5–7 Slide PowerPoint Deck</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Presentation className="w-5 h-5 text-cyan-400" />
            <span>Interactive Pitch Deck (Slide {currentSlideIndex + 1} of {OFFICIAL_SLIDES.length})</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              showSpeakerNotes
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Speaker Script</span>
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Present Mode'}</span>
          </button>
          <button
            onClick={handleExportSlides}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print / PDF Deck</span>
          </button>
        </div>
      </div>

      {/* Main 16:9 Presentation Canvas */}
      <div className="relative w-full aspect-[16/9] min-h-[480px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
        {/* Slide Header Zone */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40 text-[11px] font-mono font-bold">
                SLIDE 0{currentSlide.slideNumber}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {SITE_METADATA.problemId} · {SITE_METADATA.organization}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Bengaluru North 1.00 km²
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {currentSlide.title}
          </h2>
          <p className="text-xs sm:text-sm text-cyan-400 font-medium mt-1">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide Core Body */}
        <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
          {/* Key Bullet Points */}
          <div className="md:col-span-8 space-y-2.5">
            {currentSlide.keyPoints.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* Forma Key Metrics Callout Column */}
          <div className="md:col-span-4 flex flex-col gap-3 justify-center">
            {currentSlide.formaDataHighlights.map((hl, i) => (
              <div
                key={i}
                className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3.5 shadow-md"
              >
                <span className="text-[11px] text-slate-400 font-mono block">{hl.label}</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-cyan-300 block tabular-nums">
                  {hl.value}
                </span>
                {hl.note && <span className="text-[10px] text-emerald-400 font-mono">{hl.note}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Slide Footer Navigation Controls */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
          <div className="flex items-center gap-1.5">
            {OFFICIAL_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? 'w-8 bg-cyan-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Jump to Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <span className="text-xs text-slate-400 font-mono px-2">
              {currentSlideIndex + 1} / {OFFICIAL_SLIDES.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === OFFICIAL_SLIDES.length - 1}
              className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-30 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Speaker Notes Script Drawer */}
      {showSpeakerNotes && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono font-semibold uppercase mb-2">
            <Volume2 className="w-4 h-4" />
            <span>Official Presenter Script for Slide {currentSlide.slideNumber}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans italic bg-slate-950/70 p-4 rounded-lg border border-slate-800/80">
            "{currentSlide.speakerNotes}"
          </p>
        </div>
      )}
    </div>
  );
};
