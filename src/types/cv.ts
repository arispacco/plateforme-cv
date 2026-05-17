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
  mediaUrl?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  credentialUrl?: string;
  mediaBlob?: Blob;
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
  id?: number;
  userId?: string;
  fullName: string;
  jobTitle: string;
  bio?: string;
  location?: string;
  availability?: string;
  rating?: number;
  stars?: number;
  skills: string[];
  experiences: Experience[];
  projects?: Project[];
  certifications?: Certification[];
  mediaPosts?: MediaPost[];
  photoBlob?: Blob;
  vPitchBlob?: Blob;
}
