-- Migration: Create notes table
-- Run this in your Supabase SQL Editor or via CLI: supabase db push

CREATE TABLE IF NOT EXISTS notes (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read all notes
CREATE POLICY "Allow read all notes"
  ON notes FOR SELECT
  USING (true);

-- Policy: Allow anyone to insert notes
CREATE POLICY "Allow insert notes"
  ON notes FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anyone to delete notes
CREATE POLICY "Allow delete notes"
  ON notes FOR DELETE
  USING (true);
