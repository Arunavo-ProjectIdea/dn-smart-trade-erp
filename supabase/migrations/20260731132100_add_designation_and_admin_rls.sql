-- Phase 4.2: Add designation column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS designation TEXT;

-- Add Admin RLS policy for UPDATE
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.get_user_role() = 'Admin');
