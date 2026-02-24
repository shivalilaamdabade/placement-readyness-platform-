import { Calendar, Clock, CheckCircle } from 'lucide-react';

function Assessments() {
  const upcomingAssessments = [
    { id: 1, title: 'Data Structures Quiz', date: 'Feb 28, 2026', duration: '30 min', type: 'Quiz' },
    { id: 2, title: 'Algorithm Coding Test', date: 'Mar 2, 2026', duration: '90 min', type: 'Coding' },
    { id: 3, title: 'System Design Interview', date: 'Mar 5, 2026', duration: '60 min', type: 'Interview' },
  ];

  const completedAssessments = [
    { id: 4, title: 'Aptitude Test', score: '85%', date: 'Feb 20, 2026', status: 'Passed' },
    { id: 5, title: 'SQL Fundamentals', score: '92%', date: 'Feb 18, 2026', status: 'Passed' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessments</h2>
      
      {/* Upcoming Assessments */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingAssessments.map((assessment) => (
            <div key={assessment.id} className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-medium">
                  {assessment.type}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">{assessment.title}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {assessment.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {assessment.duration}
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                Start Assessment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Assessments */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed</h3>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Assessment</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Score</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {completedAssessments.map((assessment) => (
                <tr key={assessment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{assessment.title}</td>
                  <td className="px-6 py-4 text-gray-600">{assessment.date}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{assessment.score}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      {assessment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Assessments;
