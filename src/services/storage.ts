/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppMode, AuditLogEntry, ProjectData } from '../types';
import { DEMO_PROJECT_DATA } from '../data/demo/demoData';
import { INITIAL_ACTUAL_PROJECT_DATA } from '../data/project/projectData';

const ACTUAL_STORAGE_KEY = 'sih26114_actual_project_data_v3';
const DEMO_STORAGE_KEY = 'sih26114_demo_project_data_v3';
const MODE_STORAGE_KEY = 'sih26114_active_mode_v3';

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

/**
 * Loads project data strictly without mixing demo and actual data.
 * In Actual Project mode, if data is not stored or unevidenced, it strictly uses the clean template.
 * Never uses demo data as fallback for missing actual project data!
 */
export function loadProjectData(mode: AppMode): ProjectData {
  const key = mode === 'DEMO' ? DEMO_STORAGE_KEY : ACTUAL_STORAGE_KEY;
  const initialData = mode === 'DEMO' ? DEMO_PROJECT_DATA : INITIAL_ACTUAL_PROJECT_DATA;

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as ProjectData;
      return {
        ...initialData,
        ...parsed,
        site: { ...initialData.site, ...parsed.site },
        proposals: {
          proposalA: { ...initialData.proposals.proposalA, ...parsed.proposals?.proposalA },
          proposalB: { ...initialData.proposals.proposalB, ...parsed.proposals?.proposalB },
        },
        formaBoardTracking: {
          ...initialData.formaBoardTracking,
          ...(parsed.formaBoardTracking || {}),
        },
      };
    }
  } catch (e) {
    console.error('Error loading project data from storage:', e);
  }

  return JSON.parse(JSON.stringify(initialData));
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

/**
 * Validates imported JSON data before accepting it (Requirement 35)
 */
export function validateAndParseProjectJson(jsonStr: string): {
  success: boolean;
  data?: ProjectData;
  errors: string[];
} {
  const errors: string[] = [];

  try {
    const parsed = JSON.parse(jsonStr) as Partial<ProjectData>;
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, errors: ['Invalid JSON format: root is not an object.'] };
    }

    if (!parsed.projectId) errors.push('Missing "projectId" field.');
    if (!parsed.site) errors.push('Missing "site" metadata field.');
    else {
      if (typeof parsed.site.siteAreaM2 !== 'number') {
        errors.push('Missing or invalid site.siteAreaM2 number.');
      }
    }

    if (!parsed.proposals?.proposalA || !parsed.proposals?.proposalB) {
      errors.push('Missing "proposals.proposalA" or "proposals.proposalB".');
    }

    if (!Array.isArray(parsed.analyses)) {
      errors.push('Missing "analyses" array.');
    }

    if (!Array.isArray(parsed.revitWorkflow)) {
      errors.push('Missing "revitWorkflow" array.');
    }

    if (!Array.isArray(parsed.deliverables)) {
      errors.push('Missing "deliverables" array.');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, data: parsed as ProjectData, errors: [] };
  } catch (err: any) {
    return { success: false, errors: [`JSON parse failure: ${err.message || String(err)}`] };
  }
}

export function parseProjectJson(jsonStr: string): ProjectData {
  const result = validateAndParseProjectJson(jsonStr);
  if (!result.success || !result.data) {
    throw new Error(result.errors.join('; '));
  }
  return result.data;
}

export function resetActualProjectData(): ProjectData {
  try {
    localStorage.removeItem(ACTUAL_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
  return JSON.parse(JSON.stringify(INITIAL_ACTUAL_PROJECT_DATA));
}
