/**
 * Readiness Score Calculator
 * Calculates readiness score based on JD analysis
 */

import { getCategoryCount } from './skillExtractor';

/**
 * Calculate readiness score
 * @param {Object} params - Parameters for scoring
 * @param {Object} params.extractedSkills - Skills extracted from JD
 * @param {string} params.company - Company name
 * @param {string} params.role - Job role
 * @param {string} params.jdText - Full JD text
 * @returns {number} - Readiness score (0-100)
 */
export function calculateReadinessScore({ extractedSkills, company, role, jdText }) {
  let score = 35; // Base score

  // +5 per detected category (max 30)
  const categoryCount = getCategoryCount(extractedSkills);
  const categoryBonus = Math.min(categoryCount * 5, 30);
  score += categoryBonus;

  // +10 if company name provided
  if (company && company.trim().length > 0) {
    score += 10;
  }

  // +10 if role provided
  if (role && role.trim().length > 0) {
    score += 10;
  }

  // +10 if JD length > 800 chars
  if (jdText && jdText.length > 800) {
    score += 10;
  }

  // Cap at 100
  return Math.min(score, 100);
}

/**
 * Get score breakdown for display
 * @param {Object} params - Parameters for scoring
 * @returns {Object} - Score breakdown
 */
export function getScoreBreakdown({ extractedSkills, company, role, jdText }) {
  const categoryCount = getCategoryCount(extractedSkills);
  
  return {
    baseScore: 35,
    categoryBonus: Math.min(categoryCount * 5, 30),
    categoryCount,
    companyBonus: (company && company.trim().length > 0) ? 10 : 0,
    roleBonus: (role && role.trim().length > 0) ? 10 : 0,
    jdLengthBonus: (jdText && jdText.length > 800) ? 10 : 0,
    total: calculateReadinessScore({ extractedSkills, company, role, jdText })
  };
}

/**
 * Get readiness level label
 * @param {number} score - Readiness score
 * @returns {string} - Level label
 */
export function getReadinessLevel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
}

/**
 * Get color for readiness score
 * @param {number} score - Readiness score
 * @returns {string} - Tailwind color class
 */
export function getReadinessColor(score) {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
}
