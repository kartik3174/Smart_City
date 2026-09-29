/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  AppMode,
  NavigationPage,
  ProjectData,
  ProposalId,
  AnalysisMetricId,
  ProposalData,
  AnalysisResult,
  VerificationStatus,
  DeliverableItem,
  EvidenceItem,
} from './types';
import {
  getStoredAppMode,
  saveAppMode,
  loadProjectData,
  saveProjectData,
  addAuditLog,
} from './services/storage';
import { auditSubmissionBlockers } from './utils/validation';

// Components
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SiteView } from './components/SiteView';
import { ProposalDetailView } from './components/ProposalDetailView';
import { FormaBoard } from './components/FormaBoard';
import { AnalysisPanel } from './components/AnalysisPanel';
import { RevitBimSync } from './components/RevitBimSync';
import { EvidenceCenter } from './components/EvidenceCenter';
import { DeliverablesManager } from './components/DeliverablesManager';
import { PresentationPlanner } from './components/PresentationPlanner';
import { SubmissionReadiness } from './components/SubmissionReadiness';
import { AuditLogView } from './components/AuditLogView';
import { DataImportExport } from './components/DataImportExport';
import { MobileBottomNav } from './components/MobileBottomNav';

// Modals
import { QualityChecklistModal } from './components/QualityChecklistModal';
import { ProjectFolderModal } from './components/ProjectFolderModal';
import { GrandFinaleGuide } from './components/GrandFinaleGuide';

