/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProjectData } from '../types';
import {
  Presentation,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface PresentationPlannerProps {
  projectData: ProjectData;
  onNavigateToEvidence: () => void;
  isDemoMode: boolean;
}

export const PresentationPlanner: React.FC<PresentationPlannerProps> = ({
  projectData,
  onNavigateToEvidence,
  isDemoMode,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Map each of the 7 mandatory slides to their required evidence artifacts
  const slides = [
    {
      slideNumber: 1,
      title: 'Project Introduction',
      subtitle: 'Smart City Site Planning using Autodesk Forma Site Design',
      requiredEvidenceCategories: ['SITE'],
      requiredItems: ['Problem Statement ID SIH26114', 'Team Information', 'Site Location', 'Site Area (≥ 1 km²)'],
      notes:
        'Introduce the site in Bengaluru North, confirm the minimum 1 km² area constraint, and outline the team mission.',
    },
    {
      slideNumber: 2,
      title: 'Site & Context',
      subtitle: 'Cadastral Boundary, Terrain Contours & Surrounding Infrastructure',
      requiredEvidenceCategories: ['SITE'],
      requiredItems: ['Site Limits Polygon (1,000,000 m²)', 'Contextual Data in Forma', 'Regional Expressway Corridor', 'Southern Wetland Buffer'],
      notes:
        'Show the actual site limits and contextual data loaded in Autodesk Forma.',
    },
    {
      slideNumber: 3,
      title: 'Proposal A — Conventional Urban Development',
      subtitle: 'Baseline Conventional Masterplan & Gridiron Massing',
      requiredEvidenceCategories: ['PROPOSAL', 'ANALYSIS'],
      requiredItems: ['Forma 3D Massing', 'Road Arrangement (38.5% asphalt)', 'Landscaping', 'Preliminary Forma Analysis Results'],
      notes:
        'Demonstrate Proposal A building arrangement, transportation grid, and baseline Forma analysis findings.',
    },
    {
      slideNumber: 4,
      title: 'Proposal B — Sustainable Smart Urban Development',
      subtitle: 'Climate-Adaptive Polycentric Eco-District',
      requiredEvidenceCategories: ['PROPOSAL', 'ANALYSIS'],
      requiredItems: ['Solar-Staggered Massing', '225° SW Breeze Corridors', '41% Green Open Space', 'Transit Hub & Walkable Spines'],
      notes:
        'Present the genuine planning differences made in Proposal B and how massing responds to climate physics.',
    },
    {
      slideNumber: 5,
      title: 'Forma Board / Analysis Comparison',
      subtitle: 'Side-by-Side Benchmarking Across All 8 Required Forma Engines',
      requiredEvidenceCategories: ['FORMA', 'ANALYSIS'],
      requiredItems: ['Forma Board Screenshot', 'Area Metrics', 'Embodied Carbon', 'Sun Hours', 'Daylight', 'Wind CFD', 'Microclimate UTCI', 'Noise', 'Solar Energy'],
      notes:
        'Display the actual comparison matrix from Autodesk Forma Board. Ground every observation in real simulation data.',
    },
    {
      slideNumber: 6,
      title: 'Final Selected Proposal & Urban Rationale',
      subtitle: 'Selection Rationale, Key Design Characteristics & Office Building Nomination',
      requiredEvidenceCategories: ['PROPOSAL', 'FORMA'],
      requiredItems: ['Selection Decision', 'Forma Performance Leaps', 'Heat Island Mitigation', 'Nominated Office Building Location'],
      notes:
        'Explain why the winning proposal was selected based on actual Forma analysis data.',
    },
    {
      slideNumber: 7,
      title: 'Revit Building Development + Final Visualization',
      subtitle: 'Detailed Revit BIM Architecture, Forma Round-Trip Sync & 30-Second Walkthrough',
      requiredEvidenceCategories: ['REVIT', 'RENDER', 'VIDEO'],
      requiredItems: ['Detailed Revit Office Building (LOD 350)', 'Revit Family Schedules', 'Forma Sync Confirmation', 'Rendered Images Preview', '30-Second Walkthrough Link'],
      notes:
        'Demonstrate the full Autodesk workflow loop: Forma massing -> Revit detailing -> sync back -> rendered walkthrough preview.',
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  // Find evidence items matching current slide
  const matchingEvidence = (projectData.evidenceList || []).filter((e) =>
    currentSlide.requiredEvidenceCategories.includes(e.category as any)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Official SIH26114 Presentation Support</span>
            <span aria-hidden="true">·</span>
            <span>Section 11 5–7 Slide PowerPoint Planner</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Presentation className="w-6 h-6 text-amber-400" />
            <span>Presentation Preparation & Evidence Linker</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Correlate each of your 7 presentation slides directly with uploaded Autodesk Forma and Revit evidence. The system ensures every claim in your pitch deck is grounded in authentic project artifacts.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors shrink-0"
        >
          <Printer className="w-3.5 h-3.5 text-cyan-400" />
          <span>Print Pitch Plan</span>
        </button>
      </div>

      {/* Main Slide Carousel & Evidence Map */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        {/* Slide Header Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
              SLIDE 0{currentSlide.slideNumber} OF 07
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              SIH26114 Official PowerPoint Template
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 text-xs rounded flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <span className="text-xs text-slate-400 font-mono px-1">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlideIndex === slides.length - 1}
              className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-slate-950 font-bold text-xs rounded flex items-center gap-1 shadow-sm"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Slide Content Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">{currentSlide.title}</h2>
              <p className="text-xs text-cyan-400 font-medium mt-0.5">{currentSlide.subtitle}</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-xs font-semibold text-slate-300 font-mono uppercase block">
                Required Content Checklist for Slide 0{currentSlide.slideNumber}:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentSlide.requiredItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <span className="text-xs font-semibold text-amber-400 font-mono uppercase block">
                Official Presenter Guidelines:
              </span>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                "{currentSlide.notes}"
              </p>
            </div>
          </div>

          {/* Right Column: Linked Available Evidence for this Slide */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Available Evidence Artifacts ({matchingEvidence.length})</span>
                </span>
                <button
                  onClick={onNavigateToEvidence}
                  className="text-[11px] text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Attach</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Evidence files matching categories: {currentSlide.requiredEvidenceCategories.join(', ')}
              </p>

              {matchingEvidence.length === 0 ? (
                <div className="p-4 mt-3 bg-slate-900/60 border border-dashed border-slate-800 rounded-lg text-center text-xs text-slate-500">
                  No evidence uploaded yet for this slide's required categories.
                </div>
              ) : (
                <div className="space-y-2 mt-3 max-h-56 overflow-y-auto pr-1">
                  {matchingEvidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-400">{ev.id}</span>
                        <span className="text-[10px] text-emerald-400 font-sans">{ev.status}</span>
                      </div>
                      <div className="text-slate-200 font-sans font-semibold text-[11px] truncate">
                        {ev.title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{ev.fileName}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
              <span>Slide Readiness: </span>
              <span className={matchingEvidence.length > 0 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {matchingEvidence.length > 0 ? 'Evidence Attached' : 'Awaiting Artifact Upload'}
              </span>
            </div>
          </div>
        </div>

        {/* 7-Slide Mini Picker Bar */}
        <div className="grid grid-cols-7 gap-2 pt-2 border-t border-slate-800/80">
          {slides.map((s, idx) => {
            const isSelected = idx === currentSlideIndex;
            return (
              <button
                key={s.slideNumber}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-400 text-white font-semibold shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono block text-cyan-400">Slide 0{s.slideNumber}</span>
                <span className="text-xs truncate block font-sans">{s.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
