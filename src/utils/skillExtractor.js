/**
 * Skill Extractor Utility
 * Extracts skills from Job Description text using keyword matching
 */

const SKILL_CATEGORIES = {
  coreCS: {
    name: 'Core CS',
    keywords: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks', 'Data Structures', 'Algorithms', 'Operating Systems', 'Database Management']
  },
  languages: {
    name: 'Languages',
    keywords: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Golang', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin']
  },
  web: {
    name: 'Web Development',
    keywords: ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL', 'Angular', 'Vue', 'HTML', 'CSS', 'Bootstrap', 'Tailwind', 'Webpack', 'Vite']
  },
  data: {
    name: 'Data & Databases',
    keywords: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'DynamoDB', 'Cassandra', 'Firebase', 'Prisma', 'Sequelize']
  },
  cloud: {
    name: 'Cloud & DevOps',
    keywords: ['AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform', 'Ansible', 'Linux', 'Ubuntu', 'CentOS']
  },
  testing: {
    name: 'Testing',
    keywords: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest', 'Jest', 'Mocha', 'Chai', 'Testing Library', 'Postman', 'JMeter']
  }
};

/**
 * Extract skills from JD text
 * @param {string} jdText - Job description text
 * @returns {Object} - Extracted skills grouped by category
 */
export function extractSkills(jdText) {
  if (!jdText || typeof jdText !== 'string') {
    return { general: ['General fresher stack'] };
  }

  const normalizedText = jdText.toLowerCase();
  const extractedSkills = {};
  let hasAnySkill = false;

  Object.entries(SKILL_CATEGORIES).forEach(([categoryKey, category]) => {
    const foundSkills = [];
    
    category.keywords.forEach(keyword => {
      // Escape special regex characters in keyword
      const escapedKeyword = keyword.toLowerCase()
        .replace(/[.+*?^${}()|[\]\\]/g, '\\$&');
      
      // Match whole words
      const pattern = `\\b${escapedKeyword}\\b`;
      
      const isMatch = (() => {
        try {
          const regex = new RegExp(pattern, 'i');
          return regex.test(normalizedText);
        } catch (e) {
          console.error('Regex error for keyword:', keyword, e);
          // Fallback: simple includes check
          return normalizedText.includes(keyword.toLowerCase());
        }
      })();
      
      if (isMatch && !foundSkills.includes(keyword)) {
        foundSkills.push(keyword);
      }
    });

    if (foundSkills.length > 0) {
      extractedSkills[categoryKey] = {
        name: category.name,
        skills: foundSkills
      };
      hasAnySkill = true;
    }
  });

  // If no skills detected, return default skills in 'other' category
  if (!hasAnySkill) {
    return {
      other: ['Communication', 'Problem solving', 'Basic coding', 'Projects']
    };
  }

  return extractedSkills;
}

/**
 * Get all detected skills as flat array
 * @param {Object} extractedSkills - Output from extractSkills
 * @returns {Array} - Flat array of all skills
 */
export function getAllSkills(extractedSkills) {
  const allSkills = [];
  
  if (extractedSkills.other && extractedSkills.other.length > 0) {
    return extractedSkills.other;
  }
  
  Object.values(extractedSkills).forEach(category => {
    allSkills.push(...category.skills);
  });
  
  return allSkills;
}

/**
 * Get count of categories detected
 * @param {Object} extractedSkills - Output from extractSkills
 * @returns {number} - Number of categories
 */
export function getCategoryCount(extractedSkills) {
  if (extractedSkills.general) return 0;
  return Object.keys(extractedSkills).length;
}

/**
 * Check if specific skill is present
 * @param {Object} extractedSkills - Output from extractSkills
 * @param {string} skill - Skill to check
 * @returns {boolean}
 */
export function hasSkill(extractedSkills, skill) {
  const allSkills = getAllSkills(extractedSkills);
  return allSkills.some(s => s.toLowerCase() === skill.toLowerCase());
}
