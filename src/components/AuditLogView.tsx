/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuditLogEntry, ProjectData } from '../types';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Download,
} from 'lucide-react';

interface AuditLogViewProps {
  projectData: ProjectData;
  isDemoMode: boolean;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ projectData, isDemoMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const logs = projectData.auditLogs || [];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const handleExportAuditCSV = () => {
    const headers = ['Timestamp', 'Action', 'Entity', 'Previous Value', 'New Value', 'User', 'Notes'];
    const rows = logs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.action}"`,
      `"${l.entity}"`,
      `"${l.previousValue || ''}"`,
      `"${l.newValue || ''}"`,
      `"${l.user}"`,
      `"${l.notes || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SIH26114_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Traceability & Software Audit</span>
            <span aria-hidden="true">·</span>
            <span>Total Recorded Events: {logs.length}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Project Audit Trail Log</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Chronological audit log tracking every metric modification, evidence attachment, verification status change, and project configuration adjustment.
          </p>
        </div>

        <button
          onClick={handleExportAuditCSV}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Audit Log CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Search audit trail by entity, user, notes, or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Filter Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none font-mono"
          >
            <option value="ALL">All Actions</option>
            <option value="DATA_ADDED">DATA_ADDED</option>
            <option value="DATA_MODIFIED">DATA_MODIFIED</option>
            <option value="EVIDENCE_UPLOADED">EVIDENCE_UPLOADED</option>
            <option value="STATUS_CHANGED">STATUS_CHANGED</option>
            <option value="MODE_SWITCHED">MODE_SWITCHED</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 text-left font-sans font-semibold">Timestamp</th>
                <th className="py-3 px-4 text-left">Action</th>
                <th className="py-3 px-4 text-left font-sans">Entity / Target</th>
                <th className="py-3 px-4 text-left font-sans">Audit Transition Details</th>
                <th className="py-3 px-4 text-left">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-sans text-xs">
                    No audit records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action === 'EVIDENCE_UPLOADED'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                            : log.action === 'STATUS_CHANGED'
                            ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-sans font-semibold text-white">{log.entity}</td>
                    <td className="py-2.5 px-4 font-sans text-slate-300">
                      {log.previousValue && log.newValue ? (
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="text-slate-500">{log.previousValue}</span>
                          <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="text-emerald-400 font-semibold">{log.newValue}</span>
                        </div>
                      ) : (
                        <span>{log.newValue || log.notes || '—'}</span>
                      )}
                      {log.notes && log.previousValue && (
                        <span className="text-[10px] text-slate-500 block mt-0.5">{log.notes}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">{log.user}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
