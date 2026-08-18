-- Prevent users from updating their own role or status unless they are Admins
CREATE OR REPLACE FUNCTION public.check_profile_update()
RETURNS trigger AS $$
BEGIN
    -- If the user is an Admin, they can update anything
    IF (public.get_user_role() = 'Admin') THEN
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS secure_profile_updates ON public.profiles;
CREATE TRIGGER secure_profile_updates
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.check_profile_update();
