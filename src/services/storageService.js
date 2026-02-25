/**
 * Storage Service
 * Handles localStorage operations for analysis history
 */

import { validateAnalysisEntry, createAnalysisEntry, recalculateFinalScore } from '../utils/schema';

const STORAGE_KEY = 'placement_readiness_history_v2';

/**
 * Get all analysis history from localStorage
 * Validates entries and filters out corrupted ones
 * @returns {Array} - Array of valid analysis entries
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    
    const validEntries = [];
    const corruptedCount = 0;
    
    parsed.forEach(entry => {
      const validation = validateAnalysisEntry(entry);
      if (validation.isValid && validation.normalized) {
        validEntries.push(validation.normalized);
      } else {
        corruptedCount++;
        console.warn('Corrupted history entry skipped:', validation.errors);
      }
    });
    
    // Store corrupted count for UI notification
    if (corruptedCount > 0) {
      localStorage.setItem(`${STORAGE_KEY}_corrupted`, corruptedCount.toString());
    }
    
    return validEntries;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

/**
 * Check if there were corrupted entries
 * @returns {boolean}
 */
export function hadCorruptedEntries() {
  const count = localStorage.getItem(`${STORAGE_KEY}_corrupted`);
  return count && parseInt(count) > 0;
}

/**
 * Clear corrupted entry flag
 */
export function clearCorruptedFlag() {
  localStorage.removeItem(`${STORAGE_KEY}_corrupted`);
}

/**
 * Save analysis entry to localStorage
 * Validates and normalizes before saving
 * @param {Object} analysis - Analysis result object
 * @returns {boolean} - Success status
 */
export function saveAnalysis(analysis) {
  try {
    // Validate and normalize the entry
    const validation = validateAnalysisEntry(analysis);
    let entryToSave;
    
    if (validation.isValid && validation.normalized) {
      entryToSave = validation.normalized;
    } else if (validation.normalized) {
      // Use normalized version even if validation had minor errors
      entryToSave = validation.normalized;
    } else {
      console.error('Cannot save invalid analysis:', validation.errors);
      return false;
    }
    
    const history = getHistory();
    
    // Add new entry at the beginning
    const updatedHistory = [entryToSave, ...history];
    
    // Keep only last 50 entries to prevent storage overflow
    if (updatedHistory.length > 50) {
      updatedHistory.pop();
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Get a specific analysis by ID
 * @param {string} id - Analysis ID
 * @returns {Object|null} - Analysis entry or null
 */
export function getAnalysisById(id) {
  try {
    const history = getHistory();
    return history.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

/**
 * Delete an analysis entry by ID
 * @param {string} id - Analysis ID
 * @returns {boolean} - Success status
 */
export function deleteAnalysis(id) {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    return false;
  }
}

/**
 * Clear all history
 * @returns {boolean} - Success status
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Get history count
 * @returns {number} - Number of saved analyses
 */
export function getHistoryCount() {
  return getHistory().length;
}

/**
 * Update an existing analysis entry
 * Validates and recalculates score if skillConfidenceMap changed
 * @param {string} id - Analysis ID
 * @param {Object} updates - Fields to update
 * @returns {boolean} - Success status
 */
export function updateAnalysis(id, updates) {
  try {
    const history = getHistory();
    const index = history.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }
    
    // Merge updates into existing entry
    let updatedEntry = {
      ...history[index],
      ...updates,
      id: history[index].id, // Preserve ID
      createdAt: history[index].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString() // Update timestamp
    };
    
    // Recalculate finalScore if skillConfidenceMap was updated
    if (updates.skillConfidenceMap) {
      updatedEntry = recalculateFinalScore(updatedEntry);
    }
    
    // Validate the updated entry
    const validation = validateAnalysisEntry(updatedEntry);
    if (!validation.normalized) {
      console.error('Updated entry is invalid:', validation.errors);
      return false;
    }
    
    history[index] = validation.normalized;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error updating localStorage:', error);
    return false;
  }
}
