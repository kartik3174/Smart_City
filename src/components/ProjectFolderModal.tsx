/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PROJECT_FOLDER_TREE } from '../data/smartCityData';
import { ProjectFileItem } from '../types';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileSpreadsheet,
  FileText,
  Image,
  Video,
  Download,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface ProjectFolderModalProps {
  onClose: () => void;
}

export const ProjectFolderModal: React.FC<ProjectFolderModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<ProjectFileItem>(PROJECT_FOLDER_TREE);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    root: true,
    forma: true,
    revit: true,
    analysis: true,
  });

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-4 h-4 text-cyan-400" />;
      case 'forma':
        return <FileCode className="w-4 h-4 text-blue-400" />;
      case 'revit':
        return <FileCode className="w-4 h-4 text-indigo-400" />;
      case 'analysis':
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'image':
        return <Image className="w-4 h-4 text-amber-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-rose-400" />;
      case 'presentation':
        return <FileText className="w-4 h-4 text-orange-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const renderTree = (item: ProjectFileItem, depth = 0) => {
    const isFolder = item.type === 'folder' || !!item.children;
    const isExpanded = expandedFolders[item.id];
    const isSelected = selectedFile.id === item.id;

    return (
      <div key={item.id} className="select-none">
        <div
          onClick={() => setSelectedFile(item)}
          className={`flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-xs ${
            isSelected
              ? 'bg-slate-800 text-cyan-300 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {isFolder && (
            <span
              onClick={(e) => toggleFolder(item.id, e)}
              className="p-0.5 text-slate-500 hover:text-slate-200"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </span>
          )}

          {getFileIcon(item.type)}
          <span className="truncate">{item.name}</span>
          <span className="text-[10px] text-slate-500 font-mono ml-auto pl-2">{item.size}</span>
        </div>

        {isFolder && isExpanded && item.children && (
          <div>{item.children.map((child) => renderTree(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <span>Section 13 Quality Standard</span>
              <span aria-hidden="true">·</span>
              <span>Total Workspace: 1.42 GB</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Project Folder Organization (SIH26114_SmartCity)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Official Autodesk Forma, Revit BIM, simulation analysis files, and submission presentation structure.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2.5 py-1 rounded"
          >
            ✕ Close
          </button>
        </div>

        {/* 2-Pane Explorer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 min-h-[300px] md:h-96">
          {/* Left: Folder Hierarchy Tree */}
          <div className="md:col-span-6 bg-slate-950/70 border border-slate-800 rounded-xl p-3 max-h-60 md:max-h-none overflow-y-auto">
            {renderTree(PROJECT_FOLDER_TREE)}
          </div>

          {/* Right: Selected File Metadata Inspector */}
          <div className="md:col-span-6 bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  {getFileIcon(selectedFile.type)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedFile.name}</h3>
                  <span className="text-xs text-cyan-400 font-mono block break-all">
                    {selectedFile.path}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">Item Type</span>
                  <span className="text-slate-200 uppercase font-semibold">{selectedFile.type}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">Calculated Size</span>
                  <span className="text-slate-200 font-semibold">{selectedFile.size}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-300">Description & Role</span>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/40 p-3 rounded border border-slate-800/60">
                  {selectedFile.description}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Format Verified</span>
              </span>

              <button
                onClick={() => alert(`Simulated export of ${selectedFile.name} bundle successfully prepared.`)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Item</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
