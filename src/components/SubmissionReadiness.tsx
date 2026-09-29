/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProjectData, RequirementItem } from '../types';
import { auditSubmissionBlockers, calculateProjectMetrics } from '../utils/validation';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  AlertCircle,
  ExternalLink,
  Layers,
  Building2,
  Presentation,
  Award,
} from 'lucide-react';

interface SubmissionReadinessProps {
  projectData: ProjectData;
  onNavigateToEvidence: () => void;
  onNavigateToAnalyses: () => void;
  onNavigateToRevit: () => void;
  onNavigateToSite?: () => void;
  isDemoMode: boolean;
}

export const SubmissionReadiness: React.FC<SubmissionReadinessProps> = ({
  projectData,
  onNavigateToEvidence,
  onNavigateToAnalyses,
  onNavigateToRevit,
  onNavigateToSite,
  isDemoMode,
}) => {
  const auditResult = auditSubmissionBlockers(projectData);
  const metrics = calculateProjectMetrics(projectData.requirements || []);

  const getRequirementsByCategory = (category: RequirementItem['category']) => {
    return (projectData.requirements || []).filter((r) => r.category === category);
  };

  const formaReqs = [
    ...getRequirementsByCategory('SITE'),
    ...getRequirementsByCategory('PROPOSALS'),
    ...getRequirementsByCategory('ANALYSIS'),
  ];
  const revitReqs = getRequirementsByCategory('REVIT');
  const presentationReqs = getRequirementsByCategory('FINAL_DELIVERABLES');
  const complianceReqs = getRequirementsByCategory('COMPLIANCE');

  const renderRequirementRow = (req: RequirementItem) => {
    const isVerified = req.status === 'VERIFIED' && req.linkedEvidenceIds.length > 0;
    const hasEvidence = req.linkedEvidenceIds.length > 0;

    return (
      <div
        key={req.id}
        className={`flex items-start justify-between gap-3 p-3 rounded-lg border text-xs transition-colors ${
          isVerified
            ? 'bg-slate-900/60 border-slate-800 text-slate-200'
            : hasEvidence
            ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
            : 'bg-slate-950/80 border-red-500/20 text-slate-400'
        }`}
      >
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5">
            {isVerified ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : hasEvidence ? (
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{req.title}</span>
              <span className="text-[10px] font-mono text-slate-500">{req.id}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{req.description}</p>
            {hasEvidence && (
              <div className="text-[10px] font-mono text-cyan-400 mt-1">
                Evidence: {req.linkedEvidenceIds.join(', ')}
              </div>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <span
            className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border ${
              isVerified
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
                : hasEvidence
                ? 'bg-amber-950/40 text-amber-400 border-amber-500/40'
                : 'bg-red-950/40 text-red-400 border-red-500/40'
            }`}
          >
            {req.status}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Official SIH26114 Competition Audit</span>
            <span aria-hidden="true">·</span>
            <span>Evaluation Protocol</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span>Submission Readiness Dashboard</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Strict verification audit determining whether the project is compliant with all official Autodesk problem statement rules. Submission is automatically blocked until every mandatory evidence artifact is uploaded.
          </p>
        </div>

        {/* Readiness Badge */}
        <div className="shrink-0 w-full sm:w-auto">
          {auditResult.isReadyForSubmission ? (
            <div className="bg-emerald-950/40 border border-emerald-500/50 px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-emerald-400 font-bold text-xs shadow-lg">
              <Award className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="tracking-wide">STATUS: READY FOR SUBMISSION</div>
                <div className="text-[10px] text-emerald-500 font-mono font-normal">All criteria verified with evidence</div>
              </div>
            </div>
          ) : auditResult.hasSiteAreaViolation ? (
            <div className="bg-red-950/60 border-2 border-red-500 px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-red-300 font-bold text-xs shadow-lg ring-1 ring-red-500/40">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <div className="text-red-400 font-black tracking-wide">STATUS: NOT READY</div>
                <div className="text-[10px] text-red-300 font-mono font-normal">Site Area Constraint Violation (&lt; 1 km²)</div>
              </div>
            </div>
          ) : (
            <div className="bg-red-950/40 border border-red-500/50 px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-red-400 font-bold text-xs shadow-lg">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <div className="tracking-wide">STATUS: NOT READY</div>
                <div className="text-[10px] text-red-400/80 font-mono font-normal">
                  {auditResult.blockers.length} Active Blocker{auditResult.blockers.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Specific Site Area Constraint Violation Alert Banner */}
      {auditResult.hasSiteAreaViolation && (
        <div className="p-4 sm:p-5 bg-red-950/50 border-2 border-red-500 rounded-xl sm:rounded-2xl text-red-200 text-xs sm:text-sm space-y-3 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-red-400 animate-pulse" />
              <span>SITE AREA CONSTRAINT VIOLATION · PROJECT NOT READY</span>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-red-900/60 text-red-200 border border-red-500/50 self-start sm:self-auto font-semibold">
              Mandatory Minimum: 1.00 km² (1,000,000 m²)
            </span>
          </div>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            {auditResult.siteAreaViolationMessage || `The defined site area (${auditResult.currentSiteAreaKm2} km² / ${auditResult.currentSiteAreaM2.toLocaleString()} m²) strictly fails the official Autodesk SIH26114 competition requirement of at least 1.00 km² (1,000,000 m²). The project submission status is marked as NOT READY.`}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-red-500/30 text-xs">
            <div className="font-mono text-red-300">
              Current Area: <span className="font-bold text-white">{auditResult.currentSiteAreaKm2} km²</span> · Deficit: <span className="font-bold text-red-400">{(auditResult.minRequiredAreaKm2 - auditResult.currentSiteAreaKm2).toFixed(3)} km² ({((auditResult.minRequiredAreaKm2 - auditResult.currentSiteAreaKm2) * 1000000).toLocaleString()} m²)</span>
            </div>
            {onNavigateToSite && (
              <button
                onClick={onNavigateToSite}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md min-h-[44px]"
              >
                <span>Adjust Site Boundary on Site View</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Demo Warning Banner if in Demo mode */}
      {isDemoMode && (
        <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">DEMO AUDIT ACTIVE:</span> The requirements below reflect illustrative demo values. In Actual Project mode, real team-uploaded Autodesk Forma/Revit evidence files are required.
          </div>
        </div>
      )}

      {/* Metrics Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Total Requirements</span>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {metrics.total}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Full competition scope</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Verified with Evidence</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {metrics.verified}
          </div>
          <span className="text-[11px] text-emerald-500 mt-1 block">
            {metrics.completionPercent}% compliance achieved
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">In Progress / Review</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {metrics.pendingReview + metrics.uploaded}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Awaiting sign-off</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Unstarted / Missing</span>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1 tabular-nums">
            {metrics.missing}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Blocking submission</span>
        </div>
      </div>

      {/* Active Blocker Warnings Box */}
      {auditResult.blockers.length > 0 && (
        <div className="bg-red-950/20 border border-red-500/40 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Submission Blockers Identified ({auditResult.blockers.length}):</span>
          </div>
          <div className="space-y-2">
            {auditResult.blockers.map((b, i) => (
              <div
                key={i}
                className="bg-slate-950/80 border border-red-500/30 rounded-lg p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-mono text-red-400 font-semibold uppercase text-[10px] block">
                    [{b.category}]
                  </span>
                  <span className="text-slate-200">{b.description}</span>
                  <span className="text-slate-400 block text-[11px] mt-0.5">
                    <strong>Action required:</strong> {b.actionNeeded}
                  </span>
                </div>

                <button
                  onClick={
                    b.category.includes('ANALYSIS')
                      ? onNavigateToAnalyses
                      : b.category.includes('REVIT')
                      ? onNavigateToRevit
                      : onNavigateToEvidence
                  }
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-semibold text-xs rounded-md whitespace-nowrap self-start sm:self-auto"
                >
                  Resolve Blocker &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Four Core Audit Sections */}
      <div className="space-y-6">
        {/* Section 1: Autodesk Forma Deliverables */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Autodesk Forma Site Design & Analyses</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Site ≥ 1 km², Proposals A & B, 8 Analyses, Forma Board
            </span>
          </div>
          <div className="space-y-2">{formaReqs.map(renderRequirementRow)}</div>
        </div>

        {/* Section 2: Autodesk Revit BIM Deliverables */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Autodesk Revit BIM Modeling & Sync</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Office Building LOD 350, Workflow Evidence, Sync Proof
            </span>
          </div>
          <div className="space-y-2">{revitReqs.map(renderRequirementRow)}</div>
        </div>

        {/* Section 3: Final Presentation & Walkthrough */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Presentation className="w-4 h-4 text-amber-400" />
              <span>Final Visualization & Submission Media</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Renders, 30s Walkthrough Video, 5-7 Slide Presentation
            </span>
          </div>
          <div className="space-y-2">{presentationReqs.map(renderRequirementRow)}</div>
        </div>

        {/* Section 4: Competition Rules Compliance */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Academic Integrity & Tool Authenticity</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              No AI models, No copied pre-designed assets, Real Forma results
            </span>
          </div>
          <div className="space-y-2">{complianceReqs.map(renderRequirementRow)}</div>
        </div>
      </div>
    </div>
  );
};
