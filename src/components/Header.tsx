/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppMode, NavigationPage, ProposalId } from '../types';
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
  FileCheck,
  PackageCheck,
  ShieldCheck,
  AlertTriangle,
  History,
  FileCode,
  MapPin,
  Flame,
} from 'lucide-react';

interface HeaderProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  appMode: AppMode;
  onToggleAppMode: (mode: AppMode) => void;
  blockersCount: number;
  isReadyForSubmission: boolean;
  onOpenChecklistModal: () => void;
  onOpenFolderModal: () => void;
  onOpenGrandFinaleModal?: () => void;
  isRevitSyncing?: boolean;
  lastRevitSyncTime?: Date;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  appMode,
  onToggleAppMode,
  blockersCount,
  isReadyForSubmission,
  onOpenChecklistModal,
  onOpenFolderModal,
  onOpenGrandFinaleModal,
  isRevitSyncing = false,
  lastRevitSyncTime = new Date(),
}) => {
  const isDemo = appMode === 'DEMO';

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-30 backdrop-blur-md">
      {/* Primary Top Bar (Strict 1-Row, 3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark in display face */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('dashboard');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap"
          >
            SmartCity Forma
          </a>

          <div className="hidden lg:flex items-center text-xs text-slate-500 font-mono">
            <span>SIH26114</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Companion & Evidence Dashboard</span>
          </div>
        </div>

        {/* Zone 2: Primary navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 text-xs font-medium overflow-x-auto py-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'dashboard'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('site')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'site'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Site (≥1km²)
          </button>
          <button
            onClick={() => onNavigate('analyses')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'analyses'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            8 Analyses
          </button>
          <button
            onClick={() => onNavigate('forma_board')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'forma_board'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Forma Board
          </button>
          <button
            onClick={() => onNavigate('revit')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'revit'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Revit BIM
          </button>
          <button
            onClick={() => onNavigate('evidence')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'evidence'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Evidence Center
          </button>
          <button
            onClick={() => onNavigate('deliverables')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap hidden lg:block ${
              currentPage === 'deliverables'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deliverables
          </button>
          <button
            onClick={() => onNavigate('presentation')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap hidden lg:block ${
              currentPage === 'presentation'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7 Slides
          </button>
          <button
            onClick={() => onNavigate('readiness')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentPage === 'readiness'
                ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Readiness
          </button>
        </nav>

        {/* Zone 3: Mode Switcher, Sync Indicator, & Readiness Alert */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Revit BIM Real-Time Sync Status Indicator with Live Pulse */}
          <SyncStatusIndicator
            isRevitSyncing={isRevitSyncing}
            lastRevitSyncTime={lastRevitSyncTime}
          />

          {/* Item 13: Honest Demo Toggle vs Actual Project */}
          <div className="inline-flex p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <button
              onClick={() => onToggleAppMode('ACTUAL')}
              className={`px-2.5 py-1 rounded transition-all ${
                !isDemo
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Actual team project mode"
            >
              ACTUAL PROJECT
            </button>
            <button
              onClick={() => onToggleAppMode('DEMO')}
              className={`px-2.5 py-1 rounded transition-all ${
                isDemo
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Illustrative demo data mode"
            >
              DEMO MODE
            </button>
          </div>

          {/* Submission Readiness Status Pill */}
          <button
            onClick={() => onNavigate('readiness')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              isReadyForSubmission
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                : 'bg-red-950/40 border-red-500/40 text-red-300'
            }`}
          >
            {isReadyForSubmission ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            )}
            <span className="hidden sm:inline">
              {isReadyForSubmission ? 'Verified' : `${blockersCount} Blockers`}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Bar: Secondary Navigation & Actions */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 sm:px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Proposal Quick Links */}
          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-500">Proposals:</span>
            <button
              onClick={() => onNavigate('proposalA')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                currentPage === 'proposalA' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Proposal A
            </button>
            <button
              onClick={() => onNavigate('proposalB')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                currentPage === 'proposalB' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Proposal B (Selected)
            </button>
            <button
              onClick={() => onNavigate('comparison')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                currentPage === 'comparison' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Comparison
            </button>
          </div>

          {/* Right Tools Links */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <button
              onClick={() => onNavigate('audit_log')}
              className={`hover:text-cyan-400 transition-colors flex items-center gap-1 ${
                currentPage === 'audit_log' ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Log</span>
            </button>

            <button
              onClick={() => onNavigate('import_export')}
              className={`hover:text-cyan-400 transition-colors flex items-center gap-1 ${
                currentPage === 'import_export' ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Import / Export</span>
            </button>

            <button
              onClick={onOpenChecklistModal}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">24-Pt Checklist</span>
            </button>

            {onOpenGrandFinaleModal && (
              <button
                onClick={onOpenGrandFinaleModal}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-cyan-300"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">13-Step Flow</span>
              </button>
            )}

            <button
              onClick={onOpenFolderModal}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
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
