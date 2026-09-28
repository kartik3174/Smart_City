/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SourceType = 'FORMA' | 'REVIT' | 'TEAM_INPUT' | 'DESIGN_ASSUMPTION' | 'DEMO';

export type VerificationStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'EVIDENCE_UPLOADED' | 'VERIFIED';

export type ProposalId = 'proposalA' | 'proposalB';

export type AnalysisMetricId =
  | 'area_metrics'
  | 'embodied_carbon'
  | 'sun_hours'
  | 'daylight_potential'
  | 'wind_analysis'
  | 'microclimate'
  | 'noise_analysis'
  | 'solar_energy';

export interface EvidenceItem {
  id: string; // e.g. FORM-A-WIND-001
  requirementId: string;
  category: 'FORMA' | 'ANALYSIS' | 'REVIT' | 'RENDER' | 'VIDEO' | 'PRESENTATION' | 'SITE' | 'PROPOSAL';
  title: string;
  description: string;
  source: string; // e.g., "Autodesk Forma 2026.1", "Autodesk Revit 2026"
  sourceType: SourceType;
  fileType?: string; // e.g. "PNG Image", "RVT Project", "PDF Report", "IFC Model", "MP4 Video", "PPTX Deck", "CSV Dataset"
  autodeskTool?: 'Forma' | 'Revit' | 'Both' | 'Other';
  proposal?: ProposalId | 'both' | 'site';
  fileName: string;
  fileDataUrl?: string; // Base64 image/document preview
  fileSize?: string;
  uploadedAt: string;
  uploadedBy: string;
  status: VerificationStatus;
  notes?: string;
}

export interface AnalysisResult {
  id: AnalysisMetricId;
  metricName: string;
  category: string;
  unit: string;
  description: string;
  formaEngine: string;
  proposalAValue: number | string | null;
  proposalBValue: number | string | null;
  displayA: string;
  displayB: string;
  source: string;
  sourceType: SourceType;
  evidenceIds: string[];
  status: VerificationStatus;
  notes: string;
  lastUpdated: string;
  deltaSummary?: string; // Neutral comparison text, e.g. "Proposal B records 36.2% lower carbon intensity"
}

export type ProposalType = ProposalId;

export interface BuildingData {
  id: string;
  name: string;
  type: 'office' | 'commercial' | 'residential' | 'civic' | 'retail' | 'transit';
  heightM?: number;
  height?: number;
  floors: number;
  footprintM2?: number;
  gfaM2?: number;
  gfa?: number;
  x: number;
  y: number;
  widthM?: number;
  width?: number;
  depthM?: number;
  depth?: number;
  rotationDeg?: number;
  rotation?: number;
  embodiedCarbonKgM2?: number;
  embodiedCarbon?: number;
  isRevitSelected?: boolean;
  notes?: string;
}

export interface AnalysisSubBreakdown {
  label: string;
  propA: string;
  propB: string;
  unit: string;
}

export interface AnalysisMetricDetail {
  id: AnalysisMetricId;
  name: string;
  category: string;
  unit: string;
  description: string;
  formaMethodology: string;
  proposalAValue: number;
  proposalBValue: number;
  displayA: string;
  displayB: string;
  deltaPercent: number;
  isPositive: boolean;
  benchmarkStandard: string;
  colorScale: string[];
  subBreakdown: AnalysisSubBreakdown[];
}

export interface SiteProposal {
  id: ProposalId;
  name: string;
  tagline: string;
  conceptSummary: string;
  siteArea: number;
  gfa: number;
  footprint: number;
  siteCoverage: number;
  far: number;
  greenArea: number;
  greenRatio: number;
  roadArea: number;
  roadRatio: number;
  parkingSpaces: number;
  embodiedCarbonIntensity: number;
  totalCarbonTonnes: number;
  sunHoursAvg: number;
  daylightCompliantPercent: number;
  windComfortSittingPercent: number;
  microclimatePeakUTCI: number;
  uhiDelta: number;
  roadNoiseExceededPercent: number;
  solarPvYieldMwhYear: number;
  buildings: BuildingData[];
  designStrengths: string[];
  designWeaknesses: string[];
}

