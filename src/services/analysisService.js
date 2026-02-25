/**
 * Analysis Service
 * Generates outputs from detected skills
 */

import { extractSkills, hasSkill } from '../utils/skillExtractor';
import { calculateReadinessScore } from '../utils/readinessScore';
import { generateCompanyIntel } from '../utils/companyIntel';
import { createAnalysisEntry, normalizeSkillCategories, getAllSkillsFromCategories } from '../utils/schema';

/**
 * Generate checklist based on detected skills
 * @param {Object} extractedSkills - Extracted skills
 * @returns {Array} - Round-wise checklist
 */
function generateChecklist(extractedSkills) {
  const allSkills = getAllSkills(extractedSkills);
  const isGeneral = extractedSkills.general !== undefined;
  
  const checklist = [
    {
      round: 'Round 1: Aptitude / Basics',
      items: [
        'Practice quantitative aptitude (percentage, profit/loss, ratios)',
        'Review logical reasoning and pattern recognition',
        'Solve 10+ verbal ability questions',
        'Brush up on basic mathematics',
        'Take a timed mock aptitude test'
      ]
    },
    {
      round: 'Round 2: DSA + Core CS',
      items: [
        'Review arrays, strings, and basic data structures',
        'Practice 5+ problems on searching and sorting',
        'Study time and space complexity analysis',
        'Revise OOP concepts: inheritance, polymorphism, encapsulation',
        'Understand DBMS basics: normalization, joins, indexing',
        'Review OS concepts: processes, threads, memory management',
        'Solve 3+ medium difficulty coding problems'
      ]
    },
    {
      round: 'Round 3: Technical Interview',
      items: [
        'Prepare project explanation (problem, solution, impact)',
        'Review your strongest programming language in depth',
        'Study system design basics: scalability, load balancing',
        'Practice explaining your code clearly',
        'Prepare answers for "Tell me about yourself"',
        'Review company-specific technologies if any'
      ]
    },
    {
      round: 'Round 4: Managerial / HR',
      items: [
        'Prepare STAR format answers for behavioral questions',
        'Research company culture and values',
        'Practice "Why this company?" response',
        'Prepare questions to ask the interviewer',
        'Review your resume thoroughly',
        'Practice salary negotiation basics'
      ]
    }
  ];

  // Adapt checklist based on detected skills
  if (hasSkill(extractedSkills, 'React') || hasSkill(extractedSkills, 'Angular') || hasSkill(extractedSkills, 'Vue')) {
    checklist[2].items.push('Review frontend framework concepts and lifecycle methods');
    checklist[2].items.push('Practice explaining virtual DOM and state management');
  }

  if (hasSkill(extractedSkills, 'SQL') || hasSkill(extractedSkills, 'MySQL') || hasSkill(extractedSkills, 'PostgreSQL')) {
    checklist[1].items.push('Practice SQL queries: joins, subqueries, aggregations');
    checklist[2].items.push('Prepare to explain database design decisions');
  }

  if (hasSkill(extractedSkills, 'AWS') || hasSkill(extractedSkills, 'Azure') || hasSkill(extractedSkills, 'GCP')) {
    checklist[2].items.push('Review cloud services: EC2, S3, Lambda basics');
    checklist[2].items.push('Understand cloud deployment and CI/CD pipelines');
  }

  if (hasSkill(extractedSkills, 'Docker') || hasSkill(extractedSkills, 'Kubernetes')) {
    checklist[2].items.push('Explain containerization benefits and Docker basics');
    checklist[2].items.push('Understand Kubernetes orchestration concepts');
  }

  return checklist;
}

/**
 * Generate 7-day preparation plan
 * @param {Object} extractedSkills - Extracted skills
 * @returns {Array} - 7-day plan
 */
