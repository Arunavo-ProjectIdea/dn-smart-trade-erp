-- Create support_requests table
CREATE TABLE IF NOT EXISTS public.support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- Policies for support_requests
-- Users can view their own requests
CREATE POLICY "Users can view their own support requests"
    ON public.support_requests FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own requests
CREATE POLICY "Users can insert their own support requests"
    ON public.support_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admins can view all requests
CREATE POLICY "Admins can view all support requests"
    ON public.support_requests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'
        )
    );

-- Admins can update all requests
CREATE POLICY "Admins can update all support requests"
    ON public.support_requests FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_support_requests_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_support_requests_updated_at
    BEFORE UPDATE ON public.support_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_support_requests_updated_at_column();
