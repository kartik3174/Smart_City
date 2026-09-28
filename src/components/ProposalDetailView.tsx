/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BuildingData, ProposalData } from '../types';
import { auditProposalConsistency } from '../utils/validation';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Plus,
  Trash2,
  Layers,
  Trees,
  Car,
  Maximize2,
  ArrowRight,
} from 'lucide-react';

interface ProposalDetailViewProps {
  proposal: ProposalData;
  siteAreaM2: number;
  onUpdateProposal: (updated: Partial<ProposalData>) => void;
  onSelectBuildingFor3D?: (b: BuildingData) => void;
  isDemoMode: boolean;
}

export const ProposalDetailView: React.FC<ProposalDetailViewProps> = ({
  proposal,
  siteAreaM2,
  onUpdateProposal,
  onSelectBuildingFor3D,
  isDemoMode,
}) => {
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [declaredGfa, setDeclaredGfa] = useState(proposal.declaredGfaM2);
  const [declaredFootprint, setDeclaredFootprint] = useState(proposal.declaredFootprintM2);
  const [declaredGreen, setDeclaredGreen] = useState(proposal.declaredGreenAreaM2);
  const [declaredRoads, setDeclaredRoads] = useState(proposal.declaredRoadAreaM2);
  const [declaredParking, setDeclaredParking] = useState(proposal.declaredParkingSpaces);

  const [isAddingBuilding, setIsAddingBuilding] = useState(false);
  const [bName, setBName] = useState('');
  const [bType, setBType] = useState<BuildingData['type']>('office');
  const [bHeight, setBHeight] = useState(60);
  const [bFloors, setBFloors] = useState(15);
  const [bWidth, setBWidth] = useState(45);
  const [bDepth, setBDepth] = useState(40);
  const [bCarbon, setBCarbon] = useState(320);

  // Perform mathematical consistency audit
  const audit = auditProposalConsistency(proposal, siteAreaM2);

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    const gfa = Number(declaredGfa);
    const footprint = Number(declaredFootprint);
    const far = siteAreaM2 > 0 ? Number((gfa / siteAreaM2).toFixed(2)) : 0;
    const coverage = siteAreaM2 > 0 ? Number(((footprint / siteAreaM2) * 100).toFixed(1)) : 0;
    const greenM2 = Number(declaredGreen);
    const greenPct = siteAreaM2 > 0 ? Number(((greenM2 / siteAreaM2) * 100).toFixed(1)) : 0;
    const roadM2 = Number(declaredRoads);
    const roadPct = siteAreaM2 > 0 ? Number(((roadM2 / siteAreaM2) * 100).toFixed(1)) : 0;

    onUpdateProposal({
      declaredGfaM2: gfa,
      declaredFootprintM2: footprint,
      declaredFar: far,
      declaredSiteCoveragePercent: coverage,
      declaredGreenAreaM2: greenM2,
      declaredGreenPercent: greenPct,
      declaredRoadAreaM2: roadM2,
      declaredRoadPercent: roadPct,
      declaredParkingSpaces: Number(declaredParking),
    });
    setIsEditingMetrics(false);
  };

  const handleAddBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName.trim()) return;

    const footprintM2 = bWidth * bDepth;
    const gfaM2 = footprintM2 * bFloors * 0.85; // Net usable GFA formula

    const newBuilding: BuildingData = {
      id: `${proposal.id.slice(0, 2).toUpperCase()}-BLD-${Date.now().toString().slice(-4)}`,
      name: bName.trim(),
      type: bType,
      heightM: Number(bHeight),
      floors: Number(bFloors),
      footprintM2,
      gfaM2: Math.round(gfaM2),
      widthM: Number(bWidth),
      depthM: Number(bDepth),
      x: 350 + Math.random() * 300,
      y: 350 + Math.random() * 300,
      embodiedCarbonKgM2: Number(bCarbon),
    };

    onUpdateProposal({
      buildings: [...proposal.buildings, newBuilding],
    });

    setIsAddingBuilding(false);
    setBName('');
  };

  const handleDeleteBuilding = (id: string) => {
    onUpdateProposal({
      buildings: proposal.buildings.filter((b) => b.id !== id),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Site Proposal Documentation</span>
            <span aria-hidden="true">·</span>
            <span>{proposal.id === 'proposalA' ? 'Conventional Design' : 'Sustainable Alternative'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{proposal.name}</h1>
          <p className="text-sm text-cyan-400 font-medium mt-0.5">{proposal.tagline}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsEditingMetrics(!isEditingMetrics)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isEditingMetrics ? 'Close Editor' : 'Edit Declared Metrics'}</span>
          </button>
          <button
            onClick={() => setIsAddingBuilding(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Building Block</span>
          </button>
        </div>
      </div>

      {/* Item 6 Requirement: DATA INCONSISTENCY DETECTED BANNER */}
      {!audit.isConsistent && (
        <div className="bg-red-950/30 border-2 border-red-500/60 rounded-xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span>DATA INCONSISTENCY DETECTED</span>
          </div>
          <p className="text-xs text-slate-300">
            A mathematical discrepancy was found between the proposal's declared masterplan metrics and the sum of its individual building geometries. The dashboard never silently fabricates numbers—review the exact audit delta below:
          </p>

          <div className="overflow-x-auto border border-red-500/30 rounded-lg">
            <table className="w-full text-xs font-mono">
              <thead className="bg-red-950/60 text-red-300 text-[11px] border-b border-red-500/30">
                <tr>
                  <th className="py-2 px-3 text-left">Metric Field</th>
                  <th className="py-2 px-3 text-right">Expected / Declared Value</th>
                  <th className="py-2 px-3 text-right">Calculated from Buildings</th>
                  <th className="py-2 px-3 text-right">Discrepancy (Delta)</th>
                  <th className="py-2 px-3 text-left">Audit Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-500/20 bg-slate-950/80">
                {audit.inconsistencies.map((inc, i) => (
                  <tr key={i} className="hover:bg-red-950/20">
                    <td className="py-2 px-3 text-white font-sans font-semibold">{inc.field}</td>
                    <td className="py-2 px-3 text-right text-slate-300">
                      {typeof inc.declaredValue === 'number'
                        ? inc.declaredValue.toLocaleString()
                        : inc.declaredValue}{' '}
                      {inc.unit}
                    </td>
                    <td className="py-2 px-3 text-right text-cyan-300 font-bold">
                      {typeof inc.calculatedValue === 'number'
                        ? inc.calculatedValue.toLocaleString()
                        : inc.calculatedValue}{' '}
                      {inc.unit}
                    </td>
                    <td className="py-2 px-3 text-right text-red-400 font-bold">
                      {typeof inc.difference === 'number'
                        ? inc.difference > 0
                          ? `+${inc.difference.toLocaleString()}`
                          : inc.difference.toLocaleString()
                        : inc.difference}{' '}
                      {inc.unit}
                    </td>
                    <td className="py-2 px-3 text-slate-400 font-sans text-[11px]">{inc.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => {
                // Auto-sync declared to calculated values
                onUpdateProposal({
                  declaredGfaM2: audit.sumBuildingGfaM2,
                  declaredFootprintM2: audit.sumBuildingFootprintM2,
                  declaredFar: audit.calculatedFar,
                  declaredSiteCoveragePercent: audit.calculatedCoveragePercent,
                });
              }}
              className="px-3 py-1.5 bg-red-900/60 hover:bg-red-800 text-white font-semibold text-xs rounded-lg transition-colors border border-red-500/40"
            >
              Align Declared Metrics to Calculated Building Sum ({audit.sumBuildingGfaM2.toLocaleString()} m²)
            </button>
          </div>
        </div>
      )}

      {/* Declared Metrics Edit Form Modal / Card */}
      {isEditingMetrics && (
        <form onSubmit={handleSaveMetrics} className="bg-slate-900 border border-cyan-500/40 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Edit Declared Planning Metrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Declared GFA (m²)</label>
              <input
                type="number"
                value={declaredGfa}
                onChange={(e) => setDeclaredGfa(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Declared Footprint (m²)</label>
              <input
                type="number"
                value={declaredFootprint}
                onChange={(e) => setDeclaredFootprint(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Declared Green Area (m²)</label>
              <input
                type="number"
                value={declaredGreen}
                onChange={(e) => setDeclaredGreen(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Declared Road Area (m²)</label>
              <input
                type="number"
                value={declaredRoads}
                onChange={(e) => setDeclaredRoads(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Declared Parking Spaces</label>
              <input
                type="number"
                value={declaredParking}
                onChange={(e) => setDeclaredParking(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingMetrics(false)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded"
            >
              Save Declared Values
            </button>
          </div>
        </form>
      )}

      {/* High-Level Masterplan Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Gross Floor Area (GFA)</span>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {proposal.declaredGfaM2.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Calculated: {audit.sumBuildingGfaM2.toLocaleString()} m²
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">FAR / Density</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            {proposal.declaredFar}
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Footprint: {proposal.declaredSiteCoveragePercent}%
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Landscaped Green Area</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {proposal.declaredGreenPercent}%
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            {proposal.declaredGreenAreaM2.toLocaleString()} m²
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Transportation & Roads</span>
          <div className="text-2xl font-bold font-mono text-slate-300 mt-1 tabular-nums">
            {proposal.declaredRoadPercent}%
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            {proposal.declaredParkingSpaces.toLocaleString()} parking slots
          </span>
        </div>
      </div>

      {/* Buildings Schedule Inventory */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Building Inventory Schedule ({proposal.buildings.length} Blocks)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Documented building masses exported or mapped from Autodesk Forma.
            </span>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Sum GFA: {audit.sumBuildingGfaM2.toLocaleString()} m²
          </span>
        </div>

        {proposal.buildings.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
            No buildings added yet. Add building blocks or import from Autodesk Forma.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 text-left">Building Tag / Name</th>
                  <th className="py-2.5 px-3 text-left">Typology</th>
                  <th className="py-2.5 px-3 text-right">Height / Floors</th>
                  <th className="py-2.5 px-3 text-right">Footprint</th>
                  <th className="py-2.5 px-3 text-right">Gross Floor Area (GFA)</th>
                  <th className="py-2.5 px-3 text-right">Embodied Carbon</th>
                  <th className="py-2.5 px-3 text-center">Revit Target</th>
                  <th className="py-2.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {proposal.buildings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 text-slate-200 font-sans font-semibold">
                      {b.name}
                      <span className="text-[10px] text-slate-500 block font-mono">{b.id}</span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] uppercase font-semibold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {b.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-slate-300">
                      {(b.heightM ?? b.height ?? 0)}m ({b.floors} fl)
                    </td>
                    <td className="py-2 px-3 text-right text-slate-300">
                      {(b.footprintM2 || (b.widthM ?? b.width ?? 0) * (b.depthM ?? b.depth ?? 0)).toLocaleString()} m²
                    </td>
                    <td className="py-2 px-3 text-right text-slate-100 font-bold">
                      {(b.gfaM2 ?? b.gfa ?? 0).toLocaleString()} m²
                    </td>
                    <td className="py-2 px-3 text-right text-emerald-400">
                      {b.embodiedCarbonKgM2 ?? b.embodiedCarbon ?? 320} kg/m²
                    </td>
                    <td className="py-2 px-3 text-center">
                      {b.isRevitSelected ? (
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
                          Selected
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => handleDeleteBuilding(b.id)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded"
                        title="Delete block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Building Form Modal */}
      {isAddingBuilding && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Building Mass to {proposal.name}</h3>
            <form onSubmit={handleAddBuilding} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Building Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial Tower 05"
                  value={bName}
                  onChange={(e) => setBName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Typology</label>
                  <select
                    value={bType}
                    onChange={(e) => setBType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 font-mono"
                  >
                    <option value="office">Office / Commercial</option>
                    <option value="residential">Residential</option>
                    <option value="retail">Retail Galleria</option>
                    <option value="civic">Civic / Institutional</option>
                    <option value="transit">Transit Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Storeys / Floors</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={bFloors}
                    onChange={(e) => setBFloors(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Height (m)</label>
                  <input
                    type="number"
                    value={bHeight}
                    onChange={(e) => setBHeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Width (m)</label>
                  <input
                    type="number"
                    value={bWidth}
                    onChange={(e) => setBWidth(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Depth (m)</label>
                  <input
                    type="number"
                    value={bDepth}
                    onChange={(e) => setBDepth(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingBuilding(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded"
                >
                  Add Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
