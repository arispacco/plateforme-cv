import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, Download, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { cvService } from '../services/cvService';
import type { CandidateProfile } from '../types/cv';
import { SkillBadge } from '../components/SkillTags';
import vpitchLogo from '../assets/vpitch-logo.svg';


const getDeviconClass = (skill: string) => {
  const s = skill.toLowerCase();
  if (s.includes('react')) return 'devicon-react-original colored';
  if (s.includes('node')) return 'devicon-nodejs-plain colored';
  if (s.includes('js') || s.includes('javascript')) return 'devicon-javascript-plain colored';
  if (s.includes('ts') || s.includes('typescript')) return 'devicon-typescript-plain colored';
  if (s.includes('html')) return 'devicon-html5-plain colored';
  if (s.includes('css')) return 'devicon-css3-plain colored';
  if (s.includes('python')) return 'devicon-python-plain colored';
  if (s.includes('java') && !s.includes('script')) return 'devicon-java-plain colored';
  if (s.includes('git')) return 'devicon-git-plain colored';
  if (s.includes('docker')) return 'devicon-docker-plain colored';
  if (s.includes('aws')) return 'devicon-amazonwebservices-plain-wordmark colored';
  if (s.includes('figma')) return 'devicon-figma-plain colored';
  if (s.includes('vue')) return 'devicon-vuejs-plain colored';
  if (s.includes('angular')) return 'devicon-angularjs-plain colored';
  if (s.includes('sql') || s.includes('postgres')) return 'devicon-postgresql-plain colored';
  if (s.includes('mongo')) return 'devicon-mongodb-plain colored';
  if (s.includes('c++') || s === 'cpp') return 'devicon-cplusplus-plain colored';
  if (s.includes('c#') || s === 'csharp') return 'devicon-csharp-plain colored';
  if (s === 'c') return 'devicon-c-plain colored';
  if (s.includes('.net') || s.includes('dotnet')) return 'devicon-dot-net-plain-wordmark colored';
  if (s.includes('django')) return 'devicon-django-plain colored';
  if (s.includes('flutter')) return 'devicon-flutter-plain colored';
  if (s.includes('php')) return 'devicon-php-plain colored';
  if (s.includes('ruby')) return 'devicon-ruby-plain colored';
  if (s.includes('go') || s.includes('golang')) return 'devicon-go-plain colored';
  if (s.includes('rust')) return 'devicon-rust-plain colored';
  if (s.includes('swift')) return 'devicon-swift-plain colored';
  if (s.includes('kotlin')) return 'devicon-kotlin-plain colored';
  if (s.includes('laravel')) return 'devicon-laravel-plain colored';
  if (s.includes('spring')) return 'devicon-spring-plain colored';
  return null;
};
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
        <Link to="/" className="preview-topnav-brand" style={{textDecoration: 'none', color: 'inherit'}}>
          <img src={vpitchLogo} alt="V-Pitch logo" className="preview-topnav-logo" />
          V-Pitch
        </Link>
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
                        {cert.mediaBlob && (
                          <div style={{marginTop: 12}}>
                            {cert.mediaBlob.type.startsWith('image/') ? (
                              <img src={URL.createObjectURL(cert.mediaBlob)} alt={cert.title} className="cert-media-preview" />
                            ) : (
                              <a href={URL.createObjectURL(cert.mediaBlob)} target="_blank" rel="noopener noreferrer" className="btn btn--outline-sm">
                                <ExternalLink size={14} /> View Certificate File
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

                    {activeTab === 'portfolio' && (
            <div className="portfolio-container">
              <h2 className="portfolio-header">My Professional Showcase</h2>

              {profile.skills.length > 0 && (
                <div style={{marginBottom: 48}}>
                  <span className="section-badge">Tech Stack</span>
                  <div className="portfolio-skills-grid">
                    {profile.skills.map((skill) => {
                      const iconClass = getDeviconClass(skill);
                      return (
                        <div key={skill} className="portfolio-skill-card">
                          {iconClass ? (
                            <i className={iconClass + ' portfolio-skill-icon'}></i>
                          ) : (
                            <div className="portfolio-skill-icon" style={{color: '#ccc', fontSize: 24, fontWeight: 'bold'}}>{skill[0].toUpperCase()}</div>
                          )}
                          <span className="portfolio-skill-name">{skill}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              
              {(profile.mediaPosts ?? []).filter(m => m.type !== 'text' || (m.type === 'text' && m.text)).length > 0 && (
                <div style={{marginBottom: 48}}>
                  <span className="section-badge">Media Gallery</span>
                  <div className="portfolio-grid">
                    {(profile.mediaPosts ?? []).map((media) => (
                      <div key={media.id} className="portfolio-item-card">
                        {media.type === 'image' && media.blob && (
                          <img src={URL.createObjectURL(media.blob)} alt={media.caption || 'Media'} className="portfolio-item-media" style={{height: 200, objectFit: 'cover'}} />
                        )}
                        {media.type === 'video' && media.blob && (
                          <video src={URL.createObjectURL(media.blob)} controls className="portfolio-item-media" style={{height: 200, objectFit: 'cover', background: '#000'}} />
                        )}
                        {media.type === 'text' && (
                          <div className="portfolio-item-media" style={{height: 200, padding: 16, background: '#f8f9fa', overflowY: 'auto'}}>
                            {media.text}
                          </div>
                        )}
                        {media.caption && (
                          <div className="portfolio-item-body" style={{padding: '12px 20px', flex: 'none'}}>
                            <p className="portfolio-item-desc" style={{margin: 0}}>{media.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(profile.projects ?? []).length > 0 && (
                <div style={{marginBottom: 48}}>
                  <span className="section-badge">Featured Projects</span>
                  <div className="portfolio-grid">
                    {(profile.projects ?? []).map((proj) => (
                      <div key={proj.id} className="portfolio-item-card">
                        {proj.screenshotBlob && (
                          <img src={URL.createObjectURL(proj.screenshotBlob)} alt={proj.title} className="portfolio-item-media" />
                        )}
                        <div className="portfolio-item-body">
                          <h4 className="portfolio-item-title">{proj.title}</h4>
                          <p className="portfolio-item-desc">{proj.description}</p>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="portfolio-item-link">
                              <ExternalLink size={16} /> Open Project
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(profile.certifications ?? []).length > 0 && (
                <div>
                  <span className="section-badge">Certifications & Awards</span>
                  <div className="portfolio-grid">
                    {(profile.certifications ?? []).map((cert) => (
                      <div key={cert.id} className="portfolio-item-card">
                        {cert.mediaBlob && cert.mediaBlob.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(cert.mediaBlob)} alt={cert.title} className="portfolio-item-media" style={{objectFit: 'contain', background: '#fff'}} />
                        ) : (
                          <div className="portfolio-item-media" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2ff'}}>
                            <ExternalLink size={40} color="var(--color-primary)" opacity={0.5} />
                          </div>
                        )}
                        <div className="portfolio-item-body">
                          <h4 className="portfolio-item-title">{cert.title}</h4>
                          <p className="portfolio-item-desc">
                            {[cert.issuer, cert.date].filter(Boolean).join(' • ')}
                          </p>
                          <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                            {cert.credentialUrl && (
                              <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="portfolio-item-link">
                                <ExternalLink size={16} /> Verify
                              </a>
                            )}
                            {cert.mediaBlob && !cert.mediaBlob.type.startsWith('image/') && (
                              <a href={URL.createObjectURL(cert.mediaBlob)} target="_blank" rel="noopener noreferrer" className="portfolio-item-link">
                                <Download size={16} /> View Document
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.projects?.length === 0 && profile.certifications?.length === 0 && (
                <p className="preview-empty">This portfolio is currently empty. Add projects and certifications to showcase your work.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
