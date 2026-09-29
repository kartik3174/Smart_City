/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  validateSiteArea,
  normalizeAreaToM2,
  calculateTotalBuildingGfa,
  calculateTotalBuildingFootprint,
  auditProposalConsistency,
  auditSubmissionBlockers,
  runAllValidationDiagnostics,
} from './validation';
import { ProjectData, ProposalData } from '../types';

export function runValidationTests(): { passed: number; failed: number; total: number; logs: string[] } {
  const logs: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
      logs.push(`✓ PASS: ${testName}`);
    } else {
      failed++;
      logs.push(`✗ FAIL: ${testName}`);
    }
  }

  // 1. Site area normalization
  assert(normalizeAreaToM2(1, 'km2') === 1000000, '1 km² normalizes to 1,000,000 m²');
  assert(normalizeAreaToM2(100, 'ha') === 1000000, '100 ha normalizes to 1,000,000 m²');
  assert(normalizeAreaToM2(500000, 'm2') === 500000, '500,000 m² stays 500,000 m²');

  // 2. Site area validation constraint
  const invalidSite = validateSiteArea(500000);
  assert(!invalidSite.isValid, 'Site area < 1 km² fails validation');
  assert(invalidSite.displayStatus.includes('not satisfied'), 'Site area < 1 km² displays error message');

  const validSite = validateSiteArea(1000000);
  assert(validSite.isValid, 'Site area = 1 km² passes validation');

  const largerSite = validateSiteArea(1.25, 'km2');
  assert(largerSite.isValid && largerSite.siteAreaKm2 === 1.25, 'Site area 1.25 km² passes validation');

  // 3. GFA Calculation & Agreement
  const buildings = [
    { id: 'b1', name: 'Tower A', type: 'office' as const, floors: 20, gfaM2: 50000, footprintM2: 2500, x: 0, y: 0 },
    { id: 'b2', name: 'Tower B', type: 'residential' as const, floors: 15, gfaM2: 30000, footprintM2: 2000, x: 0, y: 0 },
  ];
  assert(calculateTotalBuildingGfa(buildings) === 80000, 'Sum of building GFA is 80,000 m²');
  assert(calculateTotalBuildingFootprint(buildings) === 4500, 'Sum of building footprint is 4,500 m²');

  const consistentProp: ProposalData = {
    id: 'proposalA',
    name: 'Proposal A',
    tagline: 'Test',
    planningConcept: 'Test concept',
    declaredGfaM2: 80000,
    declaredFootprintM2: 4500,
    declaredSiteCoveragePercent: 0.45,
    declaredFar: 0.08,
    declaredGreenAreaM2: 500000,
    declaredGreenPercent: 50,
    declaredRoadAreaM2: 200000,
    declaredRoadPercent: 20,
    declaredParkingSpaces: 500,
    buildings,
    keyDecisions: [],
    sourceType: 'TEAM_INPUT',
    evidenceIds: [],
    status: 'UPLOADED',
  };
  const auditResultConsistent = auditProposalConsistency(consistentProp, 1000000);
  assert(!auditResultConsistent.hasGfaError, 'Consistent GFA reports no GFA error');
  assert(!auditResultConsistent.hasAreaAllocationError, 'Consistent area allocation reports no allocation error');

  // 4. GFA Mismatch Detection
  const mismatchedProp: ProposalData = {
    ...consistentProp,
    declaredGfaM2: 120000, // Discrepancy!
  };
  const auditResultMismatched = auditProposalConsistency(mismatchedProp, 1000000);
  assert(auditResultMismatched.hasGfaError, 'Mismatched GFA triggers DATA VALIDATION ERROR');

  // 5. Area Allocation Error Detection
  const overAllocatedProp: ProposalData = {
    ...consistentProp,
    declaredFootprintM2: 400000,
    declaredGreenAreaM2: 500000,
    declaredRoadAreaM2: 300000, // 400k + 500k + 300k = 1.2M > 1M siteArea!
  };
  const auditResultOverAllocated = auditProposalConsistency(overAllocatedProp, 1000000);
  assert(auditResultOverAllocated.hasAreaAllocationError, 'Over-allocated ground space triggers AREA ALLOCATION ERROR');

  const total = passed + failed;
  return { passed, failed, total, logs };
}
