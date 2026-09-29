/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EvidenceItem,
  EvidenceType,
  ProjectData,
  SourceType,
  VerificationStatus,
} from '../types';
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
  Tag,
  SlidersHorizontal,
  X,
  Check,
  Ban,
  Eye,
  ShieldCheck,
  Edit2,
} from 'lucide-react';

interface EvidenceCenterProps {
  projectData: ProjectData;
  onAddEvidence: (item: EvidenceItem) => void;
  onUpdateEvidence: (id: string, updated: Partial<EvidenceItem>) => void;
  onDeleteEvidence: (id: string) => void;
  isDemoMode: boolean;
}

type AutodeskToolChoice = 'Forma' | 'Revit' | 'Both' | 'Other';

const STANDARD_EVIDENCE_TYPES: EvidenceType[] = [
  'Forma Screenshot',
  'Forma Analysis',
  'Forma Board',
  'Revit Model',
  'Revit Screenshot',
  'Render',
  'Walkthrough Video',
  'Site Data',
  'Calculation',
  'Document',
  'Other',
];

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
  'Autodesk Forma Embodied Carbon Beta',
  'Autodesk Forma Sun Hours & Daylight Potential',
  'Autodesk Forma Solar Energy Analysis',
  'Autodesk Forma Noise Simulation Engine',
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
  'Forma ↔ Revit Interoperability (Revit Workflow Evidence)',
  'Autodesk Forma Direct IFC4 Roundtrip Pipe',
  'Revit-to-Forma Synchronized Carbon Metric Schedule',
];