function generateSevenDayPlan(extractedSkills) {
  const allSkills = getAllSkills(extractedSkills);
  const plan = [
    {
      day: 'Day 1',
      focus: 'Basics + Core CS',
      tasks: [
        'Review data structures: arrays, linked lists, stacks, queues',
        'Study OOP principles with examples',
        'Practice 3 easy coding problems'
      ]
    },
    {
      day: 'Day 2',
      focus: 'Core CS Continued',
      tasks: [
        'Review DBMS: normalization, SQL basics, joins',
        'Study OS: processes, threads, scheduling',
        'Practice 2 medium coding problems'
      ]
    },
    {
      day: 'Day 3',
      focus: 'DSA + Coding Practice',
      tasks: [
        'Focus on searching and sorting algorithms',
        'Practice binary search variations',
        'Solve 5 mixed difficulty problems'
      ]
    },
    {
      day: 'Day 4',
      focus: 'Advanced DSA',
      tasks: [
        'Study trees, graphs, and dynamic programming basics',
        'Practice recursion and backtracking',
        'Solve 4 medium-hard problems'
      ]
    },
    {
      day: 'Day 5',
      focus: 'Project + Resume Alignment',
      tasks: [
        'Document project details: tech stack, challenges, outcomes',
        'Align resume with JD keywords',
        'Prepare project demo/explanation'
      ]
    },
    {
      day: 'Day 6',
      focus: 'Mock Interview Questions',
      tasks: [
        'Practice technical questions from generated list',
        'Do a mock coding interview with timer',
        'Practice behavioral questions using STAR method'
      ]
    },
    {
      day: 'Day 7',
      focus: 'Revision + Weak Areas',
      tasks: [
        'Review all notes and key concepts',
        'Focus on identified weak areas',
        'Light practice: 2-3 problems for confidence',
        'Rest and prepare mentally for interview'
      ]
    }
  ];

  // Adapt plan based on detected skills
  if (hasSkill(extractedSkills, 'React')) {
    plan[4].tasks.push('Review React hooks, context API, and state management');
    plan[4].tasks.push('Practice explaining component lifecycle and optimization');
  }

  if (hasSkill(extractedSkills, 'Node.js') || hasSkill(extractedSkills, 'Express')) {
    plan[4].tasks.push('Review backend architecture and API design principles');
    plan[4].tasks.push('Practice explaining middleware and authentication');
  }

  if (hasSkill(extractedSkills, 'SQL')) {
    plan[1].tasks.push('Practice complex SQL queries and optimization');
    plan[5].tasks.push('Prepare to explain indexing and query optimization');
  }

  if (hasSkill(extractedSkills, 'AWS') || hasSkill(extractedSkills, 'Docker')) {
    plan[4].tasks.push('Review cloud deployment and DevOps concepts');
    plan[5].tasks.push('Practice explaining system architecture diagrams');
  }

  return plan;
}

/**
 * Generate interview questions based on detected skills
 * @param {Object} extractedSkills - Extracted skills
 * @returns {Array} - Interview questions
 */
