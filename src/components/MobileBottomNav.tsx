/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationPage } from '../types';
import {
  BarChart3,
  MapPin,
  Layers,
  Building2,
  FileCheck,
  ShieldCheck,
  Menu,
  X,
  Presentation,
  PackageCheck,
  History,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FolderTree,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  blockersCount: number;
  isReadyForSubmission: boolean;
  onOpenChecklistModal?: () => void;
  onOpenFolderModal?: () => void;
  onOpenGrandFinaleModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  blockersCount,
  isReadyForSubmission,
  onOpenChecklistModal,
  onOpenFolderModal,
  onOpenGrandFinaleModal,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const mainTabs: { page: NavigationPage; label: string; icon: React.ReactNode }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { page: 'site', label: 'Site 3D', icon: <MapPin className="w-5 h-5" /> },
    { page: 'analyses', label: '8 Analyses', icon: <Layers className="w-5 h-5" /> },
    { page: 'revit', label: 'Revit BIM', icon: <Building2 className="w-5 h-5" /> },
    { page: 'evidence', label: 'Evidence', icon: <FileCheck className="w-5 h-5" /> },
    {
      page: 'readiness',
      label: 'Readiness',
      icon: (
        <div className="relative">
          <ShieldCheck className="w-5 h-5" />
          <span
            className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
              isReadyForSubmission ? 'bg-emerald-400' : 'bg-red-500 animate-pulse'
            }`}
          />
        </div>
      ),
    },
  ];

  const handleSelectPage = (page: NavigationPage) => {
    onNavigate(page);
    setIsMoreMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Visible on phones and small tablets < lg) */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 shadow-2xl px-1 py-1 safe-area-pb"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {mainTabs.map((tab) => {
            const isActive = currentPage === tab.page;
            return (
              <button
                key={tab.page}
                onClick={() => handleSelectPage(tab.page)}
                className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-colors min-w-[48px] min-h-[48px] ${
                  isActive
                    ? 'text-cyan-400 font-bold bg-slate-900/60'
                    : 'text-slate-400 hover:text-slate-200 active:scale-95'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More Menu Trigger */}
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-colors min-w-[48px] min-h-[48px] ${
              isMoreMenuOpen
                ? 'text-cyan-400 bg-slate-900/80 font-bold'
                : 'text-slate-400 hover:text-slate-200 active:scale-95'
            }`}
          >
            {isMoreMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-[10px] tracking-tight mt-0.5">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile "More" Sheet Overlay */}
      {isMoreMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div
            className="bg-slate-900 border-t border-slate-700/80 rounded-t-2xl p-4 space-y-4 max-h-[75vh] overflow-y-auto mb-14 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                All Application Views & Tools
              </span>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Proposals Section */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-500 font-semibold block px-1">
                Proposals & Side-by-Side
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSelectPage('proposalA')}
                  className={`p-2 rounded-lg border text-xs font-mono text-center flex flex-col items-center justify-center min-h-[44px] ${
                    currentPage === 'proposalA'
                      ? 'bg-slate-800 text-white border-slate-600 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>Proposal A</span>
                  <span className="text-[9px] text-slate-500">Conventional</span>
                </button>

                <button
                  onClick={() => handleSelectPage('proposalB')}
                  className={`p-2 rounded-lg border text-xs font-mono text-center flex flex-col items-center justify-center min-h-[44px] ${
                    currentPage === 'proposalB'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>Proposal B</span>
                  <span className="text-[9px] text-cyan-400">Selected</span>
                </button>

                <button
                  onClick={() => handleSelectPage('forma_board')}
                  className={`p-2 rounded-lg border text-xs font-mono text-center flex flex-col items-center justify-center min-h-[44px] ${
                    currentPage === 'forma_board' || currentPage === 'comparison'
                      ? 'bg-slate-800 text-white border-slate-600 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>Forma Board</span>
                  <span className="text-[9px] text-slate-500">Comparison</span>
                </button>
              </div>
            </div>

            {/* Deliverables & Presentation */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-500 font-semibold block px-1">
                Final Competition Deliverables
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelectPage('deliverables')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 min-h-[44px] ${
                    currentPage === 'deliverables'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <PackageCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>9 Deliverables</span>
                </button>

                <button
                  onClick={() => handleSelectPage('presentation')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 min-h-[44px] ${
                    currentPage === 'presentation'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <Presentation className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>7 Slides PPT</span>
                </button>
              </div>
            </div>

            {/* Quick Tools & Audit */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-500 font-semibold block px-1">
                Utilities & Verification
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelectPage('audit_log')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 min-h-[44px] ${
                    currentPage === 'audit_log'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <History className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Audit Trail</span>
                </button>

                <button
                  onClick={() => handleSelectPage('import_export')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 min-h-[44px] ${
                    currentPage === 'import_export'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>JSON Import/Export</span>
                </button>

                {onOpenChecklistModal && (
                  <button
                    onClick={() => {
                      onOpenChecklistModal();
                      setIsMoreMenuOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-2 min-h-[44px]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>24-Pt Checklist</span>
                  </button>
                )}

                {onOpenFolderModal && (
                  <button
                    onClick={() => {
                      onOpenFolderModal();
                      setIsMoreMenuOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-2 min-h-[44px]"
                  >
                    <FolderTree className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Project Files</span>
                  </button>
                )}

                {onOpenGrandFinaleModal && (
                  <button
                    onClick={() => {
                      onOpenGrandFinaleModal();
                      setIsMoreMenuOpen(false);
                    }}
                    className="col-span-2 p-2.5 rounded-lg bg-slate-950/60 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>13-Step Grand Finale Evaluation Flow</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
