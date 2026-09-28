/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationPage, ProjectData } from '../types';
import { auditSubmissionBlockers, calculateProjectMetrics, validateSiteArea } from '../utils/validation';
import {
  MapPin,
  Layers,
  Building2,
  FileCheck,
  PackageCheck,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface DashboardViewProps {
  projectData: ProjectData;
  onNavigate: (page: NavigationPage) => void;
  isDemoMode: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projectData,
  onNavigate,
  isDemoMode,
}) => {
  const metrics = calculateProjectMetrics(projectData.requirements || []);
  const auditResult = auditSubmissionBlockers(projectData);
  const siteAreaValidation = validateSiteArea(projectData.site.siteAreaM2);

  const verifiedAnalysesCount = projectData.analyses.filter(
    (a) => a.status === 'VERIFIED' && a.evidenceIds.length > 0
  ).length;

  const verifiedRevitStepsCount = projectData.revitWorkflow.filter(
    (s) => s.status === 'VERIFIED' && s.evidenceIds.length > 0
  ).length;

  const verifiedDeliverablesCount = projectData.deliverables.filter(
    (d) => d.status === 'VERIFIED' && d.evidenceIds.length > 0
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Demo Mode Notice Banner if in Demo mode */}
      {isDemoMode && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-2xl text-amber-200 text-xs flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-300 uppercase tracking-wider block">
                DEMO MODE ACTIVE
              </span>
              <span className="text-amber-200/90">
                Values shown here are illustrative and are NOT official Autodesk Forma results. Switch to <strong>ACTUAL PROJECT</strong> mode to manage your real project evidence.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Executive Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>SIH26114 Project Companion & Evidence Dashboard</span>
            <span aria-hidden="true">·</span>
            <span>Autodesk Forma & Revit Engineering</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {projectData.site.projectName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Real-time project management and evidence repository connecting your team's manual Autodesk Forma site design and Autodesk Revit BIM workflow with formal competition deliverables.
          </p>
        </div>

        {/* Readiness Pill */}
        <div className="shrink-0">
          <button
            onClick={() => onNavigate('readiness')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 shadow-lg transition-all ${
              auditResult.isReadyForSubmission
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400 hover:bg-emerald-900/60'
                : 'bg-red-950/50 border-red-500/50 text-red-300 hover:bg-red-900/50'
            }`}
          >
            {auditResult.isReadyForSubmission ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ready for Submission</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>{auditResult.blockers.length} Submission Blocker{auditResult.blockers.length > 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top 4 Core Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Site Area */}
        <div
          onClick={() => onNavigate('site')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Site Area</span>
            <MapPin className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
            {(projectData.site.siteAreaM2 / 1000000).toFixed(2)}{' '}
            <span className="text-sm font-normal text-slate-400 font-sans">km²</span>
          </div>
          <div className="text-[11px] font-mono mt-1 text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>≥ 1.00 km² Verified</span>
          </div>
        </div>

        {/* 8 Required Forma Analyses */}
        <div
          onClick={() => onNavigate('analyses')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Forma Analyses</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
            {verifiedAnalysesCount}{' '}
            <span className="text-sm font-normal text-slate-400 font-sans">/ 8 Verified</span>
          </div>
          <div className="text-[11px] font-mono mt-1 text-slate-400">
            {verifiedAnalysesCount === 8 ? (
              <span className="text-emerald-400">All 8 Engines Documented</span>
            ) : (
              <span className="text-amber-400">{8 - verifiedAnalysesCount} Pending Evidence</span>
            )}
          </div>
        </div>

        {/* Revit BIM Workflow */}
        <div
          onClick={() => onNavigate('revit')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Revit BIM Workflow</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1.5 tabular-nums">
            {verifiedRevitStepsCount}{' '}
            <span className="text-sm font-normal text-slate-400 font-sans">/ 4 Steps</span>
          </div>
          <div className="text-[11px] font-mono mt-1 text-slate-400">
            {verifiedRevitStepsCount === 4 ? (
              <span className="text-emerald-400">Sync Verified</span>
            ) : (
              <span className="text-amber-400">In Progress</span>
            )}
          </div>
        </div>

        {/* Evidence Artifacts */}
        <div
          onClick={() => onNavigate('evidence')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Verified Evidence</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1.5 tabular-nums">
            {(projectData.evidenceList || []).length}
          </div>
          <div className="text-[11px] font-mono mt-1 text-slate-400">
            Artifacts uploaded
          </div>
        </div>
      </div>

      {/* Critical Blocker Alert Box if blockers exist */}
      {auditResult.blockers.length > 0 && (
        <div className="bg-red-950/20 border border-red-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-red-300 block">
                Submission Attention Required: {auditResult.blockers.length} Item{auditResult.blockers.length > 1 ? 's' : ''} Missing Evidence
              </span>
              <span className="text-slate-300">
                {auditResult.blockers[0].description}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('readiness')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-semibold rounded-md whitespace-nowrap self-start sm:self-auto"
          >
            Review All Blockers &rarr;
          </button>
        </div>
      )}

      {/* 2-Column Section: Proposals Overview & Deliverables Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Proposals Overview */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Site Design Proposals (Section 4 & 5)
            </h2>
            <button
              onClick={() => onNavigate('comparison')}
              className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono"
            >
              <span>Compare</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Proposal A */}
          <div
            onClick={() => onNavigate('proposalA')}
            className="p-3.5 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-lg cursor-pointer transition-colors space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">
                Proposal A — Conventional Urban Development
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                {projectData.proposals.proposalA.sourceType}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">GFA</span>
                <span className="text-slate-200">
                  {projectData.proposals.proposalA.declaredGfaM2.toLocaleString()} m²
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Density (FAR)</span>
                <span className="text-slate-200">{projectData.proposals.proposalA.declaredFar}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Green Realm</span>
                <span className="text-slate-200">
                  {projectData.proposals.proposalA.declaredGreenPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Proposal B */}
          <div
            onClick={() => onNavigate('proposalB')}
            className="p-3.5 bg-slate-950/70 border border-cyan-500/30 hover:border-cyan-500/60 rounded-lg cursor-pointer transition-colors space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Proposal B — Sustainable Smart Urban Development
              </span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase">
                {projectData.selectedFinalProposal === 'proposalB' ? 'Selected' : 'Alternative'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">GFA</span>
                <span className="text-slate-200 font-bold">
                  {projectData.proposals.proposalB.declaredGfaM2.toLocaleString()} m²
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Density (FAR)</span>
                <span className="text-cyan-300 font-bold">{projectData.proposals.proposalB.declaredFar}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Green Realm</span>
                <span className="text-emerald-400 font-bold">
                  {projectData.proposals.proposalB.declaredGreenPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 9 Mandatory Deliverables Tracker */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-cyan-400" />
              <span>Deliverables Status ({verifiedDeliverablesCount}/9)</span>
            </h2>
            <button
              onClick={() => onNavigate('deliverables')}
              className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {projectData.deliverables.map((del) => {
              const isVerified = del.status === 'VERIFIED';
              return (
                <div
                  key={del.id}
                  onClick={() => onNavigate('deliverables')}
                  className="flex items-center justify-between p-2 rounded bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-xs font-mono cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    {isVerified ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                    <span className="text-slate-200 font-sans truncate">{del.title}</span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded shrink-0 ${
                      isVerified
                        ? 'text-emerald-400 bg-emerald-950/40'
                        : 'text-slate-500 bg-slate-900'
                    }`}
                  >
                    {del.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
