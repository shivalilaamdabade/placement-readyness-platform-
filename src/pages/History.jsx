import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  Trash2, 
  Eye, 
  Calendar, 
  Building2, 
  Briefcase,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { getHistory, deleteAnalysis, clearHistory, hadCorruptedEntries, clearCorruptedFlag } from '../services/storageService';
import { getReadinessColor } from '../utils/readinessScore';

function HistoryPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCorruptedWarning, setShowCorruptedWarning] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getHistory();
    setAnalyses(data);
    
    // Check for corrupted entries
    if (hadCorruptedEntries()) {
      setShowCorruptedWarning(true);
      clearCorruptedFlag();
    }
    
    setLoading(false);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      deleteAnalysis(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      clearHistory();
      loadHistory();
    }
  };

  const handleView = (id) => {
    navigate(`/results?id=${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (analyses.length === 0 && !showCorruptedWarning) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis History</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No analyses yet</h3>
          <p className="text-gray-600 mb-6">
            Start by analyzing a job description to see your history here.
          </p>
          <button
            onClick={() => navigate('/analyze')}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
          >
            Analyze Your First JD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Corrupted Entry Warning */}
      {showCorruptedWarning && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800">
              One saved entry couldn't be loaded. Create a new analysis.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
          <p className="text-gray-600">
            {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'} saved
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/analyze')}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            New Analysis
          </button>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {analyses.map((analysis) => (
          <div
            key={analysis.id}
            onClick={() => handleView(analysis.id)}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{analysis.company}</h3>
                  <span className="text-gray-400">•</span>
                  <p className="text-gray-600">{analysis.role}</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getReadinessColor(analysis.finalScore || analysis.baseScore || 0)} bg-gray-50`}>
                    {analysis.finalScore || analysis.baseScore || 0}/100
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {analysis.allSkills.length} skills detected
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {Object.keys(analysis.extractedSkills).length} categories
                  </span>
                </div>

                {/* Skills Preview */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {analysis.allSkills.slice(0, 5).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {analysis.allSkills.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{analysis.allSkills.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleView(analysis.id)}
                  className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                  title="View Analysis"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => handleDelete(analysis.id, e)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Your analysis history is stored locally in your browser. It will persist even after refreshing the page, 
          but will be lost if you clear your browser data. Maximum 50 analyses are kept.
        </p>
      </div>
    </div>
  );
}

export default HistoryPage;
