
-- Create job categories table
CREATE TABLE IF NOT EXISTS public.job_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  location TEXT,
  industry TEXT,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update jobs table to include more fields and proper relationships
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id),
ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'entry',
ADD COLUMN IF NOT EXISTS remote_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS application_count INTEGER DEFAULT 0;

-- Create job bookmarks table
CREATE TABLE IF NOT EXISTS public.job_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Update job applications table
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS experience_years INTEGER,
ADD COLUMN IF NOT EXISTS expected_salary INTEGER,
ADD COLUMN IF NOT EXISTS available_from DATE,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT;

-- Create user skills table
CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  skill_name TEXT NOT NULL,
  experience_level TEXT DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user experience table
CREATE TABLE IF NOT EXISTS public.user_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user education table
CREATE TABLE IF NOT EXISTS public.user_education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default job categories
INSERT INTO public.job_categories (name, description) VALUES
('Technology', 'Software development, IT, and tech roles'),
('Marketing', 'Digital marketing, advertising, and promotion'),
('Finance', 'Banking, accounting, and financial services'),
('Healthcare', 'Medical, nursing, and healthcare services'),
('Education', 'Teaching, training, and educational roles'),
('Sales', 'Sales representatives and business development'),
('Engineering', 'Civil, mechanical, and other engineering roles'),
('Design', 'Graphic design, UI/UX, and creative roles')
ON CONFLICT DO NOTHING;

-- Insert sample companies
INSERT INTO public.companies (name, description, industry, location) VALUES
('Tech Solutions Mali', 'Leading technology company in Mali', 'Technology', 'Bamako, Mali'),
('Club66 Global', 'Premium membership platform', 'Technology', 'Bamako, Mali'),
('Innovation Hub', 'Innovation and startup incubator', 'Technology', 'Bamako, Mali'),
('Digital Solutions', 'Digital transformation consultancy', 'Technology', 'Bamako, Mali'),
('TechCorp Africa', 'Pan-African technology solutions', 'Technology', 'Multiple Locations')
ON CONFLICT DO NOTHING;

-- Enable RLS on all new tables
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_education ENABLE ROW LEVEL SECURITY;

-- RLS policies for job_categories (public read)
CREATE POLICY "Job categories are viewable by everyone" ON public.job_categories
  FOR SELECT USING (true);

-- RLS policies for companies (public read)
CREATE POLICY "Companies are viewable by everyone" ON public.companies
  FOR SELECT USING (true);

-- RLS policies for jobs (public read, authenticated users can insert/update)
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON public.jobs;
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own posted jobs" ON public.jobs
  FOR UPDATE USING (auth.uid() = posted_by);

-- RLS policies for job_bookmarks
CREATE POLICY "Users can view their own bookmarks" ON public.job_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" ON public.job_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON public.job_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for job_applications
DROP POLICY IF EXISTS "Users can view their own applications" ON public.job_applications;
CREATE POLICY "Users can view their own applications" ON public.job_applications
  FOR SELECT USING (auth.uid() = applicant_id OR auth.uid() IN (SELECT posted_by FROM jobs WHERE id = job_id));

CREATE POLICY "Users can create job applications" ON public.job_applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Users can update their own applications" ON public.job_applications
  FOR UPDATE USING (auth.uid() = applicant_id);

-- RLS policies for user skills
CREATE POLICY "Users can manage their own skills" ON public.user_skills
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for user experience
CREATE POLICY "Users can manage their own experience" ON public.user_experience
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for user education
CREATE POLICY "Users can manage their own education" ON public.user_education
  FOR ALL USING (auth.uid() = user_id);

-- Create function to increment application count
CREATE OR REPLACE FUNCTION increment_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.jobs 
  SET application_count = application_count + 1 
  WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for application count
DROP TRIGGER IF EXISTS increment_application_count_trigger ON public.job_applications;
CREATE TRIGGER increment_application_count_trigger
  AFTER INSERT ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION increment_job_application_count();
