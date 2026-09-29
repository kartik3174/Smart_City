/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppMode, NavigationPage, ProjectData } from '../types';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import {
  Layers,
  BarChart3,
  Building2,
  Presentation,
  CheckCircle2,
  FolderTree,
  FileCheck,
  PackageCheck,
  ShieldCheck,
  AlertTriangle,
  History,
  FileCode,
  MapPin,
  Flame,
  Menu,
  X,
  Compass,
  FileSpreadsheet,
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
  projectData?: ProjectData;
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
  projectData,
  isRevitSyncing = false,
  lastRevitSyncTime = new Date(),
}) => {
  const isDemo = appMode === 'DEMO';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: NavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const navItems: { page: NavigationPage; label: string; icon: React.ReactNode }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4 text-cyan-400" /> },
    { page: 'site', label: 'Site (≥1km²)', icon: <MapPin className="w-4 h-4 text-cyan-400" /> },
    { page: 'analyses', label: '8 Analyses', icon: <Layers className="w-4 h-4 text-cyan-400" /> },
    { page: 'forma_board', label: 'Forma Board', icon: <Presentation className="w-4 h-4 text-cyan-400" /> },
    { page: 'revit', label: 'Revit BIM', icon: <Building2 className="w-4 h-4 text-cyan-400" /> },
    { page: 'evidence', label: 'Evidence Center', icon: <FileCheck className="w-4 h-4 text-cyan-400" /> },
    { page: 'deliverables', label: 'Deliverables', icon: <PackageCheck className="w-4 h-4 text-cyan-400" /> },
    { page: 'presentation', label: '7 Slides', icon: <Presentation className="w-4 h-4 text-cyan-400" /> },
    { page: 'readiness', label: 'Readiness', icon: <ShieldCheck className="w-4 h-4 text-cyan-400" /> },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Wordmark & Problem ID */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('dashboard');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <Compass className="w-5 h-5 text-cyan-400 shrink-0 hidden xs:inline-block" />
            <span>SmartCity Forma</span>
          </a>

          <div className="hidden lg:flex items-center text-xs text-slate-500 font-mono">
            <span>SIH26114</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Autodesk Forma & Revit Dashboard</span>
          </div>
        </div>

        {/* Zone 2: Desktop Navigation Links (Visible on xl / large desktop) */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-medium overflow-x-auto py-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap text-xs ${
                currentPage === item.page
                  ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Mode Switcher, Sync Indicator, Readiness Badge & Mobile Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Revit BIM Real-Time Sync Status Indicator */}
          <div className="hidden sm:block">
            <SyncStatusIndicator
              projectData={projectData}
              onNavigateToRevit={() => handleNavClick('revit')}
              isRevitSyncing={isRevitSyncing}
              lastRevitSyncTime={lastRevitSyncTime}
            />
          </div>

          {/* Mode Switcher (Compact on mobile) */}
          <div className="inline-flex p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <button
              onClick={() => onToggleAppMode('ACTUAL')}
              className={`px-2 sm:px-2.5 py-1 rounded transition-all text-[11px] sm:text-xs ${
                !isDemo
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Actual team project mode"
            >
              ACTUAL
            </button>
            <button
              onClick={() => onToggleAppMode('DEMO')}
              className={`px-2 sm:px-2.5 py-1 rounded transition-all text-[11px] sm:text-xs ${
                isDemo
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Illustrative demo data mode"
            >
              DEMO
            </button>
          </div>

          {/* Submission Readiness Status Pill */}
          <button
            onClick={() => handleNavClick('readiness')}
            className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 min-h-[36px] ${
              isReadyForSubmission
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                : 'bg-red-950/40 border-red-500/40 text-red-300'
            }`}
            title="Submission Readiness Audit"
          >
            {isReadyForSubmission ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            )}
            <span className="hidden md:inline">
              {isReadyForSubmission ? 'Verified' : `${blockersCount} Blockers`}
            </span>
          </button>

          {/* Mobile Navigation Toggle Button (Visible on mobile & tablet < xl) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="xl:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-colors flex items-center justify-center min-h-[38px] min-w-[38px]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sub-Bar: Touch-friendly horizontal scrollbar for proposals and quick tools */}
      <div className="bg-slate-900/70 border-t border-slate-800/80 px-3 sm:px-6 py-1.5 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs whitespace-nowrap min-w-max">
          {/* Proposal Quick Links */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-mono">
            <span className="text-slate-500 text-[11px]">Proposals:</span>
            <button
              onClick={() => handleNavClick('proposalA')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                currentPage === 'proposalA'
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-white bg-slate-950/50'
              }`}
            >
              Proposal A
            </button>
            <button
              onClick={() => handleNavClick('proposalB')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                currentPage === 'proposalB'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-950/50'
              }`}
            >
              Proposal B (Selected)
            </button>
            <button
              onClick={() => handleNavClick('comparison')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                currentPage === 'comparison'
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-white bg-slate-950/50'
              }`}
            >
              Comparison
            </button>
          </div>

          {/* Quick Tools Links */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-[11px] text-slate-400">
            <button
              onClick={() => handleNavClick('audit_log')}
              className={`hover:text-cyan-400 transition-colors flex items-center gap-1 px-1.5 py-1 rounded ${
                currentPage === 'audit_log' ? 'text-cyan-400 font-bold bg-slate-800' : ''
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Log</span>
            </button>

            <button
              onClick={() => handleNavClick('import_export')}
              className={`hover:text-cyan-400 transition-colors flex items-center gap-1 px-1.5 py-1 rounded ${
                currentPage === 'import_export' ? 'text-cyan-400 font-bold bg-slate-800' : ''
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Import / Export</span>
            </button>

            <button
              onClick={onOpenChecklistModal}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 px-1.5 py-1 rounded bg-slate-950/40"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>24-Pt Checklist</span>
            </button>

            {onOpenGrandFinaleModal && (
              <button
                onClick={onOpenGrandFinaleModal}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-cyan-300 px-1.5 py-1 rounded bg-slate-950/40"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>13-Step Flow</span>
              </button>
            )}

            <button
              onClick={onOpenFolderModal}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 px-1.5 py-1 rounded bg-slate-950/40"
            >
              <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
              <span>Project Files</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu (Opens when hamburger button is clicked) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          {/* Mobile Revit Sync Status */}
          <div className="sm:hidden pb-3 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-mono">BIM Sync:</span>
            <SyncStatusIndicator
              projectData={projectData}
              onNavigateToRevit={() => handleNavClick('revit')}
              isRevitSyncing={isRevitSyncing}
              lastRevitSyncTime={lastRevitSyncTime}
            />
          </div>

          {/* Primary Navigation Section */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block px-2 mb-1">
              Main Dashboard Pages
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left min-h-[44px] ${
                    currentPage === item.page
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <span className="p-1 rounded bg-slate-900 border border-slate-800">
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Proposals Quick Navigation */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block px-2">
              Forma Proposals
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleNavClick('proposalA')}
                className={`p-2.5 rounded-lg border text-center text-xs font-mono transition-colors min-h-[44px] flex flex-col justify-center ${
                  currentPage === 'proposalA'
                    ? 'bg-slate-800 text-white font-bold border-slate-600'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <span>Proposal A</span>
                <span className="text-[10px] text-slate-400">Conventional</span>
              </button>

              <button
                onClick={() => handleNavClick('proposalB')}
                className={`p-2.5 rounded-lg border text-center text-xs font-mono transition-colors min-h-[44px] flex flex-col justify-center ${
                  currentPage === 'proposalB'
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <span>Proposal B</span>
                <span className="text-[10px] text-cyan-400 font-bold">Selected</span>
              </button>

              <button
                onClick={() => handleNavClick('comparison')}
                className={`p-2.5 rounded-lg border text-center text-xs font-mono transition-colors min-h-[44px] flex flex-col justify-center ${
                  currentPage === 'comparison'
                    ? 'bg-slate-800 text-white font-bold border-slate-600'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <span>Comparison</span>
                <span className="text-[10px] text-slate-400">Side-by-Side</span>
              </button>
            </div>
          </div>

          {/* Tools & Modals */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block px-2">
              Competition Tools & Checklists
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  onOpenChecklistModal();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 flex items-center gap-2 min-h-[44px]"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24-Pt Checklist</span>
              </button>

              {onOpenGrandFinaleModal && (
                <button
                  onClick={() => {
                    onOpenGrandFinaleModal();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 flex items-center gap-2 min-h-[44px]"
                >
                  <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>13-Step Flow</span>
                </button>
              )}

              <button
                onClick={() => {
                  onOpenFolderModal();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 flex items-center gap-2 min-h-[44px]"
              >
                <FolderTree className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Project Folders</span>
              </button>

              <button
                onClick={() => handleNavClick('import_export')}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 flex items-center gap-2 min-h-[44px]"
              >
                <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Import / Export</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
