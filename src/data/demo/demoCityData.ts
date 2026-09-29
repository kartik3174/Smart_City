/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * DEMO DATA — NOT ACTUAL AUTODESK FORMA RESULTS
 * This dataset is strictly illustrative for demonstration and review purposes.
 * It must NEVER be used or assumed as actual project evidence for SIH26114.
 */

import {
  BuildingData,
  PresentationSlide,
  ProjectFileItem,
  WalkthroughWaypoint,
} from '../../types';

// DEMO DATA — NOT ACTUAL AUTODESK FORMA RESULTS
export const DEMO_SITE_METADATA = {
  name: 'Bengaluru North Smart Urban Sector (Demo Context)',
  problemStatementId: 'SIH26114',
  organization: 'Autodesk',
  category: 'Software',
  location: 'Bengaluru North Tech Corridor (Aerotropolis Sector 7)',
  coordinates: '13°11\'42.8"N 77°42\'18.4"E',
  elevationMeters: 915,
  siteAreaM2: 1000000, // 1,000,000 m² (1.00 km²)
  targetArea: '1.00 km² (100 Hectares)',
  statusBadge: 'DEMO DATA — NOT ACTUAL FORMA RESULTS',
};

// DEMO DATA — NOT ACTUAL AUTODESK FORMA RESULTS
export const DEMO_PROPOSAL_A_DATA = {
  id: 'proposalA',
  name: 'Proposal A — Conventional Urban Development (Demo)',
  tagline: 'Conventional Rectilinear Gridiron Layout',
  conceptSummary:
    'Demonstration baseline layout featuring standard orthogonal street blocks, uniform building masses, 38.5% asphalt road coverage, and monolithic concrete envelopes.',
  gfa: 566400,
  footprint: 38700,
  siteCoverage: 3.87,
  far: 0.57,
  greenArea: 180000,
  greenRatio: 18.0,
  roadArea: 385000,
  roadRatio: 38.5,
  parkingSpaces: 14200,
  embodiedCarbonIntensity: 492,
  totalCarbonTonnes: 278668,
  sunHoursAvg: 2.4,
  daylightCompliantPercent: 61.2,
  windComfortSittingPercent: 42.0,
  microclimatePeakUTCI: 34.8,
  roadNoiseExceededPercent: 46.5,
  solarPvYieldMwhYear: 42500,
  buildings: [
    { id: 'PA-OFF-01', name: 'Commercial Tower A1', type: 'office' as const, height: 80, floors: 20, gfa: 40500, x: 300, y: 300, width: 45, depth: 45, rotation: 0, embodiedCarbon: 510 },
    { id: 'PA-OFF-02', name: 'Commercial Tower A2', type: 'office' as const, height: 80, floors: 20, gfa: 40500, x: 420, y: 300, width: 45, depth: 45, rotation: 0, embodiedCarbon: 505 },
    { id: 'PA-OFF-03', name: 'Commercial Tower A3', type: 'office' as const, height: 96, floors: 24, gfa: 54000, x: 540, y: 300, width: 50, depth: 45, rotation: 0, embodiedCarbon: 520, isRevitSelected: true },
    { id: 'PA-OFF-04', name: 'Commercial Tower A4', type: 'office' as const, height: 80, floors: 20, gfa: 40500, x: 660, y: 300, width: 45, depth: 45, rotation: 0, embodiedCarbon: 512 },
    { id: 'PA-RET-01', name: 'Commercial Podium North', type: 'retail' as const, height: 28, floors: 6, gfa: 32400, x: 300, y: 440, width: 90, depth: 60, rotation: 0, embodiedCarbon: 470 },
    { id: 'PA-RET-02', name: 'Commercial Podium South', type: 'retail' as const, height: 28, floors: 6, gfa: 32400, x: 540, y: 440, width: 90, depth: 60, rotation: 0, embodiedCarbon: 468 },
    { id: 'PA-RES-01', name: 'Residential Block 1A', type: 'residential' as const, height: 60, floors: 16, gfa: 28800, x: 220, y: 620, width: 60, depth: 30, rotation: 0, embodiedCarbon: 485 },
    { id: 'PA-RES-02', name: 'Residential Block 1B', type: 'residential' as const, height: 60, floors: 16, gfa: 28800, x: 340, y: 620, width: 60, depth: 30, rotation: 0, embodiedCarbon: 480 },
    { id: 'PA-RES-03', name: 'Residential Block 1C', type: 'residential' as const, height: 60, floors: 16, gfa: 28800, x: 460, y: 620, width: 60, depth: 30, rotation: 0, embodiedCarbon: 482 },
    { id: 'PA-RES-04', name: 'Residential Block 1D', type: 'residential' as const, height: 60, floors: 16, gfa: 28800, x: 580, y: 620, width: 60, depth: 30, rotation: 0, embodiedCarbon: 486 },
    { id: 'PA-RES-05', name: 'Residential Block 2A', type: 'residential' as const, height: 48, floors: 12, gfa: 21600, x: 220, y: 720, width: 60, depth: 30, rotation: 0, embodiedCarbon: 475 },
    { id: 'PA-RES-06', name: 'Residential Block 2B', type: 'residential' as const, height: 48, floors: 12, gfa: 21600, x: 340, y: 720, width: 60, depth: 30, rotation: 0, embodiedCarbon: 478 },
    { id: 'PA-RES-07', name: 'Residential Block 2C', type: 'residential' as const, height: 48, floors: 12, gfa: 21600, x: 460, y: 720, width: 60, depth: 30, rotation: 0, embodiedCarbon: 476 },
    { id: 'PA-RES-08', name: 'Residential Block 2D', type: 'residential' as const, height: 48, floors: 12, gfa: 21600, x: 580, y: 720, width: 60, depth: 30, rotation: 0, embodiedCarbon: 474 },
    { id: 'PA-CIV-01', name: 'Community Center', type: 'civic' as const, height: 24, floors: 4, gfa: 16000, x: 740, y: 550, width: 80, depth: 50, rotation: 0, embodiedCarbon: 440 },
    { id: 'PA-TRN-01', name: 'Surface Transit Depot', type: 'transit' as const, height: 16, floors: 3, gfa: 12000, x: 150, y: 350, width: 80, depth: 50, rotation: 0, embodiedCarbon: 430 },
  ],
};

