import { LayoutDashboard, Users, Settings, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import vpitchLogo from '../assets/vpitch-logo.svg';

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo" style={{textDecoration: 'none', color: 'inherit'}}>
        <img src={vpitchLogo} alt="V-Pitch logo" className="sidebar-logo-icon" />
        <span className="sidebar-logo-text">V-Pitch</span>
      </Link>

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
            
          </div>
        </div>
      </nav>
    </aside>
  );
}
