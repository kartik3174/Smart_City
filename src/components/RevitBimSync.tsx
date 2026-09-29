/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProjectData, RevitWorkflowStep, VerificationStatus } from '../types';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  ExternalLink,
  Edit2,
  FileCode,
  Layers,
  ArrowRight,
  ShieldCheck,
  Maximize2,
  Tag,
  AlertTriangle,
  FileCheck,
  X,
  RefreshCw,
} from 'lucide-react';

interface RevitBimSyncProps {
  projectData: ProjectData;
  onUpdateWorkflowStep: (stepNumber: number, status: VerificationStatus, notes: string) => void;
  onNavigateToEvidence: () => void;
  onViewIn3D: () => void;
  isDemoMode: boolean;
  isSyncing?: boolean;
  lastSyncTime?: Date;
  onTriggerSync?: () => void;
}

export const RevitBimSync: React.FC<RevitBimSyncProps> = ({
  projectData,
  onUpdateWorkflowStep,
  onNavigateToEvidence,
  onViewIn3D,
  isDemoMode,
  isSyncing = false,
  lastSyncTime,
  onTriggerSync,
}) => {
  const [activeFloorView, setActiveFloorView] = useState<'elevation' | 'sky_garden' | 'structure'>('elevation');
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [stepStatus, setStepStatus] = useState<VerificationStatus>('PENDING_REVIEW');
  const [stepNotes, setStepNotes] = useState('');

  const workflowSteps = projectData.revitWorkflow || [];

  const handleOpenStepEditor = (step: RevitWorkflowStep) => {
    setEditingStep(step.stepNumber);
    setStepStatus(step.status);
    setStepNotes(step.notes || '');
  };

  const handleSaveStep = (stepNumber: number) => {
    onUpdateWorkflowStep(stepNumber, stepStatus, stepNotes);
    setEditingStep(null);
  };

  // Find nominated office building in Proposal B
  const selectedOfficeBuilding =
    projectData.proposals.proposalB.buildings.find((b) => b.isRevitSelected) ||
    projectData.proposals.proposalB.buildings.find((b) => b.type === 'office') ||
    projectData.proposals.proposalB.buildings[0];

  const verifiedCount = workflowSteps.filter(
    (s) => s.status === 'VERIFIED' && s.evidenceIds && s.evidenceIds.length > 0
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Autodesk Revit BIM Development & Workflow Tracking</span>
            <span aria-hidden="true">·</span>
            <span>Section 9 Official Requirements</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            <span>Revit Workflow Evidence & Detailing</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Track documented team evidence for the 6-step Autodesk Forma $\leftrightarrow$ Autodesk Revit BIM detailing loop. Every workflow milestone requires authentic artifacts (.RVT files, IFC models, drawings, or Forma round-trip screenshots).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onTriggerSync && (
            <button
              onClick={onTriggerSync}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-semibold text-xs rounded-lg transition-colors shadow-sm"
              title="Record workflow evidence check in audit trail"
            >
              <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Record Workflow Step</span>
            </button>
          )}

          <button
            onClick={onNavigateToEvidence}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Attach Revit Evidence</span>
          </button>

          <button
            onClick={onViewIn3D}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>View 3D Context</span>
          </button>
        </div>
      </div>

      {/* Honest Technical Status Notice */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase font-mono text-[11px]">
              Workflow Evidence Architecture (No Simulated Sync)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-mono text-[10px] border border-slate-800">
              {verifiedCount} of {workflowSteps.length} Steps Verified
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            This workspace documents genuine team progress. It records actual Revit files (.RVT), structural drawings, and verified round-trip screenshots. No fake background timer or simulated connector handshake is performed.
          </p>
        </div>
      </div>

      {/* Nominated Building Focus Panel */}
      {selectedOfficeBuilding ? (
        <div className="bg-slate-900/90 border border-indigo-500/40 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider font-bold">
                Nominated Office Building for Revit Detailing (LOD 350)
              </span>
              <h2 className="text-lg font-bold text-white">{selectedOfficeBuilding.name}</h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                Height: {(selectedOfficeBuilding.heightM ?? selectedOfficeBuilding.height ?? 0)}m ({(selectedOfficeBuilding.floors)} floors)
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
                GFA: {(selectedOfficeBuilding.gfaM2 ?? selectedOfficeBuilding.gfa ?? 0).toLocaleString()} m²
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px]">STRUCTURAL SYSTEM</span>
              <span className="text-slate-200 font-semibold">Hybrid Mass Timber & Low-Carbon Core</span>
              <span className="text-emerald-400 block text-[11px]">
                Embodied Carbon: {selectedOfficeBuilding.embodiedCarbonKgM2 ?? 288} kg CO₂e/m²
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px]">REVIT LOD SPECIFICATION</span>
              <span className="text-slate-200 font-semibold">LOD 350 (BIMForum Standard)</span>
              <span className="text-slate-400 block text-[11px]">Gridlines, slabs, curtain wall families</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px]">BIOPHILIC FEATURES</span>
              <span className="text-slate-200 font-semibold">Cantilevered Sky Gardens</span>
              <span className="text-slate-400 block text-[11px]">Multi-level outdoor breakout zones</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400 font-mono">
          No office building currently nominated in Proposal B. Add an office building in Proposal B to track its Revit detailing.
        </div>
      )}

      {/* 6-Step Workflow Evidence Tracker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <span>6-Step Revit Workflow Evidence Checklist</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {verifiedCount} of {workflowSteps.length} Verified
          </span>
        </div>

        <div className="space-y-3">
          {workflowSteps.map((step) => {
            const isEditing = editingStep === step.stepNumber;
            const hasEvidence = step.evidenceIds && step.evidenceIds.length > 0;

            return (
              <div
                key={step.stepNumber}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-cyan-400 shrink-0">
                      STEP 0{step.stepNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-100 text-sm">{step.title}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-indigo-500/30">
                          {step.softwareTool}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                      <div className="text-[11px] text-cyan-300/80 font-mono mt-1">
                        Expected Evidence: {step.expectedEvidence}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2 shrink-0 md:self-center">
                    <span
                      className={`text-xs font-mono font-semibold px-2.5 py-1 rounded border flex items-center gap-1.5 ${
                        step.status === 'VERIFIED'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                          : step.status === 'PENDING_REVIEW'
                          ? 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                          : step.status === 'UPLOADED'
                          ? 'bg-blue-950/60 text-blue-400 border-blue-500/40'
                          : 'bg-red-950/40 text-red-400 border-red-500/40'
                      }`}
                    >
                      {step.status === 'VERIFIED' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      <span>{step.status}</span>
                    </span>

                    <button
                      onClick={() => handleOpenStepEditor(step)}
                      className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                      title="Update step notes or status"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Evidence & Notes Details */}
                <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Evidence Link:</span>
                    {hasEvidence ? (
                      <span className="text-emerald-400 font-semibold">
                        {step.evidenceIds.join(', ')}
                      </span>
                    ) : (
                      <span className="text-red-400 italic">No evidence artifact linked</span>
                    )}
                  </div>
                  {step.notes && (
                    <div className="text-slate-300 truncate max-w-md">
                      <span className="text-slate-500">Notes:</span> {step.notes}
                    </div>
                  )}
                </div>

                {/* Inline Step Editor */}
                {isEditing && (
                  <div className="mt-3 p-3 bg-slate-950 border border-cyan-500/30 rounded-lg space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Verification Status</label>
                        <select
                          value={stepStatus}
                          onChange={(e) => setStepStatus(e.target.value as VerificationStatus)}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                        >
                          <option value="MISSING">MISSING (No evidence)</option>
                          <option value="UPLOADED">UPLOADED (Artifact attached)</option>
                          <option value="PENDING_REVIEW">PENDING_REVIEW (Awaiting check)</option>
                          <option value="VERIFIED">VERIFIED (Reviewed & approved)</option>
                          <option value="REJECTED">REJECTED (Non-compliant)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Step Notes & Version</label>
                        <input
                          type="text"
                          value={stepNotes}
                          onChange={(e) => setStepNotes(e.target.value)}
                          placeholder="e.g. Modeled in Revit 2026, exported IFC4 with schedules..."
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingStep(null)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveStep(step.stepNumber)}
                        className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs"
                      >
                        Save Step
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
