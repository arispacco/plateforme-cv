import { LayoutDashboard, Users, Settings, User, CreditCard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">V</span>
        <span className="sidebar-logo-text">V-Pitch</span>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/directory"
          className={`sidebar-item ${location.pathname === '/directory' ? 'active' : ''}`}
        >
          <Users size={18} />
          <span>Talent Directory</span>
        </Link>

        <div className="sidebar-group">
          <div className="sidebar-item sidebar-item--group-header">
            <Settings size={18} />
            <span>Settings</span>
          </div>
          <div className="sidebar-group-children">
            <Link
              to="/edit"
              className={`sidebar-item sidebar-item--child ${location.pathname === '/edit' ? 'active' : ''}`}
            >
              <User size={16} />
              <span>Profile</span>
            </Link>
            <Link
              to="/account"
              className={`sidebar-item sidebar-item--child ${location.pathname === '/account' ? 'active' : ''}`}
            >
              <CreditCard size={16} />
              <span>Account</span>
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}
