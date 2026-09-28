/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WALKTHROUGH_WAYPOINTS } from '../data/smartCityData';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Clock,
  CheckCircle2,
  Maximize2,
  Compass,
} from 'lucide-react';

interface WalkthroughPlayerProps {
  walkthroughTime: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onTogglePlay: () => void;
  onSwitchTo3D: () => void;
}

export const WalkthroughPlayer: React.FC<WalkthroughPlayerProps> = ({
  walkthroughTime,
  isPlaying,
  onTimeChange,
  onTogglePlay,
  onSwitchTo3D,
}) => {
  const currentWaypointIndex = Math.min(
    WALKTHROUGH_WAYPOINTS.length - 1,
    Math.floor(walkthroughTime / 5)
  );
  const currentWaypoint = WALKTHROUGH_WAYPOINTS[currentWaypointIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Section 10 Requirement</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">Duration: Exactly 30.0 Seconds</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            <span>30-Second Cinematic Walkthrough Studio</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Automated architectural flythrough sequentially presenting the 6 mandatory problem statement checkpoints in high-fidelity 3D.
          </p>
        </div>

        <button
          onClick={onSwitchTo3D}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Launch Fullscreen 3D Walkthrough</span>
        </button>
      </div>

      {/* Main Video Walkthrough Monitor */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        {/* Active Waypoint Spotlight */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950/80 border border-cyan-500/30 rounded-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Timestamp {walkthroughTime.toFixed(1)}s / 30.0s · Stop {currentWaypoint.id} of 6
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">{currentWaypoint.title}</h2>
            <p className="text-xs text-slate-300 mt-1">{currentWaypoint.description}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs font-mono shrink-0 sm:w-64">
            <span className="text-slate-500 block text-[10px]">Forma Simulation Insight</span>
            <span className="text-emerald-400">{currentWaypoint.formaInsight}</span>
          </div>
        </div>

        {/* Video Scrubber & Playback Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>00:00.0</span>
            <span className="text-cyan-400 font-bold">{walkthroughTime.toFixed(1)}s</span>
            <span>00:30.0</span>
          </div>

          <input
            type="range"
            min="0"
            max="30"
            step="0.1"
            value={walkthroughTime}
            onChange={(e) => onTimeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onTimeChange(0)}
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Rewind to 0s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onTogglePlay}
              className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Walkthrough' : 'Play 30s Walkthrough'}</span>
            </button>
          </div>
        </div>

        {/* 6 Mandatory Stops Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {WALKTHROUGH_WAYPOINTS.map((wp) => {
            const isCurrent = Math.abs(walkthroughTime - wp.timeSec) < 2.5;
            return (
              <div
                key={wp.id}
                onClick={() => onTimeChange(wp.timeSec)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-slate-800/90 border-cyan-500 text-white ring-1 ring-cyan-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                  <span className={isCurrent ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                    00:{wp.timeSec < 10 ? `0${wp.timeSec}` : wp.timeSec}
                  </span>
                  <span className="text-[10px] text-slate-500">Stop #{wp.id}</span>
                </div>
                <h4 className="font-semibold text-slate-200 mb-1">{wp.focalArea}</h4>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {wp.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
