/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnalysisMetricId, AnalysisResult, ProjectData, SourceType, VerificationStatus } from '../types';
import {
  Layers,
  Leaf,
  Sun,
  Eye,
  Wind,
  ThermometerSun,
  Volume2,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit2,
  ExternalLink,
  Upload,
  Sparkles,
} from 'lucide-react';

interface AnalysisPanelProps {
  projectData: ProjectData;
  activeAnalysisId: AnalysisMetricId;
  onSelectAnalysis: (id: AnalysisMetricId) => void;
  onUpdateAnalysis: (analysis: AnalysisResult) => void;
  onApplyToViewport: (id: AnalysisMetricId) => void;
  onNavigateToEvidence: () => void;
  isDemoMode: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  projectData,
  activeAnalysisId,
  onSelectAnalysis,
  onUpdateAnalysis,
  onApplyToViewport,
  onNavigateToEvidence,
  isDemoMode,
}) => {
  const currentMetric =
    projectData.analyses.find((m) => m.id === activeAnalysisId) || projectData.analyses[0];

  const [isEditing, setIsEditing] = useState(false);
  const [valA, setValA] = useState(currentMetric?.displayA || '');
  const [valB, setValB] = useState(currentMetric?.displayB || '');
  const [sourceText, setSourceText] = useState(currentMetric?.source || 'Autodesk Forma 2026.1');
  const [sourceType, setSourceType] = useState<SourceType>(currentMetric?.sourceType || 'TEAM_INPUT');
  const [status, setStatus] = useState<VerificationStatus>(currentMetric?.status || 'MISSING');
  const [notes, setNotes] = useState(currentMetric?.notes || '');
  const [deltaText, setDeltaText] = useState(currentMetric?.deltaSummary || '');

  // Keep state synced on selection change
  React.useEffect(() => {
    if (currentMetric) {
      setValA(currentMetric.displayA || '');
      setValB(currentMetric.displayB || '');
      setSourceText(currentMetric.source || '');
      setSourceType(currentMetric.sourceType);
      setStatus(currentMetric.status);
      setNotes(currentMetric.notes || '');
      setDeltaText(currentMetric.deltaSummary || '');
      setIsEditing(false);
    }
  }, [activeAnalysisId, currentMetric]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMetric) return;

    const updated: AnalysisResult = {
      ...currentMetric,
      displayA: valA.trim() || 'Pending Forma Analysis',
      displayB: valB.trim() || 'Pending Forma Analysis',
      source: sourceText.trim() || 'Autodesk Forma Simulation Result',
      sourceType,
      status,
      notes: notes.trim(),
      deltaSummary: deltaText.trim(),
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    onUpdateAnalysis(updated);
    setIsEditing(false);
  };

  const getIcon = (id: AnalysisMetricId) => {
    switch (id) {
      case 'area_metrics':
        return <Layers className="w-4 h-4" />;
      case 'embodied_carbon':
        return <Leaf className="w-4 h-4 text-emerald-400" />;
      case 'sun_hours':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'daylight_potential':
        return <Eye className="w-4 h-4 text-cyan-400" />;
      case 'wind_analysis':
        return <Wind className="w-4 h-4 text-teal-400" />;
      case 'microclimate':
        return <ThermometerSun className="w-4 h-4 text-orange-400" />;
      case 'noise_analysis':
        return <Volume2 className="w-4 h-4 text-rose-400" />;
      case 'solar_energy':
        return <Zap className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Mandatory SIH26114 Analyses</span>
            <span aria-hidden="true">·</span>
            <span>8 Autodesk Forma Simulation Modules</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Forma Environmental & Spatial Analyses
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Input, document, and review the actual simulation outcomes obtained from your team's Autodesk Forma project. Every metric requires linked evidence (screenshots/logs) to achieve verification.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isEditing ? 'Cancel Edit' : 'Enter Actual Results'}</span>
          </button>
          <button
            onClick={() => onApplyToViewport(activeAnalysisId)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Overlay on 3D Viewport</span>
          </button>
        </div>
      </div>

      {/* Demo Warning Banner */}
      {isDemoMode && (
        <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>DEMO DATA:</strong> These values are illustrative placeholders. Switch to <strong>ACTUAL PROJECT</strong> mode to input results from your real Autodesk Forma project runs.
          </span>
        </div>
      )}

      {/* 8 Analysis Tabs Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {projectData.analyses.map((m) => {
          const isActive = m.id === activeAnalysisId;
          const isVerified = m.status === 'VERIFIED';
          return (
            <button
              key={m.id}
              onClick={() => onSelectAnalysis(m.id)}
              className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900 border-cyan-500 text-white shadow-lg ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {getIcon(m.id)}
                <span
                  className={`text-[9px] font-mono px-1 rounded ${
                    isVerified
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {isVerified ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>
              <span className="text-xs font-semibold leading-tight line-clamp-2">
                {m.metricName.split(' ')[0]} {m.metricName.split(' ')[1] || ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Analysis Inspection View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metric Details & Data Provenance */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card: Metric Overview */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-cyan-400 font-mono uppercase tracking-wider">
                  {currentMetric.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{currentMetric.metricName}</h2>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-slate-500 block">Unit of Measurement</span>
                <span className="text-sm font-semibold text-slate-200">{currentMetric.unit}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{currentMetric.description}</p>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 space-y-2 text-xs">
              <span className="font-semibold text-slate-200 block font-mono">
                Autodesk Forma Simulation Engine:
              </span>
              <p className="text-slate-400 leading-relaxed">{currentMetric.formaEngine}</p>
            </div>
          </div>

          {/* Edit Form if active */}
          {isEditing && (
            <form onSubmit={handleSave} className="bg-slate-900 border border-cyan-500/40 rounded-xl p-6 shadow-2xl space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-cyan-400" />
                <span>Enter / Import Actual Forma Results for {currentMetric.metricName}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Proposal A Actual Value *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 492 kg CO₂e/m² or 2.4 hrs"
                    value={valA}
                    onChange={(e) => setValA(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Proposal B Actual Value *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 314 kg CO₂e/m² or 4.6 hrs"
                    value={valB}
                    onChange={(e) => setValB(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Source / Tool Provenance</label>
                  <input
                    type="text"
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="e.g. Autodesk Forma 2026.1 Wind Micro-Simulation"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Source Classification</label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none"
                  >
                    <option value="FORMA">FORMA (Official Simulation Export)</option>
                    <option value="REVIT">REVIT (BIM Schedule Extraction)</option>
                    <option value="TEAM_INPUT">TEAM_INPUT (Team Measured Entry)</option>
                    <option value="DESIGN_ASSUMPTION">DESIGN_ASSUMPTION (Early Boundary)</option>
                    <option value="DEMO">DEMO (Illustrative Placeholder)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Neutral Comparison Delta Statement</label>
                <input
                  type="text"
                  value={deltaText}
                  onChange={(e) => setDeltaText(e.target.value)}
                  placeholder="e.g. Proposal B records 36.2% lower carbon intensity compared to Proposal A."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Simulation Notes & Verification Status</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Simulation parameters, mesh density, date of run..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none"
                  />
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs"
                  >
                    <option value="MISSING">MISSING (Pending Run)</option>
                    <option value="UPLOADED">UPLOADED (Artifact Uploaded)</option>
                    <option value="PENDING_REVIEW">PENDING_REVIEW (Awaiting Audit Sign-off)</option>
                    <option value="VERIFIED">VERIFIED (Evidence Confirmed)</option>
                    <option value="REJECTED">REJECTED (Needs Re-run)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg shadow-md"
                >
                  Save & Log to Project
                </button>
              </div>
            </form>
          )}

          {/* Linked Evidence Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Linked Verification Evidence ({currentMetric.evidenceIds.length})
              </h3>
              <button
                onClick={onNavigateToEvidence}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
              >
                <span>Manage in Evidence Center</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {currentMetric.evidenceIds.length === 0 ? (
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg text-center space-y-2">
                <AlertCircle className="w-5 h-5 text-amber-400 mx-auto" />
                <p className="text-xs text-slate-400">
                  No verified Forma evidence screenshot or simulation report is linked to this analysis yet.
                </p>
                <button
                  onClick={onNavigateToEvidence}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-md"
                >
                  Attach Evidence Screenshot
                </button>
              </div>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                {currentMetric.evidenceIds.map((id) => (
                  <div
                    key={id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-cyan-400 font-bold">{id}</span>
                      <span className="text-slate-400 text-[11px] font-sans">
                        (Autodesk Forma simulation export)
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-2 py-0.5 rounded">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Comparative Benchmark Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Simulation Values & Comparison</h3>

            {/* Proposal A */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-1">
              <span className="text-xs text-slate-400 font-medium block">Proposal A (Conventional)</span>
              <div className="text-lg font-bold font-mono text-slate-200">
                {currentMetric.displayA}
              </div>
            </div>

            {/* Proposal B */}
            <div className="bg-slate-950/80 border border-cyan-500/30 rounded-lg p-3.5 space-y-1">
              <span className="text-xs text-cyan-400 font-medium block">Proposal B (Sustainable)</span>
              <div className="text-lg font-bold font-mono text-cyan-300">
                {currentMetric.displayB}
              </div>
            </div>

            {/* Neutral Comparison Delta */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
              <span className="text-[11px] text-slate-400 font-mono uppercase font-semibold">
                Comparative Finding:
              </span>
              <p className="text-slate-300 font-sans leading-relaxed">
                {currentMetric.deltaSummary ||
                  'Awaiting both proposal simulation results to record comparison delta.'}
              </p>
            </div>

            {/* Data Provenance Metadata */}
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-[11px] font-mono space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Data Source:</span>
                <span className="text-slate-200 truncate max-w-[140px]">{currentMetric.source}</span>
              </div>
              <div className="flex justify-between">
                <span>Provenance:</span>
                <span className="text-cyan-400">{currentMetric.sourceType}</span>
              </div>
              <div className="flex justify-between">
                <span>Verification:</span>
                <span className={currentMetric.status === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}>
                  {currentMetric.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="text-slate-300">{currentMetric.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
