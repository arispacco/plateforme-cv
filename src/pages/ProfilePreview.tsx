import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, Download, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { cvService } from '../services/cvService';
import type { CandidateProfile } from '../types/cv';
import { SkillBadge } from '../components/SkillTags';
import vpitchLogo from '../assets/vpitch-logo.svg';

export function ProfilePreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CandidateProfile | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resume' | 'portfolio'>('resume');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    cvService
      .getCandidateProfileById(Number(id))
      .then(setProfile)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const videoUrl = useMemo(() => {
    if (profile?.vPitchBlob) return URL.createObjectURL(profile.vPitchBlob);
    return undefined;
  }, [profile]);

  const photoUrl = useMemo(() => {
    if (profile?.photoBlob) return URL.createObjectURL(profile.photoBlob);
    return undefined;
  }, [profile]);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [videoUrl, photoUrl]);

  const handleDelete = async () => {
    if (!profile?.id || !confirm('Delete this profile?')) return;
    await cvService.deleteCandidateProfile(profile.id);
    navigate('/');
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="preview-page">
        <p className="loading-text">Loading profile…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="preview-page">
        <p>Profile not found.</p>
        <Link to="/" className="btn btn--primary">
          Back to Directory
        </Link>
      </div>
    );
  }

  const initials = profile.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="preview-page">
      {/* Top nav */}
      <header className="preview-topnav">
        <div className="preview-topnav-brand">
          <img src={vpitchLogo} alt="V-Pitch logo" className="preview-topnav-logo" />
          V-Pitch
        </div>
        <nav className="preview-topnav-tabs">
          <button
            type="button"
            className={`preview-tab ${activeTab === 'resume' ? 'preview-tab--active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            Resume
          </button>
          <button
            type="button"
            className={`preview-tab ${activeTab === 'portfolio' ? 'preview-tab--active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            Portfolio
          </button>
        </nav>
        <div className="preview-topnav-actions">
          <Link to={`/edit/${profile.id}`} className="btn btn--outline-sm">
            <Edit2 size={14} /> Edit
          </Link>
          <button type="button" className="btn btn--outline-sm btn--danger" onClick={handleDelete}>
            <Trash2 size={14} />
          </button>
          <button type="button" className="btn btn--primary" onClick={handlePrint}>
            <Download size={14} /> Download Resume
          </button>
        </div>
      </header>

      <div className="preview-body" ref={printRef}>
        {/* Left: video pitch */}
        <div className="preview-left">
          <h2 className="preview-pitch-heading">Personal Introduction Pitch</h2>
          {videoUrl ? (
            <video
              controls
              src={videoUrl}
              className="preview-video"
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="preview-no-video">
              <p>No video pitch uploaded.</p>
              <Link to={`/edit/${profile.id}`} className="btn btn--outline-sm">
                Upload Video
              </Link>
            </div>
          )}
        </div>

        {/* Right: CV */}
        <div className="preview-right">
          <div className="preview-cv-header">
            <div className="preview-cv-avatar">
              {photoUrl ? (
                <img src={photoUrl} alt={profile.fullName} className="preview-cv-avatar-img" />
              ) : (
                <span className="preview-cv-avatar-initials">{initials}</span>
              )}
            </div>
            <div>
              <h1 className="preview-cv-name">{profile.fullName}</h1>
              <p className="preview-cv-title">{profile.jobTitle}</p>
            </div>
          </div>

          {profile.bio && <p className="preview-cv-bio">{profile.bio}</p>}

          {profile.skills.length > 0 && (
            <div className="preview-cv-section">
              <h3 className="preview-cv-section-label">SKILLS</h3>
              <div className="preview-cv-skills">
                {profile.skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
              </div>
            </div>
          )}

          {profile.location && (
            <p className="preview-cv-location">
              <MapPin size={14} /> {profile.location}
            </p>
          )}

          {activeTab === 'resume' && (
            <>
              {profile.experiences.length > 0 && (
                <div className="preview-cv-section">
                  <h3 className="preview-cv-section-label">EXPERIENCE</h3>
                  <div className="preview-timeline">
                    {profile.experiences.map((exp) => (
                      <div key={exp.id} className="preview-timeline-item">
                        <div className="preview-timeline-date">
                          {exp.startDate && exp.endDate ? (
                            <span>{exp.startDate} – {exp.endDate}</span>
                          ) : exp.startDate ? (
                            <span>{exp.startDate} – Present</span>
                          ) : (
                            <span>{exp.endDate ?? '—'}</span>
                          )}
                        </div>
                        <div className="preview-timeline-content">
                          <div className="preview-timeline-dot" />
                          <h4 className="preview-timeline-role">
                            {exp.title} {exp.company && <span>at {exp.company}</span>}
                          </h4>
                          {exp.description && (
                            <p className="preview-timeline-desc">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(profile.certifications ?? []).length > 0 && (
                <div className="preview-cv-section">
                  <h3 className="preview-cv-section-label">CERTIFICATIONS</h3>
                  <div className="preview-projects">
                    {(profile.certifications ?? []).map((cert) => (
                      <div key={cert.id} className="preview-project-card">
                        <h4 className="preview-project-title">{cert.title}</h4>
                        {(cert.issuer || cert.date) && (
                          <p className="preview-project-desc">{[cert.issuer, cert.date].filter(Boolean).join(' • ')}</p>
                        )}
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="preview-project-link"
                          >
                            <ExternalLink size={12} /> View credential
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'portfolio' && (
            <>
              {(profile.projects ?? []).length > 0 ? (
                <div className="preview-cv-section">
                  <h3 className="preview-cv-section-label">PROJECTS</h3>
                  <div className="preview-projects">
                    {(profile.projects ?? []).map((proj) => (
                      <div key={proj.id} className="preview-project-card">
                        {proj.featured && (
                          <span className="preview-project-featured">Featured</span>
                        )}
                        <h4 className="preview-project-title">{proj.title}</h4>
                        <p className="preview-project-desc">{proj.description}</p>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="preview-project-link"
                          >
                            <ExternalLink size={12} /> Featured project →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="preview-empty">No projects added yet.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