// DEMO DATA — NOT ACTUAL AUTODESK FORMA RESULTS
export const DEMO_PROPOSAL_B_DATA = {
  id: 'proposalB',
  name: 'Proposal B — Sustainable Smart Urban Development (Demo)',
  tagline: 'Climate-Adaptive Biophilic Polycentric District',
  conceptSummary:
    'Demonstration layout incorporating solar-stepped building profiles, biophilic 225° SW breeze corridors, 41% landscaped permeable public realm, and multi-modal transit alignment.',
  gfa: 684200,
  footprint: 34200,
  siteCoverage: 3.42,
  far: 0.68,
  greenArea: 410000,
  greenRatio: 41.0,
  roadArea: 195000,
  roadRatio: 19.5,
  parkingSpaces: 9800,
  embodiedCarbonIntensity: 314,
  totalCarbonTonnes: 214838,
  sunHoursAvg: 4.6,
  daylightCompliantPercent: 88.4,
  windComfortSittingPercent: 87.0,
  microclimatePeakUTCI: 29.6,
  roadNoiseExceededPercent: 18.2,
  solarPvYieldMwhYear: 94800,
  buildings: [
    { id: 'PB-OFF-01', name: 'Office Tower B1 (Revit Detailing)', type: 'office' as const, height: 112, floors: 28, gfa: 70000, x: 450, y: 450, width: 50, depth: 50, rotation: 22.5, embodiedCarbon: 288, isRevitSelected: true },
    { id: 'PB-OFF-02', name: 'Innovation Tower B2', type: 'office' as const, height: 88, floors: 22, gfa: 49500, x: 570, y: 420, width: 45, depth: 50, rotation: 22.5, embodiedCarbon: 300 },
    { id: 'PB-OFF-03', name: 'Commercial Hub B3', type: 'office' as const, height: 64, floors: 16, gfa: 28800, x: 330, y: 380, width: 45, depth: 40, rotation: 22.5, embodiedCarbon: 305 },
    { id: 'PB-OFF-04', name: 'Applied Research Center B4', type: 'office' as const, height: 48, floors: 12, gfa: 20400, x: 530, y: 230, width: 50, depth: 34, rotation: 22.5, embodiedCarbon: 299 },
    { id: 'PB-RET-01', name: 'Biophilic Retail Promenade North', type: 'retail' as const, height: 20, floors: 4, gfa: 24000, x: 450, y: 340, width: 100, depth: 30, rotation: 22.5, embodiedCarbon: 285 },
    { id: 'PB-RET-02', name: 'Biophilic Retail Promenade South', type: 'retail' as const, height: 20, floors: 4, gfa: 24000, x: 450, y: 560, width: 100, depth: 30, rotation: 22.5, embodiedCarbon: 282 },
    { id: 'PB-RES-01', name: 'Terraced Eco-Living 1', type: 'residential' as const, height: 54, floors: 15, gfa: 31500, x: 250, y: 650, width: 70, depth: 30, rotation: 30, embodiedCarbon: 310 },
    { id: 'PB-RES-02', name: 'Terraced Eco-Living 2', type: 'residential' as const, height: 50, floors: 14, gfa: 28000, x: 360, y: 680, width: 65, depth: 30, rotation: 30, embodiedCarbon: 312 },
    { id: 'PB-RES-03', name: 'Terraced Eco-Living 3', type: 'residential' as const, height: 44, floors: 12, gfa: 22800, x: 480, y: 710, width: 60, depth: 30, rotation: 30, embodiedCarbon: 315 },
    { id: 'PB-RES-04', name: 'Terraced Eco-Living 4', type: 'residential' as const, height: 38, floors: 10, gfa: 18000, x: 600, y: 730, width: 55, depth: 30, rotation: 30, embodiedCarbon: 308 },
    { id: 'PB-RES-05', name: 'Courtyard Family Residences 1', type: 'residential' as const, height: 32, floors: 8, gfa: 16000, x: 220, y: 770, width: 50, depth: 40, rotation: 15, embodiedCarbon: 320 },
    { id: 'PB-RES-06', name: 'Courtyard Family Residences 2', type: 'residential' as const, height: 32, floors: 8, gfa: 16000, x: 330, y: 800, width: 50, depth: 40, rotation: 15, embodiedCarbon: 318 },
    { id: 'PB-RES-07', name: 'Courtyard Family Residences 3', type: 'residential' as const, height: 28, floors: 7, gfa: 14000, x: 440, y: 820, width: 50, depth: 40, rotation: 15, embodiedCarbon: 322 },
    { id: 'PB-RES-08', name: 'Courtyard Family Residences 4', type: 'residential' as const, height: 28, floors: 7, gfa: 14000, x: 550, y: 830, width: 50, depth: 40, rotation: 15, embodiedCarbon: 319 },
    { id: 'PB-CIV-01', name: 'Civic Cultural Library & Center', type: 'civic' as const, height: 24, floors: 4, gfa: 18000, x: 700, y: 480, width: 75, depth: 60, rotation: 0, embodiedCarbon: 275 },
    { id: 'PB-TRN-01', name: 'Multi-Modal Mobility Hub', type: 'transit' as const, height: 22, floors: 3, gfa: 18000, x: 180, y: 420, width: 85, depth: 70, rotation: 10, embodiedCarbon: 290 },
  ],
};

