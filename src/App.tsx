/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProposalType, AnalysisMetricId, BuildingData } from './types';
import { Header, MainTabType } from './components/Header';
import { Viewport3D } from './components/Viewport3D';
import { FormaBoard } from './components/FormaBoard';
import { AnalysisPanel } from './components/AnalysisPanel';
import { RevitBimSync } from './components/RevitBimSync';
import { SlideDeck } from './components/SlideDeck';
import { WalkthroughPlayer } from './components/WalkthroughPlayer';
import { QualityChecklistModal } from './components/QualityChecklistModal';
import { ProjectFolderModal } from './components/ProjectFolderModal';
import { GrandFinaleGuide } from './components/GrandFinaleGuide';
import { SITE_METADATA } from './data/smartCityData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<MainTabType>('viewport');
  const [proposal, setProposal] = useState<ProposalType>('proposalB');
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisMetricId | null>(null);
  const [walkthroughTime, setWalkthroughTime] = useState<number>(0);
  const [isWalkthroughPlaying, setIsWalkthroughPlaying] = useState<boolean>(false);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);

  // Modals state
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isFolderTreeOpen, setIsFolderTreeOpen] = useState(false);
  const [isGrandFinaleOpen, setIsGrandFinaleOpen] = useState(false);

  // Revit BIM Model Real-Time Synchronization State
  const [isRevitSyncing, setIsRevitSyncing] = useState(false);
  const [lastRevitSyncTime, setLastRevitSyncTime] = useState<Date>(new Date(Date.now() - 38000));

  const handleTriggerRevitSync = () => {
    if (isRevitSyncing) return;
    setIsRevitSyncing(true);
    setTimeout(() => {
      setIsRevitSyncing(false);
      setLastRevitSyncTime(new Date());
    }, 2000);
  };

  // Handle setting active analysis and switching to viewport if requested
  const handleApplyAnalysisToViewport = (analysisId: AnalysisMetricId) => {
    setActiveAnalysis(analysisId);
    setCurrentTab('viewport');
  };

  const handleToggleWalkthrough = () => {
    setIsWalkthroughPlaying((prev) => !prev);
  };

  const handleStartWalkthroughFromBeginning = () => {
    setWalkthroughTime(0);
    setIsWalkthroughPlaying(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation (Strict 3-Zone Contract) */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        proposal={proposal}
        onProposalChange={(p) => setProposal(p)}
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onOpenFolderTree={() => setIsFolderTreeOpen(true)}
        onOpenGrandFinale={() => setIsGrandFinaleOpen(true)}
        isRevitSyncing={isRevitSyncing}
        lastRevitSyncTime={lastRevitSyncTime}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {currentTab === 'viewport' && (
          <div className="flex-1 w-full h-[calc(100vh-100px)] min-h-[550px] relative">
            <Viewport3D
              proposal={proposal}
              activeAnalysis={activeAnalysis}
              walkthroughTime={walkthroughTime}
              isWalkthroughPlaying={isWalkthroughPlaying}
              onWalkthroughTimeChange={setWalkthroughTime}
              onToggleWalkthrough={handleToggleWalkthrough}
              selectedBuildingId={selectedBuilding ? selectedBuilding.id : null}
              onSelectBuilding={setSelectedBuilding}
            />
          </div>
        )}

        {currentTab === 'forma_board' && (
          <div className="flex-1 overflow-y-auto">
            <FormaBoard
              onSelectProposal={(p) => {
                setProposal(p);
                setCurrentTab('viewport');
              }}
              onNavigateToAnalysis={(analysisId) => {
                setActiveAnalysis(analysisId as AnalysisMetricId);
                setCurrentTab('analyses');
              }}
              onNavigateToRevit={() => setCurrentTab('revit_bim')}
            />
          </div>
        )}

        {currentTab === 'analyses' && (
          <div className="flex-1 overflow-y-auto">
            <AnalysisPanel
              activeAnalysis={activeAnalysis || 'embodied_carbon'}
              onSelectAnalysis={(id) => setActiveAnalysis(id)}
              onApplyToViewport={handleApplyAnalysisToViewport}
            />
          </div>
        )}

        {currentTab === 'revit_bim' && (
          <div className="flex-1 overflow-y-auto">
            <RevitBimSync
              isSyncing={isRevitSyncing}
              lastSyncTime={lastRevitSyncTime}
              onTriggerSync={handleTriggerRevitSync}
              onViewIn3D={() => {
                setProposal('proposalB');
                setCurrentTab('viewport');
              }}
            />
          </div>
        )}

        {currentTab === 'slides' && (
          <div className="flex-1 overflow-y-auto">
            <SlideDeck onNavigateToTab={(t) => setCurrentTab(t)} />
          </div>
        )}

        {currentTab === 'walkthrough' && (
          <div className="flex-1 overflow-y-auto">
            <WalkthroughPlayer
              walkthroughTime={walkthroughTime}
              isPlaying={isWalkthroughPlaying}
              onTimeChange={setWalkthroughTime}
              onTogglePlay={handleToggleWalkthrough}
              onSwitchTo3D={() => setCurrentTab('viewport')}
            />
          </div>
        )}
      </main>

      {/* Footer info note */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-2.5 text-[11px] text-slate-500 font-mono flex items-center justify-between">
        <div>
          <span>{SITE_METADATA.problemId}</span>
          <span className="mx-2" aria-hidden="true">·</span>
          <span>{SITE_METADATA.title}</span>
          <span className="mx-2" aria-hidden="true">·</span>
          <span>Site Area: 1,000,000 m² (1.00 km²)</span>
        </div>
        <div className="hidden sm:block">
          <span>Autodesk Forma & Revit BIM Workflow Synchronized</span>
        </div>
      </footer>

      {/* Modals */}
      {isChecklistOpen && <QualityChecklistModal onClose={() => setIsChecklistOpen(false)} />}
      {isFolderTreeOpen && <ProjectFolderModal onClose={() => setIsFolderTreeOpen(false)} />}
      {isGrandFinaleOpen && (
        <GrandFinaleGuide
          onClose={() => setIsGrandFinaleOpen(false)}
          onNavigateToTab={(t) => {
            setCurrentTab(t);
            setIsGrandFinaleOpen(false);
          }}
          onSelectProposal={(p) => setProposal(p)}
          onStartWalkthrough={handleStartWalkthroughFromBeginning}
        />
      )}
    </div>
  );
}
