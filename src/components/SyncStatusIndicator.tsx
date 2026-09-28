/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, History, ChevronDown, ChevronUp } from 'lucide-react';

export interface SyncStatusIndicatorProps {
  isRevitSyncing?: boolean;
  lastRevitSyncTime?: Date;
  // Aliases for compatibility
  isSyncing?: boolean;
  lastSyncTime?: Date;
  onTriggerSync?: () => void;
  compact?: boolean;
  showHistoryPopover?: boolean;
  className?: string;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  isRevitSyncing: propIsRevitSyncing,
  lastRevitSyncTime: propLastRevitSyncTime,
  isSyncing: propIsSyncing,
  lastSyncTime: propLastSyncTime,
  onTriggerSync,
  compact = false,
  showHistoryPopover = false,
  className = '',
}) => {
  // Resolve unified props
  const isSyncingActive = propIsRevitSyncing ?? propIsSyncing ?? false;
  const syncDate = propLastRevitSyncTime ?? propLastSyncTime ?? new Date();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showDropdown, setShowDropdown] = useState(false);

  // Real-time 1-second interval ticker for relative time calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live relative time string
  const getRelativeTime = (date: Date): string => {
    const diffSeconds = Math.max(0, Math.floor((currentTime.getTime() - date.getTime()) / 1000));
    if (diffSeconds < 5) return 'Just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const relativeTimeLabel = `Last synced: ${getRelativeTime(syncDate)}`;

  // Top navigation bar inline mode
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div
        onClick={() => onTriggerSync && onTriggerSync()}
        title={`${isSyncingActive ? 'Revit BIM sync in progress...' : 'Click to trigger Revit BIM sync'} · ${syncDate.toLocaleTimeString()}`}
        className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono transition-all select-none border ${
          isSyncingActive
            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
            : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
        } ${onTriggerSync ? 'cursor-pointer hover:bg-slate-800' : ''}`}
      >
        {/* Green pulse icon when isRevitSyncing is true */}
        {isSyncingActive ? (
          <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
            {/* Animated green pulse wave */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
            {/* Steady green center core */}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-sm" />
          </span>
        ) : (
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
        )}

        {/* Syncing activity or Last synced label */}
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {isSyncingActive ? (
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Syncing Revit BIM...</span>
            </span>
          ) : (
            <span className="text-slate-300 font-sans text-xs">
              <span className="text-slate-400">{relativeTimeLabel}</span>
            </span>
          )}
        </div>

        {/* Small LOD tag for architectural context */}
        <span className="hidden sm:inline text-[9px] uppercase tracking-wider text-slate-500 font-mono">
          LOD 350
        </span>
      </div>
    </div>
  );
};
