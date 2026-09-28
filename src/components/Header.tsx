/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProposalType } from '../types';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import {
  Layers,
  BarChart3,
  Building2,
  Presentation,
  CheckCircle2,
  FolderTree,
  Download,
  Share2,
} from 'lucide-react';

export type MainTabType = 'viewport' | 'forma_board' | 'analyses' | 'revit_bim' | 'slides' | 'walkthrough';

interface HeaderProps {
  currentTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  proposal: ProposalType;
  onProposalChange: (p: ProposalType) => void;
  onOpenChecklist: () => void;
  onOpenFolderTree: () => void;
  onOpenGrandFinale: () => void;
  isRevitSyncing?: boolean;
  lastRevitSyncTime?: Date;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  proposal,
  onProposalChange,
  onOpenChecklist,
  onOpenFolderTree,
  onOpenGrandFinale,
  isRevitSyncing = false,
  lastRevitSyncTime = new Date(),
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-30 backdrop-blur-md">
      {/* Universal Frontend Design Constitution: Strict 1-Row, 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display face */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('viewport');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap"
          >
            SmartCity Forma
          </a>
          
          <div className="hidden lg:flex items-center text-xs text-slate-500 font-mono">
            <span>SIH26114</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Autodesk Site Design</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>1.00 km²</span>
          </div>
        </div>

        {/* Zone 2: 4–6 clean single-line text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
          <button
            onClick={() => onTabChange('viewport')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'viewport'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D Site
          </button>
          <button
            onClick={() => onTabChange('forma_board')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'forma_board'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Forma Board
          </button>
          <button
            onClick={() => onTabChange('analyses')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'analyses'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            8 Analyses
          </button>
          <button
            onClick={() => onTabChange('revit_bim')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'revit_bim'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Revit BIM
          </button>
          <button
            onClick={() => onTabChange('slides')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentTab === 'slides'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7 Slides
          </button>
          <button
            onClick={() => onTabChange('walkthrough')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap hidden md:block ${
              currentTab === 'walkthrough'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Walkthrough
          </button>
        </nav>

        {/* Zone 3: Sync Status Indicator & primary actions */}
        <div className="flex items-center gap-2">
          {/* Top navigation bar Revit BIM Sync Status Indicator */}
          <SyncStatusIndicator
            isRevitSyncing={isRevitSyncing}
            lastRevitSyncTime={lastRevitSyncTime}
          />

          <button
            onClick={onOpenGrandFinale}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Finale Flow (13 Steps)
          </button>
          <button
            onClick={onOpenChecklist}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>SIH Checklist</span>
          </button>
        </div>
      </div>

      {/* Sub-Header: Proposal Selector Bar (Proposal A vs Proposal B) & Project Tree Link */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Functional Segmented Proposal Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Site Proposal:</span>
            <div className="inline-flex p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
              <button
                onClick={() => onProposalChange('proposalA')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  proposal === 'proposalA'
                    ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Proposal A: Conventional
              </button>
              <button
                onClick={() => onProposalChange('proposalB')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  proposal === 'proposalB'
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Proposal B: Sustainable (Selected)
              </button>
            </div>
          </div>

          {/* Quick stats, Revit Sync Indicator, and Folder tree link */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            {/* Real-time compact Revit BIM sync indicator */}
            <SyncStatusIndicator
              isSyncing={isRevitSyncing}
              lastSyncTime={lastRevitSyncTime}
              compact
            />

            <div className="hidden lg:flex items-center gap-3 font-mono">
              <span>GFA: {proposal === 'proposalA' ? '1.48M m²' : '1.56M m²'}</span>
              <span>·</span>
              <span>Carbon: {proposal === 'proposalA' ? '492 kg/m²' : '314 kg/m²'}</span>
              <span>·</span>
              <span>Green: {proposal === 'proposalA' ? '18%' : '41%'}</span>
            </div>

            <button
              onClick={onOpenFolderTree}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Project Files</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
