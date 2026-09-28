/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DeliverableItem, ProjectData, VerificationStatus } from '../types';
import {
  PackageCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Edit2,
  FileText,
  User,
  ExternalLink,
} from 'lucide-react';

interface DeliverablesManagerProps {
  projectData: ProjectData;
  onUpdateDeliverable: (id: string, updated: Partial<DeliverableItem>) => void;
  onNavigateToEvidence: () => void;
  isDemoMode: boolean;
}

export const DeliverablesManager: React.FC<DeliverablesManagerProps> = ({
  projectData,
  onUpdateDeliverable,
  onNavigateToEvidence,
  isDemoMode,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<VerificationStatus>('NOT_STARTED');
  const [owner, setOwner] = useState('');
  const [notes, setNotes] = useState('');

  const deliverables = projectData.deliverables || [];

  const handleEdit = (del: DeliverableItem) => {
    setEditingId(del.id);
    setStatus(del.status);
    setOwner(del.owner);
    setNotes(del.notes);
  };

  const handleSave = (id: string) => {
    onUpdateDeliverable(id, {
      status,
      owner,
      notes,
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
    });
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Competition Deliverable Tracking</span>
            <span aria-hidden="true">·</span>
            <span>9 Mandatory Work Products</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-cyan-400" />
            <span>Deliverables Manager</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Track completion, file format compliance, ownership, and evidence attachments for all 9 official competition deliverables.
          </p>
        </div>

        <button
          onClick={onNavigateToEvidence}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>Attach Deliverable Files</span>
        </button>
      </div>

      {/* Deliverables List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliverables.map((del, idx) => {
          const isEditing = editingId === del.id;
          const isVerified = del.status === 'VERIFIED';
          const hasEvidence = del.evidenceIds.length > 0;

          return (
            <div
              key={del.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xl space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    DELIVERABLE 0{idx + 1}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isVerified
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
                        : hasEvidence
                        ? 'bg-amber-950/40 text-amber-400 border-amber-500/40'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    {del.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{del.title}</h3>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Format: <span className="text-slate-200">{del.requiredFormat}</span>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-0.5 text-[11px]">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 font-mono"
                    >
                      <option value="NOT_STARTED">NOT_STARTED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="EVIDENCE_UPLOADED">EVIDENCE_UPLOADED</option>
                      <option value="VERIFIED">VERIFIED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5 text-[11px]">Owner / Lead</label>
                    <input
                      type="text"
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5 text-[11px]">Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200"
                    />
                  </div>
                  <div className="flex justify-end gap-1 pt-1">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(del.id)}
                      className="px-2 py-1 bg-cyan-500 text-slate-950 font-bold text-[10px] rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span className="flex items-center gap-1 font-sans">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>Owner:</span>
                    </span>
                    <span className="text-slate-200">{del.owner || 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Evidence Files:</span>
                    <span className="text-cyan-400">
                      {del.evidenceIds.length > 0 ? del.evidenceIds.join(', ') : 'None'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans line-clamp-1">
                    Notes: {del.notes || 'No comments.'}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-600">Updated: {del.lastUpdated}</span>
                    <button
                      onClick={() => handleEdit(del)}
                      className="text-cyan-400 hover:text-cyan-300 font-sans text-xs inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