export default function App() {
  // Mode: ACTUAL (Honest Team Project) vs DEMO (Sample Review Data)
  const [appMode, setAppMode] = useState<AppMode>(() => getStoredAppMode());
  const [projectData, setProjectData] = useState<ProjectData>(() => loadProjectData(appMode));

  // Current navigation page
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');

  // Active Proposal being viewed in 3D / detail
  const [activeProposalId, setActiveProposalId] = useState<ProposalId>('proposalB');

  // Active analysis metric
  const [activeAnalysisId, setActiveAnalysisId] = useState<AnalysisMetricId>('embodied_carbon');

  // Revit BIM Synchronization Real-Time State
  const [isRevitSyncing, setIsRevitSyncing] = useState<boolean>(false);
  const [lastRevitSyncTime, setLastRevitSyncTime] = useState<Date>(() => new Date(Date.now() - 42000));

  // Modals state
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isGrandFinaleModalOpen, setIsGrandFinaleModalOpen] = useState(false);

  // Sync state to LocalStorage
  const updateProjectDataAndSave = useCallback(
    (updater: (prev: ProjectData) => ProjectData) => {
      setProjectData((prev) => {
        const next = updater(prev);
        saveProjectData(appMode, next);
        return next;
      });
    },
    [appMode]
  );

  // Mode switching
  const handleToggleAppMode = (newMode: AppMode) => {
    if (newMode === appMode) return;
    saveAppMode(newMode);
    setAppMode(newMode);
    const loaded = loadProjectData(newMode);
    const withLog = addAuditLog(loaded, {
      action: 'MODE_SWITCHED',
      entity: 'Application Environment',
      previousValue: appMode,
      newValue: newMode,
      user: 'Team Engineer',
      notes: `Switched view mode to ${newMode}`,
    });
    setProjectData(withLog);
    saveProjectData(newMode, withLog);
  };

  // Revit Workflow Evidence Record (No fake setTimeout or simulated handshake)
  const handleTriggerRevitSync = () => {
    const now = new Date();
    setLastRevitSyncTime(now);

    const verifiedCount = (projectData.revitWorkflow || []).filter(
      (s) => s.status === 'VERIFIED' && s.evidenceIds && s.evidenceIds.length > 0
    ).length;

    updateProjectDataAndSave((prev) =>
      addAuditLog(prev, {
        action: 'DATA_MODIFIED',
        entity: 'Revit Workflow Evidence Audit',
        previousValue: 'Previous Check',
        newValue: now.toLocaleTimeString(),
        user: 'Team BIM Auditor',
        notes: `Workflow step recorded — attach actual Revit/Forma evidence. Currently ${verifiedCount} of ${prev.revitWorkflow.length} steps verified.`,
      })
    );
  };

  // Update proposal
  const handleUpdateProposal = (proposalId: ProposalId, updated: Partial<ProposalData>) => {
    updateProjectDataAndSave((prev) => {
      const current = prev.proposals[proposalId];
      const nextProposal: ProposalData = {
        ...current,
        ...updated,
      };

      const withLog = addAuditLog(
        {
          ...prev,
          proposals: {
            ...prev.proposals,
            [proposalId]: nextProposal,
          },
        },
        {
          action: 'DATA_MODIFIED',
          entity: `${proposalId === 'proposalA' ? 'Proposal A' : 'Proposal B'} Masterplan`,
          user: 'Team Urban Planner',
          notes: 'Updated declared planning metrics or building schedule.',
        }
      );
      return withLog;
    });
  };

  // Update analysis
  const handleUpdateAnalysis = (analysis: AnalysisResult) => {
    updateProjectDataAndSave((prev) => {
      const updatedList = prev.analyses.map((a) => (a.id === analysis.id ? analysis : a));
      return addAuditLog(
        {
          ...prev,
          analyses: updatedList,
        },
        {
          action: 'DATA_MODIFIED',
          entity: `Forma Analysis: ${analysis.metricName}`,
          previousValue: `${analysis.proposalAValue} / ${analysis.proposalBValue}`,
          newValue: `${analysis.displayA} / ${analysis.displayB}`,
          user: 'BIM / Environmental Analyst',
          notes: `Updated simulation figures from ${analysis.source}`,
        }
      );
    });
  };

  // Select final proposal on Forma Board
  const handleSelectFinalProposal = (id: ProposalId, rationale: string) => {
    updateProjectDataAndSave((prev) =>
      addAuditLog(
        {
          ...prev,
          selectedFinalProposal: id,
          selectionRationale: rationale,
        },
        {
          action: 'STATUS_CHANGED',
          entity: 'Forma Board Final Proposal Selection',
          newValue: id,
          user: 'Project Lead',
          notes: rationale,
        }
      )
    );
  };

  // Update Revit workflow step
  const handleUpdateWorkflowStep = (
    stepNumber: number,
    status: VerificationStatus,
    notes: string
  ) => {
    updateProjectDataAndSave((prev) => {
      const updatedSteps = prev.revitWorkflow.map((step) =>
        step.stepNumber === stepNumber
          ? {
              ...step,
              status,
              notes,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : step
      );

      return addAuditLog(
        {
          ...prev,
          revitWorkflow: updatedSteps,
        },
        {
          action: 'STATUS_CHANGED',
          entity: `Revit Workflow Step 0${stepNumber}`,
          newValue: status,
          user: 'BIM Engineer',
          notes,
        }
      );
    });
  };

  // Update deliverable item
  const handleUpdateDeliverable = (id: string, updated: Partial<DeliverableItem>) => {
    updateProjectDataAndSave((prev) => {
      const updatedList = prev.deliverables.map((d) => (d.id === id ? { ...d, ...updated } : d));
      return addAuditLog(
        {
          ...prev,
          deliverables: updatedList,
        },
        {
          action: 'STATUS_CHANGED',
          entity: `Deliverable: ${id}`,
          newValue: updated.status || 'Updated',
          user: 'Project Manager',
          notes: updated.notes || 'Deliverable status modified.',
        }
      );
    });
  };

  // Add evidence item
  const handleAddEvidence = (item: EvidenceItem) => {
    updateProjectDataAndSave((prev) => {
      const nextList = [item, ...(prev.evidenceList || [])];

      // Link to requirement without automatically marking as VERIFIED
      const nextRequirements = prev.requirements.map((req) => {
        if (req.id === item.requirementId) {
          const links = req.linkedEvidenceIds || [];
          return {
            ...req,
            status: (req.status === 'VERIFIED' ? 'VERIFIED' : 'PENDING_REVIEW') as VerificationStatus,
            linkedEvidenceIds: links.includes(item.id) ? links : [...links, item.id],
          };
        }
        return req;
      });

      return addAuditLog(
        {
          ...prev,
          evidenceList: nextList,
          requirements: nextRequirements,
        },
        {
          action: 'EVIDENCE_UPLOADED',
          entity: `Evidence: ${item.title}`,
          newValue: item.id,
          user: item.uploadedBy || 'Team Member',
          notes: `Uploaded artifact ${item.fileName} (${item.source})`,
        }
      );
    });
  };

  // Update evidence item (review / verify / reject)
  const handleUpdateEvidence = (id: string, updated: Partial<EvidenceItem>) => {
    updateProjectDataAndSave((prev) => {
      const nextList = (prev.evidenceList || []).map((e) => (e.id === id ? { ...e, ...updated } : e));
      const targetItem = nextList.find((e) => e.id === id);

      let nextRequirements = prev.requirements;
      if (targetItem && updated.status) {
        nextRequirements = prev.requirements.map((req) => {
          if (req.id === targetItem.requirementId) {
            const linkedItems = nextList.filter((e) => (req.linkedEvidenceIds || []).includes(e.id));
            const hasVerified = linkedItems.some((e) => e.status === 'VERIFIED');
            const hasPending = linkedItems.some((e) => e.status === 'PENDING_REVIEW' || e.status === 'UPLOADED');
            const newReqStatus: VerificationStatus = hasVerified
              ? 'VERIFIED'
              : hasPending
              ? 'PENDING_REVIEW'
              : linkedItems.length > 0
              ? 'REJECTED'
              : 'MISSING';
            return {
              ...req,
              status: newReqStatus,
            };
          }
          return req;
        });
      }

      return addAuditLog(
        {
          ...prev,
          evidenceList: nextList,
          requirements: nextRequirements,
        },
        {
          action: updated.status === 'VERIFIED' ? 'EVIDENCE_VERIFIED' : updated.status === 'REJECTED' ? 'EVIDENCE_REJECTED' : 'DATA_MODIFIED',
          entity: `Evidence Item: ${id}`,
          newValue: updated.status || 'Updated',
          user: updated.reviewer || 'Quality Auditor',
          notes: updated.verificationNote || updated.notes || 'Evidence item updated.',
        }
      );
    });
  };

  // Delete evidence item
  const handleDeleteEvidence = (id: string) => {
    updateProjectDataAndSave((prev) => {
      const nextList = prev.evidenceList.filter((e) => e.id !== id);
      const nextRequirements = prev.requirements.map((req) => {
        const remainingLinks = (req.linkedEvidenceIds || []).filter((eId) => eId !== id);
        const linkedItems = nextList.filter((e) => remainingLinks.includes(e.id));
        const hasVerified = linkedItems.some((e) => e.status === 'VERIFIED');
        const hasPending = linkedItems.some((e) => e.status === 'PENDING_REVIEW' || e.status === 'UPLOADED');
        const newReqStatus: VerificationStatus = remainingLinks.length === 0
          ? 'MISSING'
          : hasVerified
          ? 'VERIFIED'
          : hasPending
          ? 'PENDING_REVIEW'
          : 'REJECTED';
        return {
          ...req,
          status: newReqStatus,
          linkedEvidenceIds: remainingLinks,
        };
      });

      return addAuditLog(
        {
          ...prev,
          evidenceList: nextList,
          requirements: nextRequirements,
        },
        {
          action: 'DATA_MODIFIED',
          entity: `Evidence Item: ${id}`,
          previousValue: 'Existing Evidence',
          newValue: 'Deleted',
          user: 'Quality Auditor',
          notes: 'Evidence item removed from registry.',
        }
      );
    });
  };

  // Import JSON project data
  const handleImportProject = (imported: ProjectData) => {
    const withLog = addAuditLog(imported, {
      action: 'DATA_IMPORTED',
      entity: 'Project Data Bundle',
      user: 'Administrator',
      notes: `Imported project dataset: ${imported.site?.projectName || imported.projectId}`,
    });
    setProjectData(withLog);
    saveProjectData(appMode, withLog);
    setCurrentPage('dashboard');
  };

  // Reset project data to template
  const handleResetProject = () => {
    localStorage.removeItem(
      appMode === 'DEMO' ? 'sih26114_demo_project_data_v2' : 'sih26114_actual_project_data_v2'
    );
    const fresh = loadProjectData(appMode);
    setProjectData(fresh);
  };

  // Submission readiness audit
  const auditResult = auditSubmissionBlockers(projectData);
  const blockersCount = auditResult.blockers.length;
  const isReadyForSubmission = auditResult.isReadyForSubmission;
  const isDemo = appMode === 'DEMO';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Bar Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        appMode={appMode}
        onToggleAppMode={handleToggleAppMode}
        blockersCount={blockersCount}
        isReadyForSubmission={isReadyForSubmission}
        onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
        onOpenFolderModal={() => setIsFolderModalOpen(true)}
        onOpenGrandFinaleModal={() => setIsGrandFinaleModalOpen(true)}
        projectData={projectData}
        isRevitSyncing={isRevitSyncing}
        lastRevitSyncTime={lastRevitSyncTime}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col relative overflow-y-auto pb-20 lg:pb-0">
        {currentPage === 'dashboard' && (
          <DashboardView
            projectData={projectData}
            onNavigate={setCurrentPage}
            isDemoMode={isDemo}
          />
        )}

        {currentPage === 'site' && (
          <SiteView
            projectData={projectData}
            activeProposalId={activeProposalId}
            onSelectProposal={setActiveProposalId}
            onNavigateToEvidence={() => setCurrentPage('evidence')}
            isDemoMode={isDemo}
          />
        )}

        {currentPage === 'proposalA' && (
          <ProposalDetailView
            proposal={projectData.proposals.proposalA}
            siteAreaM2={projectData.site.siteAreaM2}
            onUpdateProposal={(up) => handleUpdateProposal('proposalA', up)}
            onSelectBuildingFor3D={() => {
              setActiveProposalId('proposalA');
              setCurrentPage('site');
            }}
            isDemoMode={isDemo}
          />
        )}

        {currentPage === 'proposalB' && (
          <ProposalDetailView
            proposal={projectData.proposals.proposalB}
            siteAreaM2={projectData.site.siteAreaM2}
            onUpdateProposal={(up) => handleUpdateProposal('proposalB', up)}
            onSelectBuildingFor3D={() => {
              setActiveProposalId('proposalB');
              setCurrentPage('site');
            }}
            isDemoMode={isDemo}
          />
        )}

        {(currentPage === 'comparison' || currentPage === 'forma_board') && (
          <FormaBoard
            projectData={projectData}
            onSelectFinalProposal={handleSelectFinalProposal}
            onNavigateToAnalysis={(id) => {
              setActiveAnalysisId(id as AnalysisMetricId);
              setCurrentPage('analyses');
            }}
            onNavigateToEvidence={() => setCurrentPage('evidence')}
            isDemoMode={isDemo}
          />
        )}

        {currentPage === 'analyses' && (
          <AnalysisPanel
            projectData={projectData}
            activeAnalysisId={activeAnalysisId}
            onSelectAnalysis={setActiveAnalysisId}
            onUpdateAnalysis={handleUpdateAnalysis}
            onApplyToViewport={(id) => {
              setActiveAnalysisId(id);
              setCurrentPage('site');
            }}
            onNavigateToEvidence={() => setCurrentPage('evidence')}
            isDemoMode={isDemo}
          />
        )}

        {currentPage === 'revit' && (
          <RevitBimSync
            projectData={projectData}
            onUpdateWorkflowStep={handleUpdateWorkflowStep}
            onNavigateToEvidence={() => setCurrentPage('evidence')}
            onViewIn3D={() => {
              setActiveProposalId('proposalB');
              setCurrentPage('site');
            }}
            isDemoMode={isDemo}
            isSyncing={isRevitSyncing}
            lastSyncTime={lastRevitSyncTime}
            onTriggerSync={handleTriggerRevitSync}
          />
        )}

        {currentPage === 'evidence' && (
          <EvidenceCenter
            projectData={projectData}
            onAddEvidence={handleAddEvidence}
            onUpdateEvidence={handleUpdateEvidence}
            onDeleteEvidence={handleDeleteEvidence}
            isDemoMode={isDemo}
          />
        )}

        {currentPage === 'deliverables' && (
          <DeliverablesManager
            projectData={projectData}
            onUpdateDeliverable={handleUpdateDeliverable}
            onNavigateToEvidence={() => setCurrentPage('evidence')}
            isDemoMode={isDemo}
          />
        )}

        {currentPage === 'presentation' && (
          <PresentationPlanner
            projectData={projectData}
            onNavigateToEvidence={() => setCurrentPage('evidence')}
            isDemoMode={isDemo}
          />
        )}

        {currentPage === 'readiness' && (
          <SubmissionReadiness
            projectData={projectData}
            onNavigateToEvidence={() => setCurrentPage('evidence')}
            onNavigateToAnalyses={() => setCurrentPage('analyses')}
            onNavigateToRevit={() => setCurrentPage('revit')}
            onNavigateToSite={() => setCurrentPage('site')}
            isDemoMode={isDemo}
          />
        )}

        {currentPage === 'audit_log' && (
          <AuditLogView projectData={projectData} isDemoMode={isDemo} />
        )}

        {currentPage === 'import_export' && (
          <DataImportExport
            projectData={projectData}
            onImportProject={handleImportProject}
            onResetProject={handleResetProject}
            isDemoMode={isDemo}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Smartphones & small tablets) */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        blockersCount={blockersCount}
        isReadyForSubmission={isReadyForSubmission}
        onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
        onOpenFolderModal={() => setIsFolderModalOpen(true)}
        onOpenGrandFinaleModal={() => setIsGrandFinaleModalOpen(true)}
      />

      {/* Compliance & Provenance Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 px-4 py-2 text-[11px] text-slate-500 font-mono flex flex-wrap items-center justify-between gap-3 mb-14 lg:mb-0">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">{projectData.site.problemStatementId}</span>
          <span aria-hidden="true">·</span>
          <span>{projectData.site.projectName}</span>
          <span aria-hidden="true">·</span>
          <span>Site: {(projectData.site.siteAreaM2 / 1000000).toFixed(2)} km²</span>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span className={isDemo ? 'text-amber-400' : 'text-emerald-400'}>
            MODE: {isDemo ? 'DEMO DATA (ILLUSTRATIVE)' : 'ACTUAL TEAM DATA'}
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">
            Autodesk Forma & Revit BIM Verification Protocol Active
          </span>
        </div>
      </footer>

      {/* Modals */}
      {isChecklistModalOpen && (
        <QualityChecklistModal onClose={() => setIsChecklistModalOpen(false)} />
      )}

      {isFolderModalOpen && (
        <ProjectFolderModal onClose={() => setIsFolderModalOpen(false)} />
      )}

      {isGrandFinaleModalOpen && (
        <GrandFinaleGuide
          onClose={() => setIsGrandFinaleModalOpen(false)}
          onNavigateToTab={(page) => {
            setCurrentPage(page);
            setIsGrandFinaleModalOpen(false);
          }}
          onSelectProposal={setActiveProposalId}
          onStartWalkthrough={() => {
            setCurrentPage('site');
            setIsGrandFinaleModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
