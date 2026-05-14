import Dexie, { type Table } from 'dexie';
import type { CandidateProfile } from '../types/cv';

class CVDatabase extends Dexie {
  candidateProfiles!: Table<CandidateProfile, number>;

  constructor() {
    super('vPitchDB');
    this.version(1).stores({
      candidateProfiles: '++id,fullName,jobTitle',
    });
  }
}

const db = new CVDatabase();

const getAllCandidateProfiles = async (): Promise<CandidateProfile[]> => {
  return db.candidateProfiles.orderBy('id').reverse().toArray();
};

const getLatestCandidateProfile = async (): Promise<CandidateProfile | undefined> => {
  return db.candidateProfiles.orderBy('id').last();
};

const getCandidateProfileById = async (id: number): Promise<CandidateProfile | undefined> => {
  return db.candidateProfiles.get(id);
};

const saveCandidateProfile = async (profile: CandidateProfile): Promise<CandidateProfile> => {
  const id = await db.candidateProfiles.put(profile);
  return { ...profile, id };
};

const deleteCandidateProfile = async (id: number): Promise<void> => {
  return db.candidateProfiles.delete(id);
};

export const cvService = {
  getAllCandidateProfiles,
  getLatestCandidateProfile,
  getCandidateProfileById,
  saveCandidateProfile,
  deleteCandidateProfile,
};
