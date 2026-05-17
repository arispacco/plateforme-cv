import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cvService } from '../services/cvService';
import vpitchLogo from '../assets/vpitch-logo.svg';

export function Auth() {
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      const name = username.trim();
      login(name);
      
      try {
        const profiles = await cvService.getAllCandidateProfiles();
        const existing = profiles.find(p => p.fullName.toLowerCase() === name.toLowerCase());
        
        if (existing && existing.id) {
          navigate('/');
        } else {
          // Auto-create a profile for the new user
          const newProfile = await cvService.saveCandidateProfile({
            fullName: name,
            jobTitle: '',
            skills: [],
            experiences: [],
            projects: [],
            certifications: [],
            mediaPosts: [],
          });
          navigate('/edit/' + newProfile.id);
        }
      } catch (error) {
        console.error('Error handling login', error);
        navigate('/');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={vpitchLogo} alt="V-Pitch logo" className="auth-logo" />
        <h1 className="auth-title">Welcome to V-Pitch</h1>
        <p className="auth-subtitle">Enter your name to connect or create your profile.</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="form-label">
            Full Name
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. John Doe"
              required
            />
          </label>
          <button type="submit" className="btn btn--primary auth-btn">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
