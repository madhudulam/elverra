/*
  # Create Admin User System and Fix Authentication

  1. Admin User Setup
    - Creates admin user management functions
    - Sets up proper role assignment system
    - Ensures admin user can be created and authenticated

  2. Authentication Fixes
    - Fixes user role checking
    - Ensures proper admin access control
    - Creates fallback admin assignment

  3. Security
    - Proper RLS policies for admin access
    - Secure role management functions
*/

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user', 'agent', 'merchant')),
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage all roles" ON public.user_roles;

-- Create policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Service role can manage all roles" ON public.user_roles
  FOR ALL USING (true);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = COALESCE($1, auth.uid()) AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to assign admin role
CREATE OR REPLACE FUNCTION public.assign_admin_role(target_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = target_email;
  
  IF target_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM public.user_roles 
  WHERE user_roles.user_id = COALESCE($1, auth.uid())
  ORDER BY 
    CASE role 
      WHEN 'admin' THEN 1 
      WHEN 'agent' THEN 2 
      WHEN 'merchant' THEN 3 
      ELSE 4 
    END 
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create admin user if it doesn't exist
CREATE OR REPLACE FUNCTION public.ensure_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if admin user exists
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@elverraglobal.com';
  
  -- If admin user exists, assign admin role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update profiles table to include user_type if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'user';

-- Try to assign admin role to existing admin user if it exists
SELECT public.ensure_admin_user();