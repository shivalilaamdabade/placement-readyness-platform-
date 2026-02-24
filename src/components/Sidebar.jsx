import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Code, ClipboardList, BookOpen, User, Sparkles, History } from 'lucide-react';

function Sidebar() {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/analyze', label: 'JD Analysis', icon: Sparkles },
    { path: '/history', label: 'History', icon: History },
    { path: '/practice', label: 'Practice', icon: Code },
    { path: '/assessments', label: 'Assessments', icon: ClipboardList },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary-500">Placement Prep</h2>
      </div>
      <nav className="px-4 pb-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
