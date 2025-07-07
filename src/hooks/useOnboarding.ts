import { useState, useEffect } from 'react';

interface UserProfile {
  experience: 'beginner' | 'intermediate' | 'advanced';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  goals: string[];
  investmentAmount: number;
  timeHorizon: 'short' | 'medium' | 'long';
  preferredAssets: string[];
}

export const useOnboarding = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem('stellar_onboarding_completed');
    const profile = localStorage.getItem('stellar_user_profile');
    
    setHasCompletedOnboarding(completed === 'true');
    
    if (profile) {
      try {
        setUserProfile(JSON.parse(profile));
      } catch (error) {
        console.error('Failed to parse user profile:', error);
      }
    }
  }, []);

  const completeOnboarding = (profile: UserProfile) => {
    localStorage.setItem('stellar_onboarding_completed', 'true');
    localStorage.setItem('stellar_user_profile', JSON.stringify(profile));
    setHasCompletedOnboarding(true);
    setUserProfile(profile);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('stellar_onboarding_completed');
    localStorage.removeItem('stellar_user_profile');
    setHasCompletedOnboarding(false);
    setUserProfile(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, ...updates };
      localStorage.setItem('stellar_user_profile', JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
    }
  };

  return {
    hasCompletedOnboarding,
    userProfile,
    completeOnboarding,
    resetOnboarding,
    updateProfile
  };
};