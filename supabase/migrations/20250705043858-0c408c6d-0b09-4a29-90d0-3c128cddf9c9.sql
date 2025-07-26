-- First make the club66 bucket public so images can be accessed
UPDATE storage.buckets SET public = true WHERE name = 'club66';

-- Create storage policies for the club66 bucket if they don't exist
CREATE POLICY "Anyone can view uploaded files" ON storage.objects
FOR SELECT USING (bucket_id = 'club66');

CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'club66' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (bucket_id = 'club66' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (bucket_id = 'club66' AND auth.uid() IS NOT NULL);