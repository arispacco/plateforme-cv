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

export interface VideoMediaPost {
  id: string;
  type: 'video';
  caption?: string;
  blob: Blob;
}

export interface ImageMediaPost {
  id: string;
  type: 'image';
  caption?: string;
  blob: Blob;
}

export interface TextMediaPost {
  id: string;
  type: 'text';
  caption?: string;
  text: string;
}

export type MediaPost = VideoMediaPost | ImageMediaPost | TextMediaPost;

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
