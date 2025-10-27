-- Fix profile table to use INTEGER id instead of UUID for compatibility with API
-- Drop existing profile table and recreate with correct schema
DROP TABLE IF EXISTS profile CASCADE;

CREATE TABLE profile (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read on profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to update profile" ON profile FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Insert default profile
INSERT INTO profile (id, name, title, bio, email, phone, location, avatar_url, github_url, linkedin_url, twitter_url)
VALUES (
  1,
  'Vishvadeepsinh Chudasama',
  'Python Developer | Full-Stack Developer | UI/UX Designer | Data Analyst',
  'Versatile tech professional with 1.5+ years of experience in Python/Django development, full-stack engineering, UI/UX design, and data analysis.',
  'vishvadeepsinh3301@gmail.com',
  '+91 6377646514',
  'Ahmedabad, Gujarat, India',
  NULL,
  'https://github.com',
  'https://linkedin.com',
  'https://twitter.com'
);
