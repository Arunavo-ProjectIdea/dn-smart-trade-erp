-- Phase 4.6: Create notifications table with priority, data, and RLS

-- Create priority enum
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create notification type enum  
CREATE TYPE notification_type AS ENUM ('shipment', 'boe', 'document', 'system');

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL DEFAULT 'system',
    priority notification_priority NOT NULL DEFAULT 'medium',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    entity_id UUID,
    entity_type TEXT,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

-- Users can update (mark read) their own notifications
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
USING (user_id = auth.uid());

-- Admins and Employees can insert notifications for any user (system-generated)
CREATE POLICY "Admins and Employees can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (public.get_user_role() IN ('Admin', 'Employee') OR user_id = auth.uid());

-- Helper function to create a notification (callable from server side)
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_type notification_type,
    p_priority notification_priority,
    p_title TEXT,
    p_description TEXT,
    p_entity_id UUID DEFAULT NULL,
    p_entity_type TEXT DEFAULT NULL,
    p_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, type, priority, title, description, entity_id, entity_type, data)
    VALUES (p_user_id, p_type, p_priority, p_title, p_description, p_entity_id, p_entity_type, p_data)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$;
