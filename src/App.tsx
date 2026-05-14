import { Bell } from 'lucide-react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { TalentDirectory } from './pages/TalentDirectory';
import { EditProfile } from './pages/EditProfile';
import { ProfilePreview } from './pages/ProfilePreview';

const FULL_WIDTH_ROUTES = ['/profile/'];

function App() {
  const location = useLocation();
  const isFullWidth = FULL_WIDTH_ROUTES.some((r) => location.pathname.startsWith(r));

  return (
    <div className={`app-shell ${isFullWidth ? 'app-shell--full' : ''}`}>
      {!isFullWidth && <Sidebar />}

      <div className="app-main">
        {!isFullWidth && (
          <header className="app-topbar">
            <div className="app-topbar-left">
              <nav className="app-topnav">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'topnav-link topnav-link--active' : 'topnav-link')} end>
                  Dashboard
                </NavLink>
                <NavLink to="/directory" className={({ isActive }) => (isActive ? 'topnav-link topnav-link--active' : 'topnav-link')}>
                  Directory
                </NavLink>
                <NavLink to="/edit" className={({ isActive }) => (isActive ? 'topnav-link topnav-link--active' : 'topnav-link')}>
                  New Profile
                </NavLink>
              </nav>
            </div>
            <div className="app-topbar-right">
              <button type="button" className="topbar-icon-btn" aria-label="Notifications">
                <Bell size={18} />
              </button>
              <div className="topbar-avatar" aria-label="User menu">
                <span>U</span>
              </div>
            </div>
          </header>
        )}

        <main className="app-content">
          <Routes>
            <Route path="/" element={<TalentDirectory />} />
            <Route path="/directory" element={<TalentDirectory />} />
            <Route path="/edit" element={<EditProfile />} />
            <Route path="/edit/:id" element={<EditProfile />} />
            <Route path="/profile/:id" element={<ProfilePreview />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
