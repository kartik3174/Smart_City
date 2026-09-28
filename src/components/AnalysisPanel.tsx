/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnalysisMetricId } from '../types';
import { FORMA_ANALYSES_METRICS, SITE_METADATA } from '../data/smartCityData';
import {
  Layers,
  Leaf,
  Sun,
  Eye,
  Wind,
  ThermometerSun,
  Volume2,
  Zap,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface AnalysisPanelProps {
  activeAnalysis: AnalysisMetricId;
  onSelectAnalysis: (id: AnalysisMetricId) => void;
  onApplyToViewport: (id: AnalysisMetricId) => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  activeAnalysis,
  onSelectAnalysis,
  onApplyToViewport,
}) => {
  const currentMetric = FORMA_ANALYSES_METRICS.find((m) => m.id === activeAnalysis) || FORMA_ANALYSES_METRICS[0];

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
            <span>Autodesk Forma Simulation Engines</span>
            <span aria-hidden="true">·</span>
            <span>Comprehensive Environmental Analytics</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            8 Mandatory Forma Analyses
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Inspect authentic simulation methodology, physics algorithms, and quantitative comparison benchmarks across all 8 modules.
          </p>
        </div>

        <button
          onClick={() => onApplyToViewport(activeAnalysis)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Project {currentMetric.name} on 3D Viewport</span>
        </button>
      </div>

      {/* 8 Analysis Segmented Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {FORMA_ANALYSES_METRICS.map((m) => {
          const isActive = m.id === activeAnalysis;
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
                <span className="text-[10px] font-mono font-semibold text-emerald-400">
                  {m.deltaPercent > 0 ? '+' : ''}{m.deltaPercent}%
                </span>
              </div>
              <span className="text-xs font-semibold leading-tight line-clamp-2">
                {m.name.split(' ')[0]} {m.name.split(' ')[1] || ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Analysis Inspection View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Simulation Details & Methodology */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Metric Overview & Forma Methodology */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs text-cyan-400 font-mono uppercase tracking-wider">
                  {currentMetric.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{currentMetric.name}</h2>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-slate-500 block">Unit of Measurement</span>
                <span className="text-sm font-semibold text-slate-200">{currentMetric.unit}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {currentMetric.description}
            </p>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 space-y-2">
              <span className="text-xs font-semibold text-slate-200 block font-mono">
                Forma Physics & Simulation Engine:
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentMetric.formaMethodology}
              </p>
              <div className="text-[11px] text-cyan-400/90 pt-1 font-mono">
                Regulatory Benchmark: {currentMetric.benchmarkStandard}
              </div>
            </div>
          </div>

          {/* Sub-Components Breakdown Table */}
          {currentMetric.subBreakdown && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-3">
                Granular Breakdown & Performance Deltas
              </h3>
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                      <th className="py-2.5 px-4 text-left">Sub-Component Parameter</th>
                      <th className="py-2.5 px-4 text-left">Proposal A (Conventional)</th>
                      <th className="py-2.5 px-4 text-left text-cyan-300">Proposal B (Sustainable)</th>
                      <th className="py-2.5 px-4 text-right">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {currentMetric.subBreakdown.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-4 text-slate-200 font-medium">{item.label}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-300">{item.propA}</td>
                        <td className="py-2.5 px-4 font-mono text-cyan-300 font-semibold">{item.propB}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-500">{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Comparison Card & 3D Visualizer Link */}
        <div className="space-y-6">
          {/* Comparison Scorecard */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Comparative Benchmark</h3>

            {/* Proposal A */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-slate-400 font-medium">Proposal A</span>
                <span className="text-xs text-slate-500 font-mono">Conventional</span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-200 tabular-nums">
                {currentMetric.displayA}
              </div>
            </div>

            {/* Proposal B */}
            <div className="bg-cyan-950/30 border border-cyan-500/40 rounded-lg p-3.5">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-cyan-300 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Proposal B
                </span>
                <span className="text-xs text-cyan-400 font-mono">Sustainable</span>
              </div>
              <div className="text-lg font-bold font-mono text-cyan-300 tabular-nums">
                {currentMetric.displayB}
              </div>
            </div>

            {/* Overall Delta Badge */}
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center justify-between">
              <span className="font-medium">Forma Optimization Leap:</span>
              <span className="font-bold font-mono text-sm tabular-nums flex items-center gap-1">
                {currentMetric.deltaPercent > 0 ? '+' : ''}{currentMetric.deltaPercent}%
                {currentMetric.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </span>
            </div>

            {/* Button to view in 3D */}
            <button
              onClick={() => onApplyToViewport(activeAnalysis)}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-lg transition-colors border border-cyan-500/30 text-center flex items-center justify-center gap-1.5"
            >
              <span>View Heatmap on 3D Masterplan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Environmental Context Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl text-xs space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 font-mono uppercase">
              Bengaluru Site Climate Context
            </span>
            <div className="space-y-1 text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Coordinates:</span>
                <span className="text-slate-200 font-mono">{SITE_METADATA.coordinates}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Elevation:</span>
                <span className="text-slate-200 font-mono">{SITE_METADATA.elevationMeters}m AMSL</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span>Prevailing Wind:</span>
                <span className="text-slate-200 font-mono">{SITE_METADATA.prevailingWindDirection}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Annual Solar:</span>
                <span className="text-slate-200 font-mono">{SITE_METADATA.solarIrradianceAnnual}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
