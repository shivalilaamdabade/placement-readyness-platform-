import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { 
  Target, 
  CheckCircle, 
  Calendar, 
  HelpCircle, 
  ArrowLeft, 
  Copy,
  Download,
  TrendingUp,
  AlertCircle,
  CheckSquare,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { getAnalysisById, updateAnalysis, getHistory } from '../services/storageService';
import { getReadinessLevel, getReadinessColor } from '../utils/readinessScore';

// Circular Progress Component
function CircularProgress({ value, max, size = 180, strokeWidth = 14 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (value / max) * circumference;
  const offset = circumference - progress;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#4f46e5"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">/ {max}</span>
      </div>
    </div>
  );
}

// Skill Toggle Component
function SkillToggle({ skill, confidence, onToggle }) {
  const isKnow = confidence === 'know';
  
  return (
    <div className="flex items-center gap-2">
      <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        isKnow 
          ? 'bg-green-100 text-green-700' 
          : 'bg-amber-100 text-amber-700'
      }`}>
        {skill}
      </span>
      <button
        onClick={onToggle}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          isKnow
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-amber-500 text-white hover:bg-amber-600'
        }`}
      >
        {isKnow ? 'I know this' : 'Need practice'}
      </button>
    </div>
  );
}

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skillConfidence, setSkillConfidence] = useState({});
  const [liveScore, setLiveScore] = useState(0);

  // Calculate live score based on skill confidence
  const calculateLiveScore = useCallback((baseScore, confidenceMap, allSkills) => {
    let adjustment = 0;
    allSkills.forEach(skill => {
      if (confidenceMap[skill] === 'know') {
        adjustment += 2;
      } else if (confidenceMap[skill] === 'practice') {
        adjustment -= 2;
      }
    });
    return Math.max(0, Math.min(100, baseScore + adjustment));
  }, []);

  useEffect(() => {
    const loadAnalysis = () => {
      const historyId = searchParams.get('id');
      
      if (historyId) {
        const savedAnalysis = getAnalysisById(historyId);
        if (savedAnalysis) {
          setAnalysis(savedAnalysis);
          const initialConfidence = savedAnalysis.skillConfidenceMap || {};
          // Initialize missing skills to 'practice'
          savedAnalysis.allSkills.forEach(skill => {
            if (!initialConfidence[skill]) {
              initialConfidence[skill] = 'practice';
            }
          });
          setSkillConfidence(initialConfidence);
          setLiveScore(calculateLiveScore(savedAnalysis.readinessScore, initialConfidence, savedAnalysis.allSkills));
        } else {
          navigate('/history');
        }
      } else if (location.state?.analysis) {
        const newAnalysis = location.state.analysis;
        setAnalysis(newAnalysis);
        const initialConfidence = {};
        newAnalysis.allSkills.forEach(skill => {
          initialConfidence[skill] = 'practice';
        });
        setSkillConfidence(initialConfidence);
        setLiveScore(calculateLiveScore(newAnalysis.readinessScore, initialConfidence, newAnalysis.allSkills));
      } else {
        // Check if there's any analysis in history to show
        const history = getHistory();
        if (history.length > 0) {
          navigate('/history');
        } else {
          navigate('/analyze');
        }
      }
      setLoading(false);
    };

    loadAnalysis();
  }, [location.state, searchParams, navigate, calculateLiveScore]);

  // Save confidence changes to localStorage
  const saveConfidenceChanges = useCallback((newConfidence, newScore) => {
    if (analysis?.id) {
      updateAnalysis(analysis.id, {
        skillConfidenceMap: newConfidence,
        adjustedReadinessScore: newScore
      });
    }
  }, [analysis]);

  const handleSkillToggle = (skill) => {
    const newConfidence = {
      ...skillConfidence,
      [skill]: skillConfidence[skill] === 'know' ? 'practice' : 'know'
    };
    setSkillConfidence(newConfidence);
    
    const newScore = calculateLiveScore(analysis.readinessScore, newConfidence, analysis.allSkills);
    setLiveScore(newScore);
    
    saveConfidenceChanges(newConfidence, newScore);
  };

  // Export functions
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const exportPlan = () => {
    const planText = analysis.plan.map(day => 
      `${day.day}: ${day.focus}\n${day.tasks.map(t => `  - ${t}`).join('\n')}`
    ).join('\n\n');
    copyToClipboard(planText, '7-Day Plan');
  };

  const exportChecklist = () => {
    const checklistText = analysis.checklist.map(round => 
      `${round.round}\n${round.items.map(i => `  [ ] ${i}`).join('\n')}`
    ).join('\n\n');
    copyToClipboard(checklistText, 'Round Checklist');
  };

  const exportQuestions = () => {
    const questionsText = analysis.questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
    copyToClipboard(questionsText, 'Interview Questions');
  };

  const downloadTXT = () => {
    const content = `PLACEMENT READINESS ANALYSIS
=============================

Company: ${analysis.company}
Role: ${analysis.role}
Date: ${new Date(analysis.createdAt).toLocaleDateString()}
Readiness Score: ${liveScore}/100

SKILLS EXTRACTED
================
${Object.entries(analysis.extractedSkills).map(([key, cat]) => 
  `${cat.name}:\n${cat.skills.map(s => `  - ${s} (${skillConfidence[s] === 'know' ? '✓ Know' : '○ Practice'})`).join('\n')}`
).join('\n\n')}

7-DAY PREPARATION PLAN
======================
${analysis.plan.map(day => 
  `${day.day}: ${day.focus}\n${day.tasks.map(t => `  - ${t}`).join('\n')}`
).join('\n\n')}

ROUND-WISE CHECKLIST
====================
${analysis.checklist.map(round => 
  `${round.round}\n${round.items.map(i => `  [ ] ${i}`).join('\n')}`
).join('\n\n')}

INTERVIEW QUESTIONS
===================
${analysis.questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}

WEAK AREAS TO FOCUS ON
======================
${getWeakSkills().map(s => `  - ${s}`).join('\n') || '  None identified'}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-analysis-${analysis.company.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get weak skills (top 3 practice-marked)
  const getWeakSkills = () => {
    return Object.entries(skillConfidence)
      .filter(([_, confidence]) => confidence === 'practice')
      .map(([skill]) => skill)
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const readinessLevel = getReadinessLevel(liveScore);
  const readinessColor = getReadinessColor(liveScore);
  const weakSkills = getWeakSkills();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-gray-600">
            {analysis.company} • {analysis.role}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Analyzed on</p>
          <p className="font-medium">{new Date(analysis.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Readiness Score */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <CircularProgress value={liveScore} max={100} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Readiness Score</h3>
            <p className={`text-3xl font-bold ${readinessColor} mb-2`}>
              {readinessLevel}
            </p>
            <p className="text-gray-600">
              Based on {analysis.allSkills.length} skills detected across {Object.keys(analysis.extractedSkills).length} categories
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Base: {analysis.readinessScore} | Adjusted: {liveScore} 
              <span className="text-xs ml-2">(updates as you mark skills)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Skills Extracted with Toggles */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-500" />
          Key Skills Extracted
          <span className="text-sm font-normal text-gray-500 ml-2">(Click to toggle confidence)</span>
        </h3>
        <div className="space-y-4">
          {Object.entries(analysis.extractedSkills).map(([key, category]) => (
            <div key={key}>
              <h4 className="text-sm font-medium text-gray-700 mb-2">{category.name}</h4>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, index) => (
                  <SkillToggle
                    key={index}
                    skill={skill}
                    confidence={skillConfidence[skill] || 'practice'}
                    onToggle={() => handleSkillToggle(skill)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Tools */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary-500" />
          Export Tools
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportPlan}
            className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Copy 7-Day Plan
          </button>
          <button
            onClick={exportChecklist}
            className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            Copy Round Checklist
          </button>
          <button
            onClick={exportQuestions}
            className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Copy 10 Questions
          </button>
          <button
            onClick={downloadTXT}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download as TXT
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 7-Day Plan */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            7-Day Preparation Plan
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {analysis.plan.map((day, index) => (
              <div key={index} className="border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold text-gray-900">{day.day}: {day.focus}</h4>
                <ul className="mt-2 space-y-1">
                  {day.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-primary-500 mt-1">•</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary-500" />
            Round-wise Checklist
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {analysis.checklist.map((round, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{round.round}</h4>
                <ul className="space-y-2">
                  {round.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <input type="checkbox" className="mt-1 rounded text-primary-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interview Questions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary-500" />
          Likely Interview Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.questions.map((question, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <p className="text-gray-700">{question}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Next Box */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          Action Next
        </h3>
        
        {weakSkills.length > 0 ? (
          <>
            <p className="text-gray-700 mb-3">Top skills to focus on:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {weakSkills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-700 mb-3">Great! You have marked all skills as known.</p>
        )}
        
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Suggested next action:</p>
            <p className="text-gray-600">Start Day 1 plan now. Focus on {weakSkills[0] || 'your basics'} first.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/analyze')}
          className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
        >
          Analyze Another JD
        </button>
        <button
          onClick={() => navigate('/history')}
          className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-colors"
        >
          View History
        </button>
      </div>
    </div>
  );
}

export default Results;
