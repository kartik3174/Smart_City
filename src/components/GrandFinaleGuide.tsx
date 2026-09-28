/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GRAND_FINALE_STEPS } from '../data/smartCityData';
import {
  CheckCircle2,
  ArrowRight,
  Compass,
  Play,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';
import { MainTabType } from './Header';
import { ProposalType } from '../types';

interface GrandFinaleGuideProps {
  onClose: () => void;
  onNavigateToTab: (tab: MainTabType) => void;
  onSelectProposal: (p: ProposalType) => void;
  onStartWalkthrough: () => void;
}

export const GrandFinaleGuide: React.FC<GrandFinaleGuideProps> = ({
  onClose,
  onNavigateToTab,
  onSelectProposal,
  onStartWalkthrough,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = GRAND_FINALE_STEPS[currentStepIndex];

  // Execute interactive step action
  const handleExecuteStep = (stepNumber: number) => {
    setCurrentStepIndex(stepNumber - 1);
    switch (stepNumber) {
      case 1: // Introduce the site
      case 2: // Show site limits
      case 3: // Show contextual data
        onNavigateToTab('viewport');
        break;
      case 4: // Show Proposal A
        onNavigateToTab('viewport');
        onSelectProposal('proposalA');
        break;
      case 5: // Show Proposal B
        onNavigateToTab('viewport');
        onSelectProposal('proposalB');
        break;
      case 6: // Run/show Forma analyses
        onNavigateToTab('analyses');
        break;
      case 7: // Compare using Forma Board
      case 8: // Explain selected proposal
        onNavigateToTab('forma_board');
        break;
      case 9: // Show detailed office building
      case 10: // Show Revit development
      case 11: // Show sync back to Forma
        onNavigateToTab('revit_bim');
        break;
      case 12: // Show rendered images
        onNavigateToTab('slides');
        break;
      case 13: // Play 30s walkthrough
        onNavigateToTab('viewport');
        onStartWalkthrough();
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Section 12 Official Demonstration Script</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Grand Finale 13-Step Presentation Flow
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Step-by-step guided demonstration sequence matching the official SIH26114 competition evaluation rubric.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2.5 py-1 rounded"
          >
            ✕ Close
          </button>
        </div>

        {/* Current Active Step Spotlight */}
        <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Step {currentStep.step} of 13
            </span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SIH Verified</span>
            </span>
          </div>

          <h3 className="text-lg font-bold text-white">{currentStep.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{currentStep.summary}</p>

          <button
            onClick={() => handleExecuteStep(currentStep.step)}
            className="w-full py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span>Execute Step {currentStep.step} in Live App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 13-Step Stepper Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
          {GRAND_FINALE_STEPS.map((step) => {
            const isSelected = step.step === currentStep.step;
            return (
              <button
                key={step.step}
                onClick={() => handleExecuteStep(step.step)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-400 text-white font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0 ${
                    isSelected ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step.step}
                </span>
                <span className="truncate">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
