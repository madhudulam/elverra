
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  employment_type: string;
  type: string; // alias for employment_type
  salary_min?: number;
  salary_max?: number;
  currency: string;
  description: string;
  requirements?: string;
  benefits?: string;
  experience_level: string;
  experience_required: number; // years of experience
  skills?: string[];
  remote_allowed: boolean;
  application_count: number;
  created_at: string;
  application_deadline?: string;
  posted_by?: string;
  company_id?: string;
  featured?: boolean;
  urgent?: boolean;
  views?: number;
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async (filters?: {
    search?: string;
    location?: string;
    employmentType?: string;
    experienceLevel?: string;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.employmentType) {
        query = query.eq('employment_type', filters.employmentType);
      }

      if (filters?.experienceLevel) {
        query = query.eq('experience_level', filters.experienceLevel);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform data to match our interface
      const transformedJobs = (data || []).map(job => ({
        ...job,
        type: job.employment_type,
        experience_required: job.experience_level === 'entry' ? 0 : 
                           job.experience_level === 'mid' ? 3 : 5,
      }));
      
      setJobs(transformedJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = async (filters: {
    title?: string;
    location?: string;
    type?: string;
    experience?: string;
    salary?: string;
    company?: string;
  }) => {
    await fetchJobs({
      search: filters.title,
      location: filters.location,
      employmentType: filters.type,
      experienceLevel: filters.experience,
    });
  };

  const postJob = async (jobData: {
    title: string;
    company: string;
    location: string;
    employment_type: string;
    experience_level: string;
    salary_min: number;
    salary_max: number;
    description: string;
    requirements?: string;
    benefits?: string;
    skills?: string[];
    application_deadline?: string;
    remote_allowed?: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...jobData,
          currency: 'CFA',
          is_active: true,
          application_count: 0,
          views: 0,
          featured: false,
          urgent: false
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Job posted successfully!');
      await fetchJobs(); // Refresh jobs list
      return { data, error: null };
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job');
      return { data: null, error };
    }
  };

  const incrementJobViews = async (jobId: string) => {
    try {
      const { error } = await supabase.rpc('increment_job_views', { job_id: jobId });
      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing job views:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { 
    jobs, 
    loading, 
    error, 
    fetchJobs, 
    searchJobs, 
    postJob,
    incrementJobViews
  };
};

export const useJobDetails = (jobId: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { incrementJobViews } = useJobs();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (error) throw error;
        
        // Transform data to match our interface
        const transformedJob = {
          ...data,
          type: data.employment_type,
          experience_required: data.experience_level === 'entry' ? 0 : 
                             data.experience_level === 'mid' ? 3 : 5,
        };
        
        setJob(transformedJob);
        
        // Increment view count
        await incrementJobViews(jobId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch job details');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, incrementJobViews]);

  return { job, loading, error };
};

export const useJobBookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('job_bookmarks')
        .select('job_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setBookmarks(data?.map(b => b.job_id) || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  const toggleBookmark = async (jobId: string) => {
    if (!user) {
      toast.error('Please login to bookmark jobs');
      return;
    }

    try {
      const isBookmarked = bookmarks.includes(jobId);
      
      if (isBookmarked) {
        const { error } = await supabase
          .from('job_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);

        if (error) throw error;
        setBookmarks(prev => prev.filter(id => id !== jobId));
        toast.success('Job removed from bookmarks');
      } else {
        const { error } = await supabase
          .from('job_bookmarks')
          .insert({ user_id: user.id, job_id: jobId });

        if (error) throw error;
        setBookmarks(prev => [...prev, jobId]);
        toast.success('Job bookmarked successfully');
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      toast.error('Failed to update bookmark');
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  return { bookmarks, toggleBookmark, fetchBookmarks };
};

export const useJobApplications = () => {
  const { user } = useAuth();

  const applyToJob = async (jobId: string, applicationData: {
    full_name: string;
    email: string;
    phone: string;
    cover_letter?: string;
    work_experience?: string;
    education?: string;
    skills?: string[];
    expected_salary?: number;
    available_from?: string;
    experience_years?: number;
    portfolio_url?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          applicant_id: user?.id || null,
          ...applicationData,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success('Application submitted successfully!');
      return { success: true };
    } catch (err) {
      console.error('Error applying to job:', err);
      toast.error('Failed to submit application');
      throw err;
    }
  };

  const getUserApplications = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            id,
            title,
            company,
            location
          )
        `)
        .eq('applicant_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching applications:', err);
      return [];
    }
  };

  const getJobApplications = async (jobId: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching job applications:', err);
      return [];
    }
  };

  return { applyToJob, getUserApplications, getJobApplications };
};