export interface PresentationSlide {
  slideNumber: number;
  title: string;
  subtitle: string;
  keyPoints: string[];
  formaDataHighlights: { label: string; value: string; note: string }[];
  speakerNotes: string;
}

export interface ProjectFileItem {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'forma' | 'revit' | 'analysis' | 'image' | 'video' | 'presentation';
  size: string;
  description: string;
  children?: ProjectFileItem[];
}

export interface WalkthroughWaypoint {
  id: number;
  timeSec: number;
  title: string;
  description: string;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  focalArea: string;
  formaInsight: string;
}

export interface ProposalData {
  id: ProposalId;
  name: string;
  tagline: string;
  planningConcept: string;
  declaredGfaM2: number;
  declaredFootprintM2: number;
  declaredSiteCoveragePercent: number;
  declaredFar: number;
  declaredGreenAreaM2: number;
  declaredGreenPercent: number;
  declaredRoadAreaM2: number;
  declaredRoadPercent: number;
  declaredParkingSpaces: number;
  buildings: BuildingData[];
  keyDecisions: string[];
  sourceType: SourceType;
  evidenceIds: string[];
  status: VerificationStatus;
}

export interface RevitWorkflowStep {
  stepNumber: number;
  title: string;
  softwareTool: string;
  description: string;
  status: VerificationStatus;
  evidenceIds: string[];
  notes?: string;
  lastUpdated?: string;
}

export interface DeliverableItem {
  id: string;
  title: string;
  category: 'FORMA_SITE' | 'PROPOSAL_A' | 'PROPOSAL_B' | 'FORMA_BOARD' | 'ANALYSIS_EVIDENCE' | 'REVIT_MODEL' | 'RENDERS' | 'WALKTHROUGH' | 'PRESENTATION_PPT';
  requiredFormat: string;
  status: VerificationStatus;
  owner: string;
  evidenceIds: string[];
  lastUpdated: string;
  notes: string;
}

export interface RequirementItem {
  id: string;
  category: 'SITE' | 'PROPOSALS' | 'ANALYSIS' | 'REVIT' | 'FINAL_DELIVERABLES' | 'COMPLIANCE';
  title: string;
  description: string;
  mandatory: boolean;
  status: VerificationStatus;
  linkedEvidenceIds: string[];
  verificationCriteria: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'DATA_ADDED' | 'DATA_MODIFIED' | 'EVIDENCE_UPLOADED' | 'STATUS_CHANGED' | 'MODE_SWITCHED' | 'DATA_IMPORTED' | 'DATA_RESET';
  entity: string;
  previousValue?: string;
  newValue?: string;
  user: string;
  notes?: string;
}

export interface SiteMetadata {
  problemStatementId: string;
  projectName: string;
  organization: string;
  category: string;
  locationName: string;
  coordinates: string;
  elevationM: number;
  siteAreaM2: number;
  siteBoundaryPolygon: string;
  surroundingContextDescription: string;
  prevailingWindDescription: string;
  solarClimateDescription: string;
  status: VerificationStatus;
  evidenceIds: string[];
}

export interface ProjectData {
  projectId: string;
  site: SiteMetadata;
  proposals: {
    proposalA: ProposalData;
    proposalB: ProposalData;
  };
  analyses: AnalysisResult[];
  revitWorkflow: RevitWorkflowStep[];
  deliverables: DeliverableItem[];
  requirements: RequirementItem[];
  evidenceList: EvidenceItem[];
  auditLogs: AuditLogEntry[];
  selectedFinalProposal: ProposalId | null;
  selectionRationale: string;
}

export type AppMode = 'DEMO' | 'ACTUAL';

export type NavigationPage =
  | 'dashboard'
  | 'site'
  | 'proposalA'
  | 'proposalB'
  | 'comparison'
  | 'analyses'
  | 'forma_board'
  | 'revit'
  | 'evidence'
  | 'deliverables'
  | 'presentation'
  | 'readiness'
  | 'audit_log'
  | 'import_export';
