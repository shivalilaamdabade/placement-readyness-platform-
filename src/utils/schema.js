/**
 * Analysis Entry Schema & Validation
 * Ensures consistent data structure across the application
 */

// Default empty skill categories
export const DEFAULT_SKILL_CATEGORIES = {
  coreCS: [],
  languages: [],
  web: [],
  data: [],
  cloud: [],
  testing: [],
  other: []
};

// Default skills when no skills detected
export const DEFAULT_SKILLS = ['Communication', 'Problem solving', 'Basic coding', 'Projects'];

// Schema definition for validation
export const ANALYSIS_SCHEMA = {
  required: ['id', 'createdAt', 'jdText', 'extractedSkills', 'baseScore'],
  fields: {
    id: 'string',
    createdAt: 'string',
    updatedAt: 'string',
    company: 'string',
    role: 'string',
    jdText: 'string',
    extractedSkills: 'object',
    roundMapping: 'array',
    checklist: 'array',
    plan7Days: 'array',
    questions: 'array',
    baseScore: 'number',
    skillConfidenceMap: 'object',
    finalScore: 'number'
  }
};

/**
 * Validate and normalize skill categories
 * @param {Object} extractedSkills - Raw extracted skills
 * @returns {Object} - Normalized skill categories
 */
export function normalizeSkillCategories(extractedSkills) {
  const normalized = { ...DEFAULT_SKILL_CATEGORIES };
  
  if (!extractedSkills || typeof extractedSkills !== 'object') {
    normalized.other = [...DEFAULT_SKILLS];
    return normalized;
  }
  
  // Map old category names to new schema
  const categoryMap = {
    'coreCS': 'coreCS',
    'coreCs': 'coreCS',
    'languages': 'languages',
    'web': 'web',
    'webDevelopment': 'web',
    'data': 'data',
    'dataDatabases': 'data',
    'cloud': 'cloud',
    'cloudDevOps': 'cloud',
    'testing': 'testing',
    'other': 'other',
    'general': 'other'
  };
  
  Object.entries(extractedSkills).forEach(([key, value]) => {
    const normalizedKey = categoryMap[key] || 'other';
    
    if (Array.isArray(value)) {
      normalized[normalizedKey] = [...value];
    } else if (value && Array.isArray(value.skills)) {
      normalized[normalizedKey] = [...value.skills];
    }
  });
  
  // Check if any skills were found
  const hasSkills = Object.values(normalized).some(arr => arr.length > 0);
  
  if (!hasSkills) {
    normalized.other = [...DEFAULT_SKILLS];
  }
  
  return normalized;
}

/**
 * Get all skills as flat array from normalized categories
 * @param {Object} normalizedSkills - Normalized skill categories
 * @returns {Array} - Flat array of all skills
 */
export function getAllSkillsFromCategories(normalizedSkills) {
  if (!normalizedSkills || typeof normalizedSkills !== 'object') {
    return [...DEFAULT_SKILLS];
  }
  
  const allSkills = [];
  Object.values(normalizedSkills).forEach(skills => {
    if (Array.isArray(skills)) {
      allSkills.push(...skills);
    }
  });
  
  return allSkills.length > 0 ? allSkills : [...DEFAULT_SKILLS];
}

/**
 * Normalize round mapping to standard schema
 * @param {Array} roundMapping - Raw round mapping
 * @returns {Array} - Normalized round mapping
 */
export function normalizeRoundMapping(roundMapping) {
  if (!Array.isArray(roundMapping) || roundMapping.length === 0) {
    return [{
      roundTitle: 'Technical Interview',
      focusAreas: ['Problem solving', 'Coding'],
      whyItMatters: 'Core assessment of technical abilities.'
    }];
  }
  
  return roundMapping.map(round => ({
    roundTitle: round.name || round.roundTitle || `Round ${round.round || 1}`,
    focusAreas: round.skillsTested || round.focusAreas || [],
    whyItMatters: round.whyItMatters || 'Assessment of candidate fit.'
  }));
}

/**
 * Normalize checklist to standard schema
 * @param {Array} checklist - Raw checklist
 * @returns {Array} - Normalized checklist
 */
export function normalizeChecklist(checklist) {
  if (!Array.isArray(checklist) || checklist.length === 0) {
    return [{
      roundTitle: 'General Preparation',
      items: ['Review basics', 'Practice coding', 'Prepare projects']
    }];
  }
  
  return checklist.map(round => ({
    roundTitle: round.round || round.roundTitle || 'Preparation',
    items: Array.isArray(round.items) ? round.items : []
  }));
}

