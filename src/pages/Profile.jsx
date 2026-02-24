import { Mail, MapPin, Briefcase, GraduationCap, Edit } from 'lucide-react';

function Profile() {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'Mumbai, India',
    role: 'Software Engineer',
    education: 'B.Tech in Computer Science',
    bio: 'Passionate about problem solving and building scalable applications. Preparing for FAANG companies.',
  };

  const skills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'System Design', 'Data Structures'
  ];

  const stats = [
    { label: 'Problems Solved', value: '124' },
    { label: 'Mock Interviews', value: '8' },
    { label: 'Assessments', value: '15' },
    { label: 'Certificates', value: '3' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-primary-600">JD</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-gray-500 mb-4">{user.role}</p>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">{user.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Briefcase className="w-5 h-5" />
                <span className="text-sm">{user.role}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <GraduationCap className="w-5 h-5" />
                <span className="text-sm">{user.education}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-primary-500">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-600 leading-relaxed">{user.bio}</p>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
