import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  Github,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { isChecklistComplete, getPassedCount, getTotalCount } from '../utils/testChecklist';

function Ship() {
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passedCount, setPassedCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const complete = isChecklistComplete();
    setIsUnlocked(complete);
    setPassedCount(getPassedCount());
    
    if (complete) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const totalCount = getTotalCount();

  if (!isUnlocked) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Locked State */}
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Shipping Locked
          </h2>
          
          <p className="text-gray-600 mb-6">
            Complete all tests in the checklist before you can ship.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 text-amber-800 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">
                {passedCount} / {totalCount} tests passed
              </span>
            </div>
            <p className="text-sm text-amber-700">
              You need to pass all {totalCount} tests to unlock shipping.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/test')}
              className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Checklist
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Unlocked State */}
      <div className="bg-white rounded-xl border border-green-200 p-12 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Ship! 🚀
        </h2>
        
        <p className="text-gray-600 mb-8">
          All {totalCount} tests passed. Your Placement Readiness Platform is ready for deployment.
        </p>

        {/* Success Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{totalCount}</div>
            <div className="text-sm text-gray-600">Tests Passed</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">100%</div>
            <div className="text-sm text-gray-600">Coverage</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">✓</div>
            <div className="text-sm text-gray-600">Ready</div>
          </div>
        </div>

        {/* Deployment Options */}
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-gray-900">Deployment Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">▲</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Deploy to Vercel</div>
                <div className="text-sm text-gray-500">Recommended for React apps</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>

            <a
              href="https://github.com/shivalilaamdabade/placement-readyness-platform-"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
            >
              <Github className="w-10 h-10 text-gray-800" />
              <div className="text-left">
                <div className="font-medium text-gray-900">View on GitHub</div>
                <div className="text-sm text-gray-500">Source code repository</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/test')}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Checklist
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      </div>

      {/* Deployment Checklist */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Pre-Deployment Checklist</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            All tests passing
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Code committed to GitHub
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-gray-300 rounded-full"></span>
            Environment variables configured (if any)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-gray-300 rounded-full"></span>
            Build successful
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-gray-300 rounded-full"></span>
            Deployed and verified
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Ship;
