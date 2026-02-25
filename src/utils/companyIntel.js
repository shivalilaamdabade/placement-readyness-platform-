/**
 * Company Intel Utility
 * Generates heuristic-based company intelligence and round mapping
 */

// Known enterprise companies
const ENTERPRISE_COMPANIES = [
  'amazon', 'microsoft', 'google', 'apple', 'meta', 'facebook', 'netflix',
  'infosys', 'tcs', 'wipro', 'cognizant', 'accenture', 'ibm', 'oracle',
  'sap', 'salesforce', 'adobe', 'intel', 'amd', 'nvidia', 'cisco',
  'dell', 'hp', 'hpe', 'vmware', 'broadcom', 'qualcomm', 'texas instruments',
  'capgemini', 'hcl', 'tech mahindra', 'lti', 'mindtree', 'mphasis',
  'deloitte', 'ey', 'kpmg', 'pwc', 'jpmorgan', 'goldman sachs', 'morgan stanley',
  'bank of america', 'wells fargo', 'citigroup', 'barclays', 'deutsche bank',
  'walmart', 'target', 'costco', 'home depot', 'lowes', 'best buy',
  'at&t', 'verizon', 'comcast', 'charter', 't-mobile', 'sprint',
  'exxon', 'chevron', 'shell', 'bp', 'total',
  'pfizer', 'johnson', 'merck', 'abbott', 'eli lilly',
  'general electric', 'boeing', 'lockheed', 'raytheon', 'northrop',
  'ford', 'gm', 'toyota', 'honda', 'bmw', 'mercedes', 'volkswagen'
];

// Industry keywords for inference
const INDUSTRY_KEYWORDS = {
  'Technology Services': ['software', 'it services', 'consulting', 'solutions', 'digital', 'tech'],
  'E-commerce': ['e-commerce', 'retail', 'shopping', 'marketplace', 'online store'],
  'Finance': ['bank', 'finance', 'fintech', 'investment', 'trading', 'insurance'],
  'Healthcare': ['health', 'medical', 'pharma', 'biotech', 'clinical'],
  'Automotive': ['automotive', 'car', 'vehicle', 'transportation', 'mobility'],
  'Energy': ['energy', 'oil', 'gas', 'renewable', 'solar', 'power'],
  'Telecommunications': ['telecom', 'wireless', 'network', 'broadband', '5g'],
  'Manufacturing': ['manufacturing', 'industrial', 'automation', 'production']
};

/**
 * Detect company size category based on company name
 * @param {string} companyName - Company name
 * @returns {string} - 'Startup' | 'Mid-size' | 'Enterprise'
 */
export function detectCompanySize(companyName) {
  if (!companyName || typeof companyName !== 'string') {
    return 'Startup';
  }

  const normalizedName = companyName.toLowerCase().trim();
  
  // Check against known enterprise list
  const isEnterprise = ENTERPRISE_COMPANIES.some(company => 
    normalizedName.includes(company) || company.includes(normalizedName)
  );
  
  if (isEnterprise) {
    return 'Enterprise';
  }
  
  // Default to Startup for unknown companies
  return 'Startup';
}

/**
 * Infer industry based on company name and JD text
 * @param {string} companyName - Company name
 * @param {string} jdText - Job description text
 * @returns {string} - Industry name
 */
export function inferIndustry(companyName, jdText = '') {
  const textToAnalyze = `${companyName} ${jdText}`.toLowerCase();
  
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some(keyword => textToAnalyze.includes(keyword))) {
      return industry;
    }
  }
  
  return 'Technology Services';
}

/**
 * Get typical hiring focus based on company size
 * @param {string} companySize - Company size category
 * @returns {Object} - Hiring focus details
 */
export function getHiringFocus(companySize) {
  const focusMap = {
    'Enterprise': {
      title: 'Structured & Fundamentals-Focused',
      description: 'Emphasis on DSA, core CS fundamentals, and standardized interview processes.',
      keyAreas: [
        'Data Structures & Algorithms',
        'System Design (for senior roles)',
        'Core CS: OS, DBMS, Networks',
        'Standardized coding assessments',
        'Behavioral & cultural fit'
      ]
    },
    'Mid-size': {
      title: 'Balanced Technical & Practical',
      description: 'Mix of DSA fundamentals and practical problem-solving.',
      keyAreas: [
        'DSA with practical applications',
        'Framework/stack expertise',
        'Project-based discussions',
        'Problem-solving approach',
        'Team collaboration skills'
      ]
    },
    'Startup': {
      title: 'Practical & Impact-Focused',
      description: 'Focus on immediate contribution, stack depth, and adaptability.',
      keyAreas: [
        'Practical coding & debugging',
        'Deep stack knowledge',
        'End-to-end ownership mindset',
        'Rapid learning ability',
        'Cultural fit & adaptability'
      ]
    }
  };
  
  return focusMap[companySize] || focusMap['Startup'];
}

/**
 * Generate round mapping based on company size and detected skills
 * @param {string} companySize - Company size category
 * @param {Object} extractedSkills - Skills extracted from JD
 * @returns {Array} - Round mapping with details
 */
