/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProjectData, RequirementItem, VerificationStatus } from '../types';
import {
  Table,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  Ban,
} from 'lucide-react';

interface RequirementMatrixProps {
  projectData: ProjectData;
  onNavigateToEvidence: () => void;
  isDemoMode: boolean;
}

export const RequirementMatrix: React.FC<RequirementMatrixProps> = ({
  projectData,
  onNavigateToEvidence,
  isDemoMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const requirements = projectData.requirements || [];
  const evidenceList = projectData.evidenceList || [];

  const filteredRequirements = requirements.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.expectedEvidence ? r.expectedEvidence.toLowerCase().includes(searchTerm.toLowerCase()) : false);

    const matchesCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const verifiedCount = requirements.filter((r) => r.status === 'VERIFIED').length;
  const totalCount = requirements.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>SIH26114 Formal Compliance Engine</span>
            <span aria-hidden="true">·</span>
            <span>Requirement Traceability Matrix (RTM)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span>Requirement Traceability Matrix</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Central compliance verification grid mapping every official SIH26114 requirement directly to its expected Autodesk Forma/Revit evidence, attached artifacts, and reviewer verification state.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-right">
            <span className="text-slate-400 block text-[10px]">VERIFIED COMPLIANCE</span>
            <span className="font-bold text-emerald-400 text-sm">
              {verifiedCount} / {totalCount} ({Math.round((verifiedCount / (totalCount || 1)) * 100)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Search by Requirement ID, title, description, or expected evidence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none font-mono"
            >
              <option value="ALL">All Categories</option>
              <option value="SITE">Site</option>
              <option value="PROPOSALS">Proposals</option>
              <option value="ANALYSIS">Analysis</option>
              <option value="REVIT">Revit</option>
              <option value="FINAL_DELIVERABLES">Final Deliverables</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none font-mono"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="PENDING_REVIEW">PENDING_REVIEW</option>
              <option value="UPLOADED">UPLOADED</option>
              <option value="MISSING">MISSING</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>
      </div>

      {/* RTM Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Req ID</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-4 min-w-[220px]">Requirement Statement</th>
                <th className="py-3 px-4 min-w-[240px]">Expected Evidence</th>
                <th className="py-3 px-4 min-w-[200px]">Current Attached Evidence</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRequirements.map((req) => {
                const attachedEvidence = evidenceList.filter((e) =>
                  (req.linkedEvidenceIds || []).includes(e.id) || e.requirementId === req.id
                );
                const hasEvidence = attachedEvidence.length > 0;

                return (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* ID */}
                    <td className="py-3 px-3 font-bold text-cyan-400 whitespace-nowrap">
                      {req.id}
                      {req.mandatory && (
                        <span className="text-red-400 ml-1" title="Mandatory SIH Requirement">*</span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                        {req.category}
                      </span>
                    </td>

                    {/* Title & Description */}
                    <td className="py-3 px-4 font-sans">
                      <span className="font-bold text-white block text-xs">{req.title}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5 line-clamp-2">
                        {req.description}
                      </span>
                    </td>

                    {/* Expected Evidence */}
                    <td className="py-3 px-4 font-sans text-slate-300 text-xs">
                      {req.expectedEvidence || <span className="text-slate-500 italic">Expected evidence specification pending</span>}
                    </td>

                    {/* Current Attached Evidence */}
                    <td className="py-3 px-4">
                      {hasEvidence ? (
                        <div className="space-y-1">
                          {attachedEvidence.map((ev) => (
                            <div key={ev.id} className="flex items-center gap-1.5 text-[11px]">
                              <span className="text-emerald-400 font-semibold">{ev.id}</span>
                              <span className="text-slate-400 truncate max-w-[140px] font-sans">
                                {ev.fileName}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-red-400/80 italic text-[11px]">
                          No evidence attached
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                          req.status === 'VERIFIED'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50'
                            : req.status === 'PENDING_REVIEW'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-500/50'
                            : req.status === 'UPLOADED'
                            ? 'bg-blue-950/60 text-blue-400 border-blue-500/50'
                            : req.status === 'REJECTED'
                            ? 'bg-red-950/60 text-red-400 border-red-500/50'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        {req.status === 'VERIFIED' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{req.status}</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={onNavigateToEvidence}
                        className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-[10px] transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
