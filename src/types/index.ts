/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SourceType = 'FORMA' | 'REVIT' | 'TEAM_INPUT' | 'DESIGN_ASSUMPTION' | 'DEMO';

/**
 * 5-Stage Strict Evidence Verification Status
 * MISSING: No evidence exists
 * UPLOADED: File/reference has been added
 * PENDING_REVIEW: Evidence exists but has not been manually verified
 * VERIFIED: Explicitly verified by a designated reviewer with verification notes
 * REJECTED: Evidence was reviewed and rejected
 */
export type VerificationStatus =
  | 'MISSING'
  | 'UPLOADED'
  | 'PENDING_REVIEW'
  | 'VERIFIED'
  | 'REJECTED';

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

/**
 * Standard Evidence Types for SIH26114 Competition Deliverables
 */
export type EvidenceType =
  | 'Forma Screenshot'
  | 'Forma Analysis'
  | 'Forma Board'
  | 'Revit Model'
  | 'Revit Screenshot'
  | 'Render'
  | 'Walkthrough Video'
  | 'Site Data'
  | 'Calculation'
  | 'Document'
  | 'Other';

export interface EvidenceItem {
  id: string; // e.g. EVID-REQ01-001
  requirementId: string;
  category: 'FORMA' | 'ANALYSIS' | 'REVIT' | 'RENDER' | 'VIDEO' | 'PRESENTATION' | 'SITE' | 'PROPOSAL';
  title: string;
  description: string;
  source: string; // e.g. "Autodesk Forma 2026.1", "Autodesk Revit 2026"
  sourceType: SourceType;
  evidenceType?: EvidenceType;
  fileType?: string; // e.g. "PNG Image", "RVT Project", "PDF Report", "MP4 Video"
  autodeskTool?: 'Forma' | 'Revit' | 'Both' | 'Other';
  proposal?: ProposalId | 'both' | 'site';
  fileName: string;
  fileDataUrl?: string; // Base64 preview if available
  fileSize?: string;
  uploadedAt: string;
  uploadedBy: string;
  status: VerificationStatus;
  reviewer?: string;
  verifiedAt?: string;
  verificationNote?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface AnalysisResult {
  id: AnalysisMetricId;
  metricName: string;
  category: string;
  unit: string;
  description: string;
  formaEngine: string;
  methodologyStatus?: 'Planned Analysis Method' | 'Actual Forma Result' | 'Illustrative Demo';
  proposalAStatus: VerificationStatus;
  proposalBStatus: VerificationStatus;
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

/**
 * 7-Step Honest Revit Workflow Tracking Specification
 */
export interface RevitWorkflowStep {
  stepNumber: number; // Steps 1 to 7
  title: string;
  softwareTool: string;
  description: string;
  expectedEvidence?: string;
  status: VerificationStatus;
  evidenceIds: string[];
  notes?: string;
  date?: string;
  reviewer?: string;
  lastUpdated?: string;
}

export interface FormaBoardTracking {
  boardCreated: boolean;
  proposalAAdded: boolean;
  proposalBAdded: boolean;
  comparisonCompleted: boolean;
  comparisonVisible?: boolean;
  evidenceUploaded: boolean;
  evidenceVerified: boolean;
  evidenceId?: string;
  status: VerificationStatus;
  notes?: string;
}

export interface DeliverableItem {
  id: string;
  title: string;
  category: 'FORMA_SITE' | 'PROPOSAL_A' | 'PROPOSAL_B' | 'FORMA_BOARD' | 'ANALYSIS_EVIDENCE' | 'REVIT_MODEL' | 'RENDERS' | 'WALKTHROUGH' | 'PRESENTATION_PPT';
  requiredFormat: string;
  expectedEvidence?: string;
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
  expectedEvidence?: string;
  status: VerificationStatus;
  linkedEvidenceIds: string[];
  verificationCriteria: string;
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action:
    | 'DATA_ADDED'
    | 'DATA_MODIFIED'
    | 'EVIDENCE_UPLOADED'
    | 'EVIDENCE_REVIEWED'
    | 'EVIDENCE_VERIFIED'
    | 'EVIDENCE_REJECTED'
    | 'EVIDENCE_DELETED'
    | 'STATUS_CHANGED'
    | 'MODE_SWITCHED'
    | 'DATA_IMPORTED'
    | 'DATA_RESET';
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
  formaBoardTracking: FormaBoardTracking;
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
  | 'requirements'
  | 'project_audit'
  | 'audit_log'
  | 'import_export';
