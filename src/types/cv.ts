export interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
}

export interface CandidateProfile {
  id?: number; // Primary key, auto-incremented by Dexie
  fullName: string;
  jobTitle: string;
  skills: string[];
  experiences: Experience[];
  vPitchBlob?: Blob;
}
