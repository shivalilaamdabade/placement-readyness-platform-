import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Square, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { 
  getChecklist, 
  toggleTestItem, 
  resetChecklist, 
  getPassedCount, 
  getTotalCount,
  isChecklistComplete 
} from '../utils/testChecklist';

function TestChecklist() {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState([]);
  const [passedCount, setPassedCount] = useState(0);
  const [showHints, setShowHints] = useState({});

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = () => {
    const items = getChecklist();
    setChecklist(items);
    setPassedCount(getPassedCount());
  };

  const handleToggle = (id) => {
    const updated = toggleTestItem(id);
    setChecklist(updated);
    setPassedCount(getPassedCount());
  };

  const handleReset = () => {
    if (window.confirm('Reset all test items to unchecked?')) {
      resetChecklist();
      loadChecklist();
    }
  };

  const toggleHint = (id) => {
    setShowHints(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalCount = getTotalCount();
  const isComplete = isChecklistComplete();
  const progressPercentage = (passedCount / totalCount) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary-500" />
          Shipping Test Checklist
        </h2>
        <p className="text-gray-600">
          Verify all functionality before shipping. Check each item after testing.
        </p>
      </div>

      {/* Summary Card */}
      <div className={`rounded-xl border p-6 mb-8 ${
        isComplete 
          ? 'bg-green-50 border-green-200' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Tests Passed: {passedCount} / {totalCount}
            </h3>
            <p className="text-sm text-gray-500">
              {isComplete 
                ? 'All tests passed! Ready to ship.' 
                : 'Complete all tests before shipping.'}
            </p>
          </div>
          <div className="text-right">
            {isComplete ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <div className="text-3xl font-bold text-amber-500">
                {Math.round(progressPercentage)}%
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              isComplete ? 'bg-green-500' : 'bg-primary-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Warning if not complete */}
        {!isComplete && (
          <div className="flex items-center gap-2 text-amber-700 bg-amber-100 p-3 rounded-lg">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              Fix issues before shipping. All tests must pass.
            </p>
          </div>
        )}

        {/* Success message */}
        {isComplete && (
          <div className="flex items-center gap-2 text-green-700 bg-green-100 p-3 rounded-lg">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              All tests passed! You can now proceed to ship.
            </p>
          </div>
        )}
      </div>

      {/* Test Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="space-y-4">
          {checklist.map((item, index) => (
            <div 
              key={item.id}
              className={`p-4 rounded-lg border transition-all ${
                item.checked 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggle(item.id)}
                  className="flex-shrink-0 mt-0.5"
                >
                  {item.checked ? (
                    <CheckSquare className="w-6 h-6 text-green-600" />
                  ) : (
                    <Square className="w-6 h-6 text-gray-400" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-medium ${
                      item.checked ? 'text-green-900 line-through' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </span>
                  </div>

                  {/* Hint Toggle */}
                  <button
                    onClick={() => toggleHint(item.id)}
                    className="flex items-center gap-1 mt-2 text-sm text-gray-500 hover:text-primary-600"
                  >
                    <HelpCircle className="w-4 h-4" />
                    {showHints[item.id] ? 'Hide hint' : 'How to test'}
                  </button>

                  {/* Hint Text */}
                  {showHints[item.id] && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      {item.hint}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Checklist
        </button>

        <button
          onClick={() => navigate('/ship')}
          disabled={!isComplete}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isComplete
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Proceed to Ship
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Info Note */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          This checklist is stored in your browser's localStorage and will persist 
          even after refreshing the page. Use the reset button to start over.
        </p>
      </div>
    </div>
  );
}

export default TestChecklist;
