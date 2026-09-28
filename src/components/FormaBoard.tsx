/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FORMA_ANALYSES_METRICS,
  PROPOSAL_A_DATA,
  PROPOSAL_B_DATA,
  SITE_METADATA,
} from '../data/smartCityData';
import {
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Award,
  Download,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FormaBoardProps {
  onSelectProposal: (p: 'proposalA' | 'proposalB') => void;
  onNavigateToAnalysis: (analysisId: string) => void;
  onNavigateToRevit: () => void;
}

export const FormaBoard: React.FC<FormaBoardProps> = ({
  onSelectProposal,
  onNavigateToAnalysis,
  onNavigateToRevit,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const toggleRow = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleExportCSV = () => {
    const headers = ['Category', 'Metric', 'Proposal A (Conventional)', 'Proposal B (Sustainable)', 'Delta (%)', 'Forma Benchmark'];
    const rows = FORMA_ANALYSES_METRICS.map((m) => [
      `"${m.category}"`,
      `"${m.name}"`,
      `"${m.displayA}"`,
      `"${m.displayB}"`,
      `"${m.deltaPercent > 0 ? '+' : ''}${m.deltaPercent}%"`,
      `"${m.benchmarkStandard}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'SIH26114_Forma_Board_Comparison_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title & Board Metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Autodesk Forma Board</span>
            <span aria-hidden="true">·</span>
            <span>Comparative Design Intelligence</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">Site Area: 1,000,000 m² (1.00 km²)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Proposal Performance Matrix
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            Direct analytical comparison between Conventional Gridiron (Proposal A) and Climate-Adaptive Biophilic (Proposal B) across all 8 mandatory Autodesk Forma environmental simulation engines.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{downloadSuccess ? 'CSV Exported!' : 'Export Forma Board CSV'}</span>
          </button>
        </div>
      </div>

      {/* High-Level Comparison KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Embodied Carbon */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Embodied Carbon</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">314</span>
            <span className="text-xs text-slate-500 font-mono">kg CO₂e/m²</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-36.2% vs Proposal A (492)</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">238,320 tonnes CO₂e avoided</span>
        </div>

        {/* Green Area Ratio */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Open Green Realm</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">41.0%</span>
            <span className="text-xs text-slate-500 font-mono">410,000 m²</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-cyan-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2.28x higher than Prop A (18%)</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Continuous 225° SW breeze corridor</span>
        </div>

        {/* Microclimate Peak UTCI */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Peak Microclimate UTCI</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">29.6°C</span>
            <span className="text-xs text-slate-500 font-mono">Thermal Comfort</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-5.2°C cooler vs Prop A (34.8°C)</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Mitigates urban heat island</span>
        </div>

        {/* Solar Renewable Energy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Solar PV Generation</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">94,800</span>
            <span className="text-xs text-slate-500 font-mono">MWh / year</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+123.0% vs Prop A (42.5k)</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Offsets 78% of daytime load</span>
        </div>
      </div>

      {/* Main Forma Board Side-by-Side Comparison Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            Autodesk Forma Analysis Results Comparison
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            8 Mandatory Simulation Categories
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-3 px-4 w-1/4">Analysis Module</th>
                <th className="py-3 px-4 w-1/4">
                  <span className="block text-slate-300 font-semibold">Proposal A</span>
                  <span className="text-[10px] text-slate-500">Conventional Development</span>
                </th>
                <th className="py-3 px-4 w-1/4">
                  <span className="block text-cyan-300 font-semibold flex items-center gap-1">
                    Proposal B
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </span>
                  <span className="text-[10px] text-cyan-400/80">Sustainable Smart Development</span>
                </th>
                <th className="py-3 px-4 w-1/6 text-right">Forma Delta</th>
                <th className="py-3 px-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {FORMA_ANALYSES_METRICS.map((metric) => {
                const isExpanded = expandedRow === metric.id;
                return (
                  <React.Fragment key={metric.id}>
                    <tr
                      onClick={() => toggleRow(metric.id)}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-slate-800/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{metric.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{metric.category}</div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                        {metric.displayA}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-cyan-300 font-semibold">
                        {metric.displayB}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${
                            metric.isPositive ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          {metric.deltaPercent > 0 ? '+' : ''}
                          {metric.deltaPercent}%
                          {metric.isPositive ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-500">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </td>
                    </tr>

                    {/* Sub-breakdown rows on click */}
                    {isExpanded && (
                      <tr className="bg-slate-950/40">
                        <td colSpan={5} className="p-4 border-y border-slate-800/80">
                          <div className="space-y-3">
                            <div className="text-xs text-slate-400">
                              <span className="font-semibold text-slate-200">Forma Methodology: </span>
                              {metric.formaMethodology}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              <span className="text-slate-300">Benchmark Reference: </span>
                              {metric.benchmarkStandard}
                            </div>

                            {metric.subBreakdown && (
                              <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden mt-2">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="bg-slate-950 text-slate-400 font-mono text-[11px]">
                                      <th className="py-2 px-3 text-left">Sub-Component Parameter</th>
                                      <th className="py-2 px-3 text-left">Proposal A</th>
                                      <th className="py-2 px-3 text-left text-cyan-300">Proposal B</th>
                                      <th className="py-2 px-3 text-right">Unit</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800">
                                    {metric.subBreakdown.map((sub, i) => (
                                      <tr key={i} className="text-slate-300 font-mono text-[11px]">
                                        <td className="py-1.5 px-3 font-sans text-slate-300">{sub.label}</td>
                                        <td className="py-1.5 px-3">{sub.propA}</td>
                                        <td className="py-1.5 px-3 text-cyan-300 font-medium">{sub.propB}</td>
                                        <td className="py-1.5 px-3 text-right text-slate-500">{sub.unit}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            <div className="flex justify-end pt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigateToAnalysis(metric.id);
                                }}
                                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                              >
                                View Detailed {metric.name} Simulation &rarr;
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Proposal Selection Rationale Section */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-cyan-400 font-mono uppercase tracking-wider font-semibold">
                Section 8 — Final Proposal Selection
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Selected Winning Proposal: Proposal B — Sustainable Smart Urban Development
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Based on the comprehensive quantitative simulation results from all 8 Autodesk Forma analysis engines, <strong>Proposal B</strong> is selected for execution and detailed Revit BIM development. Proposal B delivers a superior 15-minute city layout, achieving higher commercial density (+5.4% GFA) while simultaneously saving <strong>238,320 tonnes of upfront embodied CO₂e</strong>, increasing open green space to <strong>41.0%</strong>, and reducing peak microclimate heat stress by <strong>5.2°C</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <span className="font-semibold text-slate-200 block mb-1">Key Performance Superiority:</span>
                <ul className="space-y-1 text-slate-400 list-disc list-inside">
                  <li>36.2% lower embodied carbon through mass timber hybrid structure</li>
                  <li>87% of public realm suitable for sitting & dining wind comfort</li>
                  <li>91.6% increase in ground-level direct solar access (4.6 hrs/day)</li>
                  <li>60.8% reduction in high acoustic traffic noise (&gt; 65 dBA)</li>
                </ul>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <span className="font-semibold text-slate-200 block mb-1">Revit Development Selection:</span>
                <p className="text-slate-400">
                  <strong>Lumina Central EcoTower (Block C-04)</strong> selected for LOD 350 BIM modeling in Autodesk Revit, featuring parametric 32° solar louvers, CLT composite floorplates, and biophilic sky gardens.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 md:w-60">
            <button
              onClick={() => onSelectProposal('proposalB')}
              className="w-full py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-md text-center"
            >
              Activate Proposal B in 3D
            </button>
            <button
              onClick={onNavigateToRevit}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700 text-center"
            >
              Inspect Revit BIM Model &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
