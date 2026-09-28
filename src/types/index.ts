/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProposalType = 'proposalA' | 'proposalB';

export type AnalysisMetricId =
  | 'area_metrics'
  | 'embodied_carbon'
  | 'sun_hours'
  | 'daylight_potential'
  | 'wind_analysis'
  | 'microclimate'
  | 'noise_analysis'
  | 'solar_energy';

export interface AnalysisMetricDetail {
  id: AnalysisMetricId;
  name: string;
  category: string;
  unit: string;
  description: string;
  formaMethodology: string;
  proposalAValue: number | string;
  proposalBValue: number | string;
  displayA: string;
  displayB: string;
  deltaPercent: number;
  isPositive: boolean; // Is B better than A
  benchmarkStandard: string;
  colorScale: string[];
  subBreakdown?: {
    label: string;
    propA: string | number;
    propB: string | number;
    unit: string;
  }[];
}

export interface BuildingData {
  id: string;
  name: string;
  type: 'office' | 'commercial' | 'residential' | 'civic' | 'retail' | 'transit';
  height: number; // meters
  floors: number;
  gfa: number; // m²
  x: number; // meters from site origin (0..1000)
  y: number; // meters from site origin (0..1000)
  width: number;
  depth: number;
  rotation?: number;
  embodiedCarbon: number; // kg CO2e / m²
  isRevitSelected?: boolean;
}

export interface SiteProposal {
  id: ProposalType;
  name: string;
  tagline: string;
  conceptSummary: string;
  siteArea: number; // 1,000,000 m² (1 km²)
  gfa: number;
  footprint: number;
  siteCoverage: number; // %
  far: number;
  greenArea: number;
  greenRatio: number; // %
  roadArea: number;
  roadRatio: number; // %
  parkingSpaces: number;
  embodiedCarbonIntensity: number; // kg CO2e/m²
  totalCarbonTonnes: number; // tonnes CO2e
  sunHoursAvg: number; // hours
  daylightCompliantPercent: number; // %
  windComfortSittingPercent: number; // %
  microclimatePeakUTCI: number; // °C
  uhiDelta: number; // °C difference from rural baseline
  roadNoiseExceededPercent: number; // % > 65 dBA
  solarPvYieldMwhYear: number; // MWh/year
  buildings: BuildingData[];
  designStrengths: string[];
  designWeaknesses: string[];
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

export interface PresentationSlide {
  slideNumber: number;
  title: string;
  subtitle: string;
  keyPoints: string[];
  formaDataHighlights: { label: string; value: string; note?: string }[];
  speakerNotes: string;
}

export interface ProjectFileItem {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'forma' | 'revit' | 'analysis' | 'image' | 'video' | 'presentation' | 'csv' | 'ifc';
  size: string;
  description: string;
  children?: ProjectFileItem[];
}