/**
 * Normalize 7-day plan to standard schema
 * @param {Array} plan - Raw plan
 * @returns {Array} - Normalized plan
 */
export function normalizePlan7Days(plan) {
  if (!Array.isArray(plan) || plan.length === 0) {
    return Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      focus: 'General preparation',
      tasks: ['Study', 'Practice', 'Review']
    }));
  }
  
  return plan.map((day, index) => ({
    day: day.day || `Day ${index + 1}`,
    focus: day.focus || 'Preparation',
    tasks: Array.isArray(day.tasks) ? day.tasks : []
  }));
}

/**
 * Create a new analysis entry with full schema
 * @param {Object} data - Input data
 * @returns {Object} - Complete analysis entry
 */
export function createAnalysisEntry(data) {
  const now = new Date().toISOString();
  const normalizedSkills = normalizeSkillCategories(data.extractedSkills);
  const allSkills = getAllSkillsFromCategories(normalizedSkills);
  
  // Initialize skill confidence map
  const skillConfidenceMap = {};
  allSkills.forEach(skill => {
    skillConfidenceMap[skill] = 'practice';
  });
  
  return {
    id: data.id || Date.now().toString(),
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    company: data.company || '',
    role: data.role || '',
    jdText: data.jdText || '',
    extractedSkills: normalizedSkills,
    roundMapping: normalizeRoundMapping(data.roundMapping || data.companyIntel?.roundMapping),
    checklist: normalizeChecklist(data.checklist),
    plan7Days: normalizePlan7Days(data.plan || data.plan7Days),
    questions: Array.isArray(data.questions) ? data.questions : [],
    baseScore: typeof data.baseScore === 'number' ? data.baseScore : (data.readinessScore || 0),
    skillConfidenceMap: data.skillConfidenceMap || skillConfidenceMap,
    finalScore: typeof data.finalScore === 'number' ? data.finalScore : (data.baseScore || data.readinessScore || 0)
  };
}

/**
 * Validate an analysis entry
 * @param {Object} entry - Entry to validate
 * @returns {Object} - { isValid: boolean, errors: string[], normalized: Object }
 */
export function validateAnalysisEntry(entry) {
  const errors = [];
  
  if (!entry || typeof entry !== 'object') {
    return { isValid: false, errors: ['Entry is not an object'], normalized: null };
  }
  
  // Check required fields
  ANALYSIS_SCHEMA.required.forEach(field => {
    if (!(field in entry) || entry[field] === undefined || entry[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Check types
  Object.entries(ANALYSIS_SCHEMA.fields).forEach(([field, type]) => {
    if (field in entry) {
      const actualType = Array.isArray(entry[field]) ? 'array' : typeof entry[field];
      if (actualType !== type && !(type === 'array' && actualType === 'object')) {
        errors.push(`Field ${field} should be ${type}, got ${actualType}`);
      }
    }
  });
  
  // Normalize if has critical fields
  let normalized = null;
  if (entry.id && entry.jdText !== undefined) {
    normalized = createAnalysisEntry(entry);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    normalized
  };
}

/**
 * Update final score based on skill confidence
 * @param {Object} entry - Analysis entry
 * @returns {Object} - Updated entry with new finalScore
 */
export function recalculateFinalScore(entry) {
  if (!entry || !entry.skillConfidenceMap) return entry;
  
  const baseScore = entry.baseScore || 0;
  let adjustment = 0;
  
  Object.entries(entry.skillConfidenceMap).forEach(([skill, confidence]) => {
    if (confidence === 'know') {
      adjustment += 2;
    } else if (confidence === 'practice') {
      adjustment -= 2;
    }
  });
  
  const finalScore = Math.max(0, Math.min(100, baseScore + adjustment));
  
  return {
    ...entry,
    finalScore,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Toggle skill confidence and recalculate score
 * @param {Object} entry - Analysis entry
 * @param {string} skill - Skill to toggle
 * @returns {Object} - Updated entry
 */
export function toggleSkillConfidence(entry, skill) {
  if (!entry || !entry.skillConfidenceMap || !(skill in entry.skillConfidenceMap)) {
    return entry;
  }
  
  const newConfidence = entry.skillConfidenceMap[skill] === 'know' ? 'practice' : 'know';
  
  const updatedEntry = {
    ...entry,
    skillConfidenceMap: {
      ...entry.skillConfidenceMap,
      [skill]: newConfidence
    }
  };
  
  return recalculateFinalScore(updatedEntry);
}
