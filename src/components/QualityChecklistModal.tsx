/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProjectData } from '../types';
import {
  CheckCircle2,
  ShieldCheck,
  Award,
  Clock,
  AlertTriangle,
  Upload,
  XCircle,
  FileCheck,
} from 'lucide-react';

interface QualityChecklistModalProps {
  onClose: () => void;
  projectData: ProjectData;
  isDemoMode: boolean;
}

export const QualityChecklistModal: React.FC<QualityChecklistModalProps> = ({
  onClose,
  projectData,
  isDemoMode,
}) => {
  // Derive checklist items strictly from the authentic requirements and evidence system
  const requirements = projectData.requirements || [];
  const totalItems = requirements.length;
  const verifiedCount = requirements.filter((r) => r.status === 'VERIFIED').length;
  const pendingCount = requirements.filter((r) => r.status === 'PENDING_REVIEW').length;
  const uploadedCount = requirements.filter((r) => r.status === 'UPLOADED').length;
  const missingCount = requirements.filter((r) => r.status === 'MISSING').length;
  const percentComplete = totalItems > 0 ? Math.round((verifiedCount / totalItems) * 100) : 0;

  const getStatusBadge = (status: string, evidenceCount: number) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            <span>VERIFIED</span>
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/40 flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3" />
            <span>PENDING REVIEW</span>
          </span>
        );
      case 'UPLOADED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-950/80 text-blue-400 border border-blue-500/40 flex items-center gap-1 shrink-0">
            <Upload className="w-3 h-3" />
            <span>UPLOADED ({evidenceCount})</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-950/80 text-rose-400 border border-rose-500/40 flex items-center gap-1 shrink-0">
            <XCircle className="w-3 h-3" />
            <span>REJECTED</span>
          </span>
        );
      case 'MISSING':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-950/50 text-red-400 border border-red-500/30 flex items-center gap-1 shrink-0">
            <AlertTriangle className="w-3 h-3" />
            <span>MISSING</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-xl sm:rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Section 14 — Quality & Compliance Audit</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Official Competition Verification Checklist
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Calculated dynamically from authentic Autodesk Forma and Revit project evidence. Read-only completion status.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2.5 py-1 rounded"
          >
            ✕ Close
          </button>
        </div>

        {/* Demo Notice if in demo mode */}
        {isDemoMode && (
          <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-amber-300 text-xs flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider font-mono">
              DEMO DATA — NOT ACTUAL FORMA RESULTS
            </span>
          </div>
        )}

        {/* Calculated Status Summary Card */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-semibold text-slate-200">
              Calculated Requirement Compliance
            </span>
            <span className="font-mono text-cyan-400 font-bold tabular-nums">
              {verifiedCount} of {totalItems} Criteria Verified ({percentComplete}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                percentComplete === 100
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                  : 'bg-gradient-to-r from-red-500 via-amber-500 to-cyan-400'
              }`}
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono text-[11px]">
            <div className="p-1.5 bg-slate-900/80 rounded border border-emerald-500/20 text-emerald-400">
              <span className="block font-bold">{verifiedCount}</span>
              <span className="text-[10px] text-slate-400">Verified</span>
            </div>
            <div className="p-1.5 bg-slate-900/80 rounded border border-amber-500/20 text-amber-400">
              <span className="block font-bold">{pendingCount}</span>
              <span className="text-[10px] text-slate-400">Pending Review</span>
            </div>
            <div className="p-1.5 bg-slate-900/80 rounded border border-blue-500/20 text-blue-400">
              <span className="block font-bold">{uploadedCount}</span>
              <span className="text-[10px] text-slate-400">Uploaded</span>
            </div>
            <div className="p-1.5 bg-slate-900/80 rounded border border-red-500/20 text-red-400">
              <span className="block font-bold">{missingCount}</span>
              <span className="text-[10px] text-slate-400">Missing</span>
            </div>
          </div>
        </div>

        {/* 24-Criteria Read-Only Verification List */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2">
          {requirements.map((req, index) => {
            const isVerified = req.status === 'VERIFIED';
            const evidenceCount = (req.linkedEvidenceIds || []).length;

            return (
              <div
                key={req.id}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  isVerified
                    ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                    : req.status === 'PENDING_REVIEW'
                    ? 'bg-amber-950/10 border-amber-500/20 text-slate-200'
                    : 'bg-slate-950/80 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className="font-semibold text-slate-100">{req.title}</h4>
                      <span className="text-[9px] text-slate-500 font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {req.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {req.description}
                    </p>
                    <div className="text-[10px] font-mono text-cyan-400/80">
                      Required Evidence: {req.expectedEvidence}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {getStatusBadge(req.status, evidenceCount)}
                    <span className="text-[9px] font-mono text-slate-500">
                      {evidenceCount} linked artifact{evidenceCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-500 font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-center">
          Quality Checklist is derived directly from the Evidence and Requirement Verification Engine. Attach authentic Autodesk Forma and Revit files in the Evidence Center to progress verification.
        </div>
      </div>
    </div>
  );
};
