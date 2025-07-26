
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  country: string;
  profile_image_url?: string;
}

export interface UserSkill {
  id: string;
  skill_name: string;
  experience_level: string;
}

export interface UserExperience {
  id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

export interface UserEducation {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  grade?: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [experience, setExperience] = useState<UserExperience[]>([]);
  const [education, setEducation] = useState<UserEducation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Fetch skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (skillsError) throw skillsError;

      // Fetch experience
      const { data: experienceData, error: experienceError } = await supabase
        .from('user_experience')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (experienceError) throw experienceError;

      // Fetch education
      const { data: educationData, error: educationError } = await supabase
        .from('user_education')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (educationError) throw educationError;

      setProfile(profileData);
      setSkills(skillsData || []);
      setExperience(experienceData || []);
      setEducation(educationData || []);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      // Ensure full_name is provided when creating new profile
      const profileData = {
        id: user.id,
        full_name: updates.full_name || profile?.full_name || user.email?.split('@')[0] || 'User',
        ...updates
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;
      await fetchProfile();
      return { success: true };
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const addSkill = async (skillName: string, experienceLevel: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_skills')
        .insert({
          user_id: user.id,
          skill_name: skillName,
          experience_level: experienceLevel
        });

      if (error) throw error;
      await fetchProfile();
    } catch (err) {
      console.error('Error adding skill:', err);
      throw err;
    }
  };

  const addExperience = async (experienceData: Omit<UserExperience, 'id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_experience')
        .insert({
          user_id: user.id,
          ...experienceData
        });

      if (error) throw error;
      await fetchProfile();
    } catch (err) {
      console.error('Error adding experience:', err);
      throw err;
    }
  };

  const addEducation = async (educationData: Omit<UserEducation, 'id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_education')
        .insert({
          user_id: user.id,
          ...educationData
        });

      if (error) throw error;
      await fetchProfile();
    } catch (err) {
      console.error('Error adding education:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    skills,
    experience,
    education,
    loading,
    updateProfile,
    addSkill,
    addExperience,
    addEducation,
    fetchProfile
  };
};
