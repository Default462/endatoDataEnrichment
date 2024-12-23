import { FileText, Upload } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Navigation() {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-4">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dashboard')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Link>
            <Link
              to="/downloads"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/downloads')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Downloads
            </Link>
          </div>
          <button
            onClick={logout}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}