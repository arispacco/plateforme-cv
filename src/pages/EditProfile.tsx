import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Camera, Plus, X } from 'lucide-react';
import { cvService } from '../services/cvService';
import type { CandidateProfile, Certification, Experience, MediaPost, Project } from '../types/cv';
import { SkillTags } from '../components/SkillTags';
import { VideoUpload } from '../components/VideoUpload';

const createEmptyExperience = (): Experience => ({
  id: crypto.randomUUID(),
  title: '',
  company: '',
  startDate: '',
  endDate: '',
  description: '',
});

const createEmptyProject = (): Project => ({
  id: crypto.randomUUID(),
  title: '',
  description: '',
  link: '',
  featured: false,
});

const createEmptyCertification = (): Certification => ({
  id: crypto.randomUUID(),
  title: '',
  issuer: '',
  date: '',
  credentialUrl: '',
  mediaBlob: undefined,
});

const createEmptyTextMediaPost = (): MediaPost => ({
  id: crypto.randomUUID(),
  type: 'text',
  caption: '',
  text: '',
});

const createEmptyProfile = (): CandidateProfile => ({
  fullName: '',
  jobTitle: '',
  bio: '',
  location: '',
  availability: 'Full-time',
  rating: undefined,
  skills: [],
  experiences: [createEmptyExperience()],
  projects: [],
  certifications: [],
  mediaPosts: [],
});

