/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProjectData, ProposalId } from '../types';
import {
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FormaBoardProps {
  projectData: ProjectData;
  onSelectFinalProposal: (id: ProposalId, rationale: string) => void;
  onNavigateToAnalysis: (id: string) => void;
  onNavigateToEvidence: () => void;
  isDemoMode: boolean;
}

export const FormaBoard: React.FC<FormaBoardProps> = ({
  projectData,
  onSelectFinalProposal,
  onNavigateToAnalysis,
  onNavigateToEvidence,
  isDemoMode,
}) => {
  const [rationale, setRationale] = useState(
    projectData.selectionRationale ||
      'Proposal B is selected based on documented Forma simulation results: lower upfront embodied carbon intensity, increased biophilic open green spaces, improved pedestrian wind comfort, and thermal microclimate resilience.'
  );
  const [selectedProposal, setSelectedProposal] = useState<ProposalId>(
    projectData.selectedFinalProposal || 'proposalB'
  );
  const [isSaved, setIsSaved] = useState(false);

  const propA = projectData.proposals.proposalA;
  const propB = projectData.proposals.proposalB;

  const handleSaveDecision = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectFinalProposal(selectedProposal, rationale);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportCSV = () => {
    const headers = [
      'Category',
      'Metric',
      'Proposal A Value',
      'Proposal B Value',
      'Source',
      'Source Type',
      'Status',
      'Neutral Comparison Observation',
    ];

    const rows = projectData.analyses.map((a) => [
      `"${a.category}"`,
      `"${a.metricName}"`,
      `"${a.displayA}"`,
      `"${a.displayB}"`,
      `"${a.source}"`,
      `"${a.sourceType}"`,
      `"${a.status}"`,
      `"${a.deltaSummary || 'Pending comparison'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SIH26114_Forma_Board_Comparison_${new Date().toISOString().split('T')[0]}.csv`);
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
            <span>Autodesk Forma Board</span>
            <span aria-hidden="true">·</span>
            <span>Evidence-Based Design Comparison</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Proposal Performance Comparison
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Neutral scientific benchmarking between Proposal A and Proposal B. Displays actual simulation values where verified evidence exists; displays 'Pending Forma Analysis' for incomplete modules. No fabricated scores.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors shadow-sm shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Comparison CSV</span>
        </button>
      </div>

      {/* Demo Warning Banner */}
      {isDemoMode && (
        <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>DEMO MODE — Values shown here are illustrative and are NOT official Autodesk Forma results.</strong> Switch to Actual Project mode to input your real Forma Board metrics.
          </span>
        </div>
      )}

      {/* Spatial Masterplan Metrics Comparison Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Spatial & Land Use Utilization
          </h2>
          <span className="text-xs text-slate-400 font-mono">Site Area: {projectData.site.siteAreaM2.toLocaleString()} m²</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 text-left font-sans font-semibold">Masterplan Dimension</th>
                <th className="py-3 px-4 text-left">Proposal A (Conventional)</th>
                <th className="py-3 px-4 text-left text-cyan-300">Proposal B (Sustainable)</th>
                <th className="py-3 px-4 text-left font-sans">Neutral Comparison Statement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-sans font-semibold text-slate-200">Building Count</td>
                <td className="py-2.5 px-4">{propA.buildings.length} building blocks</td>
                <td className="py-2.5 px-4 text-cyan-300 font-bold">{propB.buildings.length} building blocks</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">
                  {propB.buildings.length !== propA.buildings.length
                    ? `Proposal B configures ${propB.buildings.length} building blocks compared to ${propA.buildings.length} in Proposal A.`
                    : 'Both proposals share equal building block counts.'}
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-sans font-semibold text-slate-200">Gross Floor Area (GFA)</td>
                <td className="py-2.5 px-4">{propA.declaredGfaM2.toLocaleString()} m²</td>
                <td className="py-2.5 px-4 text-cyan-300 font-bold">{propB.declaredGfaM2.toLocaleString()} m²</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">
                  {propB.declaredGfaM2 > propA.declaredGfaM2
                    ? `Proposal B records a higher floor area yield (+${(propB.declaredGfaM2 - propA.declaredGfaM2).toLocaleString()} m²).`
                    : 'GFA values are recorded above.'}
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-sans font-semibold text-slate-200">Building Footprint & Coverage</td>
                <td className="py-2.5 px-4">
                  {propA.declaredFootprintM2.toLocaleString()} m² ({propA.declaredSiteCoveragePercent}%)
                </td>
                <td className="py-2.5 px-4 text-cyan-300 font-bold">
                  {propB.declaredFootprintM2.toLocaleString()} m² ({propB.declaredSiteCoveragePercent}%)
                </td>
                <td className="py-2.5 px-4 font-sans text-slate-400">
                  {propB.declaredSiteCoveragePercent < propA.declaredSiteCoveragePercent
                    ? `Proposal B records a lower ground site coverage (${propB.declaredSiteCoveragePercent}% vs ${propA.declaredSiteCoveragePercent}%).`
                    : 'Footprint coverage values recorded.'}
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-sans font-semibold text-slate-200">Landscaped Green Area</td>
                <td className="py-2.5 px-4">
                  {propA.declaredGreenAreaM2.toLocaleString()} m² ({propA.declaredGreenPercent}%)
                </td>
                <td className="py-2.5 px-4 text-cyan-300 font-bold">
                  {propB.declaredGreenAreaM2.toLocaleString()} m² ({propB.declaredGreenPercent}%)
                </td>
                <td className="py-2.5 px-4 font-sans text-slate-400">
                  {propB.declaredGreenPercent > propA.declaredGreenPercent
                    ? `Proposal B allocates ${propB.declaredGreenPercent}% green area compared to ${propA.declaredGreenPercent}% in Proposal A.`
                    : 'Green area allocations recorded.'}
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-sans font-semibold text-slate-200">Transportation & Road Area</td>
                <td className="py-2.5 px-4">
                  {propA.declaredRoadAreaM2.toLocaleString()} m² ({propA.declaredRoadPercent}%)
                </td>
                <td className="py-2.5 px-4 text-cyan-300 font-bold">
                  {propB.declaredRoadAreaM2.toLocaleString()} m² ({propB.declaredRoadPercent}%)
                </td>
                <td className="py-2.5 px-4 font-sans text-slate-400">
                  {propB.declaredRoadPercent < propA.declaredRoadPercent
                    ? `Proposal B records a lower impermeable vehicular road footprint (${propB.declaredRoadPercent}% vs ${propA.declaredRoadPercent}%).`
                    : 'Road area allocations recorded.'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 8 Required Forma Environmental Analyses Comparison Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            8 Mandatory Autodesk Forma Simulation Results
          </h2>
          <span className="text-xs text-cyan-400 font-mono">Official Problem Statement Results</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 text-left font-sans font-semibold">Forma Simulation Module</th>
                <th className="py-3 px-4 text-left">Proposal A Value</th>
                <th className="py-3 px-4 text-left text-cyan-300">Proposal B Value</th>
                <th className="py-3 px-4 text-left">Evidence & Provenance</th>
                <th className="py-3 px-4 text-left font-sans">Neutral Comparison Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {projectData.analyses.map((a) => {
                const hasEvidence = a.evidenceIds.length > 0;
                return (
                  <tr key={a.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                      <div>{a.metricName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{a.category}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {a.displayA === 'Pending Forma Analysis' ? (
                        <span className="text-slate-500 italic">Pending Forma Analysis</span>
                      ) : (
                        a.displayA
                      )}
                    </td>
                    <td className="py-3 px-4 text-cyan-300 font-semibold">
                      {a.displayB === 'Pending Forma Analysis' ? (
                        <span className="text-slate-500 italic">Pending Forma Analysis</span>
                      ) : (
                        a.displayB
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded border ${
                            a.sourceType === 'DEMO'
                              ? 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                              : hasEvidence
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}
                        >
                          {a.sourceType}
                        </span>
                        {hasEvidence ? (
                          <span className="text-[10px] text-emerald-400 font-mono">Evidence linked</span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">No evidence</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-400">
                      {a.deltaSummary || (
                        <span className="text-slate-500 italic">Awaiting simulation data upload</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 8: Final Proposal Selection Rationale Documentation */}
      <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-6 shadow-xl space-y-4">
        <div>
          <span className="text-xs text-cyan-400 font-mono uppercase tracking-wider font-semibold block mb-1">
            Section 8 Problem Statement Requirement
          </span>
          <h2 className="text-lg font-bold text-white">
            Final Proposal Selection & Justification Documentation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Document why the final proposal was selected, important design characteristics, Forma analysis results, and main differences from the alternative proposal based on actual project evidence.
          </p>
        </div>

        <form onSubmit={handleSaveDecision} className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-slate-300 font-medium">Selected Final Proposal:</span>
            <div className="flex items-center gap-3 font-mono">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="selectedProposal"
                  checked={selectedProposal === 'proposalA'}
                  onChange={() => setSelectedProposal('proposalA')}
                  className="accent-cyan-500"
                />
                <span>Proposal A (Conventional Urban Development)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-cyan-300 font-semibold">
                <input
                  type="radio"
                  name="selectedProposal"
                  checked={selectedProposal === 'proposalB'}
                  onChange={() => setSelectedProposal('proposalB')}
                  className="accent-cyan-500"
                />
                <span>Proposal B (Sustainable Smart Urban Development)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              Selection Rationale & Evidence-Based Technical Justification *
            </label>
            <textarea
              rows={4}
              required
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
              placeholder="State the technical reasons for proposal selection based on actual Autodesk Forma analysis results..."
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500 font-mono">
              {isSaved ? 'Selection rationale updated in project.' : 'Selection ready for review.'}
            </span>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg transition-colors shadow-sm"
            >
              Save Selection Decision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
