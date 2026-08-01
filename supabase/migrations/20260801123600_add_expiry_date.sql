ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS expiry_date DATE;