export function EditProfile() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<CandidateProfile>(createEmptyProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        let profile: CandidateProfile | undefined;
        if (id) {
          profile = await cvService.getCandidateProfileById(Number(id));
        }
        if (profile) {
          setDraft({
            ...profile,
            experiences: profile.experiences.length ? profile.experiences : [createEmptyExperience()],
            projects: profile.projects ?? [],
            certifications: profile.certifications ?? [],
            mediaPosts: profile.mediaPosts ?? [],
          });
        } else {
          setDraft(createEmptyProfile());
        }
      } catch {
        setError('Unable to load profile.');
      } finally {
        setIsLoading(false);
      }
    };
    void loadProfile();
  }, [id]);

  const photoUrl = useMemo(() => {
    if (draft.photoBlob) return URL.createObjectURL(draft.photoBlob);
    return undefined;
  }, [draft.photoBlob]);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const initials = draft.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const set = <K extends keyof CandidateProfile>(key: K, value: CandidateProfile[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const setExperience = (expId: string, key: keyof Experience, value: string) => {
    setDraft((d) => ({
      ...d,
      experiences: d.experiences.map((e) =>
        e.id === expId ? { ...e, [key]: value } : e,
      ),
    }));
  };

  const removeExperience = (expId: string) => {
    setDraft((d) => ({
      ...d,
      experiences: d.experiences.filter((e) => e.id !== expId),
    }));
  };

  const setProject = (projId: string, key: keyof Project, value: string | boolean) => {
    setDraft((d) => ({
      ...d,
      projects: (d.projects ?? []).map((p) =>
        p.id === projId ? { ...p, [key]: value } : p,
      ),
    }));
  };

  const removeProject = (projId: string) => {
    setDraft((d) => ({
      ...d,
      projects: (d.projects ?? []).filter((p) => p.id !== projId),
    }));
  };

  const setCertification = (certId: string, key: keyof Certification, value: string) => {
    setDraft((d) => ({
      ...d,
      certifications: (d.certifications ?? []).map((c) =>
        c.id === certId ? { ...c, [key]: value } : c,
      ),
    }));
  };

  
  const setCertificationMedia = (certId: string, file: File | null) => {
    setDraft((d) => ({
      ...d,
      certifications: (d.certifications ?? []).map((c) =>
        c.id === certId ? { ...c, mediaBlob: file || undefined } : c,
      ),
    }));
  };
const removeCertification = (certId: string) => {
    setDraft((d) => ({
      ...d,
      certifications: (d.certifications ?? []).filter((c) => c.id !== certId),
    }));
  };

  const setMediaCaption = (mediaId: string, caption: string) => {
    setDraft((d) => ({
      ...d,
      mediaPosts: (d.mediaPosts ?? []).map((m) =>
        m.id === mediaId ? { ...m, caption } : m,
      ),
    }));
  };

  const setMediaText = (mediaId: string, text: string) => {
    setDraft((d) => ({
      ...d,
      mediaPosts: (d.mediaPosts ?? []).map((m) =>
        m.id === mediaId && m.type === 'text' ? { ...m, text } : m,
      ),
    }));
  };

  const removeMediaPost = (mediaId: string) => {
    setDraft((d) => ({
      ...d,
      mediaPosts: (d.mediaPosts ?? []).filter((m) => m.id !== mediaId),
    }));
  };

  const addMediaFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const nextMedia: MediaPost[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        nextMedia.push({
          id: crypto.randomUUID(),
          type: 'image',
          caption: '',
          blob: file,
        });
      } else if (file.type.startsWith('video/')) {
        nextMedia.push({
          id: crypto.randomUUID(),
          type: 'video',
          caption: '',
          blob: file,
        });
      }
    });
    if (nextMedia.length) {
      setDraft((d) => ({ ...d, mediaPosts: [...(d.mediaPosts ?? []), ...nextMedia] }));
    }
  };

  
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Basic validation
        if (json && json.fullName) {
          setDraft(d => ({ ...d, ...json, id: d.id, userId: d.userId }));
        } else {
          alert('Invalid profile JSON');
        }
      } catch (err) {
        alert('Error parsing JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
const onSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const profileToSave: CandidateProfile = {
        ...draft,
        fullName: draft.fullName.trim(),
        jobTitle: draft.jobTitle.trim(),
        experiences: draft.experiences.filter(
          (e) => e.title || e.company || e.description,
        ),
        projects: (draft.projects ?? []).filter((p) => p.title || p.description),
        certifications: (draft.certifications ?? []).filter(
          (c) => c.title || c.issuer || c.date || c.credentialUrl,
        ),
        mediaPosts: (draft.mediaPosts ?? []).filter((m) => {
          if (m.type === 'text') return Boolean(m.text.trim());
          return Boolean(m.blob);
        }),
      };
      const saved = await cvService.saveCandidateProfile(profileToSave);
      navigate(`/profile/${saved.id}`);
    } catch {
      setError('Unable to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="edit-profile-page">
        <p className="loading-text">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-breadcrumb">
        <span>User Settings</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Edit Profile</span>
      </div>

      <h1 className="edit-profile-title">Edit Profile</h1>

      {error && <p className="form-error">{error}</p>}

      <div className="edit-profile-card">
        {/* Photo section */}
        <div className="edit-profile-photo-section">
          <div className="edit-profile-avatar">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="edit-profile-avatar-img" />
            ) : (
              <span className="edit-profile-avatar-initials">{initials || '?'}</span>
            )}
          </div>
          <div className="edit-profile-photo-actions">
            <button
              type="button"
              className="btn btn--outline-sm"
              onClick={() => photoInputRef.current?.click()}
            >
              <Camera size={14} /> Upload Photo
            </button>
            {photoUrl && (
              <button
                type="button"
                className="btn btn--outline-sm btn--danger"
                onClick={() => set('photoBlob', undefined)}
              >
                Remove Photo
              </button>
            )}
          </div>
          <p className="edit-profile-avatar-name">{draft.fullName || 'Full Name'}</p>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden-input"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) set('photoBlob', file);
            }}
          />
          <input
            ref={mediaInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden-input"
            onChange={(e) => {
              addMediaFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {/* Main form */}
        <div className="edit-profile-form">
          <div className="form-row">
            <label className="form-label">
              Full Name
              <input
                className="form-input"
                value={draft.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                placeholder="Sarah J. Miller"
              />
            </label>
            <label className="form-label">
              Job Title
              <input
                className="form-input"
                value={draft.jobTitle}
                onChange={(e) => set('jobTitle', e.target.value)}
                placeholder="Senior Product Designer"
              />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              Location
              <input
                className="form-input"
                value={draft.location ?? ''}
                onChange={(e) => set('location', e.target.value)}
                placeholder="San Francisco"
              />
            </label>
            <label className="form-label">
              Availability
              <select
                className="form-input"
                value={draft.availability ?? 'Full-time'}
                onChange={(e) => set('availability', e.target.value)}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Available</option>
                <option>Freelance</option>
                <option>Not available</option>
              </select>
            </label>
          </div>

          <label className="form-label">
            Bio
            <textarea
              className="form-input form-textarea"
              value={draft.bio ?? ''}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="A short summary about yourself…"
              rows={3}
            />
          </label>

          <label className="form-label">
            Skills
            <SkillTags
              skills={draft.skills}
              onChange={(skills) => set('skills', skills)}
            />
          </label>

          {/* Video Pitch */}
          <label className="form-label">
            Video Pitch
          </label>
          <VideoUpload
            value={draft.vPitchBlob}
            onChange={(file) => set('vPitchBlob', file)}
            onRemove={() => set('vPitchBlob', undefined)}
          />

          {/* Experiences */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Experience</h3>
              <button
                type="button"
                className="btn btn--outline-sm"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    experiences: [...d.experiences, createEmptyExperience()],
                  }))
                }
              >
                <Plus size={14} /> Add
              </button>
            </div>
            {draft.experiences.map((exp) => (
              <div key={exp.id} className="exp-card">
                <div className="exp-card-header">
                  <button
                    type="button"
                    className="exp-card-remove"
                    onClick={() => removeExperience(exp.id)}
                    aria-label="Remove experience"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="form-row">
                  <label className="form-label">
                    Role
                    <input
                      className="form-input"
                      value={exp.title}
                      onChange={(e) => setExperience(exp.id, 'title', e.target.value)}
                      placeholder="Lead Product Designer"
                    />
                  </label>
                  <label className="form-label">
                    Company
                    <input
                      className="form-input"
                      value={exp.company}
                      onChange={(e) => setExperience(exp.id, 'company', e.target.value)}
                      placeholder="TechCorp"
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label className="form-label">
                    Start Date
                    <input
                      className="form-input"
                      value={exp.startDate ?? ''}
                      onChange={(e) => setExperience(exp.id, 'startDate', e.target.value)}
                      placeholder="2022"
                    />
                  </label>
                  <label className="form-label">
                    End Date
                    <input
                      className="form-input"
                      value={exp.endDate ?? ''}
                      onChange={(e) => setExperience(exp.id, 'endDate', e.target.value)}
                      placeholder="Present"
                    />
                  </label>
                </div>
                <label className="form-label">
                  Description
                  <textarea
                    className="form-input form-textarea"
                    value={exp.description}
                    onChange={(e) => setExperience(exp.id, 'description', e.target.value)}
                    placeholder="What did you do?"
                    rows={2}
                  />
                </label>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Projects</h3>
              <button
                type="button"
                className="btn btn--outline-sm"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    projects: [...(d.projects ?? []), createEmptyProject()],
                  }))
                }
              >
                <Plus size={14} /> Add
              </button>
            </div>
            {(draft.projects ?? []).map((proj) => (
              <div key={proj.id} className="exp-card">
                <div className="exp-card-header">
                  <label className="featured-check">
                    <input
                      type="checkbox"
                      checked={proj.featured ?? false}
                      onChange={(e) => setProject(proj.id, 'featured', e.target.checked)}
                    />
                    Featured
                  </label>
                  <button
                    type="button"
                    className="exp-card-remove"
                    onClick={() => removeProject(proj.id)}
                    aria-label="Remove project"
                  >
                    <X size={14} />
                  </button>
                </div>
                <label className="form-label">
                  Title
                  <input
                    className="form-input"
                    value={proj.title}
                    onChange={(e) => setProject(proj.id, 'title', e.target.value)}
                    placeholder="E-commerce Platform Redesign"
                  />
                </label>
                <label className="form-label">
                  Description
                  <textarea
                    className="form-input form-textarea"
                    value={proj.description}
                    onChange={(e) => setProject(proj.id, 'description', e.target.value)}
                    placeholder="Short description…"
                    rows={2}
                  />
                </label>
                <label className="form-label">
                  Link
                  <input
                    className="form-input"
                    value={proj.link ?? ''}
                    onChange={(e) => setProject(proj.id, 'link', e.target.value)}
                    placeholder="https://…"
                  />
                </label>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Certifications</h3>
              <button
                type="button"
                className="btn btn--outline-sm"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    certifications: [...(d.certifications ?? []), createEmptyCertification()],
                  }))
                }
              >
                <Plus size={14} /> Add
              </button>
            </div>
            {(draft.certifications ?? []).map((cert) => (
              <div key={cert.id} className="exp-card">
                <div className="exp-card-header">
                  <button
                    type="button"
                    className="exp-card-remove"
                    onClick={() => removeCertification(cert.id)}
                    aria-label="Remove certification"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="form-row">
                  <label className="form-label">
                    Title
                    <input
                      className="form-input"
                      value={cert.title}
                      onChange={(e) => setCertification(cert.id, 'title', e.target.value)}
                      placeholder="AWS Certified Developer"
                    />
                  </label>
                  <label className="form-label">
                    Issuer
                    <input
                      className="form-input"
                      value={cert.issuer ?? ''}
                      onChange={(e) => setCertification(cert.id, 'issuer', e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label className="form-label">
                    Date
                    <input
                      className="form-input"
                      value={cert.date ?? ''}
                      onChange={(e) => setCertification(cert.id, 'date', e.target.value)}
                      placeholder="2026"
                    />
                  </label>
                  <label className="form-label">
                    Credential URL
                    <input
                      className="form-input"
                      value={cert.credentialUrl ?? ''}
                      onChange={(e) => setCertification(cert.id, 'credentialUrl', e.target.value)}
                      placeholder="https://…"
                    />
                  </label>
                  <label className="form-label">
                    Certificate File (Image/PDF)
                    <input
                      type="file"
                      className="form-input"
                      accept="image/*,.pdf"
                      onChange={(e) => setCertificationMedia(cert.id, e.target.files?.[0] || null)}
                    />
                    {cert.mediaBlob && <span className="media-badge" style={{marginTop: 8, display: 'inline-block'}}>File attached</span>}
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Media Updates */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Media Updates</h3>
              <div className="section-actions">
                <button
                  type="button"
                  className="btn btn--outline-sm"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      mediaPosts: [...(d.mediaPosts ?? []), createEmptyTextMediaPost()],
                    }))
                  }
                >
                  <Plus size={14} /> Text
                </button>
                <button
                  type="button"
                  className="btn btn--outline-sm"
                  onClick={() => mediaInputRef.current?.click()}
                >
                  <Plus size={14} /> Image/Video
                </button>
              </div>
            </div>

            {(draft.mediaPosts ?? []).map((media) => (
              <div key={media.id} className="exp-card">
                <div className="exp-card-header">
                  <span className="media-badge">{media.type.toUpperCase()}</span>
                  <button
                    type="button"
                    className="exp-card-remove"
                    onClick={() => removeMediaPost(media.id)}
                    aria-label="Remove media post"
                  >
                    <X size={14} />
                  </button>
                </div>
                <label className="form-label">
                  Caption
                  <input
                    className="form-input"
                    value={media.caption ?? ''}
                    onChange={(e) => setMediaCaption(media.id, e.target.value)}
                    placeholder="Write a short caption…"
                  />
                </label>
                {media.type === 'text' ? (
                  <label className="form-label">
                    Text
                    <textarea
                      className="form-input form-textarea"
                      value={media.text}
                      onChange={(e) => setMediaText(media.id, e.target.value)}
                      placeholder="Share an update…"
                      rows={3}
                    />
                  </label>
                ) : (
                  <p className="media-file-note">File attached ({media.type}).</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="edit-profile-footer">
        


            
        <label className="btn btn--outline" style={{cursor: 'pointer'}}>
          Import JSON
          <input type="file" accept=".json" style={{display: 'none'}} onChange={handleImportJson} />
        </label>
        <button type="button" className="btn btn--primary" onClick={onSave} disabled={isSaving}>
          <Save size={16} /> {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
