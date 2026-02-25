import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Building2, Briefcase, Sparkles, AlertTriangle } from 'lucide-react';
import { analyzeJD } from '../services/analysisService';
import { saveAnalysis } from '../services/storageService';

function Analyze() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jdText: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    
    if (!formData.jdText.trim()) {
      alert('Please enter a job description');
      return;
    }

    console.log('JD text is valid, starting analysis...');
    setIsAnalyzing(true);
    
    try {
      // Process immediately - no artificial delay
      console.log('Calling analyzeJD...');
      const analysis = analyzeJD(formData);
      console.log('Analysis complete:', analysis);
      
      console.log('Saving analysis...');
      const saved = saveAnalysis(analysis);
      console.log('Analysis saved:', saved);
      
      // Navigate to results with the analysis data
      console.log('Navigating to results...');
      navigate('/results', { state: { analysis }, replace: false });
      console.log('Navigation called');
    } catch (error) {
      console.error('Analysis error:', error);
      console.error('Error stack:', error.stack);
      alert('Error during analysis: ' + error.message + '\n\nCheck console (F12) for details.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Show warning if JD is too short
    if (name === 'jdText') {
      setShowWarning(value.length > 0 && value.length < 200);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">JD Analysis</h2>
        <p className="text-gray-600">
          Paste a job description to extract skills, generate a preparation plan, and calculate your readiness score.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g., Google, Microsoft, Amazon"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Job Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Software Engineer, Full Stack Developer"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="jdText" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="jdText"
              name="jdText"
              value={formData.jdText}
              onChange={handleChange}
              rows={12}
              placeholder="Paste the full job description here. Include requirements, skills, and responsibilities for better analysis..."
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                showWarning ? 'border-amber-400 bg-amber-50' : 'border-gray-200'
              }`}
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              {formData.jdText.length} characters {formData.jdText.length > 800 && (
                <span className="text-green-600 font-medium">✓ Detailed JD detected</span>
              )}
            </p>
            
            {/* Warning for short JD */}
            {showWarning && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  This JD is too short to analyze deeply. Paste full JD for better output.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Job Description
              </>
            )}
          </button>
        </form>

        {/* Tips */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Tips for better analysis:</h4>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Include the complete job description for accurate skill extraction</li>
            <li>JD with 800+ characters gives bonus readiness points</li>
            <li>Specify company and role for personalized preparation plan</li>
            <li>All analysis is saved to your history for future reference</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Analyze;