// Aliases for compatibility
export const PROPOSAL_A_DATA = DEMO_PROPOSAL_A_DATA;
export const PROPOSAL_B_DATA = DEMO_PROPOSAL_B_DATA;
export const SITE_METADATA = DEMO_SITE_METADATA;

// DEMO DATA — NOT ACTUAL AUTODESK FORMA RESULTS
export const DEMO_WALKTHROUGH_WAYPOINTS: WalkthroughWaypoint[] = [
  {
    id: 1,
    timeSec: 0,
    title: 'Regional Approach & Site Limits',
    description: 'Aerial vista establishing the 1,000,000 m² (1.00 km²) cadastral boundary, expressway corridor, and southern wetland buffer.',
    cameraPos: [500, 750, 1400],
    cameraTarget: [500, 0, 500],
    focalArea: 'Site Limits Boundary',
    formaInsight: 'Forma Area Metrics: 1.00 km² cadastral polygon validated against SIH26114 requirements.',
  },
  {
    id: 2,
    timeSec: 5,
    title: 'Masterplan Urban Fabric & Arterial Transit',
    description: 'Transitioning into the multi-modal mobility hub and walkable central spine.',
    cameraPos: [200, 320, 850],
    cameraTarget: [400, 60, 480],
    focalArea: 'Multi-Modal Transit Spine',
    formaInsight: 'Forma Noise Analysis: High-acoustic buffers isolate residential living zones.',
  },
  {
    id: 3,
    timeSec: 10,
    title: 'Ecological Corridor & Public Realm',
    description: 'Sweeping along the 225° SW green corridor connecting stormwater ponds with biophilic shaded canopies.',
    cameraPos: [420, 160, 680],
    cameraTarget: [470, 40, 400],
    focalArea: 'Biophilic Green Corridor',
    formaInsight: 'Forma Wind Analysis: Breeze corridors channel summer air, avoiding stagnation.',
  },
  {
    id: 4,
    timeSec: 15,
    title: 'Commercial Office Tower (Revit Detailing)',
    description: 'Detailed elevation orbit of the nominated commercial office building selected for Autodesk Revit BIM development.',
    cameraPos: [380, 180, 380],
    cameraTarget: [450, 90, 450],
    focalArea: 'Revit Detailed Office Building',
    formaInsight: 'Forma Embodied Carbon: Low-carbon timber-hybrid framing lowers carbon intensity.',
  },
  {
    id: 5,
    timeSec: 20,
    title: 'Microclimate Buffer & Pedestrian Plaza',
    description: 'Eye-level pedestrian perspective through shaded civic plazas demonstrating thermal comfort and solar protection.',
    cameraPos: [520, 40, 520],
    cameraTarget: [650, 30, 480],
    focalArea: 'Pedestrian Shaded Plaza',
    formaInsight: 'Forma Microclimate Analysis: Tree canopy and shading mitigate Urban Heat Island effects.',
  },
  {
    id: 6,
    timeSec: 25,
    title: 'District Solar Canopy & Sustainable Horizon',
    description: 'Ascending sunset panorama highlighting rooftop solar photovoltaic arrays across the smart city district.',
    cameraPos: [500, 600, 1100],
    cameraTarget: [500, 0, 500],
    focalArea: 'Solar PV District Roofscape',
    formaInsight: 'Forma Solar Energy: High-irradiance rooftop arrays power local district demand.',
  },
];

