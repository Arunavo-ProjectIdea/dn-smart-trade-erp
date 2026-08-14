-- Add force_password_change column to profiles
ALTER TABLE public.profiles ADD COLUMN force_password_change BOOLEAN DEFAULT false;
