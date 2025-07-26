
-- Update the jobs table to include all necessary fields
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS urgent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON public.jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON public.jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON public.jobs(featured);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at);

-- Update job applications table to include more fields
ALTER TABLE public.job_applications
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS work_experience TEXT,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[];

-- Create a function to increment job views
CREATE OR REPLACE FUNCTION increment_job_views(job_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.jobs 
  SET views = views + 1 
  WHERE id = job_id;
END;
$$;

-- Update RLS policies for job applications to allow anonymous applications
DROP POLICY IF EXISTS "Users can create job applications" ON public.job_applications;
CREATE POLICY "Anyone can create job applications" ON public.job_applications
  FOR INSERT WITH CHECK (true);

-- Allow anonymous users to view jobs
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON public.jobs;
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs
  FOR SELECT USING (true);

-- Insert some sample jobs if none exist
INSERT INTO public.jobs (
  title, company, location, employment_type, description, requirements, 
  benefits, salary_min, salary_max, currency, experience_level, skills, 
  posted_by, is_active, featured, urgent
) VALUES 
(
  'Senior Software Engineer',
  'Tech Solutions Mali',
  'Bamako, Mali',
  'full-time',
  'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining scalable web applications.',
  'Bachelor''s degree in Computer Science or related field. 5+ years of experience in software development. Strong knowledge of JavaScript, React, Node.js.',
  'Competitive salary, health insurance, flexible working hours, professional development opportunities.',
  800000,
  1200000,
  'CFA',
  'senior',
  ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL'],
  (SELECT id FROM auth.users LIMIT 1),
  true,
  true,
  false
),
(
  'Marketing Manager',
  'Club66 Global',
  'Remote',
  'full-time',
  'Join our marketing team to drive brand awareness and customer acquisition. You will develop and execute marketing campaigns across multiple channels.',
  'Bachelor''s degree in Marketing or Business. 3+ years of marketing experience. Experience with digital marketing tools.',
  'Remote work flexibility, performance bonuses, training budget, team outings.',
  600000,
  900000,
  'CFA',
  'mid',
  ARRAY['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics'],
  (SELECT id FROM auth.users LIMIT 1),
  true,
  false,
  true
),
(
  'Junior Web Developer',
  'Innovation Hub',
  'Bamako, Mali',
  'full-time',
  'Perfect opportunity for a junior developer to grow their skills. You will work on various web projects and learn from experienced developers.',
  'Basic knowledge of HTML, CSS, JavaScript. Fresh graduate or 1+ year experience. Eagerness to learn.',
  'Mentorship program, skill development, collaborative environment.',
  400000,
  600000,
  'CFA',
  'entry',
  ARRAY['HTML', 'CSS', 'JavaScript', 'Git'],
  (SELECT id FROM auth.users LIMIT 1),
  true,
  false,
  false
)
ON CONFLICT DO NOTHING;
