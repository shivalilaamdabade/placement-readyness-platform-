/**
 * Storage Service
 * Handles localStorage operations for analysis history
 */

const STORAGE_KEY = 'placement_readiness_history';

/**
 * Get all analysis history from localStorage
 * @returns {Array} - Array of analysis entries
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

/**
 * Save analysis entry to localStorage
 * @param {Object} analysis - Analysis result object
 * @returns {boolean} - Success status
 */
export function saveAnalysis(analysis) {
  try {
    const history = getHistory();
    
    // Add new entry at the beginning
    const updatedHistory = [analysis, ...history];
    
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
