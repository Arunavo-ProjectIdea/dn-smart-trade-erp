-- Fix get_user_role to prevent RLS infinite recursion and search_path injection
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Fix check_profile_update to prevent infinite recursion
CREATE OR REPLACE FUNCTION public.check_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    executing_user_role public.user_role;
BEGIN
    -- Get the role of the user performing the update safely, bypassing RLS
    SELECT role INTO executing_user_role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
    
    -- If the user is an Admin, they can update anything
    IF (executing_user_role = 'Admin'::public.user_role) THEN
        RETURN NEW;
    END IF;

    -- For non-admins, ensure role and status are not changed
    IF (NEW.role IS DISTINCT FROM OLD.role) THEN
        NEW.role = OLD.role;
    END IF;

    IF (NEW.status IS DISTINCT FROM OLD.status) THEN
        NEW.status = OLD.status;
    END IF;

    RETURN NEW;
END;
$$;
