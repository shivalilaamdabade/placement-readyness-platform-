import { Search, Filter, PlayCircle } from 'lucide-react';

function Practice() {
  const problems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', status: 'Solved' },
    { id: 2, title: 'Reverse Linked List', difficulty: 'Easy', category: 'Linked List', status: 'Attempted' },
    { id: 3, title: 'Binary Tree Level Order', difficulty: 'Medium', category: 'Trees', status: 'Unsolved' },
    { id: 4, title: 'Merge Intervals', difficulty: 'Medium', category: 'Arrays', status: 'Unsolved' },
    { id: 5, title: 'LRU Cache', difficulty: 'Hard', category: 'Design', status: 'Unsolved' },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Problems</h2>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Problem</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Category</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Difficulty</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{problem.title}</td>
                <td className="px-6 py-4 text-gray-600">{problem.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{problem.status}</td>
                <td className="px-6 py-4">
                  <button className="flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium">
                    <PlayCircle className="w-4 h-4" />
                    Solve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Practice;
