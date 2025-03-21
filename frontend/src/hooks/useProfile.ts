import { useState, useCallback } from 'react';
import { getProfile, updateProfile } from '@/lib/api';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'client' | 'lawyer' | 'admin';
  specialization?: string[];
  yearsOfExperience?: number;
  languages: string[];
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  availability?: {
    monday: { start: string; end: string }[];
    tuesday: { start: string; end: string }[];
    wednesday: { start: string; end: string }[];
    thursday: { start: string; end: string }[];
    friday: { start: string; end: string }[];
    saturday: { start: string; end: string }[];
    sunday: { start: string; end: string }[];
  };
  stats?: {
    totalCases: number;
    resolvedCases: number;
    clientRating: number;
    responseRate: number;
    avgResponseTime: number;
  };
}

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useProfile() {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    loading: true,
    error: null
  });

  const fetchProfile = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    const response = await getProfile();

    if (response.data) {
      const profileData = response.data as UserProfile;
      setState({
        profile: profileData,
        loading: false,
        error: null
      });
    } else {
      setState({
        profile: null,
        loading: false,
        error: response.error
      });
    }
  }, []);

  const updateProfileData = async (data: Partial<Omit<UserProfile, 'id' | 'role'>>) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await updateProfile(data);

    if (response.data) {
      const updatedProfile = response.data as UserProfile;
      setState({
        profile: updatedProfile,
        loading: false,
        error: null
      });
      return true;
    } else {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: response.error
      }));
      return false;
    }
  };

  const getFullName = () => {
    if (!state.profile) return '';
    return `${state.profile.firstName} ${state.profile.lastName}`;
  };

  const getContactInfo = () => {
    if (!state.profile) return null;
    return {
      email: state.profile.email,
      phone: state.profile.phone,
      address: state.profile.address
    };
  };

  const getProfessionalInfo = () => {
    if (!state.profile) return null;
    return {
      role: state.profile.role,
      specialization: state.profile.specialization,
      yearsOfExperience: state.profile.yearsOfExperience,
      languages: state.profile.languages
    };
  };

  const getAvailability = () => {
    return state.profile?.availability;
  };

  const getPerformanceStats = () => {
    return state.profile?.stats;
  };

  const getSocialLinks = () => {
    return state.profile?.socialLinks;
  };

  const isLawyer = () => {
    return state.profile?.role === 'lawyer';
  };

  const isAdmin = () => {
    return state.profile?.role === 'admin';
  };

  return {
    ...state,
    fetchProfile,
    updateProfile: updateProfileData,
    getFullName,
    getContactInfo,
    getProfessionalInfo,
    getAvailability,
    getPerformanceStats,
    getSocialLinks,
    isLawyer,
    isAdmin
  };
} 