export function generateRoundMapping(companySize, extractedSkills) {
  const hasDSA = hasSkill(extractedSkills, 'DSA') || 
                 hasSkill(extractedSkills, 'Data Structures') ||
                 hasSkill(extractedSkills, 'Algorithms');
  const hasWeb = hasSkill(extractedSkills, 'React') || 
                 hasSkill(extractedSkills, 'Node.js') ||
                 hasSkill(extractedSkills, 'Angular');
  const hasSystemDesign = hasSkill(extractedSkills, 'System Design') ||
                          hasSkill(extractedSkills, 'AWS') ||
                          hasSkill(extractedSkills, 'Docker');

  // Enterprise round mapping
  if (companySize === 'Enterprise') {
    const rounds = [
      {
        round: 1,
        name: 'Online Assessment',
        focus: 'DSA + Aptitude',
        description: 'Timed coding problems and logical reasoning',
        whyItMatters: 'Filters candidates based on fundamental problem-solving speed and accuracy.',
        skillsTested: ['DSA', 'Aptitude', 'Time Management']
      },
      {
        round: 2,
        name: 'Technical Interview I',
        focus: hasDSA ? 'DSA Deep Dive' : 'Core Fundamentals',
        description: hasDSA ? 'Complex algorithmic problems' : 'Core CS concepts and basic coding',
        whyItMatters: 'Evaluates depth of technical knowledge and problem-solving approach.',
        skillsTested: hasDSA ? ['DSA', 'Problem Solving'] : ['Core CS', 'Coding']
      },
      {
        round: 3,
        name: 'Technical Interview II',
        focus: hasSystemDesign ? 'System Design + Projects' : 'Projects + Core CS',
        description: 'Discussion of past projects and system design scenarios',
        whyItMatters: 'Assesses practical experience and ability to design scalable solutions.',
        skillsTested: hasSystemDesign ? ['System Design', 'Architecture'] : ['Projects', 'Core CS']
      },
      {
        round: 4,
        name: 'Managerial/HR Round',
        focus: 'Behavioral + Culture Fit',
        description: 'Leadership principles, behavioral questions, and compensation discussion',
        whyItMatters: 'Determines cultural alignment and long-term potential within the organization.',
        skillsTested: ['Communication', 'Leadership', 'Culture Fit']
      }
    ];
    return rounds;
  }
  
  // Startup round mapping
  if (companySize === 'Startup') {
    const rounds = [
      {
        round: 1,
        name: 'Practical Coding',
        focus: hasWeb ? 'Stack-specific Tasks' : 'Problem Solving',
        description: hasWeb ? 'Build a small feature or debug existing code' : 'Solve practical problems',
        whyItMatters: 'Tests immediate contribution ability and hands-on coding skills.',
        skillsTested: hasWeb ? ['React/Node.js', 'Debugging'] : ['Problem Solving', 'Coding']
      },
      {
        round: 2,
        name: 'System/Architecture Discussion',
        focus: hasSystemDesign ? 'System Design' : 'Technical Deep Dive',
        description: 'Discuss architecture decisions or deep dive into your stack',
        whyItMatters: 'Evaluates understanding of trade-offs and technical decision-making.',
        skillsTested: ['Architecture', 'Trade-off Analysis']
      },
      {
        round: 3,
        name: 'Culture & Fit',
        focus: 'Values Alignment + Growth Mindset',
        description: 'Discussion with founders/team about values and vision',
        whyItMatters: 'Startups need people who align with mission and can wear multiple hats.',
        skillsTested: ['Adaptability', 'Ownership', 'Culture Fit']
      }
    ];
    return rounds;
  }
  
  // Mid-size (default)
  return [
    {
      round: 1,
      name: 'Technical Screening',
      focus: 'DSA + Basic Coding',
      description: 'Online or live coding assessment',
      whyItMatters: 'Basic filter for technical competence.',
      skillsTested: ['DSA', 'Coding']
    },
    {
      round: 2,
      name: 'Technical Interview',
      focus: 'Projects + Problem Solving',
      description: 'Deep dive into projects and technical challenges',
      whyItMatters: 'Balances theoretical knowledge with practical experience.',
      skillsTested: ['Projects', 'Problem Solving']
    },
    {
      round: 3,
      name: 'Final Round',
      focus: 'System Design + HR',
      description: 'Architecture discussion and behavioral questions',
      whyItMatters: 'Final assessment of technical and cultural fit.',
      skillsTested: ['System Design', 'Communication']
    }
  ];
}

/**
 * Helper function to check if skill exists
 */
function hasSkill(extractedSkills, skill) {
  if (!extractedSkills) return false;
  
  const allSkills = [];
  Object.values(extractedSkills).forEach(category => {
    if (category.skills) {
      allSkills.push(...category.skills);
    }
  });
  
  return allSkills.some(s => 
    s.toLowerCase() === skill.toLowerCase() ||
    s.toLowerCase().includes(skill.toLowerCase())
  );
}

/**
 * Generate complete company intel
 * @param {string} companyName - Company name
 * @param {string} jdText - Job description text
 * @param {Object} extractedSkills - Extracted skills
 * @returns {Object} - Complete company intel
 */
export function generateCompanyIntel(companyName, jdText, extractedSkills) {
  const size = detectCompanySize(companyName);
  const industry = inferIndustry(companyName, jdText);
  const hiringFocus = getHiringFocus(size);
  const roundMapping = generateRoundMapping(size, extractedSkills);
  
  return {
    name: companyName || 'Unknown Company',
    size,
    industry,
    hiringFocus,
    roundMapping,
    isDemo: true
  };
}