export const WALKTHROUGH_WAYPOINTS = DEMO_WALKTHROUGH_WAYPOINTS;

// DEMO DATA — Section 13 Compliant Project Directory Layout
export const DEMO_PROJECT_FOLDER_TREE: ProjectFileItem = {
  id: 'root',
  name: 'SIH26114_SmartCity',
  path: '/SIH26114_SmartCity',
  type: 'folder',
  size: '1.25 GB',
  description: 'Master Project Directory for SIH26114 Smart City Site Planning',
  children: [
    {
      id: 'forma',
      name: 'Forma',
      path: '/SIH26114_SmartCity/Forma',
      type: 'folder',
      size: '420 MB',
      description: 'Autodesk Forma project files, site limits, proposals, and comparative board exports',
      children: [
        { id: 'f-site', name: 'Site_Boundary', path: '/SIH26114_SmartCity/Forma/Site_Boundary', type: 'forma', size: '15 MB', description: 'Cadastral_Polygon.geojson (1,000,000 m²) & Site_Limits.forma' },
        { id: 'f-context', name: 'Context_Data', path: '/SIH26114_SmartCity/Forma/Context_Data', type: 'forma', size: '120 MB', description: 'Terrain_Contours.dxf, Surrounding_Roads.osm, Climate_Data.epw' },
        { id: 'f-propA', name: 'Proposal_A', path: '/SIH26114_SmartCity/Forma/Proposal_A', type: 'forma', size: '85 MB', description: 'Conventional_Gridiron_Massing.forma & building schedules' },
        { id: 'f-propB', name: 'Proposal_B', path: '/SIH26114_SmartCity/Forma/Proposal_B', type: 'forma', size: '110 MB', description: 'Sustainable_EcoDistrict_Massing.forma & biophilic schedules' },
        { id: 'f-board', name: 'Forma_Board', path: '/SIH26114_SmartCity/Forma/Forma_Board', type: 'forma', size: '90 MB', description: 'Forma_Board_Comparison_Matrix.pdf & high-res board screenshots' },
      ],
    },
    {
      id: 'revit',
      name: 'Revit',
      path: '/SIH26114_SmartCity/Revit',
      type: 'folder',
      size: '560 MB',
      description: 'Autodesk Revit detailed architectural BIM models, drawing sheets, and workflow exchange files',
      children: [
        { id: 'r-office', name: 'Office_Building', path: '/SIH26114_SmartCity/Revit/Office_Building', type: 'revit', size: '320 MB', description: 'Commercial_Office_Tower_Detailed_LOD350.rvt (structural framing, curtain wall)' },
        { id: 'r-drawings', name: 'Drawings', path: '/SIH26114_SmartCity/Revit/Drawings', type: 'revit', size: '90 MB', description: 'Elevations, floor plans, wall sections, and structural details with title blocks' },
        { id: 'r-sync', name: 'Forma_Revit_Sync', path: '/SIH26114_SmartCity/Revit/Forma_Revit_Sync', type: 'revit', size: '150 MB', description: 'Revit_Export_Model.rvt & round-trip verification documentation' },
      ],
    },
    {
      id: 'analysis',
      name: 'Analysis',
      path: '/SIH26114_SmartCity/Analysis',
      type: 'folder',
      size: '140 MB',
      description: 'Raw simulation outputs and verified analytical reports across all 8 mandatory modules',
      children: [
        { id: 'a-area', name: 'Area_Metrics', path: '/SIH26114_SmartCity/Analysis/Area_Metrics', type: 'analysis', size: '8 MB', description: 'Forma Area Metrics schedules, GFA, FAR, and site coverage' },
        { id: 'a-carbon', name: 'Embodied_Carbon', path: '/SIH26114_SmartCity/Analysis/Embodied_Carbon', type: 'analysis', size: '16 MB', description: 'Cradle-to-practical-completion carbon reports and material breakdowns' },
        { id: 'a-sun', name: 'Sun_Hours', path: '/SIH26114_SmartCity/Analysis/Sun_Hours', type: 'analysis', size: '22 MB', description: 'Direct solar exposure heatmaps for Solstices and Equinoxes' },
        { id: 'a-daylight', name: 'Daylight_Potential', path: '/SIH26114_SmartCity/Analysis/Daylight_Potential', type: 'analysis', size: '20 MB', description: 'Vertical Sky Component (VSC) and Daylight Factor compliance grids' },
        { id: 'a-wind', name: 'Wind_Analysis', path: '/SIH26114_SmartCity/Analysis/Wind_Analysis', type: 'analysis', size: '25 MB', description: 'Pedestrian Lawson wind comfort classes and aerodynamic velocity profiles' },
        { id: 'a-microclimate', name: 'Microclimate', path: '/SIH26114_SmartCity/Analysis/Microclimate', type: 'analysis', size: '18 MB', description: 'Universal Thermal Climate Index (UTCI) and Urban Heat Island assessments' },
        { id: 'a-noise', name: 'Noise_Analysis', path: '/SIH26114_SmartCity/Analysis/Noise_Analysis', type: 'analysis', size: '15 MB', description: 'Acoustic road traffic propagation simulation maps' },
        { id: 'a-solar', name: 'Solar_Energy', path: '/SIH26114_SmartCity/Analysis/Solar_Energy', type: 'analysis', size: '16 MB', description: 'Annual irradiance and rooftop photovoltaic yield electricity potential' },
      ],
    },
    {
      id: 'deliverables',
      name: 'Deliverables',
      path: '/SIH26114_SmartCity/Deliverables',
      type: 'folder',
      size: '130 MB',
      description: 'Official final submission deliverables required by SIH26114 problem statement',
      children: [
        { id: 'd-renders', name: 'Rendered_Images', path: '/SIH26114_SmartCity/Deliverables/Rendered_Images', type: 'image', size: '45 MB', description: 'Masterplan aerial perspectives, pedestrian street plazas, and Revit BIM views' },
        { id: 'd-walkthrough', name: 'Walkthrough_Video', path: '/SIH26114_SmartCity/Deliverables/Walkthrough_Video', type: 'video', size: '60 MB', description: '30s_Cinematic_Walkthrough_HD.mp4 visiting all 6 mandatory checkpoints' },
        { id: 'd-presentation', name: 'Presentation', path: '/SIH26114_SmartCity/Deliverables/Presentation', type: 'presentation', size: '20 MB', description: 'SIH26114_Final_Pitch_Deck.pptx conforming to 5-7 slide requirement' },
        { id: 'd-integrity', name: 'Integrity_Statement', path: '/SIH26114_SmartCity/Deliverables/Integrity_Statement', type: 'analysis', size: '5 MB', description: 'Signed academic integrity statement: no AI-generated models or copied assets' },
      ],
    },
  ],
};

