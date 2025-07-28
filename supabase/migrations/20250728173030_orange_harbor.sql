-- Create elverra storage bucket for logo and assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'elverra',
  'elverra',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create storage policies for the elverra bucket
CREATE POLICY "Anyone can view uploaded files" ON storage.objects
FOR SELECT USING (bucket_id = 'elverra');

CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'elverra' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (bucket_id = 'elverra' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (bucket_id = 'elverra' AND auth.uid() IS NOT NULL);