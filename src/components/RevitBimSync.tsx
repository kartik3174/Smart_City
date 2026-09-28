/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { REVIT_OFFICE_BUILDING_SPECS } from '../data/smartCityData';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import {
  Building2,
  RefreshCw,
  CheckCircle2,
  Layers,
  ArrowRight,
  Maximize2,
  Sparkles,
  Download,
  Cpu,
  ShieldCheck,
  Bell,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

interface SyncNotificationEvent {
  id: string;
  title: string;
  details: string;
  timestamp: Date;
  commitHash: string;
}

interface RevitBimSyncProps {
  onViewIn3D: () => void;
  isSyncing?: boolean;
  lastSyncTime?: Date;
  onTriggerSync?: () => void;
}

export const RevitBimSync: React.FC<RevitBimSyncProps> = ({
  onViewIn3D,
  isSyncing: externalIsSyncing,
  lastSyncTime: externalLastSyncTime,
  onTriggerSync: externalOnTriggerSync,
}) => {
  const [internalIsSyncing, setInternalIsSyncing] = useState(false);
  const [internalLastSyncTime, setInternalLastSyncTime] = useState<Date>(new Date(Date.now() - 45000));
  const [activeFloorView, setActiveFloorView] = useState<'elevation' | 'sky_garden' | 'structure'>('elevation');

  // Overlay state
  const [isOverlayMinimized, setIsOverlayMinimized] = useState(false);
  const [isOverlayDismissed, setIsOverlayDismissed] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Store last 3 successful synchronization events
  const [syncEvents, setSyncEvents] = useState<SyncNotificationEvent[]>([
    {
      id: 'evt-1',
      title: 'Parametric Louver Handshake',
      details: '32° Bronze Solar Louvers & Sky Gardens Synchronized',
      timestamp: new Date(Date.now() - 45000),
      commitHash: 'REV-C04-8F2B',
    },
    {
      id: 'evt-2',
      title: 'Embodied Carbon Schedule EPDs',
      details: 'Glulam Timber-Concrete Composites mapped (288 kg CO₂e/m²)',
      timestamp: new Date(Date.now() - 190000),
      commitHash: 'REV-C04-7E1A',
    },
    {
      id: 'evt-3',
      title: 'Forma Solar Envelope Re-Mesh',
      details: 'Daylight autonomy & solar raytrace verification locked',
      timestamp: new Date(Date.now() - 460000),
      commitHash: 'REV-C04-4D9C',
    },
  ]);

  const isSyncing = externalIsSyncing !== undefined ? externalIsSyncing : internalIsSyncing;
  const lastSyncTime = externalLastSyncTime !== undefined ? externalLastSyncTime : internalLastSyncTime;

  // Real-time second ticker for relative timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update sync events when lastSyncTime updates
  useEffect(() => {
    if (!lastSyncTime) return;
    setSyncEvents((prev) => {
      if (prev.length > 0 && Math.abs(prev[0].timestamp.getTime() - lastSyncTime.getTime()) < 1500) {
        return prev;
      }
      const newEvent: SyncNotificationEvent = {
        id: `evt-${Date.now()}`,
        title: 'Revit BIM Bidirectional Sync',
        details: 'Lumina EcoTower (Block C-04) parameters updated in Forma',
        timestamp: lastSyncTime,
        commitHash: `REV-C04-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      };
      return [newEvent, ...prev.slice(0, 2)];
    });
  }, [lastSyncTime]);

  const getRelativeTimeString = (date: Date) => {
    const diffSec = Math.max(0, Math.floor((currentTime.getTime() - date.getTime()) / 1000));
    if (diffSec < 5) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    return `${diffHours}h ago`;
  };

  const handleTriggerSync = () => {
    if (externalOnTriggerSync) {
      externalOnTriggerSync();
    } else {
      setInternalIsSyncing(true);
      setTimeout(() => {
        setInternalIsSyncing(false);
        const newTimestamp = new Date();
        setInternalLastSyncTime(newTimestamp);
      }, 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Autodesk Revit 2026.1 BIM Integration</span>
            <span aria-hidden="true">·</span>
            <span>Bidirectional Forma Connector</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {REVIT_OFFICE_BUILDING_SPECS.name}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Detailed architectural and structural BIM development of selected Block C-04 commercial office tower, demonstrating seamless Forma-to-Revit-to-Forma round-trip synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onViewIn3D}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>View in 3D Site</span>
          </button>
        </div>
      </div>

      {/* Real-Time Revit BIM Synchronization Status Indicator */}
      <div className="flex items-center justify-between p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-200">Revit BIM Direct Connector Status</span>
          <p className="text-xs text-slate-400">
            Bidirectional cloud link to Autodesk Revit 2026.1 (Lumina EcoTower Block C-04).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SyncStatusIndicator
            isRevitSyncing={isSyncing}
            lastRevitSyncTime={lastSyncTime}
            onTriggerSync={handleTriggerSync}
          />
          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync BIM Now'}</span>
          </button>
        </div>
      </div>

      {/* Official 4-Step Forma -> Revit -> Forma Workflow Progression */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
        <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block mb-3 font-semibold">
          Problem Statement Section 9 Workflow Pipeline
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {REVIT_OFFICE_BUILDING_SPECS.workflowSteps.map((ws) => (
            <div
              key={ws.step}
              className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold flex items-center justify-center">
                    {ws.step}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{ws.status}</span>
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white mb-1">{ws.title}</h3>
                <span className="text-[10px] text-cyan-400 font-mono block mb-2">{ws.tool}</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">{ws.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Building Architecture Visualizer & BIM Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Architectural Elevation Cutaway Diagram */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs text-cyan-400 font-mono uppercase tracking-wider">
                Revit BIM Architectural Section
              </span>
              <h3 className="text-sm font-bold text-white">28-Storey Cross Section (114m)</h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md text-[11px]">
              <button
                onClick={() => setActiveFloorView('elevation')}
                className={`px-2 py-0.5 rounded ${activeFloorView === 'elevation' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400'}`}
              >
                Envelope
              </button>
              <button
                onClick={() => setActiveFloorView('sky_garden')}
                className={`px-2 py-0.5 rounded ${activeFloorView === 'sky_garden' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400'}`}
              >
                Sky Gardens
              </button>
              <button
                onClick={() => setActiveFloorView('structure')}
                className={`px-2 py-0.5 rounded ${activeFloorView === 'structure' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400'}`}
              >
                Structure
              </button>
            </div>
          </div>

          {/* Precision Architectural SVG Elevation */}
          <div className="relative w-full h-[440px] bg-slate-950/90 border border-slate-800/80 rounded-lg p-3 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 320 460" className="w-full h-full max-h-[420px]" fill="none">
              {/* Ground line & datum */}
              <line x1="20" y1="420" x2="300" y2="420" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
              <text x="25" y="435" fill="#64748b" fontSize="9" fontFamily="monospace">±0.000m (GL: 915m AMSL)</text>
              <text x="210" y="435" fill="#64748b" fontSize="9" fontFamily="monospace">Basement EV Parking</text>

              {/* Substructure / Piles */}
              <rect x="70" y="420" width="180" height="30" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <line x1="90" y1="420" x2="90" y2="450" stroke="#0ea5e9" strokeWidth="1.5" />
              <line x1="160" y1="420" x2="160" y2="450" stroke="#0ea5e9" strokeWidth="1.5" />
              <line x1="230" y1="420" x2="230" y2="450" stroke="#0ea5e9" strokeWidth="1.5" />

              {/* Central Concrete Core (LOD 350) */}
              <rect x="135" y="50" width="50" height="370" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
              <text x="160" y="240" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 160 240)">
                SHEAR CORE / MEP DUCT
              </text>

              {/* Tower Floors (28 Storeys) */}
              {Array.from({ length: 28 }).map((_, i) => {
                const floorY = 410 - i * 12.8;
                const isSkyGarden = i === 7 || i === 15 || i === 23;
                return (
                  <g key={i}>
                    {/* Floor Slab */}
                    <rect
                      x="70"
                      y={floorY}
                      width="180"
                      height="2.5"
                      fill={isSkyGarden ? '#10b981' : activeFloorView === 'structure' ? '#f59e0b' : '#334155'}
                    />

                    {/* Sky Garden Cutaways at Levels 8, 16, 24 */}
                    {isSkyGarden && (
                      <g>
                        <rect x="45" y={floorY - 22} width="40" height="24" fill="#065f46" opacity="0.6" rx="2" />
                        <circle cx="55" cy={floorY - 10} r="5" fill="#10b981" />
                        <circle cx="70" cy={floorY - 14} r="6" fill="#059669" />
                        <text x="35" y={floorY - 8} fill="#34d399" fontSize="7" fontFamily="monospace">Lvl {i + 1}</text>
                      </g>
                    )}

                    {/* Curtain Wall Facade Louvers */}
                    {activeFloorView === 'elevation' && (
                      <>
                        <line x1="68" y1={floorY - 10} x2="72" y2={floorY - 3} stroke="#d97706" strokeWidth="1.2" />
                        <line x1="248" y1={floorY - 10} x2="252" y2={floorY - 3} stroke="#d97706" strokeWidth="1.2" />
                      </>
                    )}
                  </g>
                );
              })}

              {/* Double-skin exterior glass curtain wall */}
              <rect x="68" y="50" width="184" height="370" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.6" />

              {/* Rooftop Solar Pergola Crown (+114.000m) */}
              <polygon points="60,50 260,50 250,38 70,38" fill="#eab308" opacity="0.7" />
              <line x1="60" y1="50" x2="260" y2="50" stroke="#f59e0b" strokeWidth="2" />
              <text x="160" y="32" fill="#fbbf24" fontSize="9" fontFamily="monospace" textAnchor="middle">
                ROOFTOP BIPV CANOPY (+114m)
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
            <span>Height: 114m</span>
            <span>·</span>
            <span>Floors: 28</span>
            <span>·</span>
            <span>GFA: 58,400 m²</span>
            <span>·</span>
            <span className="text-emerald-400">Carbon: 288 kg/m²</span>
          </div>
        </div>

        {/* Right Column: Revit BIM Family Schedules & Environmental Performance */}
        <div className="lg:col-span-7 space-y-6">
          {/* Revit Family Schedules Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                Revit BIM Family Schedules & Material Carbon
              </h3>
              <span className="text-xs text-cyan-400 font-mono">LOD 350 Detailed</span>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                    <th className="py-2.5 px-3 text-left">Building Component</th>
                    <th className="py-2.5 px-3 text-left">Revit Family Specification</th>
                    <th className="py-2.5 px-3 text-right">Carbon Intensity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {REVIT_OFFICE_BUILDING_SPECS.bimComponents.map((comp, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 text-slate-200 font-medium">{comp.name}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                        <div>{comp.family}</div>
                        <div className="text-slate-500 text-[10px]">{comp.material}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-semibold tabular-nums">
                        {comp.carbonKg}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revit Synced Environmental Metrics */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-semibold text-white">
              Forma Synced Engineering Performance
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <span className="text-slate-400 text-[10px] block">Embodied Carbon Achieved</span>
                <span className="text-sm font-bold text-emerald-400">
                  {REVIT_OFFICE_BUILDING_SPECS.revitAnalysisResults.embodiedCarbonAchieved}
                </span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <span className="text-slate-400 text-[10px] block">Energy Use Intensity (EUI)</span>
                <span className="text-sm font-bold text-cyan-300">
                  {REVIT_OFFICE_BUILDING_SPECS.revitAnalysisResults.energyUseIntensityEUI}
                </span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <span className="text-slate-400 text-[10px] block">Daylight Autonomy (sDA 300/50%)</span>
                <span className="text-sm font-bold text-amber-400">
                  {REVIT_OFFICE_BUILDING_SPECS.revitAnalysisResults.daylightAutonomysDA}
                </span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                <span className="text-slate-400 text-[10px] block">Annual On-Site Solar PV</span>
                <span className="text-sm font-bold text-yellow-400">
                  {REVIT_OFFICE_BUILDING_SPECS.revitAnalysisResults.annualPvGeneration}
                </span>
              </div>
            </div>

            <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-300 text-xs flex items-center justify-between">
              <span>Forma-Revit Synchronized State:</span>
              <span className="font-mono font-semibold flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                Verified & Locked to Proposal B
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Small Notification Overlay: Last 3 Successful Synchronization Events */}
      {!isOverlayDismissed ? (
        <div className="fixed bottom-5 right-5 z-40 max-w-[360px] w-full transition-all duration-200">
          {isOverlayMinimized ? (
            /* Minimized Pill State */
            <div
              onClick={() => setIsOverlayMinimized(false)}
              className="bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-full px-3.5 py-2 shadow-2xl flex items-center justify-between cursor-pointer hover:border-cyan-400 transition-all select-none"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Last 3 Sync Events
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ({getRelativeTimeString(syncEvents[0]?.timestamp || new Date())})
                </span>
              </div>
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            </div>
          ) : (
            /* Expanded Notification Card */
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl p-3.5 space-y-3">
              {/* Overlay Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Bell className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-none">
                      Revit BIM Sync Notifications
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Last 3 Successful Events
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsOverlayMinimized(true)}
                    className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
                    title="Minimize overlay"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsOverlayDismissed(true)}
                    className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
                    title="Dismiss overlay"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* List of Last 3 Successful Synchronization Events */}
              <div className="space-y-2">
                {syncEvents.slice(0, 3).map((event, idx) => (
                  <div
                    key={event.id}
                    className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 text-xs font-mono transition-all hover:border-slate-700/80"
                  >
                    <div className="flex items-start justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-slate-200 font-sans font-semibold text-[11px] truncate">
                          {event.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-cyan-400 tabular-nums shrink-0 font-sans">
                        {getRelativeTimeString(event.timestamp)}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 font-sans pl-4 leading-tight mb-1">
                      {event.details}
                    </p>

                    <div className="flex items-center justify-between text-[9px] text-slate-500 pl-4 border-t border-slate-900 pt-1">
                      <span>{event.commitHash}</span>
                      <span>{event.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer info note */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono border-t border-slate-800/60">
                <span className="flex items-center gap-1 text-emerald-400/90 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Bidirectional Link Active
                </span>
                <span>LOD 350 Model</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Floating Reopen Button if Dismissed */
        <button
          onClick={() => {
            setIsOverlayDismissed(false);
            setIsOverlayMinimized(false);
          }}
          className="fixed bottom-5 right-5 z-40 bg-slate-900/90 border border-slate-700 hover:border-cyan-400 p-2.5 rounded-full shadow-2xl text-cyan-400 hover:text-white transition-all"
          title="Show Sync Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
