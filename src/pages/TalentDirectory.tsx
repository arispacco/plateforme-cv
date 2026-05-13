import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Map, Download, Search, ChevronDown } from 'lucide-react';
import { cvService } from '../services/cvService';
import type { CandidateProfile } from '../types/cv';
import { CandidateCard } from '../components/CandidateCard';

const PAGE_SIZE = 8;

export function TalentDirectory() {
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="directory-page">
      <div className="directory-topbar">
        <div className="directory-search-wrap">
          <Search size={16} className="directory-search-icon" />
          <input
            className="directory-search"
            placeholder="Search candidates by name, skills, location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
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
                setPage(1);
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
          <h1 className="directory-title">Talent Directory</h1>
          <p className="directory-subtitle">
            {isLoading ? 'Loading…' : `${filtered.length} professional${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="directory-actions">
          <Link to="/edit" className="btn btn--primary">
            <Plus size={16} />
            Add Talent
          </Link>
          <button type="button" className="btn btn--outline">
            <Map size={16} />
            View Map
          </button>
          <button type="button" className="btn btn--outline">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="directory-empty">Loading profiles…</p>
      ) : paginated.length === 0 ? (
        <div className="directory-empty-state">
          <p>No candidates found.</p>
          <Link to="/edit" className="btn btn--primary">
            <Plus size={16} /> Add your first profile
          </Link>
        </div>
      ) : (
        <div className="directory-grid">
          {paginated.map((profile) => (
            <CandidateCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="directory-pagination">
          {page > 1 && (
            <button
              type="button"
              className="page-btn"
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              className={`page-btn ${p === page ? 'page-btn--active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          {page < totalPages && (
            <button
              type="button"
              className="page-btn"
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}
