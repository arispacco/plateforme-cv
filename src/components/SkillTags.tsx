import { useState, useRef } from 'react';
import { X } from 'lucide-react';

const TAG_COLORS = [
  '#FEF3C7', // yellow
  '#FEE2E2', // red
  '#D1FAE5', // green
  '#DBEAFE', // blue
  '#F3E8FF', // purple
  '#FFEDD5', // orange
  '#FCE7F3', // pink
  '#ECFDF5', // teal
];

const TAG_TEXT_COLORS = [
  '#92400E',
  '#991B1B',
  '#065F46',
  '#1E40AF',
  '#6B21A8',
  '#9A3412',
  '#9D174D',
  '#064E3B',
];

function getTagColor(skill: string): { bg: string; color: string } {
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = ((hash * 31) + skill.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % TAG_COLORS.length;
  return { bg: TAG_COLORS[idx], color: TAG_TEXT_COLORS[idx] };
}

interface SkillTagsProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillTags({ skills, onChange }: SkillTagsProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addSkill = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInput('');
  };

  const removeSkill = (skill: string) => {
    onChange(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input);
    } else if (e.key === 'Backspace' && !input && skills.length > 0) {
      onChange(skills.slice(0, -1));
    }
  };

  return (
    <div className="skill-tags" onClick={() => inputRef.current?.focus()}>
      {skills.map((skill) => {
        const { bg, color } = getTagColor(skill);
        return (
          <span key={skill} className="skill-tag" style={{ backgroundColor: bg, color }}>
            {skill}
            <button
              type="button"
              className="skill-tag-remove"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(skill);
              }}
              aria-label={`Remove ${skill}`}
            >
              <X size={12} />
            </button>
          </span>
        );
      })}
      <input
        ref={inputRef}
        className="skill-tag-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (input) addSkill(input);
        }}
        placeholder={skills.length === 0 ? 'Add skills...' : '+ Add Skill'}
      />
    </div>
  );
}

interface SkillBadgeProps {
  skill: string;
}

export function SkillBadge({ skill }: SkillBadgeProps) {
  const { bg, color } = getTagColor(skill);
  return (
    <span className="skill-badge" style={{ backgroundColor: bg, color }}>
      {skill}
    </span>
  );
}
