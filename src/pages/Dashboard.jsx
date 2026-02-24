import { TrendingUp, Target, Clock, Award, Calendar, ChevronRight } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// Circular Progress Component
function CircularProgress({ value, max, size = 200, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (value / max) * circumference;
  const offset = circumference - progress;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
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

// Card Component
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  );
}

function Dashboard() {
  const stats = [
    { label: 'Problems Solved', value: '124', icon: Target, color: 'bg-blue-100 text-blue-600' },
    { label: 'Mock Interviews', value: '8', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Study Hours', value: '48', icon: Clock, color: 'bg-purple-100 text-purple-600' },
    { label: 'Achievements', value: '12', icon: Award, color: 'bg-yellow-100 text-yellow-600' },
  ];

  // Radar chart data
  const skillData = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
  ];

  // Weekly activity data
  const weekDays = [
    { day: 'Mon', active: true },
    { day: 'Tue', active: true },
    { day: 'Wed', active: true },
    { day: 'Thu', active: false },
    { day: 'Fri', active: true },
    { day: 'Sat', active: true },
    { day: 'Sun', active: false },
  ];

  // Upcoming assessments
  const assessments = [
    { title: 'DSA Mock Test', date: 'Tomorrow', time: '10:00 AM', color: 'bg-red-100 text-red-600' },
    { title: 'System Design Review', date: 'Wed', time: '2:00 PM', color: 'bg-blue-100 text-blue-600' },
    { title: 'HR Interview Prep', date: 'Friday', time: '11:00 AM', color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="!p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid - 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Overall Readiness */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Overall Readiness</h3>
          <div className="flex flex-col items-center">
            <CircularProgress value={72} max={100} size={200} strokeWidth={16} />
            <p className="mt-4 text-gray-600 font-medium">Readiness Score</p>
          </div>
        </Card>

        {/* Skill Breakdown - Radar Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Skill Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="#4f46e5"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Continue Practice */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Practice</h3>
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-1">Last Topic</p>
            <h4 className="text-2xl font-bold mb-4">Dynamic Programming</h4>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>3/10 completed</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 transition-all duration-500" style={{ width: '30%' }}></div>
              </div>
            </div>
            <button className="w-full py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goals</h3>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Problems Solved</span>
              <span className="font-semibold text-gray-900">12/20 this week</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-primary-500 rounded-full h-3 transition-all duration-500" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="flex justify-between">
            {weekDays.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    day.active
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day.day[0]}
                </div>
                <span className="text-xs text-gray-500">{day.day}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming Assessments */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assessments</h3>
        <div className="space-y-4">
          {assessments.map((assessment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${assessment.color}`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{assessment.title}</h4>
                  <p className="text-sm text-gray-500">{assessment.date}, {assessment.time}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