export const PROJECT_FOLDER_TREE = DEMO_PROJECT_FOLDER_TREE;

// DEMO DATA — Section 12 Grand Finale Flow
export const DEMO_GRAND_FINALE_STEPS = [
  { step: 1, title: 'Introduce the Site', summary: 'Bengaluru North Tech Corridor (13°11\'42"N 77°42\'18"E), 915m elevation, high-tech aerotropolis growth belt.' },
  { step: 2, title: 'Show Site Limits', summary: '1,000m × 1,000m cadastral boundary = 1,000,000 m² (1.00 km²), strictly satisfying the minimum 1 km² mandate.' },
  { step: 3, title: 'Show Contextual Data', summary: 'Surrounding expressway corridors, southern ecological wetlands, terrain contours, and wind/solar meteorological baseline.' },
  { step: 4, title: 'Show Proposal A', summary: 'Conventional rectilinear gridiron development, 38.5% asphalt road coverage, and uniform concrete building massing.' },
  { step: 5, title: 'Show Proposal B', summary: 'Sustainable climate-adaptive masterplan, solar-staggered heights, 41% green biophilic corridors, and transit orientation.' },
  { step: 6, title: 'Run / Show Forma Analyses', summary: 'Present simulation findings across all 8 modules: Area, Carbon, Sun, Daylight, Wind, Microclimate, Noise, and Solar.' },
  { step: 7, title: 'Compare using Forma Board', summary: 'Side-by-side analytical benchmarking demonstrating performance deltas between Proposal A and Proposal B.' },
  { step: 8, title: 'Document Team Selection & Justification', summary: 'Document formal team selection rationale and evidence-based justification from Forma comparison metrics.' },
  { step: 9, title: 'Nominate Commercial Office Building', summary: 'Identify and isolate the nominated commercial office building for detailed architectural and structural modeling in Revit.' },
  { step: 10, title: 'Revit Architectural & Structural Development', summary: 'Develop detailed BIM geometry in Autodesk Revit at LOD 350 with drawing sheets and details.' },
  { step: 11, title: 'Track Revit & Forma Workflow Evidence', summary: 'Document geometry export and round-trip integration back into Autodesk Forma site masterplan.' },
  { step: 12, title: 'Review Rendered Images', summary: 'Review high-resolution architectural renders of site masterplan, pedestrian street plazas, and Revit building model.' },
  { step: 13, title: 'Play 30-Second Walkthrough Video', summary: 'Real-time guided cinematic flythrough visiting all 6 required project checkpoints in 30 seconds.' },
];

