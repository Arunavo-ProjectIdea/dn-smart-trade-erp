-- Dummy migration converted to a fix for column renames in hs_codes table
-- This allows the Supabase Preview database to successfully run all migrations from scratch
DO $$ 
BEGIN
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='hs_codes' and column_name='code')
  THEN
      ALTER TABLE public.hs_codes RENAME COLUMN code TO hscode;
  END IF;

  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='hs_codes' and column_name='name')
  THEN
      ALTER TABLE public.hs_codes RENAME COLUMN name TO tariff_description;
  END IF;
END $$;
