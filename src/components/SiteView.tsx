/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BuildingData, ProjectData, ProposalId } from '../types';
import { Viewport3D } from './Viewport3D';
import { validateSiteArea } from '../utils/validation';
import {
  Compass,
  MapPin,
  Layers,
  Wind,
  Sun,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Trees,
  Car,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface SiteViewProps {
  projectData: ProjectData;
  activeProposalId: ProposalId;
  onSelectProposal: (id: ProposalId) => void;
  onNavigateToEvidence: () => void;
  isDemoMode: boolean;
}

export const SiteView: React.FC<SiteViewProps> = ({
  projectData,
  activeProposalId,
  onSelectProposal,
  onNavigateToEvidence,
  isDemoMode,
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);
  const [walkthroughTime, setWalkthroughTime] = useState(0);
  const [isWalkthroughPlaying, setIsWalkthroughPlaying] = useState(false);

  const site = projectData.site;
  const siteAreaValidation = validateSiteArea(site.siteAreaM2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Site Selection & Cadastral Definition</span>
            <span aria-hidden="true">·</span>
            <span className={siteAreaValidation.isValid ? 'text-emerald-400' : 'text-red-400 font-bold'}>
              {site.siteAreaM2.toLocaleString()} m² (≥ 1.00 km²)
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <span>Site Boundary & Context Documentation</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Location, cadastral boundary coordinates, terrain elevation, and environmental baseline modeled directly within Autodesk Forma.
          </p>
        </div>

        <button
          onClick={onNavigateToEvidence}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors shrink-0"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Site Limits Evidence ({site.evidenceIds.length})</span>
        </button>
      </div>

      {/* Mandatory Site Area Constraint Verification Card */}
      <div
        className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
          siteAreaValidation.isValid
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-red-950/40 border-red-500/50'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {siteAreaValidation.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              SIH26114 Minimum 1 km² Constraint Audit
            </span>
          </div>
          <p className="text-xs text-slate-300">{siteAreaValidation.message}</p>
        </div>

        <div className="text-right font-mono text-xs shrink-0">
          <span className="text-slate-400 block text-[10px]">Verified Area</span>
          <span className="text-base font-bold text-cyan-300">
            {(site.siteAreaM2 / 1000000).toFixed(2)} km²
          </span>
        </div>
      </div>

      {/* Site Geodata & Contextual Baseline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Geographic Location */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-xs text-slate-400 font-mono font-semibold uppercase block">
            Geographic Coordinates
          </span>
          <div className="text-sm font-bold text-white font-mono">{site.coordinates}</div>
          <div className="text-xs text-slate-400">
            <span>Location: {site.locationName}</span>
            <span className="block mt-0.5 font-mono">Elevation: {site.elevationM}m AMSL</span>
          </div>
        </div>

        {/* Environmental Wind Baseline */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-semibold uppercase">
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            <span>Prevailing Wind Vector</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{site.prevailingWindDescription}</p>
        </div>

        {/* Solar Radiation Climate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-semibold uppercase">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Solar Insolation Profile</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{site.solarClimateDescription}</p>
        </div>
      </div>

      {/* Surrounding Context Description */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs space-y-1">
        <span className="text-slate-400 font-mono font-semibold uppercase text-[11px]">
          Surrounding Urban Context:
        </span>
        <p className="text-slate-300 leading-relaxed">{site.surroundingContextDescription}</p>
      </div>

      {/* 3D Dashboard Visualization Module (Item 7 Requirement) */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>PROJECT VISUALIZATION — Dashboard 3D Spatial Simulator</span>
            </h2>
            <span className="text-[11px] text-slate-400">
              Dashboard visualization for spatial review · Not Autodesk Forma software
            </span>
          </div>

          {/* Proposal Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Review Proposal:</span>
            <div className="inline-flex p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
              <button
                onClick={() => onSelectProposal('proposalA')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeProposalId === 'proposalA'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Proposal A
              </button>
              <button
                onClick={() => onSelectProposal('proposalB')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeProposalId === 'proposalB'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Proposal B
              </button>
            </div>
          </div>
        </div>

        {/* 3D Viewport Canvas Container */}
        <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-950">
          <Viewport3D
            proposal={activeProposalId}
            activeAnalysis={null}
            walkthroughTime={walkthroughTime}
            isWalkthroughPlaying={isWalkthroughPlaying}
            onWalkthroughTimeChange={setWalkthroughTime}
            onToggleWalkthrough={() => setIsWalkthroughPlaying(!isWalkthroughPlaying)}
            selectedBuildingId={selectedBuilding ? selectedBuilding.id : null}
            onSelectBuilding={setSelectedBuilding}
          />
        </div>
      </div>
    </div>
  );
};
