import { FileText, Video, BookOpen, ExternalLink } from 'lucide-react';

function Resources() {
  const resources = [
    {
      id: 1,
      title: 'Data Structures & Algorithms Guide',
      type: 'PDF',
      category: 'Study Material',
      icon: FileText,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: 2,
      title: 'System Design Interview Course',
      type: 'Video',
      category: 'Course',
      icon: Video,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 3,
      title: 'Behavioral Interview Questions',
      type: 'Article',
      category: 'Interview Prep',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 4,
      title: 'Resume Writing Tips',
      type: 'PDF',
      category: 'Career',
      icon: FileText,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 5,
      title: 'Company-wise Interview Experiences',
      type: 'Article',
      category: 'Interview Prep',
      icon: BookOpen,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      id: 6,
      title: 'Advanced JavaScript Concepts',
      type: 'Video',
      category: 'Technical',
      icon: Video,
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources</h2>
      
      {/* Resource Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center hover:border-primary-300 cursor-pointer transition-colors">
          <FileText className="w-8 h-8 mx-auto mb-2 text-primary-500" />
          <span className="text-sm font-medium text-gray-700">Documents</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center hover:border-primary-300 cursor-pointer transition-colors">
          <Video className="w-8 h-8 mx-auto mb-2 text-primary-500" />
          <span className="text-sm font-medium text-gray-700">Videos</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center hover:border-primary-300 cursor-pointer transition-colors">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary-500" />
          <span className="text-sm font-medium text-gray-700">Articles</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center hover:border-primary-300 cursor-pointer transition-colors">
          <ExternalLink className="w-8 h-8 mx-auto mb-2 text-primary-500" />
          <span className="text-sm font-medium text-gray-700">External</span>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${resource.color}`}>
                <resource.icon className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                {resource.type}
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
            <p className="text-sm text-gray-500 mb-4">{resource.category}</p>
            <button className="flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium text-sm">
              View Resource
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Resources;
