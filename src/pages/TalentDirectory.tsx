import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Briefcase, Download, Search, ChevronDown, Clock, Star, ExternalLink } from 'lucide-react';
import { cvService } from '../services/cvService';
import type { CandidateProfile } from '../types/cv';
import { SkillBadge } from '../components/SkillTags';

function FeedItem({ profile }: { profile: CandidateProfile }) {
  const photoUrl = useMemo(() => {
    if (!profile.photoBlob) return undefined;
    return URL.createObjectURL(profile.photoBlob);
  }, [profile.photoBlob]);

  const mediaItems = useMemo(() => {
    const items = [...(profile.mediaPosts ?? [])];
    if (profile.vPitchBlob) {
      items.unshift({
        id: `__legacy_vpitch_${profile.id ?? 'unsaved'}`,
        type: 'video',
        caption: 'Video pitch',
        blob: profile.vPitchBlob,
      });
    }
    return items.filter((item) => (item.type === 'text' ? Boolean(item.text?.trim()) : Boolean(item.blob)));
  }, [profile.id, profile.mediaPosts, profile.vPitchBlob]);

  const mediaUrls = useMemo(
    () =>
      mediaItems.map((item) => {
        if (item.type === 'text') return undefined;
        return URL.createObjectURL(item.blob);
      }),
    [mediaItems],
  );

  const projectImageUrls = useMemo(
    () => (profile.projects ?? []).map((project) => (project.screenshotBlob ? URL.createObjectURL(project.screenshotBlob) : undefined)),
    [profile.projects],
  );

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      mediaUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      projectImageUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [photoUrl, mediaUrls, projectImageUrls]);

  const initials = profile.fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <article className="feed-card">
      <header className="feed-card-header">
        <div className="feed-card-avatar">
          {photoUrl ? <img src={photoUrl} alt={profile.fullName} className="feed-card-photo" /> : <span>{initials || '?'}</span>}
        </div>
        <div className="feed-card-identity">
          <h2 className="feed-card-name">{profile.fullName || 'Unnamed'}</h2>
          <p className="feed-card-title">{profile.jobTitle || 'No title'}</p>
        </div>
      </header>

      {(profile.location || profile.availability || profile.rating !== undefined) && (
        <div className="feed-meta-row">
          {profile.location && (
            <span className="feed-meta-item">
              <MapPin size={13} />
              {profile.location}
            </span>
          )}
          {profile.availability && (
            <span className="feed-meta-item">
              <Clock size={13} />
              {profile.availability}
            </span>
          )}
          {profile.rating !== undefined && (
            <span className="feed-meta-item feed-meta-item--rating">
              <Star size={13} fill="currentColor" />
              {profile.rating.toFixed(1)}
            </span>
          )}
        </div>
      )}

      {profile.bio && <p className="feed-bio">{profile.bio}</p>}

      {mediaItems.length > 0 && (
        <section className="feed-section">
          <h3 className="feed-section-title">V-Pitch Updates</h3>
          <div className="feed-media-strip">
            {mediaItems.map((item, index) => (
              <div key={item.id} className="feed-media-item">
                {item.type === 'video' && mediaUrls[index] && (
                  <video controls src={mediaUrls[index]} className="feed-media-visual" />
                )}
                {item.type === 'image' && mediaUrls[index] && (
                  <img src={mediaUrls[index]} alt={item.caption ?? `${profile.fullName}'s media post`} className="feed-media-visual" />
                )}
                {item.type === 'text' && (
                  <div className="feed-media-text">
                    <p>{item.text}</p>
                  </div>
                )}
                {item.caption && <p className="feed-media-caption">{item.caption}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {(profile.projects ?? []).length > 0 && (
        <section className="feed-section">
          <h3 className="feed-section-title">Portfolio</h3>
          <div className="feed-project-list">
            {(profile.projects ?? []).map((project, index) => (
              <article key={project.id} className="feed-project-card">
                {projectImageUrls[index] && (
                  <img src={projectImageUrls[index]} alt={`${project.title || 'Project'} screenshot`} className="feed-project-image" />
                )}
                <div className="feed-project-content">
                  <div className="feed-project-row">
                    <h4 className="feed-project-title">{project.title || 'Untitled project'}</h4>
                    {project.featured && <span className="feed-project-featured">Featured</span>}
                  </div>
                  <p className="feed-project-description">{project.description || 'No description yet.'}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="feed-project-link">
                      <ExternalLink size={12} />
                      Open project
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {(profile.certifications ?? []).length > 0 && (
        <section className="feed-section">
          <h3 className="feed-section-title">Certifications</h3>
          <div className="feed-project-list">
            {(profile.certifications ?? []).map((cert) => (
              <article key={cert.id} className="feed-project-card">
                <div className="feed-project-content">
                  <div className="feed-project-row">
                    <h4 className="feed-project-title">{cert.title || 'Untitled certification'}</h4>
                  </div>
                  <p className="feed-project-description">
                    {[cert.issuer, cert.date].filter(Boolean).join(' • ') || 'No details yet.'}
                  </p>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="feed-project-link">
                      <ExternalLink size={12} />
                      View credential
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {profile.skills.length > 0 && (
        <section className="feed-section">
          <h3 className="feed-section-title">Skills</h3>
          <div className="feed-skills-wrap">
            {profile.skills.map((skill, index) => (
              <SkillBadge key={`${profile.id ?? 'profile'}-${skill}-${index}`} skill={skill} />
            ))}
          </div>
        </section>
      )}

      {profile.experiences.length > 0 && (
        <section className="feed-section">
          <h3 className="feed-section-title">Experience</h3>
          <div className="feed-experience-list">
            {profile.experiences.map((experience) => (
              <article key={experience.id} className="feed-experience-item">
                <div className="feed-experience-header">
                  <h4>
                    <Briefcase size={13} />
                    <span>{experience.title || 'Role'}</span>
                  </h4>
                  <span>{experience.company || 'Company'}</span>
                </div>
                {(experience.startDate || experience.endDate) && (
                  <p className="feed-experience-dates">
                    {experience.startDate || '—'} - {experience.endDate || 'Present'}
                  </p>
                )}
                {experience.description && <p className="feed-experience-description">{experience.description}</p>}
              </article>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

export function TalentDirectory() {
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  useEffect(() => {
    cvService
      .getAllCandidateProfiles()
      .then(setProfiles)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const allSkills = Array.from(new Set(profiles.flatMap((p) => p.skills))).sort();

  const filtered = profiles.filter((p) => {
    const matchesSearch =
      !search ||
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesSkill = !skillFilter || p.skills.includes(skillFilter);

    return matchesSearch && matchesSkill;
  });

  return (
    <div className="directory-page directory-page--feed">
      <div className="directory-topbar">
        <div className="directory-search-wrap">
          <Search size={16} className="directory-search-icon" />
          <input
            className="directory-search"
            placeholder="Search by name, job title, or skills..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        <div className="directory-filters">
          <div className="filter-select-wrap">
            <select
              className="filter-select"
              value={skillFilter}
              onChange={(e) => {
                setSkillFilter(e.target.value);
              }}
            >
              <option value="">Filter by Skills</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="filter-select-chevron" />
          </div>
        </div>
      </div>

      <div className="directory-header">
        <div>
          <h1 className="directory-title">Home Feed</h1>
          <p className="directory-subtitle">
            {isLoading ? 'Loading…' : `${filtered.length} profile update${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="directory-actions">
          <Link to="/edit" className="btn btn--primary">
            <Plus size={16} />
            Update Profile
          </Link>
          <button type="button" className="btn btn--outline">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="directory-empty">Loading profiles…</p>
      ) : filtered.length === 0 ? (
        <div className="directory-empty-state">
          <p>No profile updates found.</p>
          <Link to="/edit" className="btn btn--primary">
            <Plus size={16} /> Add your first profile
          </Link>
        </div>
      ) : (
        <div className="feed-list">
          {filtered.map((profile) => (
            <FeedItem key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
