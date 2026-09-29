/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, CheckCircle2, Clock } from 'lucide-react';
import { ProjectData } from '../types';

export interface SyncStatusIndicatorProps {
  projectData?: ProjectData;
  onNavigateToRevit?: () => void;
  className?: string;
  isRevitSyncing?: boolean;
  lastRevitSyncTime?: Date;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  projectData,
  onNavigateToRevit,
  className = '',
}) => {
  const revitSteps = projectData?.revitWorkflow || [];
  const totalSteps = revitSteps.length > 0 ? revitSteps.length : 6;
  const verifiedStepsCount = revitSteps.filter(
    (s) => s.status === 'VERIFIED' && s.evidenceIds && s.evidenceIds.length > 0
  ).length;

  const isComplete = verifiedStepsCount === totalSteps && totalSteps > 0;

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={onNavigateToRevit}
        title="Revit Workflow Evidence Status: Click to inspect LOD 350 BIM detailing and export milestones."
        className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono transition-all select-none border cursor-pointer min-h-[36px] ${
          isComplete
            ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 shadow-sm'
            : verifiedStepsCount > 0
            ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
        }`}
      >
        {isComplete ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        ) : verifiedStepsCount > 0 ? (
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        ) : (
          <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        )}

        {/* Text description */}
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-slate-400 hidden sm:inline">Revit BIM:</span>
          {isComplete ? (
            <span className="font-semibold text-emerald-300">
              Evidence Verified (6/6)
            </span>
          ) : (
            <span className="text-amber-400 font-semibold">
              Not Connected / Evidence Required ({verifiedStepsCount}/{totalSteps})
            </span>
          )}
        </div>

        {/* LOD / Tool Badge */}
        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono px-1 py-0.5 rounded bg-slate-950 border border-slate-800">
          LOD 350
        </span>
      </button>
    </div>
  );
};
