-- Create partners table for managing partners
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  partnership_type TEXT DEFAULT 'partner',
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create policies for partners
CREATE POLICY "Anyone can view active partners" 
ON public.partners 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Service can manage partners" 
ON public.partners 
FOR ALL 
USING (true);

-- Create trigger for partners updated_at
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Insert default CMS pages that are missing
INSERT INTO public.cms_pages (title, slug, content, page_type, status) VALUES
('About Us', 'about', '<h1>About Club 66 Global</h1><p>Club 66 Global is a dynamic organization dedicated to empowering communities across Africa through innovative membership programs and services.</p>', 'page', 'published'),
('Partners', 'partners', '<h1>Our Partners</h1><p>We work with leading organizations to provide exceptional value to our members.</p>', 'page', 'published'),
('Projects', 'projects', '<h1>Our Projects</h1><p>Discover the impactful projects we are working on across Africa.</p>', 'page', 'published'),
('Changing Lives', 'changing-lives', '<h1>Changing Lives</h1><p>See how Club 66 Global is making a difference in communities across Africa.</p>', 'page', 'published'),
('Terms of Service', 'terms', '<h1>Terms of Service</h1><p>Please read these terms carefully before using our services.</p>', 'page', 'published'),
('Privacy Policy', 'privacy', '<h1>Privacy Policy</h1><p>Your privacy is important to us. Learn how we protect your information.</p>', 'page', 'published'),
('Contact Us', 'contact', '<h1>Contact Us</h1><p>Get in touch with our team for any questions or support.</p>', 'page', 'published'),
('FAQ', 'faq', '<h1>Frequently Asked Questions</h1><p>Find answers to common questions about our services.</p>', 'page', 'published')
ON CONFLICT (slug) DO NOTHING;