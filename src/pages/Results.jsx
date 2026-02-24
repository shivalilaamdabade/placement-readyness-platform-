import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Target, 
  CheckCircle, 
  Calendar, 
  HelpCircle, 
  ArrowLeft, 
  Save,
  TrendingUp,
  Clock,
  BookOpen
} from 'lucide-react';
import { getAnalysisById } from '../services/storageService';
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
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">/ {max}</span>
      </div>
    </div>
  );
}

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const historyId = searchParams.get('id');
    
    if (historyId) {
      // Load from history
      const savedAnalysis = getAnalysisById(historyId);
      if (savedAnalysis) {
        setAnalysis(savedAnalysis);
      } else {
        navigate('/history');
      }
    } else if (location.state?.analysis) {
      // Use passed analysis data
      setAnalysis(location.state.analysis);
    } else {
      // No data available
      navigate('/analyze');
    }
    setLoading(false);
  }, [location.state, searchParams, navigate]);

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

  const readinessLevel = getReadinessLevel(analysis.readinessScore);
  const readinessColor = getReadinessColor(analysis.readinessScore);

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
            <CircularProgress value={analysis.readinessScore} max={100} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Readiness Score</h3>
            <p className={`text-3xl font-bold ${readinessColor} mb-2`}>
              {readinessLevel}
            </p>
            <p className="text-gray-600">
              Based on {analysis.allSkills.length} skills detected across {Object.keys(analysis.extractedSkills).length} categories
            </p>
            {analysis.jdText.length > 800 && (
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                Detailed JD bonus applied
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Skills Extracted */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-500" />
          Key Skills Extracted
        </h3>
        <div className="space-y-4">
          {Object.entries(analysis.extractedSkills).map(([key, category]) => (
            <div key={key}>
              <h4 className="text-sm font-medium text-gray-700 mb-2">{category.name}</h4>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
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
      <div className="bg-white rounded-xl border border-gray-200 p-6">
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

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
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
