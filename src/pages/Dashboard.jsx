import { TrendingUp, Target, Clock, Award } from 'lucide-react';

function Dashboard() {
  const stats = [
    { label: 'Problems Solved', value: '124', icon: Target, color: 'bg-blue-100 text-blue-600' },
    { label: 'Mock Interviews', value: '8', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Study Hours', value: '48', icon: Clock, color: 'bg-purple-100 text-purple-600' },
    { label: 'Achievements', value: '12', icon: Award, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Completed "Two Sum" problem</p>
              <p className="text-sm text-gray-500">Array • Easy • 15 mins ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Finished Mock Interview Session</p>
              <p className="text-sm text-gray-500">Technical • 45 mins • 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Earned "Streak Master" badge</p>
              <p className="text-sm text-gray-500">7-day streak achieved • 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
