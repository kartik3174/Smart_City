/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { BuildingData, ProposalType, AnalysisMetricId } from '../types';
import {
  PROPOSAL_A_DATA,
  PROPOSAL_B_DATA,
  SITE_METADATA,
  WALKTHROUGH_WAYPOINTS,
} from '../data/smartCityData';
import {
  Maximize2,
  Compass,
  Layers,
  Eye,
  Camera,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface Viewport3DProps {
  proposal: ProposalType;
  activeAnalysis: AnalysisMetricId | null;
  walkthroughTime: number;
  isWalkthroughPlaying: boolean;
  onWalkthroughTimeChange: (time: number) => void;
  onToggleWalkthrough: () => void;
  selectedBuildingId: string | null;
  onSelectBuilding: (building: BuildingData | null) => void;
}

export const Viewport3D: React.FC<Viewport3DProps> = ({
  proposal,
  activeAnalysis,
  walkthroughTime,
  isWalkthroughPlaying,
  onWalkthroughTimeChange,
  onToggleWalkthrough,
  selectedBuildingId,
  onSelectBuilding,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const windParticlesRef = useRef<THREE.Points | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());

  // Layer visibility state
  const [showBoundary, setShowBoundary] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showLandscape, setShowLandscape] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showHeatmapGround, setShowHeatmapGround] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'top' | 'pedestrian' | 'revit'>('iso');

  // Mouse drag orbit controls state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const cameraSphericalRef = useRef({
    radius: 1200,
    theta: Math.PI / 4,
    phi: Math.PI / 3,
    target: new THREE.Vector3(500, 20, 500),
  });

  const currentProposalData = proposal === 'proposalA' ? PROPOSAL_A_DATA : PROPOSAL_B_DATA;

  // Helper to color building based on active analysis or zoning
  const getBuildingMaterial = useCallback((b: BuildingData, isSelected: boolean, analysis: AnalysisMetricId | null) => {
    let colorHex = '#94a3b8';
    const bHeight = b.height ?? b.heightM ?? 50;
    const bCarbon = b.embodiedCarbon ?? b.embodiedCarbonKgM2 ?? 400;

    if (analysis === 'embodied_carbon') {
      // Carbon gradient: low green (< 320), medium amber (320-450), high red (> 450)
      if (bCarbon < 320) colorHex = '#10b981';
      else if (bCarbon < 450) colorHex = '#f59e0b';
      else colorHex = '#ef4444';
    } else if (analysis === 'daylight_potential') {
      // Daylight potential: higher height / isolated = better daylight
      if (b.isRevitSelected || bHeight > 80) colorHex = '#06b6d4';
      else if (bHeight > 50) colorHex = '#3b82f6';
      else colorHex = '#6366f1';
    } else if (analysis === 'solar_energy') {
      // High roof exposure
      colorHex = '#eab308';
    } else if (analysis === 'sun_hours') {
      colorHex = '#f97316';
    } else if (analysis === 'wind_analysis') {
      // Wind stagnation / comfort zones
      if (bHeight > 90) colorHex = '#ef4444'; // Corner gusts
      else if (bHeight > 60) colorHex = '#f59e0b';
      else colorHex = '#10b981';
    } else if (analysis === 'microclimate') {
      colorHex = bCarbon < 350 ? '#059669' : '#d97706';
    } else if (analysis === 'noise_analysis') {
      // Near northern expressway
      colorHex = b.y < 400 ? '#f43f5e' : '#10b981';
    } else {
      // Architectural zoning color
      if (b.isRevitSelected) {
        colorHex = '#38bdf8'; // Highlighted Revit BIM model
      } else {
        switch (b.type) {
          case 'office':
            colorHex = '#0284c7';
            break;
          case 'commercial':
            colorHex = '#2563eb';
            break;
          case 'residential':
            colorHex = '#0d9488';
            break;
          case 'civic':
            colorHex = '#8b5cf6';
            break;
          case 'retail':
            colorHex = '#d97706';
            break;
          case 'transit':
            colorHex = '#475569';
            break;
          default:
            colorHex = '#64748b';
        }
      }
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: b.isRevitSelected ? 0.2 : 0.45,
      metalness: b.isRevitSelected ? 0.6 : 0.15,
      emissive: isSelected ? new THREE.Color('#38bdf8') : new THREE.Color('#000000'),
      emissiveIntensity: isSelected ? 0.4 : 0,
      transparent: b.isRevitSelected,
      opacity: b.isRevitSelected ? 0.95 : 1.0,
      wireframe: false,
    });

    return material;
  }, []);

  // Update Camera based on spherical coords
  const updateCameraFromSpherical = useCallback(() => {
    if (!cameraRef.current) return;
    const { radius, theta, phi, target } = cameraSphericalRef.current;
    
    // Clamp phi to prevent flip
    const clampedPhi = Math.max(0.08, Math.min(Math.PI / 2 - 0.05, phi));
    cameraSphericalRef.current.phi = clampedPhi;

    const x = target.x + radius * Math.sin(clampedPhi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(clampedPhi);
    const z = target.z + radius * Math.sin(clampedPhi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(target);
  }, []);

  // Interpolate camera for walkthrough
  const updateCameraForWalkthrough = useCallback((time: number) => {
    if (!cameraRef.current) return;

    // Find current waypoint interval
    const totalWaypoints = WALKTHROUGH_WAYPOINTS.length;
    let idx = 0;
    for (let i = 0; i < totalWaypoints - 1; i++) {
      if (time >= WALKTHROUGH_WAYPOINTS[i].timeSec && time <= WALKTHROUGH_WAYPOINTS[i + 1].timeSec) {
        idx = i;
        break;
      }
    }
    if (time >= WALKTHROUGH_WAYPOINTS[totalWaypoints - 1].timeSec) {
      idx = totalWaypoints - 2;
    }

    const wpA = WALKTHROUGH_WAYPOINTS[idx];
    const wpB = WALKTHROUGH_WAYPOINTS[idx + 1] || wpA;
    const duration = Math.max(1, wpB.timeSec - wpA.timeSec);
    const progress = Math.min(1, Math.max(0, (time - wpA.timeSec) / duration));
    
    // Smooth cosine interpolation
    const smoothT = (1 - Math.cos(progress * Math.PI)) / 2;

    const camX = wpA.cameraPos[0] + (wpB.cameraPos[0] - wpA.cameraPos[0]) * smoothT;
    const camY = wpA.cameraPos[1] + (wpB.cameraPos[1] - wpA.cameraPos[1]) * smoothT;
    const camZ = wpA.cameraPos[2] + (wpB.cameraPos[2] - wpA.cameraPos[2]) * smoothT;

    const tarX = wpA.cameraTarget[0] + (wpB.cameraTarget[0] - wpA.cameraTarget[0]) * smoothT;
    const tarY = wpA.cameraTarget[1] + (wpB.cameraTarget[1] - wpA.cameraTarget[1]) * smoothT;
    const tarZ = wpA.cameraTarget[2] + (wpB.cameraTarget[2] - wpA.cameraTarget[2]) * smoothT;

    cameraRef.current.position.set(camX, camY, camZ);
    cameraRef.current.lookAt(new THREE.Vector3(tarX, tarY, tarZ));
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712'); // Deep slate CAD background
    scene.fog = new THREE.FogExp2('#030712', 0.00045);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 5, 4500);
    cameraRef.current = camera;
    updateCameraFromSpherical();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // Ambient and directional lighting (simulating solar angles)
    const ambientLight = new THREE.AmbientLight('#94a3b8', 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#fffbeb', 1.8);
    // Align with Bengaluru solar geometry (SW azimuth ~ 210°, altitude 65°)
    sunLight.position.set(350, 850, 450);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 100;
    sunLight.shadow.camera.far = 2500;
    sunLight.shadow.camera.left = -700;
    sunLight.shadow.camera.right = 700;
    sunLight.shadow.camera.top = 700;
    sunLight.shadow.camera.bottom = -700;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight('#38bdf8', 0.5);
    fillLight.position.set(-500, 300, -500);
    scene.add(fillLight);

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      renderer.dispose();
    };
  }, [updateCameraFromSpherical]);

  // Build the 3D Site Entities (Terrain, Roads, Boundaries, Buildings, Wind Particles)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear previous dynamic meshes
    const objectsToRemove: THREE.Object3D[] = [];
    scene.traverse((obj) => {
      if (obj.name && obj.name.startsWith('site_entity_')) {
        objectsToRemove.push(obj);
      }
    });
    objectsToRemove.forEach((obj) => {
      scene.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    });
    buildingMeshesRef.current.clear();

    // 1. Terrain Base (1,000m x 1,000m site + surrounding contextual buffer)
    const siteGroup = new THREE.Group();
    siteGroup.name = 'site_entity_root';

    // Surrounding context terrain (2,400m x 2,400m)
    const outerTerrainGeo = new THREE.PlaneGeometry(2800, 2800, 32, 32);
    outerTerrainGeo.rotateX(-Math.PI / 2);
    const outerTerrainMat = new THREE.MeshStandardMaterial({
      color: '#090d16',
      roughness: 0.9,
      metalness: 0.1,
    });
    const outerTerrain = new THREE.Mesh(outerTerrainGeo, outerTerrainMat);
    outerTerrain.position.set(500, -2, 500);
    outerTerrain.receiveShadow = true;
    siteGroup.add(outerTerrain);

    // Site 1 km² Terrain Mesh (1000m x 1000m, from 0 to 1000 in X and Z)
    const siteTerrainGeo = new THREE.PlaneGeometry(1000, 1000, 40, 40);
    siteTerrainGeo.rotateX(-Math.PI / 2);

    // Generate procedural microclimate or solar heatmap texture on terrain if active
    let siteTerrainColor = '#0f172a';
    if (showHeatmapGround && activeAnalysis) {
      if (activeAnalysis === 'sun_hours') siteTerrainColor = proposal === 'proposalB' ? '#ca8a04' : '#854d0e';
      else if (activeAnalysis === 'daylight_potential') siteTerrainColor = '#0284c7';
      else if (activeAnalysis === 'wind_analysis') siteTerrainColor = proposal === 'proposalB' ? '#059669' : '#b45309';
      else if (activeAnalysis === 'microclimate') siteTerrainColor = proposal === 'proposalB' ? '#047857' : '#c2410c';
      else if (activeAnalysis === 'noise_analysis') siteTerrainColor = '#9f1239';
      else if (activeAnalysis === 'solar_energy') siteTerrainColor = '#d97706';
      else if (activeAnalysis === 'embodied_carbon') siteTerrainColor = proposal === 'proposalB' ? '#065f46' : '#991b1b';
    }

    const siteTerrainMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(siteTerrainColor),
      roughness: 0.8,
      metalness: 0.05,
    });
    const siteTerrain = new THREE.Mesh(siteTerrainGeo, siteTerrainMat);
    siteTerrain.position.set(500, 0, 500);
    siteTerrain.receiveShadow = true;
    siteGroup.add(siteTerrain);

    // CAD Grid lines (100m spacing)
    const gridHelper = new THREE.GridHelper(1000, 10, '#334155', '#1e293b');
    gridHelper.position.set(500, 0.2, 500);
    siteGroup.add(gridHelper);

    // 2. Site Boundary Limits (Strict 1.00 km² Cadastral Boundary with Corner Pillars)
    if (showBoundary) {
      const boundaryPoints = [
        new THREE.Vector3(0, 2, 0),
        new THREE.Vector3(1000, 2, 0),
        new THREE.Vector3(1000, 2, 1000),
        new THREE.Vector3(0, 2, 1000),
        new THREE.Vector3(0, 2, 0),
      ];
      const boundaryGeo = new THREE.BufferGeometry().setFromPoints(boundaryPoints);
      const boundaryMat = new THREE.LineBasicMaterial({
        color: '#38bdf8',
        linewidth: 3,
      });
      const boundaryLine = new THREE.Line(boundaryGeo, boundaryMat);
      siteGroup.add(boundaryLine);

      // 4 Corner Boundary Beacon Pillars
      const pillarGeo = new THREE.CylinderGeometry(4, 4, 35, 16);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: '#0284c7',
        emissive: '#0284c7',
        emissiveIntensity: 0.6,
      });
      [[0, 0], [1000, 0], [1000, 1000], [0, 1000]].forEach(([cx, cz]) => {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(cx, 17.5, cz);
        siteGroup.add(pillar);
      });
    }

    // 3. Transportation Road Meshes
    if (showRoads) {
      const roadMat = new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.7,
      });
      const arterialRoadMat = new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.6,
      });

      // Northern Regional Arterial Highway (60m wide, at Y: 100)
      const northHighwayGeo = new THREE.PlaneGeometry(1400, 60);
      northHighwayGeo.rotateX(-Math.PI / 2);
      const northHighway = new THREE.Mesh(northHighwayGeo, arterialRoadMat);
      northHighway.position.set(500, 0.4, 80);
      siteGroup.add(northHighway);

      if (proposal === 'proposalA') {
        // Orthogonal Gridiron Roads (Proposal A)
        // Horizontal streets
        [220, 360, 500, 680, 840].forEach((zPos) => {
          const roadGeo = new THREE.PlaneGeometry(1000, 24);
          roadGeo.rotateX(-Math.PI / 2);
          const road = new THREE.Mesh(roadGeo, roadMat);
          road.position.set(500, 0.3, zPos);
          siteGroup.add(road);
        });
        // Vertical avenues
        [150, 370, 500, 630, 850].forEach((xPos) => {
          const roadGeo = new THREE.PlaneGeometry(24, 1000);
          roadGeo.rotateX(-Math.PI / 2);
          const road = new THREE.Mesh(roadGeo, roadMat);
          road.position.set(xPos, 0.35, 500);
          siteGroup.add(road);
        });
      } else {
        // Multi-Modal Transit Loop & Curvilinear Avenues (Proposal B)
        // Outer loop road
        const loopRoadGeo1 = new THREE.PlaneGeometry(860, 20);
        loopRoadGeo1.rotateX(-Math.PI / 2);
        const lRoad1 = new THREE.Mesh(loopRoadGeo1, roadMat);
        lRoad1.position.set(500, 0.3, 170);
        siteGroup.add(lRoad1);

        const loopRoadGeo2 = new THREE.PlaneGeometry(860, 20);
        loopRoadGeo2.rotateX(-Math.PI / 2);
        const lRoad2 = new THREE.Mesh(loopRoadGeo2, roadMat);
        lRoad2.position.set(500, 0.3, 930);
        siteGroup.add(lRoad2);

        // Central Transit-Oriented spine with pedestrian priority
        const transitSpineGeo = new THREE.PlaneGeometry(28, 760);
        transitSpineGeo.rotateX(-Math.PI / 2);
        const tSpineMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.8 });
        const tSpine = new THREE.Mesh(transitSpineGeo, tSpineMat);
        tSpine.position.set(500, 0.35, 550);
        siteGroup.add(tSpine);
      }
    }

    // 4. Landscaping, Green Corridors & Water Elements
    if (showLandscape) {
      if (proposal === 'proposalA') {
        // Concentrated rectangular hardscape park (Proposal A)
        const parkGeo = new THREE.PlaneGeometry(240, 160);
        parkGeo.rotateX(-Math.PI / 2);
        const parkMat = new THREE.MeshStandardMaterial({ color: '#166534', roughness: 0.9 });
        const park = new THREE.Mesh(parkGeo, parkMat);
        park.position.set(500, 0.4, 580);
        siteGroup.add(park);

        // Sparse trees
        const treeGeo = new THREE.ConeGeometry(5, 12, 6);
        const treeMat = new THREE.MeshStandardMaterial({ color: '#15803d' });
        for (let i = 0; i < 28; i++) {
          const tree = new THREE.Mesh(treeGeo, treeMat);
          const tx = 400 + (i % 7) * 35;
          const tz = 520 + Math.floor(i / 7) * 35;
          tree.position.set(tx, 6, tz);
          siteGroup.add(tree);
        }
      } else {
        // Continuous 225° SW Biophilic Ventilation Corridors & Wetland (Proposal B)
        // Southern Retention Wetland Lake
        const lakeGeo = new THREE.CircleGeometry(110, 32);
        lakeGeo.rotateX(-Math.PI / 2);
        const lakeMat = new THREE.MeshStandardMaterial({
          color: '#0284c7',
          roughness: 0.1,
          metalness: 0.8,
        });
        const lake = new THREE.Mesh(lakeGeo, lakeMat);
        lake.position.set(500, 0.45, 750);
        siteGroup.add(lake);

        // Diagonal Biophilic Green Corridors
        const greenGeo = new THREE.PlaneGeometry(180, 850);
        greenGeo.rotateX(-Math.PI / 2);
        greenGeo.rotateY(Math.PI / 8); // 22.5° angle
        const greenMat = new THREE.MeshStandardMaterial({
          color: '#059669',
          roughness: 0.9,
        });
        const greenCorridor = new THREE.Mesh(greenGeo, greenMat);
        greenCorridor.position.set(500, 0.4, 520);
        siteGroup.add(greenCorridor);

        // Lush tree canopies (120+ 3D procedural trees)
        const treeTrunkGeo = new THREE.CylinderGeometry(1, 1.4, 6, 5);
        const treeTrunkMat = new THREE.MeshStandardMaterial({ color: '#78350f' });
        const treeFoliageGeo = new THREE.DodecahedronGeometry(6, 1);
        const treeFoliageMat = new THREE.MeshStandardMaterial({ color: '#10b981', roughness: 0.8 });

        for (let i = 0; i < 90; i++) {
          const tGroup = new THREE.Group();
          const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
          trunk.position.y = 3;
          const foliage = new THREE.Mesh(treeFoliageGeo, treeFoliageMat);
          foliage.position.y = 9;
          tGroup.add(trunk);
          tGroup.add(foliage);

          // Position trees along green spine
          const angle = (i / 90) * Math.PI * 2;
          const dist = 50 + (i * 4.2) % 360;
          const tx = 500 + Math.sin(angle) * dist * 0.7;
          const tz = 520 + Math.cos(angle) * dist * 0.9;
          if (tx > 40 && tx < 960 && tz > 180 && tz < 960) {
            tGroup.position.set(tx, 0, tz);
            siteGroup.add(tGroup);
          }
        }
      }
    }

    // 5. Buildings / Massing Envelopes
    if (showBuildings) {
      currentProposalData.buildings.forEach((b: BuildingData) => {
        const isSelected = b.id === selectedBuildingId || b.isRevitSelected;
        const mat = getBuildingMaterial(b, !!isSelected, activeAnalysis);
        const bW = b.width ?? b.widthM ?? 40;
        const bH = b.height ?? b.heightM ?? 50;
        const bD = b.depth ?? b.depthM ?? 40;
        const bRot = b.rotation ?? b.rotationDeg ?? 0;

        // Building geometry
        const bGeo = new THREE.BoxGeometry(bW, bH, bD);
        const bMesh = new THREE.Mesh(bGeo, mat);
        bMesh.castShadow = true;
        bMesh.receiveShadow = true;
        bMesh.position.set(b.x, bH / 2, b.y);

        if (bRot) {
          bMesh.rotation.y = (bRot * Math.PI) / 180;
        }

        // Store reference for raycasting / selection
        bMesh.userData = { building: b };
        siteGroup.add(bMesh);
        buildingMeshesRef.current.set(b.id, bMesh);

        // If this is the Revit Flagship Tower, add architectural details (sky gardens, crown, core)
        if (b.isRevitSelected && proposal === 'proposalB') {
          // Atrium crown
          const crownGeo = new THREE.BoxGeometry(bW * 0.9, 8, bD * 0.9);
          const crownMat = new THREE.MeshStandardMaterial({
            color: '#38bdf8',
            metalness: 0.8,
            roughness: 0.1,
            emissive: '#0284c7',
            emissiveIntensity: 0.3,
          });
          const crown = new THREE.Mesh(crownGeo, crownMat);
          crown.position.set(0, bH / 2 + 4, 0);
          bMesh.add(crown);

          // Cantilevered biophilic sky terraces (Levels 8, 16, 24)
          [0.3, 0.6, 0.85].forEach((hRatio) => {
            const terraceGeo = new THREE.BoxGeometry(bW + 6, 2, bD + 4);
            const terraceMat = new THREE.MeshStandardMaterial({ color: '#10b981', roughness: 0.8 });
            const terrace = new THREE.Mesh(terraceGeo, terraceMat);
            terrace.position.set(0, -bH / 2 + bH * hRatio, 0);
            bMesh.add(terrace);
          });
        }
      });
    }

    // 6. Wind Analysis Animated Flow Streamlines (CFD Particle System)
    if (activeAnalysis === 'wind_analysis') {
      const particleCount = 450;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        // Spawn particles along the Southwest boundary (225°)
        positions[i * 3] = Math.random() * 600;
        positions[i * 3 + 1] = 4 + Math.random() * 35; // Pedestrian level
        positions[i * 3 + 2] = 400 + Math.random() * 600;

        // Flow towards Northeast (NE)
        velocities[i * 3] = 1.2 + Math.random() * 1.5;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
        velocities[i * 3 + 2] = -(1.2 + Math.random() * 1.5);
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.userData = { velocities };

      const particleMat = new THREE.PointsMaterial({
        color: '#06b6d4',
        size: 5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });

      const windParticles = new THREE.Points(particleGeo, particleMat);
      siteGroup.add(windParticles);
      windParticlesRef.current = windParticles;
    }

    scene.add(siteGroup);
  }, [
    proposal,
    activeAnalysis,
    currentProposalData,
    showBoundary,
    showRoads,
    showLandscape,
    showBuildings,
    showHeatmapGround,
    selectedBuildingId,
    getBuildingMaterial,
  ]);

  // Main Render Loop
  useEffect(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Handle walkthrough playback
      if (isWalkthroughPlaying) {
        const newTime = (walkthroughTime + dt) % 30;
        onWalkthroughTimeChange(newTime);
        updateCameraForWalkthrough(newTime);
      }

      // Animate wind particles
      if (windParticlesRef.current) {
        const geo = windParticlesRef.current.geometry;
        const pos = geo.attributes.position.array as Float32Array;
        const vels = geo.userData.velocities as Float32Array;
        const count = pos.length / 3;

        for (let i = 0; i < count; i++) {
          pos[i * 3] += vels[i * 3];
          pos[i * 3 + 1] += vels[i * 3 + 1];
          pos[i * 3 + 2] += vels[i * 3 + 2];

          // Respawn at SW boundary if traveled out of site
          if (pos[i * 3] > 1000 || pos[i * 3 + 2] < 0) {
            pos[i * 3] = Math.random() * 500;
            pos[i * 3 + 1] = 4 + Math.random() * 35;
            pos[i * 3 + 2] = 500 + Math.random() * 500;
          }
        }
        geo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [
    isWalkthroughPlaying,
    walkthroughTime,
    onWalkthroughTimeChange,
    updateCameraForWalkthrough,
  ]);

  // Sync walkthrough time when changed externally
  useEffect(() => {
    if (!isWalkthroughPlaying) {
      updateCameraForWalkthrough(walkthroughTime);
    }
  }, [walkthroughTime, isWalkthroughPlaying, updateCameraForWalkthrough]);

  // Preset Camera Views
  const applyCameraPreset = (preset: 'iso' | 'top' | 'pedestrian' | 'revit') => {
    setCameraPreset(preset);
    if (!cameraRef.current) return;

    if (preset === 'iso') {
      cameraSphericalRef.current = {
        radius: 1200,
        theta: Math.PI / 4,
        phi: Math.PI / 3,
        target: new THREE.Vector3(500, 20, 500),
      };
    } else if (preset === 'top') {
      cameraSphericalRef.current = {
        radius: 1350,
        theta: 0,
        phi: 0.05,
        target: new THREE.Vector3(500, 0, 500),
      };
    } else if (preset === 'pedestrian') {
      cameraSphericalRef.current = {
        radius: 350,
        theta: Math.PI * 0.85,
        phi: Math.PI / 2.3,
        target: new THREE.Vector3(500, 15, 650),
      };
    } else if (preset === 'revit') {
      cameraSphericalRef.current = {
        radius: 280,
        theta: Math.PI * 0.3,
        phi: Math.PI / 2.8,
        target: new THREE.Vector3(520, 60, 280),
      };
    }
    updateCameraFromSpherical();
  };

  // Mouse Interaction Handlers for Camera Orbit / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevMousePosRef.current.x;
    const dy = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    if (e.buttons === 1) {
      // Left click drag: Orbit
      cameraSphericalRef.current.theta -= dx * 0.005;
      cameraSphericalRef.current.phi -= dy * 0.005;
      updateCameraFromSpherical();
    } else if (e.buttons === 2 || e.shiftKey) {
      // Right click drag or Shift+drag: Pan
      const panSpeed = 0.8;
      cameraSphericalRef.current.target.x -= dx * panSpeed;
      cameraSphericalRef.current.target.z += dy * panSpeed;
      updateCameraFromSpherical();
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1 + e.deltaY * 0.001;
    cameraSphericalRef.current.radius = Math.max(150, Math.min(2200, cameraSphericalRef.current.radius * zoomFactor));
    updateCameraFromSpherical();
  };

  // Click on building to inspect
  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const meshes = Array.from(buildingMeshesRef.current.values());
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const bData = intersects[0].object.userData.building as BuildingData;
      if (bData) {
        onSelectBuilding(bData);
      }
    } else {
      onSelectBuilding(null);
    }
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Top Left HUD: Site Limits & Coordinate Callout */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold text-slate-100">Site Limits: 1,000,000 m² (1.00 km²)</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
            <span>{SITE_METADATA.coordinates}</span>
            <span>·</span>
            <span>Elev: {SITE_METADATA.elevationMeters}m</span>
          </div>
        </div>

        {/* Active Analysis Indicator */}
        {activeAnalysis && (
          <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-lg px-3 py-1.5 text-xs text-cyan-300 shadow-xl flex items-center gap-2 pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="capitalize">{activeAnalysis.replace('_', ' ')} Overlay Active</span>
          </div>
        )}
      </div>

      {/* Top Right: Camera Presets & Layer Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        {/* Camera Views */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-lg p-1 flex items-center gap-1 shadow-xl">
          <button
            onClick={() => applyCameraPreset('iso')}
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              cameraPreset === 'iso' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Isometric Orbit"
          >
            3D View
          </button>
          <button
            onClick={() => applyCameraPreset('top')}
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              cameraPreset === 'top' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Masterplan Ortho"
          >
            Top-Down
          </button>
          <button
            onClick={() => applyCameraPreset('pedestrian')}
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              cameraPreset === 'pedestrian' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Pedestrian Eye-Level"
          >
            Eye-Level
          </button>
          <button
            onClick={() => applyCameraPreset('revit')}
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              cameraPreset === 'revit' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Focus on Detailed Revit BIM Tower"
          >
            Revit Tower
          </button>
        </div>

        {/* Layer Toggles Popover */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-lg p-2 text-xs flex flex-col gap-1.5 shadow-xl text-slate-300 min-w-[160px]">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">BIM Layers</span>
          <label className="flex items-center justify-between cursor-pointer hover:text-slate-100">
            <span>Site Boundary</span>
            <input
              type="checkbox"
              checked={showBoundary}
              onChange={(e) => setShowBoundary(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer hover:text-slate-100">
            <span>Transportation</span>
            <input
              type="checkbox"
              checked={showRoads}
              onChange={(e) => setShowRoads(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer hover:text-slate-100">
            <span>Landscaping</span>
            <input
              type="checkbox"
              checked={showLandscape}
              onChange={(e) => setShowLandscape(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer hover:text-slate-100">
            <span>Buildings</span>
            <input
              type="checkbox"
              checked={showBuildings}
              onChange={(e) => setShowBuildings(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer hover:text-slate-100">
            <span>Terrain Heatmap</span>
            <input
              type="checkbox"
              checked={showHeatmapGround}
              onChange={(e) => setShowHeatmapGround(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
          </label>
        </div>
      </div>

      {/* Bottom Center: 30-Second Walkthrough Floating Control Bar */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/70 rounded-xl p-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleWalkthrough}
              className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center hover:bg-cyan-400 transition-colors shadow-md"
              title={isWalkthroughPlaying ? 'Pause Walkthrough' : 'Play 30s Walkthrough'}
            >
              {isWalkthroughPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
            </button>
            <button
              onClick={() => onWalkthroughTimeChange(0)}
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 transition-colors"
              title="Reset to 0s"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-100">30-Second Walkthrough Video Mode</span>
              <span className="text-[11px] text-cyan-400 font-mono tabular-nums">
                {walkthroughTime.toFixed(1)}s / 30.0s
              </span>
            </div>
          </div>

          {/* Current Waypoint Checkpoint Title */}
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-[11px] font-medium text-slate-300">
              {WALKTHROUGH_WAYPOINTS.find((w) => walkthroughTime >= w.timeSec && walkthroughTime < w.timeSec + 5)?.title || 'Civic Core & Renewable Canopy'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Official Checkpoint {Math.min(6, Math.floor(walkthroughTime / 5) + 1)} of 6</span>
          </div>
        </div>

        {/* Timeline Slider with Waypoint Tick Marks */}
        <div className="relative w-full flex items-center">
          <input
            type="range"
            min="0"
            max="30"
            step="0.1"
            value={walkthroughTime}
            onChange={(e) => onWalkthroughTimeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Waypoint Jump Buttons */}
        <div className="flex justify-between items-center mt-2 px-1 text-[10px] text-slate-400">
          {WALKTHROUGH_WAYPOINTS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => onWalkthroughTimeChange(wp.timeSec)}
              className={`hover:text-cyan-300 transition-colors ${
                Math.abs(walkthroughTime - wp.timeSec) < 2.5 ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              {wp.timeSec}s: {wp.focalArea.slice(0, 14)}...
            </button>
          ))}
        </div>
      </div>

      {/* Building Inspector Modal / Floating Card */}
      {selectedBuildingId && (
        <div className="absolute left-4 bottom-24 z-20 w-80 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl p-4 shadow-2xl text-slate-200">
          {(() => {
            const b = currentProposalData.buildings.find((item: BuildingData) => item.id === selectedBuildingId);
            if (!b) return null;
            return (
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">{b.type} Building</span>
                    <h4 className="text-sm font-bold text-white">{b.name}</h4>
                  </div>
                  {b.isRevitSelected && (
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-mono">
                      Revit Synced
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3 font-mono">
                  <div className="bg-slate-800/60 p-2 rounded">
                    <span className="text-slate-400 block text-[10px]">Height / Floors</span>
                    <span className="font-semibold text-slate-200">{(b.height ?? b.heightM ?? 0)}m ({b.floors} storeys)</span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded">
                    <span className="text-slate-400 block text-[10px]">Gross Floor Area</span>
                    <span className="font-semibold text-slate-200">{(b.gfa ?? b.gfaM2 ?? 0).toLocaleString()} m²</span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded">
                    <span className="text-slate-400 block text-[10px]">Embodied Carbon</span>
                    <span className={`font-semibold ${(b.embodiedCarbon ?? b.embodiedCarbonKgM2 ?? 400) < 320 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {b.embodiedCarbon ?? b.embodiedCarbonKgM2 ?? 400} kg CO₂e/m²
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded">
                    <span className="text-slate-400 block text-[10px]">Site Coordinates</span>
                    <span className="text-slate-300">X:{b.x}m Y:{b.y}m</span>
                  </div>
                </div>

                {b.isRevitSelected ? (
                  <div className="text-[11px] text-cyan-300/90 bg-cyan-950/40 border border-cyan-500/20 p-2 rounded">
                    Selected for detailed Revit BIM development. Features parametric double-skin louvers, CLT composite slabs, and 3 biophilic sky gardens.
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectBuilding(null)}
                    className="w-full py-1 text-center text-xs text-slate-400 hover:text-slate-200 bg-slate-800 rounded transition-colors"
                  >
                    Close Inspector
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
