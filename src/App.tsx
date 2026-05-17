import { Bell, LogOut } from 'lucide-react';
import { NavLink, Route, Routes, useLocation, useNavigate, Link } from 'react-router-dom';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { TalentDirectory } from './pages/TalentDirectory';
import { EditProfile } from './pages/EditProfile';
import { ProfilePreview } from './pages/ProfilePreview';
import { Auth } from './pages/Auth';
import { useState, useEffect } from 'react';
import { cvService } from './services/cvService';
import type { CandidateProfile } from './types/cv';
import { useAuth } from './contexts/AuthContext';

const FULL_WIDTH_ROUTES = ['/profile/', '/auth'];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isFullWidth = FULL_WIDTH_ROUTES.some((r) => location.pathname.startsWith(r));
  const isAuthPage = location.pathname === '/auth';
  const [userProfile, setUserProfile] = useState<CandidateProfile | null>(null);

  useEffect(() => {
    if (user) {
      cvService.getAllCandidateProfiles().then(profiles => {
        const found = profiles.find(p => p.fullName.toLowerCase() === user.toLowerCase());
        if (found) setUserProfile(found);
      });
    } else {
      setUserProfile(null);
    }
  }, [user, location.pathname]);


  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user && !isAuthPage) {
    return <Auth />;
  }

  if (isAuthPage && user) {
    navigate('/');
    return null;
  }

  if (isAuthPage) {
    return <Auth />;
  }

  return (
    <div className={'app-shell ' + (isFullWidth ? 'app-shell--full' : '')}>
      {!isFullWidth && <Sidebar />}

      <div className="app-main">
        {!isFullWidth && (
          <header className="app-topbar">
            <div className="app-topbar-left">
              
              <nav className="app-topnav">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'topnav-link topnav-link--active' : 'topnav-link')} end>
                  Feed
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
              <span className="topbar-username" style={{fontSize: 14, fontWeight: 600, color: 'var(--color-text)'}}>{user}</span>
              <button type="button" className="topbar-icon-btn" aria-label="Notifications">
                <Bell size={18} />
              </button>
              <button type="button" className="topbar-icon-btn" aria-label="Logout" onClick={handleLogout} title="Logout">
                <LogOut size={18} />
              </button>
              <Link to={userProfile ? `/profile/${userProfile.id}` : '/edit'} className="topbar-avatar" aria-label="Edit my profile" style={{textDecoration: 'none', overflow: 'hidden'}}>
                {userProfile && userProfile.photoBlob ? (
                  <img src={URL.createObjectURL(userProfile.photoBlob)} alt={user || ''} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  <span>{user ? user[0].toUpperCase() : 'U'}</span>
                )}
              </Link>
            </div>
          </header>
        )}

        <main className="app-content">
          <Routes>
            <Route path="/" element={<TalentDirectory isFeed={true} />} />
            <Route path="/directory" element={<TalentDirectory isFeed={false} />} />
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
