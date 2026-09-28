/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EvidenceItem, ProjectData, SourceType, VerificationStatus } from '../types';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  Search,
  ExternalLink,
  Plus,
  Trash2,
  FileCode,
  Image as ImageIcon,
  Video,
  Presentation,
  Layers,
  RefreshCw,
  Tag,
  SlidersHorizontal,
} from 'lucide-react';

interface EvidenceCenterProps {
  projectData: ProjectData;
  onAddEvidence: (item: EvidenceItem) => void;
  onDeleteEvidence: (id: string) => void;
  isDemoMode: boolean;
}

type AutodeskToolChoice = 'Forma' | 'Revit' | 'Both' | 'Other';

const STANDARD_FILE_TYPES = [
  'PNG Image / Screenshot (.png)',
  'Revit BIM Project (.rvt)',
  'PDF Environmental Report (.pdf)',
  'IFC OpenBIM Model (.ifc)',
  'MP4 Video Walkthrough (.mp4)',
  'PowerPoint Slide Deck (.pptx)',
  'CSV / Excel Schedule (.csv)',
  'JPG / JPEG Render (.jpg)',
  'CAD / DWG Vector Drawing (.dwg)',
  'Other / Custom Format',
];

const FORMA_SOURCE_PRESETS = [
  'Autodesk Forma 2026.1',
  'Autodesk Forma Wind CFD (Lawson Comfort)',
  'Autodesk Forma Microclimate (UTCI Engine)',
  'Autodesk Forma Embodied Carbon (Embodied AI)',
  'Autodesk Forma Sun Hours & Daylight Potential',
  'Autodesk Forma Solar Energy Analysis',
  'Autodesk Forma Noise Simulation (Nord2000)',
  'Autodesk Forma Board (Design Comparison)',
];

const REVIT_SOURCE_PRESETS = [
  'Autodesk Revit 2026 (Architecture & Structure LOD 350)',
  'Autodesk Revit 2026 (Architectural Mass & Louvers)',
  'Autodesk Revit 2026 (Structural CLT & Core Schedules)',
  'Autodesk Revit 2026 (Curtain Walls & Biophilic Terraces)',
  'Autodesk Revit 2026 (BIM Quantity Takeoff & Schedules)',
];

const CONNECTOR_SOURCE_PRESETS = [
  'Forma ↔ Revit Connector v2026.1 (Live BIM Handshake)',
  'Autodesk Forma Direct IFC4 Roundtrip Pipe',
  'Revit-to-Forma Synchronized Carbon Metric Schedule',
];