export const GRAND_FINALE_STEPS = DEMO_GRAND_FINALE_STEPS;

// DEMO DATA — Section 11 Official Presentation Slide Deck (7 Slides)
export const DEMO_OFFICIAL_SLIDES: PresentationSlide[] = [
  {
    slideNumber: 1,
    title: 'Project Introduction',
    subtitle: 'Smart City Site Planning using Autodesk Forma Site Design — Problem Statement SIH26114',
    keyPoints: [
      'Problem Statement: Smart City Site Planning using Autodesk Forma Site Design (SIH26114).',
      'Organization: Autodesk | Category: Software.',
      'Project Location: Bengaluru North Tech Corridor (Aerotropolis Sector 7), 13°11\'42"N 77°42\'18"E, elevation 915m AMSL.',
      'Site Area: Strictly 1.00 km² (1,000,000 m² / 100 Hectares) fulfilling the mandatory competition constraint.',
    ],
    formaDataHighlights: [
      { label: 'Site Area', value: '1.00 km²', note: 'Mandatory minimum met' },
      { label: 'Elevation', value: '915 m', note: 'AMSL plateau terrain' },
      { label: 'Zoning', value: 'Mixed-Use', note: 'Commercial + Residential' },
    ],
    speakerNotes:
      'Slide 1 establishes the official SIH26114 competition context, identifying the 1.00 km² project boundary in Bengaluru North and stating our mission to develop a high-performance urban district.',
  },
  {
    slideNumber: 2,
    title: 'Site & Context',
    subtitle: 'Cadastral Boundary Limits, Surrounding Infrastructure & Environmental Baseline',
    keyPoints: [
      'Cadastral Boundary: Explicit 1,000m × 1,000m polygon (1,000,000 m²) established in Autodesk Forma.',
      'Surrounding Infrastructure: Northern 60m regional expressway, western academic campus, and eastern industrial zone.',
      'Ecological Context: Southern natural wetland buffer integrated for stormwater attenuation.',
      'Climatic Baseline: Southwest prevailing monsoon winds (225° SW) and Köppen Aw tropical savanna solar climate.',
    ],
    formaDataHighlights: [
      { label: 'Cadastral Limit', value: '1,000m × 1,000m', note: 'Geo-referenced' },
      { label: 'Wind Vector', value: '225° SW @ 4.2 m/s', note: 'Forma climate data' },
      { label: 'Solar Baseline', value: '1,840 kWh/m²', note: 'Annual GHI' },
    ],
    speakerNotes:
      'Slide 2 details our site setup in Autodesk Forma, highlighting the 1 km² limits and contextual infrastructure including expressway links and natural wetland buffers.',
  },
  {
    slideNumber: 3,
    title: 'Proposal A — Conventional Urban Development',
    subtitle: 'Baseline Conventional Planning Practice & Orthogonal Gridiron Layout',
    keyPoints: [
      'Masterplan Typology: Rigid rectilinear gridiron with uniform building heights and deep street canyons.',
      'Land Use Allocation: 38.5% asphalt road coverage, 3.87% building footprint, 18.0% open green realm.',
      'Building Programme: 16 building blocks totaling 566,400 m² GFA (FAR 0.57) with conventional concrete framing.',
      'Forma Simulation Baseline: 492 kg CO₂e/m² embodied carbon, 2.4 sun hours, and 46.5% road noise exceedance.',
    ],
    formaDataHighlights: [
      { label: 'Total GFA', value: '566,400 m²', note: 'FAR 0.57 density' },
      { label: 'Road Coverage', value: '38.5%', note: 'High vehicular asphalt' },
      { label: 'Carbon Intensity', value: '492 kg CO₂e/m²', note: 'Forma Carbon baseline' },
    ],
    speakerNotes:
      'Slide 3 introduces Proposal A representing conventional urban development, establishing the baseline against which sustainable variations are measured.',
  },
  {
    slideNumber: 4,
    title: 'Proposal B — Sustainable Smart Urban Development',
    subtitle: 'Climate-Adaptive Polycentric Eco-District with Biophilic Corridors',
    keyPoints: [
      'Masterplan Typology: Solar-staggered heights, 225° SW breeze ventilation corridors, and transit-oriented layout.',
      'Land Use Allocation: 41.0% permeable green open space (+128% over Proposal A), 19.5% road network.',
      'Density Optimization: 684,200 m² GFA (FAR 0.68) accommodating 20.8% more population with lower ground footprint.',
      'Sustainable Materials: Low-carbon mass timber-hybrid framing achieving 314 kg CO₂e/m² (-36.2% carbon reduction).',
    ],
    formaDataHighlights: [
      { label: 'Total GFA', value: '684,200 m²', note: 'FAR 0.68 optimized' },
      { label: 'Green Realm', value: '41.0%', note: '225° SW breeze corridors' },
      { label: 'Carbon Intensity', value: '314 kg CO₂e/m²', note: '-36.2% embodied carbon' },
    ],
    speakerNotes:
      'Slide 4 presents Proposal B, demonstrating our climate-adaptive design strategy with biophilic breeze corridors and optimized solar profiles.',
  },
  {
    slideNumber: 5,
    title: 'Autodesk Forma Board Comparison',
    subtitle: 'Side-by-Side Simulation Benchmarking Across All 8 Required Modules',
    keyPoints: [
      'Forma Board Analysis: Side-by-side comparative benchmarking of Proposal A vs Proposal B.',
      'Carbon & Solar: 36.2% lower carbon intensity (314 vs 492 kg CO₂e/m²) and +123% solar yield (94,800 vs 42,500 MWh/yr).',
      'Daylight & Sunlight: +91.6% average sun hours (4.6 vs 2.4 hrs) and +44.4% daylight potential compliance.',
      'Wind & Comfort: +107% pedestrian wind comfort (87% vs 42%) and -5.2°C lower peak summer thermal heat stress.',
    ],
    formaDataHighlights: [
      { label: 'Sun Hours', value: '4.6 vs 2.4 hrs', note: '+91.6% daylight access' },
      { label: 'Wind Comfort', value: '87% vs 42%', note: '+107% Lawson sitting' },
      { label: 'Solar Electricity', value: '94,800 MWh/yr', note: '+123% clean yield' },
    ],
    speakerNotes:
      'Slide 5 highlights the analytical comparison in Autodesk Forma Board, comparing both proposals across the eight required environmental and spatial metrics.',
  },
  {
    slideNumber: 6,
    title: 'Final Proposal Selection & Revit BIM Detailing',
    subtitle: 'Evidence-Based Selection Justification & Detailed Office Building Modeling',
    keyPoints: [
      'Selection Justification: Proposal B chosen based on superior performance across all 8 Forma analysis categories.',
      'Nominated Office Building: Selected for architectural and structural BIM detailing in Autodesk Revit.',
      'Revit BIM Detailing: Modeled at LOD 350 with 9m structural grid, timber slabs, and biophilic sky gardens.',
      'Forma & Revit Workflow: Geometry exported, validated, and linked back into the Forma masterplan context.',
    ],
    formaDataHighlights: [
      { label: 'Selected Proposal', value: 'Proposal B', note: 'Documented rationale' },
      { label: 'Revit Model', value: 'LOD 350', note: 'Commercial office tower' },
      { label: 'Updated Carbon', value: '288 kg CO₂e/m²', note: 'Refined in Revit BIM' },
    ],
    speakerNotes:
      'Slide 6 documents the formal selection of Proposal B and tracks the detailing of the nominated commercial office tower in Autodesk Revit.',
  },
  {
    slideNumber: 7,
    title: 'Deliverables & Academic Integrity',
    subtitle: 'Renderings, 30s Walkthrough, Deliverables Checklist & Compliance Declaration',
    keyPoints: [
      'High-Resolution Renders: Masterplan aerial perspectives, street-level pedestrian plazas, and Revit BIM views.',
      '30-Second Walkthrough: Real-time cinematic walkthrough video navigating all 6 mandatory checkpoints.',
      'Structured Project Tree: Clean directory organization matching SIH26114 Section 13 standards.',
      'Academic Integrity: Formal declaration that all models, geometries, and analyses are created using required Autodesk tools with NO AI-generated models or copied assets.',
    ],
    formaDataHighlights: [
      { label: 'Walkthrough', value: '30.0 Seconds', note: '6 checkpoints' },
      { label: 'Presentation', value: '7 Slides', note: 'Section 11 compliant' },
      { label: 'Integrity', value: '100% Genuine', note: 'Autodesk Forma + Revit' },
    ],
    speakerNotes:
      'Slide 7 concludes our submission with the required visual deliverables, walkthrough video, and academic integrity statement.',
  },
];

export const OFFICIAL_SLIDES = DEMO_OFFICIAL_SLIDES;
