-- Enable trigram extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create index on tariff_description for fast trigram search
CREATE INDEX IF NOT EXISTS hs_codes_tariff_desc_trgm_idx 
ON public.hs_codes USING gin (tariff_description gin_trgm_ops);

-- Create RPC function for hybrid AI HS Code matching
CREATE OR REPLACE FUNCTION public.match_hs_codes_ai(
  search_term text,
  match_limit int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  hscode text,
  tariff_description text,
  category text,
  cd numeric,
  sd numeric,
  vat numeric,
  ait numeric,
  at numeric,
  rd numeric,
  tti numeric,
  trgm_score double precision
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id,
    h.hscode,
    h.tariff_description,
    h.category,
    h.cd,
    h.sd,
    h.vat,
    h.ait,
    h.at,
    h.rd,
    h.tti,
    similarity(h.tariff_description, search_term)::double precision AS trgm_score
  FROM public.hs_codes h
  WHERE 
    similarity(h.tariff_description, search_term) > 0.12
    OR h.tariff_description ILIKE '%' || search_term || '%'
    OR h.hscode ILIKE search_term || '%'
  ORDER BY 
    similarity(h.tariff_description, search_term) DESC,
    h.hscode ASC
  LIMIT match_limit;
END;
$$;
