/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectData, ProposalData, RequirementItem } from '../types';

export interface InconsistencyReport {
  field: string;
  declaredValue: number | string;
  calculatedValue: number | string;
  difference: number | string;
  unit: string;
  severity: 'ERROR' | 'WARNING';
  explanation: string;
}

export interface ProposalConsistencyResult {
  isConsistent: boolean;
  inconsistencies: InconsistencyReport[];
  sumBuildingGfaM2: number;
  sumBuildingFootprintM2: number;
  calculatedFar: number;
  calculatedCoveragePercent: number;
}

/**
 * Validates site area against SIH26114 mandatory >= 1,000,000 m² (1 km²) constraint
 */
export function validateSiteArea(siteAreaM2: number): {
  isValid: boolean;
  message: string;
} {
  const minRequired = 1000000;
  if (!siteAreaM2 || siteAreaM2 <= 0) {
    return {
      isValid: false,
      message: 'Site area must be specified.',
    };
  }
  if (siteAreaM2 < minRequired) {
    return {
      isValid: false,
      message: `Invalid site area: ${siteAreaM2.toLocaleString()} m² is less than the mandatory minimum of 1,000,000 m² (1.00 km²).`,
    };
  }
  return {
    isValid: true,
    message: `Site area meets competition requirement: ${siteAreaM2.toLocaleString()} m² (≥ 1.00 km²).`,
  };
}

/**
 * Audits mathematical consistency between declared masterplan metrics and individual building sums
 */
export function auditProposalConsistency(
  proposal: ProposalData,
  siteAreaM2: number
): ProposalConsistencyResult {
  const inconsistencies: InconsistencyReport[] = [];

  // Sum of individual building footprints & GFAs
  const sumBuildingGfaM2 = proposal.buildings.reduce(
    (acc, b) => acc + (b.gfaM2 ?? b.gfa ?? 0),
    0
  );
  const sumBuildingFootprintM2 = proposal.buildings.reduce(
    (acc, b) => acc + (b.footprintM2 || (b.widthM ?? b.width ?? 0) * (b.depthM ?? b.depth ?? 0) || 0),
    0
  );

  const calculatedFar = siteAreaM2 > 0 ? Number((sumBuildingGfaM2 / siteAreaM2).toFixed(2)) : 0;
  const calculatedCoveragePercent =
    siteAreaM2 > 0 ? Number(((sumBuildingFootprintM2 / siteAreaM2) * 100).toFixed(1)) : 0;

  // 1. Compare declared GFA vs Building Sum
  if (proposal.buildings.length > 0) {
    const gfaDelta = Math.abs(sumBuildingGfaM2 - proposal.declaredGfaM2);
    // Allow minor rounding tolerance (e.g. 50 m²)
    if (gfaDelta > 100) {
      inconsistencies.push({
        field: 'Gross Floor Area (GFA)',
        declaredValue: proposal.declaredGfaM2,
        calculatedValue: sumBuildingGfaM2,
        difference: sumBuildingGfaM2 - proposal.declaredGfaM2,
        unit: 'm²',
        severity: 'ERROR',
        explanation: `Declared proposal GFA (${proposal.declaredGfaM2.toLocaleString()} m²) does not equal the sum of ${proposal.buildings.length} individual buildings (${sumBuildingGfaM2.toLocaleString()} m²).`,
      });
    }

    // 2. Compare declared Footprint vs Building Footprint Sum
    const footprintDelta = Math.abs(sumBuildingFootprintM2 - proposal.declaredFootprintM2);
    if (footprintDelta > 100) {
      inconsistencies.push({
        field: 'Building Footprint',
        declaredValue: proposal.declaredFootprintM2,
        calculatedValue: sumBuildingFootprintM2,
        difference: sumBuildingFootprintM2 - proposal.declaredFootprintM2,
        unit: 'm²',
        severity: 'WARNING',
        explanation: `Declared building footprint (${proposal.declaredFootprintM2.toLocaleString()} m²) differs from sum of building base areas (${sumBuildingFootprintM2.toLocaleString()} m²).`,
      });
    }

    // 3. Compare declared FAR vs Calculated FAR
    const farDelta = Math.abs(calculatedFar - proposal.declaredFar);
    if (farDelta > 0.05) {
      inconsistencies.push({
        field: 'Floor Area Ratio (FAR)',
        declaredValue: proposal.declaredFar,
        calculatedValue: calculatedFar,
        difference: Number((calculatedFar - proposal.declaredFar).toFixed(2)),
        unit: 'ratio',
        severity: 'WARNING',
        explanation: `Declared FAR (${proposal.declaredFar}) does not match calculated FAR from building GFA / site area (${calculatedFar}).`,
      });
    }
  }

  // 4. Ground Area Allocation Check (Footprint + Green + Roads should not exceed siteArea)
  const totalAllocated =
    proposal.declaredFootprintM2 + proposal.declaredGreenAreaM2 + proposal.declaredRoadAreaM2;
  if (totalAllocated > siteAreaM2 * 1.02) {
    inconsistencies.push({
      field: 'Total Ground Land Use Allocation',
      declaredValue: totalAllocated,
      calculatedValue: siteAreaM2,
      difference: totalAllocated - siteAreaM2,
      unit: 'm²',
      severity: 'ERROR',
      explanation: `Combined footprint (${proposal.declaredFootprintM2.toLocaleString()}), landscape (${proposal.declaredGreenAreaM2.toLocaleString()}), and road area (${proposal.declaredRoadAreaM2.toLocaleString()}) total ${totalAllocated.toLocaleString()} m², exceeding the total 1 km² site area by ${(totalAllocated - siteAreaM2).toLocaleString()} m².`,
    });
  }

  return {
    isConsistent: inconsistencies.filter((i) => i.severity === 'ERROR').length === 0,
    inconsistencies,
    sumBuildingGfaM2,
    sumBuildingFootprintM2,
    calculatedFar,
    calculatedCoveragePercent,
  };
}