export const EvidenceCenter: React.FC<EvidenceCenterProps> = ({
  projectData,
  onAddEvidence,
  onDeleteEvidence,
  isDemoMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [toolFilter, setToolFilter] = useState<string>('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirementId, setRequirementId] = useState(projectData.requirements[0]?.id || 'req-site-01');
  const [category, setCategory] = useState<EvidenceItem['category']>('FORMA');
  
  // Specific Autodesk Tool categorization ('Forma' | 'Revit' | 'Both' | 'Other')
  const [autodeskTool, setAutodeskTool] = useState<AutodeskToolChoice>('Forma');
  
  // Source field and presets
  const [source, setSource] = useState('Autodesk Forma 2026.1');
  const [sourceType, setSourceType] = useState<SourceType>(isDemoMode ? 'DEMO' : 'FORMA');
  
  // File Type field
  const [fileType, setFileType] = useState('PNG Image / Screenshot (.png)');
  const [customFileType, setCustomFileType] = useState('');
  const [proposal, setProposal] = useState<'proposalA' | 'proposalB' | 'both' | 'site'>('both');
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState('');

  const evidenceList = projectData.evidenceList || [];

  // Helper to resolve effective Autodesk Tool for an item
  const resolveAutodeskTool = (item: EvidenceItem): AutodeskToolChoice => {
    if (item.autodeskTool) return item.autodeskTool;
    const combined = `${item.source} ${item.category} ${item.title}`.toLowerCase();
    if (combined.includes('forma') && combined.includes('revit')) return 'Both';
    if (combined.includes('revit')) return 'Revit';
    if (combined.includes('forma')) return 'Forma';
    return 'Other';
  };

  // Helper to resolve effective File Type label
  const resolveFileType = (item: EvidenceItem): string => {
    if (item.fileType) return item.fileType;
    const fn = (item.fileName || '').toLowerCase();
    if (fn.endsWith('.rvt')) return 'Revit Model (.rvt)';
    if (fn.endsWith('.png') || fn.endsWith('.jpg') || fn.endsWith('.jpeg')) return 'Image / Screenshot';
    if (fn.endsWith('.mp4') || fn.endsWith('.mov')) return 'Video (.mp4)';
    if (fn.endsWith('.pdf')) return 'PDF Report';
    if (fn.endsWith('.pptx') || fn.endsWith('.ppt')) return 'Slide Deck (.pptx)';
    if (fn.endsWith('.csv') || fn.endsWith('.xlsx')) return 'Data Sheet (.csv)';
    if (fn.endsWith('.ifc')) return 'IFC Model (.ifc)';
    if (fn.endsWith('.zip')) return 'Archive (.zip)';
    return 'Artifact Document';
  };

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.source && item.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.fileType && item.fileType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;

    const itemTool = resolveAutodeskTool(item);
    const matchesTool =
      toolFilter === 'ALL' ||
      (toolFilter === 'FORMA' && (itemTool === 'Forma' || itemTool === 'Both')) ||
      (toolFilter === 'REVIT' && (itemTool === 'Revit' || itemTool === 'Both')) ||
      (toolFilter === 'OTHER' && itemTool === 'Other');

    return matchesSearch && matchesCategory && matchesTool;
  });

  // Handle selecting an Autodesk tool in the upload modal
  const handleSelectAutodeskTool = (choice: AutodeskToolChoice) => {
    setAutodeskTool(choice);
    if (choice === 'Forma') {
      setSource('Autodesk Forma 2026.1');
      setSourceType(isDemoMode ? 'DEMO' : 'FORMA');
      if (category === 'REVIT') setCategory('ANALYSIS');
      if (fileType.includes('.rvt')) setFileType('PNG Image / Screenshot (.png)');
    } else if (choice === 'Revit') {
      setSource('Autodesk Revit 2026 (Architecture & Structure LOD 350)');
      setSourceType(isDemoMode ? 'DEMO' : 'REVIT');
      setCategory('REVIT');
      setFileType('Revit BIM Project (.rvt)');
    } else if (choice === 'Both') {
      setSource('Forma ↔ Revit Connector v2026.1 (Live BIM Handshake)');
      setSourceType(isDemoMode ? 'DEMO' : 'FORMA');
      setCategory('REVIT');
    } else {
      setSource('Team Measured Input / External Tool');
      setSourceType(isDemoMode ? 'DEMO' : 'TEAM_INPUT');
    }
  };

  // Smart file name typing handler that auto-detects tool and file type
  const handleFileNameChange = (val: string) => {
    setFileName(val);
    const lower = val.toLowerCase();
    if (lower.endsWith('.rvt')) {
      setFileType('Revit BIM Project (.rvt)');
      if (autodeskTool !== 'Revit' && autodeskTool !== 'Both') {
        handleSelectAutodeskTool('Revit');
      }
    } else if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
      if (fileType.includes('.rvt') || fileType.includes('.mp4')) {
        setFileType('PNG Image / Screenshot (.png)');
      }
    } else if (lower.endsWith('.pdf')) {
      setFileType('PDF Environmental Report (.pdf)');
    } else if (lower.endsWith('.mp4') || lower.endsWith('.mov')) {
      setFileType('MP4 Video Walkthrough (.mp4)');
      setCategory('VIDEO');
    } else if (lower.endsWith('.pptx') || lower.endsWith('.ppt')) {
      setFileType('PowerPoint Slide Deck (.pptx)');
      setCategory('PRESENTATION');
    } else if (lower.endsWith('.csv') || lower.endsWith('.xlsx')) {
      setFileType('CSV / Excel Schedule (.csv)');
    } else if (lower.endsWith('.ifc')) {
      setFileType('IFC OpenBIM Model (.ifc)');
      if (autodeskTool !== 'Revit' && autodeskTool !== 'Both') {
        handleSelectAutodeskTool('Revit');
      }
    }
  };

  const handleCreateEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileName.trim()) return;

    const resolvedFinalFileType =
      fileType === 'Other / Custom Format' && customFileType.trim()
        ? customFileType.trim()
        : fileType;

    const newEvidence: EvidenceItem = {
      id: `EVID-${Date.now().toString().slice(-6)}-${category.slice(0, 3)}`,
      requirementId,
      category,
      title: title.trim(),
      description: description.trim(),
      source: source.trim() || (autodeskTool === 'Revit' ? 'Autodesk Revit 2026' : 'Autodesk Forma 2026.1'),
      sourceType: isDemoMode ? 'DEMO' : sourceType,
      fileType: resolvedFinalFileType,
      autodeskTool,
      proposal,
      fileName: fileName.trim(),
      fileSize: fileType.includes('.rvt') ? '142 MB (Recorded)' : fileType.includes('.mp4') ? '68 MB (Recorded)' : '2.4 MB (Recorded)',
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      uploadedBy: 'Team Member',
      status: 'VERIFIED',
      notes: notes.trim(),
    };

    onAddEvidence(newEvidence);
    setIsUploadModalOpen(false);
    setTitle('');
    setDescription('');
    setFileName('');
    setNotes('');
    setCustomFileType('');
  };

  const getCategoryIcon = (cat: EvidenceItem['category']) => {
    switch (cat) {
      case 'FORMA':
      case 'ANALYSIS':
        return <FileCode className="w-4 h-4 text-cyan-400" />;
      case 'REVIT':
        return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'RENDER':
        return <ImageIcon className="w-4 h-4 text-amber-400" />;
      case 'VIDEO':
        return <Video className="w-4 h-4 text-rose-400" />;
      case 'PRESENTATION':
        return <Presentation className="w-4 h-4 text-orange-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>SIH26114 Evidence Management System</span>
            <span aria-hidden="true">·</span>
            <span>Total Evidence Artifacts: {evidenceList.length}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
            <span>Evidence Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Central repository for verifiable proof (Autodesk Forma simulation screenshots, microclimate & carbon logs, Revit BIM models, and deliverables). Every artifact is categorized by its specific Autodesk tool and file format.
          </p>
        </div>

        <button
          onClick={() => {
            handleSelectAutodeskTool('Forma');
            setIsUploadModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Log Evidence</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Search by Evidence ID, title, file name, source tool, or file type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Autodesk Tool Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Tool:</span>
            <select
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none font-mono"
            >
              <option value="ALL">All Tools</option>
              <option value="FORMA">Autodesk Forma</option>
              <option value="REVIT">Autodesk Revit</option>
              <option value="OTHER">Other / Team Input</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none font-mono"
            >
              <option value="ALL">All Categories</option>
              <option value="FORMA">Forma Models</option>
              <option value="ANALYSIS">Analyses (8 Engines)</option>
              <option value="REVIT">Revit BIM</option>
              <option value="RENDER">Renders</option>
              <option value="VIDEO">Walkthrough Video</option>
              <option value="PRESENTATION">Presentation PPT</option>
              <option value="SITE">Site Limits</option>
              <option value="PROPOSAL">Proposals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evidence Grid */}
      {filteredEvidence.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No Evidence Records Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm || categoryFilter !== 'ALL' || toolFilter !== 'ALL'
              ? 'No evidence items match your active search or filter criteria.'
              : 'The team has not uploaded evidence yet. Attach your Autodesk Forma simulation screenshots and Revit files to verify requirements.'}
          </p>
          <button
            onClick={() => {
              handleSelectAutodeskTool('Forma');
              setIsUploadModalOpen(true);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-lg transition-colors"
          >
            Log First Evidence Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvidence.map((item) => {
            const tool = resolveAutodeskTool(item);
            const resolvedType = resolveFileType(item);

            return (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between shadow-lg transition-all space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="p-1.5 rounded-md bg-slate-950 border border-slate-800">
                        {getCategoryIcon(item.category)}
                      </span>
                      <span className="font-mono font-bold text-xs text-cyan-400">{item.id}</span>
                      
                      {/* Autodesk Tool Badge */}
                      {tool === 'Forma' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-semibold">
                          <FileCode className="w-2.5 h-2.5" />
                          <span>Forma</span>
                        </span>
                      )}
                      {tool === 'Revit' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 flex items-center gap-1 font-semibold">
                          <Layers className="w-2.5 h-2.5" />
                          <span>Revit</span>
                        </span>
                      )}
                      {tool === 'Both' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-semibold">
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>Forma ↔ Revit</span>
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                        item.sourceType === 'DEMO'
                          ? 'bg-amber-950/40 text-amber-400 border-amber-500/40'
                          : 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      {item.sourceType}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>File:</span>
                    <span className="text-slate-200 truncate max-w-[180px] font-semibold">{item.fileName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>File Type:</span>
                    <span className="text-cyan-300 truncate max-w-[180px] font-medium">{resolvedType}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Source Tool:</span>
                    <span className="text-slate-300 truncate max-w-[180px]" title={item.source}>{item.source}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Linked Requirement:</span>
                    <span className="text-cyan-400">{item.requirementId}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>Uploaded: {item.uploadedAt}</span>
                    <span>{item.uploadedBy}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.status}</span>
                  </span>
                  <button
                    onClick={() => onDeleteEvidence(item.id)}
                    className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                    title="Delete evidence record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload / Log Evidence Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Log Verified Evidence Artifact</span>
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-1 rounded"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateEvidence} className="space-y-3.5 text-xs">
              {/* Evidence Title */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Evidence Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autodesk Forma Wind CFD Lawson Comfort Simulation or Lumina Tower Revit LOD 350 Model"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Categorization by Autodesk Tool (Forma vs Revit) */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-bold flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Autodesk Tool Categorization *</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">SIH26114 Tool Provenance</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectAutodeskTool('Forma')}
                    className={`px-2.5 py-2 rounded-lg border font-mono text-xs text-left transition-all flex flex-col gap-0.5 ${
                      autodeskTool === 'Forma'
                        ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1">
                      <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Forma</span>
                    </span>
                    <span className="text-[9px] text-slate-400 leading-tight">Masterplan & Analyses</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAutodeskTool('Revit')}
                    className={`px-2.5 py-2 rounded-lg border font-mono text-xs text-left transition-all flex flex-col gap-0.5 ${
                      autodeskTool === 'Revit'
                        ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Revit</span>
                    </span>
                    <span className="text-[9px] text-slate-400 leading-tight">Detailed BIM LOD 350</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAutodeskTool('Both')}
                    className={`px-2.5 py-2 rounded-lg border font-mono text-xs text-left transition-all flex flex-col gap-0.5 ${
                      autodeskTool === 'Both'
                        ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Connector</span>
                    </span>
                    <span className="text-[9px] text-slate-400 leading-tight">Forma ↔ Revit Sync</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAutodeskTool('Other')}
                    className={`px-2.5 py-2 rounded-lg border font-mono text-xs text-left transition-all flex flex-col gap-0.5 ${
                      autodeskTool === 'Other'
                        ? 'bg-slate-800 border-slate-500 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span>Other</span>
                    </span>
                    <span className="text-[9px] text-slate-400 leading-tight">Team Input / Docs</span>
                  </button>
                </div>
              </div>

              {/* Source Field (Tool & Engine Specification) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <span>Source (Software Tool & Engine) *</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Specifies exact software version or module</span>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="text"
                    required
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Autodesk Forma 2026.1 (Wind CFD) or Autodesk Revit 2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />

                  {/* Quick Preset Selector */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-mono">Quick Presets:</span>
                    {(autodeskTool === 'Revit'
                      ? REVIT_SOURCE_PRESETS
                      : autodeskTool === 'Both'
                      ? CONNECTOR_SOURCE_PRESETS
                      : FORMA_SOURCE_PRESETS
                    )
                      .slice(0, 3)
                      .map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setSource(p)}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                        >
                          {p.split(' ')[1] || p.slice(0, 16)}...
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* File Type & File Name Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* File Type Field */}
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    File Type *
                  </label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {STANDARD_FILE_TYPES.map((ft) => (
                      <option key={ft} value={ft}>
                        {ft}
                      </option>
                    ))}
                  </select>

                  {fileType === 'Other / Custom Format' && (
                    <input
                      type="text"
                      placeholder="Specify custom format (e.g. GeoTIFF, Rhino 3DM)"
                      value={customFileType}
                      onChange={(e) => setCustomFileType(e.target.value)}
                      className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  )}
                </div>

                {/* File / Artifact Name */}
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    File / Artifact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. forma_wind_lawson_b.png or lumina_tower.rvt"
                    value={fileName}
                    onChange={(e) => handleFileNameChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Tip: Entering .rvt, .png, or .mp4 auto-configures format
                  </span>
                </div>
              </div>

              {/* Category & Associated Proposal Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs"
                  >
                    <option value="FORMA">Forma Site Design</option>
                    <option value="ANALYSIS">Forma Analysis (8 Engines)</option>
                    <option value="REVIT">Revit BIM Model</option>
                    <option value="RENDER">Rendered Perspective</option>
                    <option value="VIDEO">30-Second Walkthrough</option>
                    <option value="PRESENTATION">5-7 Slide Presentation</option>
                    <option value="SITE">Site Limits</option>
                    <option value="PROPOSAL">Site Proposal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Associated Proposal</label>
                  <select
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs"
                  >
                    <option value="both">Both Proposals (Comparison)</option>
                    <option value="proposalB">Proposal B (Sustainable)</option>
                    <option value="proposalA">Proposal A (Conventional)</option>
                    <option value="site">Site Overall</option>
                  </select>
                </div>
              </div>

              {/* Requirement & Source Type Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Associated Requirement</label>
                  <select
                    value={requirementId}
                    onChange={(e) => setRequirementId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs"
                  >
                    {projectData.requirements.map((req) => (
                      <option key={req.id} value={req.id}>
                        {req.id}: {req.title.slice(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Provenance Mode</label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs"
                  >
                    <option value="FORMA">Autodesk Forma</option>
                    <option value="REVIT">Autodesk Revit</option>
                    <option value="TEAM_INPUT">Team Measured Input</option>
                    <option value="DESIGN_ASSUMPTION">Design Assumption</option>
                    <option value="DEMO">Demo Sample</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Description / Findings</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key findings, simulation parameters, and LOD level evidenced by this artifact..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Notes & Verifier Comments</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Verification comments, date of run, or software build..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg shadow-md text-xs"
                >
                  Save & Verify Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
