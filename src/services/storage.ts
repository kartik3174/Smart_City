/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppMode, AuditLogEntry, EvidenceItem, ProjectData } from '../types';
import { DEMO_PROJECT_DATA } from '../data/demoData';
import { INITIAL_ACTUAL_PROJECT_DATA } from '../data/initialActualProjectData';

const ACTUAL_STORAGE_KEY = 'sih26114_actual_project_data_v2';
const DEMO_STORAGE_KEY = 'sih26114_demo_project_data_v2';
const MODE_STORAGE_KEY = 'sih26114_active_mode_v2';

export function getStoredAppMode(): AppMode {
  try {
    const stored = localStorage.getItem(MODE_STORAGE_KEY);
    if (stored === 'DEMO' || stored === 'ACTUAL') {
      return stored;
    }
  } catch (e) {
    console.error('Storage access error', e);
  }
  return 'ACTUAL'; // Default to Actual Project mode for honesty
}

export function saveAppMode(mode: AppMode): void {
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export function loadProjectData(mode: AppMode): ProjectData {
  const key = mode === 'DEMO' ? DEMO_STORAGE_KEY : ACTUAL_STORAGE_KEY;
  const fallback = mode === 'DEMO' ? DEMO_PROJECT_DATA : INITIAL_ACTUAL_PROJECT_DATA;

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as ProjectData;
      // Merge with required schema fields in case of version evolution
      return {
        ...fallback,
        ...parsed,
        site: { ...fallback.site, ...parsed.site },
        proposals: {
          proposalA: { ...fallback.proposals.proposalA, ...parsed.proposals?.proposalA },
          proposalB: { ...fallback.proposals.proposalB, ...parsed.proposals?.proposalB },
        },
      };
    }
  } catch (e) {
    console.error('Error loading project data from storage:', e);
  }

  return JSON.parse(JSON.stringify(fallback));
}

export function saveProjectData(mode: AppMode, data: ProjectData): void {
  const key = mode === 'DEMO' ? DEMO_STORAGE_KEY : ACTUAL_STORAGE_KEY;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving project data:', e);
  }
}

export function addAuditLog(
  currentData: ProjectData,
  log: Omit<AuditLogEntry, 'id' | 'timestamp'>
): ProjectData {
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
  const newEntry: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp,
    ...log,
  };

  const updatedData: ProjectData = {
    ...currentData,
    auditLogs: [newEntry, ...(currentData.auditLogs || [])],
  };

  return updatedData;
}

export function exportProjectToJson(data: ProjectData): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute(
    'download',
    `SIH26114_${data.projectId}_${new Date().toISOString().split('T')[0]}.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseProjectJson(jsonStr: string): ProjectData {
  const parsed = JSON.parse(jsonStr);
  if (!parsed || !parsed.site || !parsed.proposals || !parsed.analyses) {
    throw new Error('Invalid SIH26114 project data schema: missing mandatory fields (site, proposals, analyses).');
  }
  return parsed as ProjectData;
}

export function resetActualProjectData(): ProjectData {
  try {
    localStorage.removeItem(ACTUAL_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
  return JSON.parse(JSON.stringify(INITIAL_ACTUAL_PROJECT_DATA));
}
