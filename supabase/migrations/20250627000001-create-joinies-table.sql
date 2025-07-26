-- Create joinies table to track new user registrations
CREATE TABLE IF NOT EXISTS public.joinies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Mali',
  user_type TEXT DEFAULT 'member',
  membership_tier TEXT,
  referral_code TEXT,
  registration_source TEXT DEFAULT 'website',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on joinies table
ALTER TABLE public.joinies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for joinies
CREATE POLICY "Joinies are viewable by authenticated users" ON public.joinies
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own joinie record" ON public.joinies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own joinie record" ON public.joinies
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to automatically create joinie record when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_joinie()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.joinies (
    user_id, 
    full_name, 
    email, 
    phone,
    user_type,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'member'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create joinie record on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_joinie ON auth.users;
CREATE TRIGGER on_auth_user_created_joinie
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_joinie();

-- Create trigger for joinies updated_at
DROP TRIGGER IF EXISTS update_joinies_updated_at ON public.joinies;
CREATE TRIGGER update_joinies_updated_at
  BEFORE UPDATE ON public.joinies
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- Create joinies records for existing users who don't have one
INSERT INTO public.joinies (user_id, full_name, email, phone, user_type, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', p.full_name, split_part(au.email, '@', 1)) as full_name,
  au.email,
  COALESCE(au.raw_user_meta_data->>'phone', p.phone) as phone,
  COALESCE(au.raw_user_meta_data->>'user_type', 'member') as user_type,
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
LEFT JOIN public.joinies j ON au.id = j.user_id
WHERE j.user_id IS NULL;
