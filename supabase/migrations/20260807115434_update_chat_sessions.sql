ALTER TABLE chat_sessions
ADD COLUMN is_pinned boolean DEFAULT false,
ADD COLUMN is_archived boolean DEFAULT false;
