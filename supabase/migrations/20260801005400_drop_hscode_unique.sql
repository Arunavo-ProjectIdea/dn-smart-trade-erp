-- Drop any unique constraint on hscode/code column to allow duplicate hscodes (multiple tariff rows per code)
ALTER TABLE public.hs_codes DROP CONSTRAINT IF EXISTS hs_codes_code_key CASCADE;
ALTER TABLE public.hs_codes DROP CONSTRAINT IF EXISTS hs_codes_hscode_key CASCADE;
