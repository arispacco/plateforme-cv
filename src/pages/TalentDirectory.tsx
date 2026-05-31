import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Search, ChevronDown, Star } from 'lucide-react';
import { cvService } from '../services/cvService';
import type { CandidateProfile } from '../types/cv';
import { SkillBadge } from '../components/SkillTags';


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

function FeedItem({ profile, onToggleStar }: { profile: CandidateProfile, onToggleStar: (id: number, currentStars: number) => void }) {
  const photoUrl = useMemo(() => {
    if (!profile.photoBlob) return undefined;
    return URL.createObjectURL(profile.photoBlob);
  }, [profile.photoBlob]);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

    const videoUrl = useMemo(() => {
    if (!profile.vPitchBlob) return undefined;
    return URL.createObjectURL(profile.vPitchBlob);
  }, [profile.vPitchBlob]);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const initials = profile.fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <article className="feed-card feed-card--compact">
      <header className="feed-card-header">
        <div className="feed-card-avatar">
          {photoUrl ? <img src={photoUrl} alt={profile.fullName} className="feed-card-photo" /> : <span>{initials || '?'}</span>}
        </div>
        <div className="feed-card-identity">
          <h2 className="feed-card-name">{profile.fullName || 'Unnamed'}</h2>
          <p className="feed-card-title">{profile.jobTitle || 'No title'}</p>
          {(profile.location || profile.availability) && (
            <div className="feed-meta-row" style={{marginTop: 4}}>
              {profile.location && (
                <span className="feed-meta-item">
                  <MapPin size={13} />
                  {profile.location}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="feed-card-actions" style={{marginLeft: 'auto'}}>
          <button 
            type="button"
            className={'feed-star-btn ' + (profile.stars && profile.stars > 0 ? 'starred' : '')}
            onClick={() => profile.id && onToggleStar(profile.id, profile.stars || 0)}
          >
            <Star size={14} fill={profile.stars && profile.stars > 0 ? 'currentColor' : 'none'} />
            {profile.stars || 0}
          </button>
        </div>
      </header>

      {videoUrl && (
        <Link to={'/profile/' + profile.id} style={{display: 'block', marginTop: 12, borderRadius: 8, overflow: 'hidden', height: 200, position: 'relative', textDecoration: 'none'}}>
          <video src={videoUrl} style={{width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none'}} muted playsInline />
          
        </Link>
      )}


      


      {profile.bio && <p className="feed-bio" style={{marginTop: 12, marginBottom: 16}}>{profile.bio.slice(0, 150)}{profile.bio.length > 150 ? '...' : ''}</p>}

      {profile.skills.length > 0 && (
        <div className="feed-skills-wrap" style={{marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center'}}>
          {profile.skills.slice(0, 5).map((skill, index) => {
             const iconClass = getDeviconClass(skill);
             return iconClass ? (
               <i key={'skill-'+index} className={iconClass} style={{fontSize: 24}} title={skill}></i>
             ) : (
               <SkillBadge key={'skill-'+index} skill={skill} />
             );
          })}
          {profile.skills.length > 5 && <span className="skill-badge-more">+{profile.skills.length - 5}</span>}
        </div>
      )}

      <div className="feed-card-footer" style={{borderTop: '1px solid var(--color-border)', paddingTop: 12}}>
        <Link to={'/profile/' + profile.id} className="btn btn--outline" style={{width: '100%', justifyContent: 'center'}}>
          Voir le profil détaillé
        </Link>
      </div>
    </article>
  );
}

export function TalentDirectory({ isFeed = true }: { isFeed?: boolean }) {
  const handleToggleStar = async (id: number, currentStars: number) => {
    const updated = await cvService.toggleStarProfile(id, currentStars === 0);
    if (updated) {
      setProfiles(prev => prev.map(p => p.id === id ? updated : p));
    }
  };
    
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('recent');

  useEffect(() => {
    cvService
      .getAllCandidateProfiles()
      .then(setProfiles)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const allSkills = Array.from(new Set(profiles.flatMap((p) => p.skills))).sort();

  const filteredAndSorted = useMemo(() => {
    let result = profiles.filter((p) => {
      const matchesSearch =
        !search ||
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        p.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchesSkill = !skillFilter || p.skills.includes(skillFilter);
      return matchesSearch && matchesSkill;
    });

    if (sortFilter === 'stars_3') {
      result = result.filter(p => (p.stars || 0) >= 3);
    }

    result.sort((a, b) => {
      if (sortFilter === 'stars' || sortFilter === 'stars_3') {
        return (b.stars || 0) - (a.stars || 0);
      }
      if (sortFilter === 'skills') {
        return (b.skills?.length || 0) - (a.skills?.length || 0);
      }
      return 0;
    });

    return result;
  }, [profiles, search, skillFilter, sortFilter]);

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

        {!isFeed && (
          <div className="directory-filters">
            <div className="filter-select-wrap" style={{ marginRight: 16 }}>
              <select
                className="filter-select"
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
              >
                <option value="recent">Plus récents</option>
                <option value="stars">Plus d'étoiles</option>
                <option value="stars_3">+ de 3 étoiles</option>
                <option value="skills">Plus de compétences</option>
              </select>
              <ChevronDown size={14} className="filter-select-chevron" />
            </div>
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
        )}
      </div>

      <div className="directory-header">
        <div>
          <h1 className="directory-title">{isFeed ? 'Home Feed' : 'Talent Directory'}</h1>
          <p className="directory-subtitle">
            {isLoading ? 'Loading…' : `${filteredAndSorted.length} profile update${filteredAndSorted.length !== 1 ? 's' : ''}`}
          </p>
        </div>


      </div>

      {isLoading ? (
        <p className="directory-empty">Loading profiles…</p>
      ) : filteredAndSorted.length === 0 ? (
        <div className="directory-empty-state">
          <p>No profile updates found.</p>
          <Link to="/edit" className="btn btn--primary">
            <Plus size={16} /> Add your first profile
          </Link>
        </div>
      ) : (
        <div className={`feed-list ${!isFeed ? "grid-view" : ""}`}>
          {filteredAndSorted.map((profile) => (
            <FeedItem key={profile.id} profile={profile} onToggleStar={handleToggleStar} />
          ))}
        </div>
      )}
    </div>
  );
}
