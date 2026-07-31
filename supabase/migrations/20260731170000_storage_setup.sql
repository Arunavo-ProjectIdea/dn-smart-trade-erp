-- Create documents bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false) 
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'documents' bucket
-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow authenticated users to view/download files
DROP POLICY IF EXISTS "Authenticated users can read documents" ON storage.objects;
CREATE POLICY "Authenticated users can read documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

-- Allow authenticated users to update files
DROP POLICY IF EXISTS "Authenticated users can update documents" ON storage.objects;
CREATE POLICY "Authenticated users can update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents');

-- Allow authenticated users to delete files
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON storage.objects;
CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');
