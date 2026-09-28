/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProjectData } from '../types';
import { exportProjectToJson, parseProjectJson } from '../services/storage';
import {
  Download,
  Upload,
  FileCode,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface DataImportExportProps {
  projectData: ProjectData;
  onImportProject: (imported: ProjectData) => void;
  onResetProject: () => void;
  isDemoMode: boolean;
}

export const DataImportExport: React.FC<DataImportExportProps> = ({
  projectData,
  onImportProject,
  onResetProject,
  isDemoMode,
}) => {
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = parseProjectJson(content);
        onImportProject(parsed);
        setImportStatus({ success: true, message: `Successfully imported "${parsed.site.projectName}"!` });
      } catch (err: any) {
        setImportStatus({ success: false, message: `Import failed: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  const handlePasteImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    try {
      const parsed = parseProjectJson(importText);
      onImportProject(parsed);
      setImportStatus({ success: true, message: `Successfully imported "${parsed.site.projectName}"!` });
      setImportText('');
    } catch (err: any) {
      setImportStatus({ success: false, message: `JSON syntax error: ${err.message}` });
    }
  };

  const handleExportCSVMetrics = () => {
    const headers = [
      'Category',
      'Metric Name',
      'Proposal A Value',
      'Proposal B Value',
      'Unit',
      'Source Tool',
      'Source Provenance',
      'Verification Status',
      'Last Updated',
      'Linked Evidence IDs',
      'Notes',
    ];

    const rows = projectData.analyses.map((a) => [
      `"${a.category}"`,
      `"${a.metricName}"`,
      `"${a.displayA}"`,
      `"${a.displayB}"`,
      `"${a.unit}"`,
      `"${a.source}"`,
      `"${a.sourceType}"`,
      `"${a.status}"`,
      `"${a.lastUpdated}"`,
      `"${a.evidenceIds.join('; ')}"`,
      `"${a.notes}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SIH26114_Forma_Metrics_${new Date().toISOString().split('T')[0]}.csv`);
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
            <span>Data Interoperability & Persistence</span>
            <span aria-hidden="true">·</span>
            <span>JSON & CSV Protocols</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCode className="w-6 h-6 text-cyan-400" />
            <span>Project Data Import & Export</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Backup your team's verified evidence, export analysis metrics to spreadsheets, or restore an entire SIH26114 project workspace from a structured JSON schema.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => exportProjectToJson(projectData)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full Project (JSON)</span>
          </button>
          <button
            onClick={handleExportCSVMetrics}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Metrics (CSV)</span>
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {importStatus && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
            importStatus.success
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/40 border-red-500/50 text-red-300'
          }`}
        >
          {importStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{importStatus.message}</span>
        </div>
      )}

      {/* 2-Column Import Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: File Upload */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Upload Project Backup (.JSON)</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select a previously exported SIH26114 project JSON file to restore all proposals, evidence links, and audit history.
          </p>

          <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/40">
            <Upload className="w-8 h-8 text-cyan-400 mb-2" />
            <span className="text-xs font-semibold text-slate-200">Click to choose .JSON file</span>
            <span className="text-[10px] text-slate-500 font-mono mt-1">SIH26114 standard project schema</span>
            <input type="file" accept=".json" onChange={handleJsonUpload} className="hidden" />
          </label>
        </div>

        {/* Right: Paste Raw JSON */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>Paste Raw Project JSON</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Directly paste raw JSON text into the area below to parse and load into the application state.
          </p>

          <form onSubmit={handlePasteImport} className="space-y-3">
            <textarea
              rows={5}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste JSON project data here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!importText.trim()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-400 font-bold text-xs rounded-lg transition-colors"
              >
                Parse & Import
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Danger Zone / Reset */}
      <div className="bg-slate-900/40 border border-red-500/20 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-red-400 uppercase font-mono tracking-wider">
            Workspace Reset
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Reset current Actual Project workspace back to initial unverified state (clears local cache).
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset your project data back to the clean starting state?')) {
              onResetProject();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-semibold text-xs rounded-lg transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Actual Workspace</span>
        </button>
      </div>
    </div>
  );
};
