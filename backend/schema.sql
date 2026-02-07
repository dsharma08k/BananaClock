-- BananaClock Database Schema
-- Run this SQL in Supabase Dashboard > SQL Editor
-- Enable UUID extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- =====================================================
-- FEEDBACK TABLE
-- Stores user corrections for model improvement
-- =====================================================
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    predicted_label TEXT NOT NULL,
    correct_label TEXT NOT NULL,
    confidence FLOAT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
-- Allow anonymous inserts (for feedback submission)
CREATE POLICY "Allow anonymous inserts" ON feedback FOR
INSERT TO anon WITH CHECK (true);
-- Allow anonymous selects (for admin/model training)
CREATE POLICY "Allow anonymous selects" ON feedback FOR
SELECT TO anon USING (true);
-- =====================================================
-- STORAGE CONFIGURATION
-- =====================================================
-- 1. Create Buckets (if they don't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('share-images', 'share-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public)
VALUES ('feedback-images', 'feedback-images', true) ON CONFLICT (id) DO NOTHING;
-- 2. Storage Policies (Admin/Anon Access)
-- SHARE-IMAGES: Allow anonymous uploads and reads
-- Note: Your specific policy name might differ (e.g. "Allow Anonymous Uploads 127750m_0")
-- but the logic below ensures functionality.
CREATE POLICY "Allow Anonymous Uploads Share" ON storage.objects FOR
INSERT TO anon WITH CHECK (bucket_id = 'share-images');
CREATE POLICY "Allow Anonymous Selects Share" ON storage.objects FOR
SELECT TO anon USING (bucket_id = 'share-images');
-- FEEDBACK-IMAGES: Allow anonymous uploads and reads
CREATE POLICY "Allow Anonymous Uploads Feedback" ON storage.objects FOR
INSERT TO anon WITH CHECK (bucket_id = 'feedback-images');
CREATE POLICY "Allow Anonymous Selects Feedback" ON storage.objects FOR
SELECT TO anon USING (bucket_id = 'feedback-images');
-- =====================================================
-- OPTIONAL: Predictions Log Table
-- Uncomment if you want to log all predictions
-- =====================================================
-- CREATE TABLE IF NOT EXISTS predictions (
--     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
--     image_hash TEXT,
--     prediction TEXT NOT NULL,
--     confidence FLOAT NOT NULL,
--     days_until_bad INT,
--     created_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow anonymous inserts" ON predictions
--     FOR INSERT TO anon WITH CHECK (true);