import Dexie, { type Table } from 'dexie';
import type { CandidateProfile } from '../types/cv';

class CVDatabase extends Dexie {
  candidateProfiles!: Table<CandidateProfile, number>;

  constructor() {
    super('vPitchDB');
    this.version(1).stores({
      candidateProfiles: '++id,fullName,jobTitle',
    });
    this.version(2)
      .stores({
        candidateProfiles: '++id,fullName,jobTitle',
      })
      .upgrade(async (tx) => {
        await tx.table<CandidateProfile, number>('candidateProfiles').toCollection().modify((profile) => {
          if (!profile.mediaPosts) {
            profile.mediaPosts = [];
          }
        });
      });
    this.version(3)
      .stores({
        candidateProfiles: '++id,fullName,jobTitle',
      })
      .upgrade(async (tx) => {
        await tx.table<CandidateProfile, number>('candidateProfiles').toCollection().modify((profile) => {
          if (!profile.certifications) {
            profile.certifications = [];
          }
        });
      });
    this.version(4)
      .stores({
        candidateProfiles: '++id,userId,fullName,jobTitle,stars',
      })
      .upgrade(async (tx) => {
        await tx.table<CandidateProfile, number>('candidateProfiles').toCollection().modify((profile) => {
          if (profile.stars === undefined) profile.stars = 0;
          if (profile.userId === undefined) profile.userId = profile.fullName.toLowerCase().replace(/\s+/g, '-');
        });
      });
  }
}

const db = new CVDatabase();


const getLatestCandidateProfile = async (): Promise<CandidateProfile | undefined> => {
  return db.candidateProfiles.orderBy('id').last();
};

const getAllCandidateProfiles = async (): Promise<CandidateProfile[]> => {
  return db.candidateProfiles.orderBy('id').reverse().toArray();
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

const toggleStarProfile = async (id: number, increment: boolean): Promise<CandidateProfile | undefined> => {
  const profile = await db.candidateProfiles.get(id);
  if (!profile) return undefined;
  
  const currentStars = profile.stars || 0;
  profile.stars = increment ? currentStars + 1 : Math.max(0, currentStars - 1);
  await db.candidateProfiles.put(profile);
  return profile;
};

export const cvService = {
  getAllCandidateProfiles,
  getLatestCandidateProfile,
  getCandidateProfileById,
  saveCandidateProfile,
  deleteCandidateProfile,
  toggleStarProfile,
};
