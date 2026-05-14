export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate?: string;
  endDate?: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  featured?: boolean;
  link?: string;
  screenshotBlob?: Blob;
}

export interface MediaPost {
  id: string;
  type: 'video' | 'image' | 'text';
  caption?: string;
  text?: string;
  blob?: Blob;
}

export interface CandidateProfile {
  id?: number; // Primary key, auto-incremented by Dexie
  fullName: string;
  jobTitle: string;
  bio?: string;
  location?: string;
  availability?: string;
  rating?: number;
  skills: string[];
  experiences: Experience[];
  projects?: Project[];
  mediaPosts?: MediaPost[];
  photoBlob?: Blob;
  vPitchBlob?: Blob;
}
