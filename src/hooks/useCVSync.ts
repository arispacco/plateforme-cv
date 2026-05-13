import { useCallback, useEffect, useState } from 'react';
import { cvService } from '../services/cvService';
import type { CandidateProfile } from '../types/cv';

export const useCVSync = () => {
  const [profile, setProfile] = useState<CandidateProfile | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      const storedProfile = await cvService.getLatestCandidateProfile();
      setProfile(storedProfile);
    } catch {
      setError('Unable to read candidate profile from local storage.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const storedProfile = await cvService.getLatestCandidateProfile();
        if (isMounted) {
          setProfile(storedProfile);
        }
      } catch {
        if (isMounted) {
          setError('Unable to read candidate profile from local storage.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveProfile = useCallback(async (nextProfile: CandidateProfile) => {
    setError(null);

    try {
      const savedProfile = await cvService.saveCandidateProfile(nextProfile);
      setProfile(savedProfile);
      return savedProfile;
    } catch {
      setError('Unable to save candidate profile in local storage.');
      return undefined;
    }
  }, []);

  return {
    profile,
    isLoading,
    error,
    refreshProfile,
    saveProfile,
  };
};
