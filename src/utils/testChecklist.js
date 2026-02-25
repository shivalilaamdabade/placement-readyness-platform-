/**
 * Test Checklist Utility
 * Manages the shipping checklist with localStorage persistence
 */

const CHECKLIST_KEY = 'placement_readiness_test_checklist';

// Default test items
export const DEFAULT_TEST_ITEMS = [
  {
    id: 'jd-required',
    label: 'JD required validation works',
    hint: 'Try submitting an empty JD form. Should show required field warning.',
    checked: false
  },
  {
    id: 'short-jd-warning',
    label: 'Short JD warning shows for <200 chars',
    hint: 'Paste a JD with less than 200 characters. Should show amber warning.',
    checked: false
  },
  {
    id: 'skills-extraction',
    label: 'Skills extraction groups correctly',
    hint: 'Analyze a JD with React, SQL, AWS. Check skills appear in correct categories.',
    checked: false
  },
  {
    id: 'round-mapping',
    label: 'Round mapping changes based on company + skills',
    hint: 'Compare Amazon (Enterprise) vs Unknown Startup. Should show different round counts.',
    checked: false
  },
  {
    id: 'score-deterministic',
    label: 'Score calculation is deterministic',
    hint: 'Analyze same JD twice. Base score should be identical.',
    checked: false
  },
  {
    id: 'skill-toggles',
    label: 'Skill toggles update score live',
    hint: 'On results page, toggle "I know this". Final score should update immediately.',
    checked: false
  },
  {
    id: 'persist-refresh',
    label: 'Changes persist after refresh',
    hint: 'Toggle skills, refresh page. Toggles and score should remain.',
    checked: false
  },
  {
    id: 'history-save-load',
    label: 'History saves and loads correctly',
    hint: 'Create analysis, go to History, click to view. Should load correctly.',
    checked: false
  },
  {
    id: 'export-buttons',
    label: 'Export buttons copy the correct content',
    hint: 'Click "Copy 7-Day Plan". Paste in notepad to verify content.',
    checked: false
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on core pages',
    hint: 'Open DevTools (F12). Navigate through all pages. Check for red errors.',
    checked: false
  }
];

/**
 * Get current checklist from localStorage
 * @returns {Array} - Test items with checked status
 */
export function getChecklist() {
  try {
    const data = localStorage.getItem(CHECKLIST_KEY);
    if (!data) {
      return [...DEFAULT_TEST_ITEMS];
    }
    
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      return [...DEFAULT_TEST_ITEMS];
    }
    
    // Merge with defaults to ensure all items exist
    const merged = DEFAULT_TEST_ITEMS.map(defaultItem => {
      const saved = parsed.find(item => item.id === defaultItem.id);
      return saved ? { ...defaultItem, checked: saved.checked } : defaultItem;
    });
    
    return merged;
  } catch (error) {
    console.error('Error loading checklist:', error);
    return [...DEFAULT_TEST_ITEMS];
  }
}

/**
 * Save checklist to localStorage
 * @param {Array} checklist - Test items
 */
export function saveChecklist(checklist) {
  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist));
    return true;
  } catch (error) {
    console.error('Error saving checklist:', error);
    return false;
  }
}

/**
 * Toggle a test item
 * @param {string} id - Test item ID
 * @returns {Array} - Updated checklist
 */
export function toggleTestItem(id) {
  const checklist = getChecklist();
  const updated = checklist.map(item => 
    item.id === id ? { ...item, checked: !item.checked } : item
  );
  saveChecklist(updated);
  return updated;
}

/**
 * Reset checklist to default (all unchecked)
 */
export function resetChecklist() {
  const reset = DEFAULT_TEST_ITEMS.map(item => ({ ...item, checked: false }));
  saveChecklist(reset);
  return reset;
}

/**
 * Get count of passed tests
 * @returns {number}
 */
export function getPassedCount() {
  const checklist = getChecklist();
  return checklist.filter(item => item.checked).length;
}

/**
 * Get total test count
 * @returns {number}
 */
export function getTotalCount() {
  return DEFAULT_TEST_ITEMS.length;
}

/**
 * Check if all tests are passed
 * @returns {boolean}
 */
export function isChecklistComplete() {
  return getPassedCount() === getTotalCount();
}

/**
 * Get completion percentage
 * @returns {number}
 */
export function getCompletionPercentage() {
  return (getPassedCount() / getTotalCount()) * 100;
}
