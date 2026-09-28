/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QUALITY_CHECKLIST_ITEMS } from '../data/smartCityData';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  Download,
  AlertTriangle,
} from 'lucide-react';

interface QualityChecklistModalProps {
  onClose: () => void;
}

export const QualityChecklistModal: React.FC<QualityChecklistModalProps> = ({ onClose }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    QUALITY_CHECKLIST_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: item.verified }), {})
  );

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const count = Object.values(next).filter(Boolean).length;
      if (count === QUALITY_CHECKLIST_ITEMS.length) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
      return next;
    });
  };

  const totalVerified = Object.values(checkedItems).filter(Boolean).length;
  const percentComplete = Math.round((totalVerified / QUALITY_CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Section 14 — Quality & Compliance Audit</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Official Competition Verification Checklist
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Mandatory verification of all 24 criteria prior to final submission.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2.5 py-1 rounded"
          >
            ✕ Close
          </button>
        </div>

        {/* Progress Bar & Status Card */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-semibold text-slate-200">Audit Status</span>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">
                {totalVerified} of {QUALITY_CHECKLIST_ITEMS.length} Criteria Verified ({percentComplete}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>

          {percentComplete === 100 && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg shrink-0">
              <Award className="w-4 h-4" />
              <span>100% Submission Ready</span>
            </div>
          )}
        </div>

        {/* 24-Criteria Checklist List */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2">
          {QUALITY_CHECKLIST_ITEMS.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <label
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                    : 'bg-red-950/20 border-red-500/30 text-red-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="mt-0.5 accent-cyan-500 rounded"
                />
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{item.text}</span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">{item.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.detail}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
