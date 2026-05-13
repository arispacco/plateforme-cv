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

const getLatestCandidateProfile = async (): Promise<CandidateProfile | undefined> => {
  return db.candidateProfiles.orderBy('id').last();
};

const saveCandidateProfile = async (profile: CandidateProfile): Promise<CandidateProfile> => {
  const id = await db.candidateProfiles.put(profile);
  return { ...profile, id };
};

export const cvService = {
  getLatestCandidateProfile,
  saveCandidateProfile,
};