/**
 * Calculates project completion percentage strictly from verified requirements with evidence
 */
export function calculateProjectMetrics(requirements: RequirementItem[]): {
  total: number;
  verified: number;
  evidenceUploaded: number;
  inProgress: number;
  notStarted: number;
  completionPercent: number;
} {
  const total = requirements.length;
  if (total === 0) {
    return { total: 0, verified: 0, evidenceUploaded: 0, inProgress: 0, notStarted: 0, completionPercent: 0 };
  }

  const verified = requirements.filter((r) => r.status === 'VERIFIED').length;
  const evidenceUploaded = requirements.filter((r) => r.status === 'EVIDENCE_UPLOADED').length;
  const inProgress = requirements.filter((r) => r.status === 'IN_PROGRESS').length;
  const notStarted = requirements.filter((r) => r.status === 'NOT_STARTED').length;

  const completionPercent = Math.round((verified / total) * 100);

  return {
    total,
    verified,
    evidenceUploaded,
    inProgress,
    notStarted,
    completionPercent,
  };
}

/**
 * Audits all submission blockers across Forma, Revit, Deliverables, and Compliance
 */
export function auditSubmissionBlockers(projectData: ProjectData): {
  isReadyForSubmission: boolean;
  blockers: { category: string; description: string; actionNeeded: string }[];
  warnings: string[];
} {
  const blockers: { category: string; description: string; actionNeeded: string }[] = [];
  const warnings: string[] = [];

  // 1. Site Area Check
  if (projectData.site.siteAreaM2 < 1000000) {
    blockers.push({
      category: 'SITE_LIMITS',
      description: `Site area is ${projectData.site.siteAreaM2.toLocaleString()} m², which violates the mandatory minimum 1,000,000 m² (1 km²) constraint.`,
      actionNeeded: 'Adjust site boundary to minimum 1,000,000 m² and attach Forma site boundary coordinates.',
    });
  }

  // 2. Proposal A & B Check
  if (!projectData.proposals.proposalA || projectData.proposals.proposalA.buildings.length === 0) {
    blockers.push({
      category: 'PROPOSALS',
      description: 'Proposal A (Conventional Urban Development) has not been documented with building massing.',
      actionNeeded: 'Document Proposal A buildings, roads, and landscape from Autodesk Forma.',
    });
  }

  if (!projectData.proposals.proposalB || projectData.proposals.proposalB.buildings.length === 0) {
    blockers.push({
      category: 'PROPOSALS',
      description: 'Proposal B (Sustainable Smart Urban Development) has not been documented with building massing.',
      actionNeeded: 'Document Proposal B buildings, roads, and landscape from Autodesk Forma.',
    });
  }

  // 3. 8 Required Forma Analyses Check
  const requiredAnalysisIds = [
    'area_metrics',
    'embodied_carbon',
    'sun_hours',
    'daylight_potential',
    'wind_analysis',
    'microclimate',
    'noise_analysis',
    'solar_energy',
  ];

  const unverifiedAnalyses = projectData.analyses.filter(
    (a) => requiredAnalysisIds.includes(a.id) && (a.status !== 'VERIFIED' || a.evidenceIds.length === 0)
  );

  if (unverifiedAnalyses.length > 0) {
    blockers.push({
      category: 'FORMA_ANALYSIS',
      description: `${unverifiedAnalyses.length} of 8 required Autodesk Forma analyses are missing verified evidence: ${unverifiedAnalyses.map((a) => a.metricName).join(', ')}.`,
      actionNeeded: 'Run simulations in Autodesk Forma, upload actual result screenshots, and enter recorded values.',
    });
  }

  // 4. Revit BIM Workflow Check
  const revitVerifiedSteps = projectData.revitWorkflow.filter(
    (s) => s.status === 'VERIFIED' && s.evidenceIds.length > 0
  );
  if (revitVerifiedSteps.length < projectData.revitWorkflow.length) {
    blockers.push({
      category: 'REVIT_WORKFLOW',
      description: `Revit BIM development and sync workflow has only ${revitVerifiedSteps.length} of ${projectData.revitWorkflow.length} verified steps.`,
      actionNeeded: 'Export Forma office building to Autodesk Revit, develop LOD 350 BIM model, sync back, and upload evidence.',
    });
  }

  // 5. Final Deliverables Check
  const missingDeliverables = projectData.deliverables.filter(
    (d) => d.status !== 'VERIFIED' || d.evidenceIds.length === 0
  );
  if (missingDeliverables.length > 0) {
    blockers.push({
      category: 'DELIVERABLES',
      description: `${missingDeliverables.length} mandatory final deliverables are not yet verified: ${missingDeliverables.map((d) => d.title).join(', ')}.`,
      actionNeeded: 'Complete rendered images, 30s walkthrough video, and 5-7 slide PPT presentation.',
    });
  }

  // 6. Selected Proposal Rationale
  if (!projectData.selectedFinalProposal) {
    warnings.push('No final proposal has been selected based on Forma Board comparison.');
  }

  return {
    isReadyForSubmission: blockers.length === 0,
    blockers,
    warnings,
  };
}