export const EvidenceCenter: React.FC<EvidenceCenterProps> = ({
  projectData,
  onAddEvidence,
  onUpdateEvidence,
  onDeleteEvidence,
  isDemoMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [toolFilter, setToolFilter] = useState<string>('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Review Modal state
  const [reviewingItem, setReviewingItem] = useState<EvidenceItem | null>(null);
  const [reviewAction, setReviewAction] = useState<'VERIFY' | 'REJECT' | null>(null);
  const [reviewerName, setReviewerName] = useState('Lead Auditor / Faculty Advisor');
  const [verificationNote, setVerificationNote] = useState('');

  // Edit Modal state
  const [editingItem, setEditingItem] = useState<EvidenceItem | null>(null);

  // Add Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirementId, setRequirementId] = useState(projectData.requirements[0]?.id || 'req-site-01');
  const [category, setCategory] = useState<EvidenceItem['category']>('FORMA');
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('Forma Screenshot');
  const [autodeskTool, setAutodeskTool] = useState<AutodeskToolChoice>('Forma');
  const [source, setSource] = useState('Autodesk Forma 2026.1');
  const [sourceType, setSourceType] = useState<SourceType>(isDemoMode ? 'DEMO' : 'FORMA');
  const [fileType, setFileType] = useState('PNG Image / Screenshot (.png)');
  const [proposal, setProposal] = useState<'proposalA' | 'proposalB' | 'both' | 'site'>('both');
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState('');

  const evidenceList = projectData.evidenceList || [];

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.source && item.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesTool =
      toolFilter === 'ALL' ||
      (toolFilter === 'FORMA' && (item.autodeskTool === 'Forma' || item.autodeskTool === 'Both')) ||
      (toolFilter === 'REVIT' && (item.autodeskTool === 'Revit' || item.autodeskTool === 'Both')) ||
      (toolFilter === 'OTHER' && item.autodeskTool === 'Other');

    return matchesSearch && matchesCategory && matchesStatus && matchesTool;
  });

  const handleSelectAutodeskTool = (choice: AutodeskToolChoice) => {
    setAutodeskTool(choice);
    if (choice === 'Forma') {
      setSource('Autodesk Forma 2026.1');
      setSourceType(isDemoMode ? 'DEMO' : 'FORMA');
      setEvidenceType('Forma Screenshot');
      if (category === 'REVIT') setCategory('ANALYSIS');
    } else if (choice === 'Revit') {
      setSource('Autodesk Revit 2026 (Architecture & Structure LOD 350)');
      setSourceType(isDemoMode ? 'DEMO' : 'REVIT');
      setCategory('REVIT');
      setEvidenceType('Revit Model');
      setFileType('Revit BIM Project (.rvt)');
    } else if (choice === 'Both') {
      setSource('Forma ↔ Revit Connector v2026.1 (Live BIM Handshake)');
      setSourceType(isDemoMode ? 'DEMO' : 'FORMA');
      setCategory('REVIT');
      setEvidenceType('Forma Screenshot');
    } else {
      setSource('Team Measured Input / External Tool');
      setSourceType(isDemoMode ? 'DEMO' : 'TEAM_INPUT');
      setEvidenceType('Document');
    }
  };

  const handleFileNameChange = (val: string) => {
    setFileName(val);
    const lower = val.toLowerCase();
    if (lower.endsWith('.rvt')) {
      setFileType('Revit BIM Project (.rvt)');
      setEvidenceType('Revit Model');
      if (autodeskTool !== 'Revit' && autodeskTool !== 'Both') {
        handleSelectAutodeskTool('Revit');
      }
    } else if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
      if (fileType.includes('.rvt') || fileType.includes('.mp4')) {
        setFileType('PNG Image / Screenshot (.png)');
      }
    } else if (lower.endsWith('.pdf')) {
      setFileType('PDF Environmental Report (.pdf)');
      setEvidenceType('Document');
    } else if (lower.endsWith('.mp4') || lower.endsWith('.mov')) {
      setFileType('MP4 Video Walkthrough (.mp4)');
      setEvidenceType('Walkthrough Video');
      setCategory('VIDEO');
    } else if (lower.endsWith('.pptx') || lower.endsWith('.ppt')) {
      setFileType('PowerPoint Slide Deck (.pptx)');
      setEvidenceType('Document');
      setCategory('PRESENTATION');
    } else if (lower.endsWith('.csv') || lower.endsWith('.xlsx')) {
      setFileType('CSV / Excel Schedule (.csv)');
      setEvidenceType('Calculation');
    } else if (lower.endsWith('.ifc')) {
      setFileType('IFC OpenBIM Model (.ifc)');
      setEvidenceType('Revit Model');
    }
  };

  const handleCreateEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileName.trim()) return;

    // Rule 4: NEVER automatically mark newly created evidence as VERIFIED!
    // It must start as UPLOADED or PENDING_REVIEW.
    const newEvidence: EvidenceItem = {
      id: `EVID-${Date.now().toString().slice(-6)}-${category.slice(0, 3)}`,
      requirementId,
      category,
      evidenceType,
      title: title.trim(),
      description: description.trim(),
      source: source.trim() || 'Autodesk Forma 2026.1',
      sourceType: isDemoMode ? 'DEMO' : sourceType,
      fileType,
      autodeskTool,
      proposal,
      fileName: fileName.trim(),
      fileSize: fileType.includes('.rvt')
        ? '142 MB (Recorded)'
        : fileType.includes('.mp4')
        ? '68 MB (Recorded)'
        : '2.4 MB (Recorded)',
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      uploadedBy: 'Team Member',
      status: 'UPLOADED', // Explicitly UPLOADED, not VERIFIED!
      notes: notes.trim(),
    };

    onAddEvidence(newEvidence);
    setIsUploadModalOpen(false);
    setTitle('');
    setDescription('');
    setFileName('');
    setNotes('');
  };

  const handlePerformReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingItem || !reviewAction) return;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    if (reviewAction === 'VERIFY') {
      onUpdateEvidence(reviewingItem.id, {
        status: 'VERIFIED',
        reviewer: reviewerName.trim() || 'Designated Evaluator',
        verifiedAt: now,
        verificationNote: verificationNote.trim() || 'Verified authentic Autodesk project deliverable.',
      });
    } else if (reviewAction === 'REJECT') {
      onUpdateEvidence(reviewingItem.id, {
        status: 'REJECTED',
        reviewer: reviewerName.trim() || 'Designated Evaluator',
        rejectedAt: now,
        rejectionReason: verificationNote.trim() || 'Evidence does not meet required Autodesk criteria.',
      });
    }

    setReviewingItem(null);
    setReviewAction(null);
    setVerificationNote('');
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
            <span>Total Artifacts: {evidenceList.length}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-bold">
              {evidenceList.filter((e) => e.status === 'VERIFIED').length} Verified
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
            <span>Evidence Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Central repository for verifiable proof (Autodesk Forma simulation screenshots, microclimate & carbon logs, Revit BIM models, and deliverables). Evidence is uploaded and requires explicit manual review to become verified.
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
          <span>Attach / Log Evidence</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Search by Evidence ID, title, file name, source tool, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none font-mono"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">VERIFIED (Approved)</option>
              <option value="PENDING_REVIEW">PENDING_REVIEW</option>
              <option value="UPLOADED">UPLOADED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="MISSING">MISSING</option>
            </select>
          </div>

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
            {searchTerm || categoryFilter !== 'ALL' || statusFilter !== 'ALL' || toolFilter !== 'ALL'
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
            Attach First Evidence Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvidence.map((item) => (
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

                    {/* Tool Badge */}
                    {item.autodeskTool === 'Forma' && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-semibold">
                        Forma
                      </span>
                    )}
                    {item.autodeskTool === 'Revit' && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 font-semibold">
                        Revit
                      </span>
                    )}
                    {item.autodeskTool === 'Both' && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-semibold">
                        Forma ↔ Revit
                      </span>
                    )}
                  </div>

                  {/* 5-Stage Status Badge */}
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                      item.status === 'VERIFIED'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50'
                        : item.status === 'PENDING_REVIEW'
                        ? 'bg-amber-950/60 text-amber-400 border-amber-500/50'
                        : item.status === 'UPLOADED'
                        ? 'bg-blue-950/60 text-blue-400 border-blue-500/50'
                        : item.status === 'REJECTED'
                        ? 'bg-red-950/60 text-red-400 border-red-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
              </div>

              {/* Metadata Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>File:</span>
                  <span className="text-slate-200 truncate max-w-[180px] font-semibold">{item.fileName}</span>
                </div>
                {item.fileType && (
                  <div className="flex justify-between text-slate-400">
                    <span>File Type:</span>
                    <span className="text-indigo-300 truncate max-w-[180px]">{item.fileType}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Evidence Type:</span>
                  <span className="text-cyan-300 truncate max-w-[180px]">{item.evidenceType}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Source Tool:</span>
                  <span className="text-slate-300 truncate max-w-[180px]" title={item.source}>
                    {item.source}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Linked Requirement:</span>
                  <span className="text-cyan-400">{item.requirementId}</span>
                </div>

                {/* Verification Sign-Off Info if verified or rejected */}
                {item.status === 'VERIFIED' && item.reviewer && (
                  <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-[10px] space-y-0.5 text-emerald-300">
                    <div>
                      <span className="font-bold">Verified by:</span> {item.reviewer} ({item.verifiedAt || 'Recorded'})
                    </div>
                    {item.verificationNote && (
                      <div className="text-emerald-400/90 italic">"{item.verificationNote}"</div>
                    )}
                  </div>
                )}

                {item.status === 'REJECTED' && (
                  <div className="p-2 rounded bg-red-950/30 border border-red-500/30 text-[10px] space-y-0.5 text-red-300">
                    <div>
                      <span className="font-bold">Rejected by:</span> {item.reviewer || 'Auditor'} ({item.rejectedAt || 'Recorded'})
                    </div>
                    {item.rejectionReason && (
                      <div className="text-red-400/90 italic">"{item.rejectionReason}"</div>
                    )}
                  </div>
                )}

                <div className="flex justify-between text-slate-500 text-[10px]">
                  <span>Uploaded: {item.uploadedAt}</span>
                  <span>{item.uploadedBy}</span>
                </div>
              </div>

              {/* Reviewer Action Bar */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {item.status !== 'VERIFIED' && (
                    <button
                      onClick={() => {
                        setReviewingItem(item);
                        setReviewAction('VERIFY');
                        setVerificationNote('Authentic Autodesk deliverable verified per SIH26114 requirements.');
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold"
                      title="Explicitly verify this evidence artifact"
                    >
                      <Check className="w-3 h-3" />
                      <span>Verify</span>
                    </button>
                  )}

                  {item.status !== 'REJECTED' && (
                    <button
                      onClick={() => {
                        setReviewingItem(item);
                        setReviewAction('REJECT');
                        setVerificationNote('Artifact lacks required Autodesk Forma/Revit simulation parameters.');
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-[10px] font-mono text-red-300"
                      title="Reject this evidence artifact"
                    >
                      <Ban className="w-3 h-3" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onDeleteEvidence(item.id)}
                  className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                  title="Delete evidence record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review & Verification Modal */}
      {reviewingItem && reviewAction && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {reviewAction === 'VERIFY' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Explicit Verification Sign-Off</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span>Reject Evidence Artifact</span>
                  </>
                )}
              </h2>
              <button
                onClick={() => {
                  setReviewingItem(null);
                  setReviewAction(null);
                }}
                className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-1 rounded"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handlePerformReview} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-mono block">EVIDENCE UNDER REVIEW</span>
                <span className="font-bold text-slate-200 block">{reviewingItem.title}</span>
                <span className="text-cyan-400 font-mono text-[11px] block">{reviewingItem.fileName}</span>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Reviewer Name / Title *</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Lead Architect / Faculty Advisor / Prof. Sharma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  {reviewAction === 'VERIFY' ? 'Verification Note / Compliance Comment *' : 'Rejection Reason *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  placeholder={
                    reviewAction === 'VERIFY'
                      ? 'Confirm that authentic Autodesk Forma/Revit output was inspected and matches required metrics...'
                      : 'State why this evidence artifact was rejected...'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReviewingItem(null);
                    setReviewAction(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 font-bold rounded-lg shadow-md text-xs ${
                    reviewAction === 'VERIFY'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : 'bg-red-500 hover:bg-red-400 text-white'
                  }`}
                >
                  {reviewAction === 'VERIFY' ? 'Confirm Verification' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload / Log Evidence Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Attach / Log Verified Evidence Artifact</span>
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
                  placeholder="e.g. Autodesk Forma Wind CFD Simulation (Proposal B) or Lumina Tower Revit Model"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Categorization by Autodesk Tool */}
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
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
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

              {/* Evidence Type & File Type Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Evidence Type *</label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {STANDARD_EVIDENCE_TYPES.map((et) => (
                      <option key={et} value={et}>
                        {et}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">File Format *</label>
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
                </div>
              </div>

              {/* Source Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Source Tool & Version *</label>
                  <span className="text-[10px] text-slate-400">Specifies exact software version or module</span>
                </div>
                <input
                  type="text"
                  required
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. Autodesk Forma 2026.1 or Autodesk Revit 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              {/* File / Artifact Name */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  File / Artifact Reference Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. forma_wind_lawson_b.png or lumina_tower.rvt"
                  value={fileName}
                  onChange={(e) => handleFileNameChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                  Artifacts are recorded with metadata. Newly created items start as UPLOADED and require verification sign-off.
                </span>
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

              {/* Requirement & Provenance Mode */}
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
                  <label className="block text-slate-400 mb-1 font-medium">Initial Status</label>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-blue-400 font-mono text-xs font-semibold">
                    UPLOADED (Requires Reviewer Sign-Off)
                  </div>
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
                  Log Evidence (Starts as UPLOADED)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
