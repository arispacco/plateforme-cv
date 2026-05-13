import { useEffect, useMemo } from 'react';
import { MapPin, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CandidateProfile } from '../types/cv';
import { SkillBadge } from './SkillTags';

interface CandidateCardProps {
  profile: CandidateProfile;
}

export function CandidateCard({ profile }: CandidateCardProps) {
  const photoUrl = useMemo(() => {
    if (profile.photoBlob) return URL.createObjectURL(profile.photoBlob);
    return undefined;
  }, [profile.photoBlob]);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const initials = profile.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="candidate-card">
      <div className="candidate-card-header">
        <div className="candidate-card-avatar">
          {photoUrl ? (
            <img src={photoUrl} alt={profile.fullName} className="candidate-card-photo" />
          ) : (
            <span className="candidate-card-initials">{initials || '?'}</span>
          )}
        </div>
        <div className="candidate-card-info">
          <h3 className="candidate-card-name">{profile.fullName || 'Unnamed'}</h3>
          <p className="candidate-card-title">{profile.jobTitle || 'No title'}</p>
        </div>
        {profile.id !== undefined && (
          <Link to={`/profile/${profile.id}`} className="candidate-card-link">
            View Profile
          </Link>
        )}
      </div>

      <div className="candidate-card-skills">
        {profile.skills.slice(0, 4).map((skill) => (
          <SkillBadge key={skill} skill={skill} />
        ))}
        {profile.skills.length > 4 && (
          <span className="candidate-card-more">+{profile.skills.length - 4}</span>
        )}
      </div>

      <div className="candidate-card-meta">
        {profile.location && (
          <span className="candidate-card-meta-item">
            <MapPin size={13} />
            {profile.location}
          </span>
        )}
        {profile.availability && (
          <span className="candidate-card-meta-item">
            <Clock size={13} />
            {profile.availability}
          </span>
        )}
        {profile.rating !== undefined && (
          <span className="candidate-card-meta-item candidate-card-rating">
            <Star size={13} fill="currentColor" />
            {profile.rating.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}