function generateQuestions(extractedSkills) {
  const questions = [];
  const allSkills = getAllSkills(extractedSkills);

  // Core CS questions (always included)
  questions.push(
    'Explain the difference between stack and heap memory.',
    'What is time complexity? Analyze the complexity of binary search.',
    'Explain inheritance and polymorphism with examples.'
  );

  // Skill-specific questions
  if (hasSkill(extractedSkills, 'SQL') || hasSkill(extractedSkills, 'MySQL') || hasSkill(extractedSkills, 'PostgreSQL')) {
    questions.push(
      'Explain indexing in databases and when it helps vs hurts performance.',
      'What are the different types of joins in SQL? Give examples.',
      'Explain normalization and denormalization with use cases.'
    );
  }

  if (hasSkill(extractedSkills, 'React')) {
    questions.push(
      'Explain state management options in React and when to use each.',
      'What is the virtual DOM and how does React use it?',
      'Explain React hooks and custom hooks with examples.',
      'How would you optimize a React application for performance?'
    );
  }

  if (hasSkill(extractedSkills, 'JavaScript') || hasSkill(extractedSkills, 'TypeScript')) {
    questions.push(
      'Explain closures in JavaScript with a practical example.',
      'What is the event loop and how does it work?',
      'Explain the difference between == and === in JavaScript.'
    );
  }

  if (hasSkill(extractedSkills, 'Java')) {
    questions.push(
      'Explain the difference between abstract classes and interfaces.',
      'What is the Java Collections Framework? Explain List vs Set vs Map.',
      'Explain multithreading in Java and how to handle synchronization.'
    );
  }

  if (hasSkill(extractedSkills, 'Python')) {
    questions.push(
      'Explain list comprehensions and generator expressions.',
      'What are decorators in Python and how do they work?',
      'Explain the GIL (Global Interpreter Lock) and its implications.'
    );
  }

  if (hasSkill(extractedSkills, 'AWS') || hasSkill(extractedSkills, 'Azure') || hasSkill(extractedSkills, 'GCP')) {
    questions.push(
      'Explain the difference between IaaS, PaaS, and SaaS with examples.',
      'How would you design a scalable web application on the cloud?',
      'Explain load balancing and auto-scaling strategies.'
    );
  }

  if (hasSkill(extractedSkills, 'Docker') || hasSkill(extractedSkills, 'Kubernetes')) {
    questions.push(
      'Explain containerization and its benefits over virtualization.',
      'What is the difference between Docker and Kubernetes?',
      'Explain microservices architecture and its pros/cons.'
    );
  }

  if (hasSkill(extractedSkills, 'DSA') || hasSkill(extractedSkills, 'Data Structures')) {
    questions.push(
      'How would you optimize search in sorted data?',
      'Explain dynamic programming with a real-world example.',
      'Compare different sorting algorithms and their use cases.'
    );
  }

  if (hasSkill(extractedSkills, 'REST') || hasSkill(extractedSkills, 'GraphQL')) {
    questions.push(
      'Explain RESTful API design principles.',
      'What is the difference between REST and GraphQL?',
      'How would you version your APIs?'
    );
  }

  if (hasSkill(extractedSkills, 'MongoDB') || hasSkill(extractedSkills, 'Redis')) {
    questions.push(
      'Explain NoSQL databases and when to use them over SQL.',
      'What is eventual consistency in distributed databases?'
    );
  }

  // If no specific skills detected, add general questions
  if (questions.length <= 5) {
    questions.push(
      'Tell me about yourself and your technical background.',
      'Explain a challenging project you worked on.',
      'How do you keep up with new technologies?',
      'Describe your approach to debugging a complex issue.',
      'How do you handle tight deadlines and pressure?'
    );
  }

  // Return top 10 questions
  return questions.slice(0, 10);
}

/**
 * Perform complete JD analysis
 * @param {Object} params - Analysis parameters
 * @param {string} params.company - Company name
 * @param {string} params.role - Job role
 * @param {string} params.jdText - Job description text
 * @returns {Object} - Complete analysis result
 */
export function analyzeJD({ company, role, jdText }) {
  const extractedSkills = extractSkills(jdText);
  const normalizedSkills = normalizeSkillCategories(extractedSkills);
  const allSkills = getAllSkillsFromCategories(normalizedSkills);
  const readinessScore = calculateReadinessScore({ extractedSkills: normalizedSkills, company, role, jdText });
  const companyIntel = generateCompanyIntel(company, jdText, normalizedSkills);
  
  // Create raw analysis data
  const rawAnalysis = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    company: company || '',
    role: role || '',
    jdText,
    extractedSkills: normalizedSkills,
    allSkills,
    baseScore: readinessScore,
    roundMapping: companyIntel.roundMapping,
    checklist: generateChecklist(normalizedSkills),
    plan7Days: generateSevenDayPlan(normalizedSkills),
    questions: generateQuestions(normalizedSkills)
  };
  
  // Return standardized entry
  return createAnalysisEntry(rawAnalysis);
}
