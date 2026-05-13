import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, Save, Upload } from 'lucide-react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { useCVSync } from './hooks/useCVSync';
import type { CandidateProfile, Experience } from './types/cv';

const createEmptyExperience = (): Experience => ({
  id: crypto.randomUUID(),
  title: '',
  company: '',
  description: '',
});

const emptyProfile: CandidateProfile = {
  fullName: '',
  jobTitle: '',
  skills: [],
  experiences: [createEmptyExperience()],
};

function App() {
  const navigate = useNavigate();
  const { profile, isLoading, error, saveProfile } = useCVSync();
  const [draft, setDraft] = useState<CandidateProfile | null>(null);
  const [skillsInput, setSkillsInput] = useState<string | null>(null);

  const resolvedDraft = useMemo(() => {
    if (draft) {
      return draft;
    }

    if (!profile) {
      return emptyProfile;
    }

    return {
      ...profile,
      experiences: profile.experiences.length ? profile.experiences : [createEmptyExperience()],
    };
  }, [draft, profile]);

  const resolvedSkillsInput = skillsInput ?? profile?.skills.join(', ') ?? '';

  const previewBlob = profile?.vPitchBlob;
  const previewUrl = useMemo(() => {
    if (!previewBlob) {
      return undefined;
    }

    return URL.createObjectURL(previewBlob);
  }, [previewBlob]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const setExperience = (experienceId: string, key: keyof Experience, value: string) => {
    setDraft((currentDraft) => ({
      ...(currentDraft ?? resolvedDraft),
      experiences: (currentDraft ?? resolvedDraft).experiences.map((experience) =>
        experience.id === experienceId ? { ...experience, [key]: value } : experience,
      ),
    }));
  };

  const onSave = async () => {
    const profileToSave: CandidateProfile = {
      ...resolvedDraft,
      fullName: resolvedDraft.fullName.trim(),
      jobTitle: resolvedDraft.jobTitle.trim(),
      skills: resolvedSkillsInput
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      experiences: resolvedDraft.experiences.filter(
        (experience) => experience.title || experience.company || experience.description,
      ),
    };

    const savedProfile = await saveProfile(profileToSave);
    if (savedProfile) {
      navigate('/preview');
    }
  };

  return (
    <div className="app">
      <header>
        <h1>V-Pitch</h1>
        <p>Local-first CV and portfolio editor.</p>
        <nav>
          <Link to="/">Edit Profile</Link>
          <Link to="/preview">Preview</Link>
        </nav>
      </header>

      {isLoading && <p>Loading profile from local storage...</p>}
      {error && <p className="error">{error}</p>}

      {!isLoading && (
        <Routes>
          <Route
            path="/"
            element={
              <section className="panel" aria-label="candidate profile form">
                <h2>
                  <BriefcaseBusiness size={18} /> Candidate Profile
                </h2>

                <label>
                  Full name
                  <input
                    value={resolvedDraft.fullName}
                    onChange={(event) => {
                      const fullName = event.target.value;
                      setDraft((currentDraft) => ({
                        ...(currentDraft ?? resolvedDraft),
                        fullName,
                      }));
                    }}
                    placeholder="Jane Doe"
                  />
                </label>

                <label>
                  Job title
                  <input
                    value={resolvedDraft.jobTitle}
                    onChange={(event) => {
                      const jobTitle = event.target.value;
                      setDraft((currentDraft) => ({
                        ...(currentDraft ?? resolvedDraft),
                        jobTitle,
                      }));
                    }}
                    placeholder="Frontend Engineer"
                  />
                </label>

                <label>
                  Skills (comma-separated)
                  <input
                    value={resolvedSkillsInput}
                    onChange={(event) => {
                      setSkillsInput(event.target.value);
                    }}
                    placeholder="React, TypeScript, UX"
                  />
                </label>

                <div>
                  <h3>Experiences</h3>
                  {resolvedDraft.experiences.map((experience) => (
                    <div key={experience.id} className="experience-card">
                      <input
                        value={experience.title}
                        onChange={(event) => setExperience(experience.id, 'title', event.target.value)}
                        placeholder="Role"
                      />
                      <input
                        value={experience.company}
                        onChange={(event) =>
                          setExperience(experience.id, 'company', event.target.value)
                        }
                        placeholder="Company"
                      />
                      <textarea
                        value={experience.description}
                        onChange={(event) =>
                          setExperience(experience.id, 'description', event.target.value)
                        }
                        placeholder="What did you do?"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setDraft((currentDraft) => ({
                      ...(currentDraft ?? resolvedDraft),
                      experiences: [
                        ...(currentDraft ?? resolvedDraft).experiences,
                        createEmptyExperience(),
                      ],
                    }));
                  }}
                >
                  Add experience
                </button>

                <label>
                  <Upload size={16} /> V-Pitch video
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }

                      setDraft((currentDraft) => ({
                        ...(currentDraft ?? resolvedDraft),
                        vPitchBlob: file,
                      }));
                    }}
                  />
                </label>

                <button type="button" onClick={onSave}>
                  <Save size={16} /> Save locally
                </button>
              </section>
            }
          />
          <Route
            path="/preview"
            element={
              <section className="panel" aria-label="candidate profile preview">
                <h2>Preview</h2>
                {profile ? (
                  <>
                    <p>
                      <strong>{profile.fullName || 'No name yet'}</strong>
                    </p>
                    <p>{profile.jobTitle || 'No job title yet'}</p>
                    <p>{profile.skills.length ? profile.skills.join(' • ') : 'No skills yet'}</p>

                    <ul>
                      {profile.experiences.map((experience) => (
                        <li key={experience.id}>
                          <strong>{experience.title || 'Untitled role'}</strong> —{' '}
                          {experience.company || 'Unknown company'}
                        </li>
                      ))}
                    </ul>

                    {previewUrl && (
                      <video controls src={previewUrl} className="video-preview">
                        Your browser does not support video playback.
                      </video>
                    )}
                  </>
                ) : (
                  <p>No saved profile found.</p>
                )}
              </section>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
