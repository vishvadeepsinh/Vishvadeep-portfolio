-- Drop existing tables and recreate with correct schema
DROP TABLE IF EXISTS profile CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS experience CASCADE;
DROP TABLE IF EXISTS contact CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

-- Create profile table with INTEGER id
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
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT single_profile CHECK (id = 1)
);

-- Create projects table with INTEGER id
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create skills table with INTEGER id
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  proficiency INTEGER DEFAULT 50,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create experience table with INTEGER id
CREATE TABLE experience (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create contact table with INTEGER id
CREATE TABLE contact (
  id INTEGER PRIMARY KEY DEFAULT 1,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT single_contact CHECK (id = 1)
);

-- Create messages table with INTEGER id
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Allow public read on profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Allow public read on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read on experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Allow public read on contact" ON contact FOR SELECT USING (true);

-- Allow ALL operations for service role (bypasses RLS)
CREATE POLICY "Allow all for service role on profile" ON profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on skills" ON skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on experience" ON experience FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on contact" ON contact FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on messages" ON messages FOR ALL USING (true) WITH CHECK (true);

-- Insert seed data
INSERT INTO profile (id, name, title, bio, email, phone, location, github_url, linkedin_url) VALUES (
  1,
  'Vishvadeepsinh Chudasama',
  'Python Developer | Full-Stack Developer | UI/UX Designer | Data Analyst',
  'Versatile tech professional with over 1.5+ years of experience in Python/Django development, full-stack engineering, UI/UX design, and data analysis.',
  'vishvadeepsinh3301@gmail.com',
  '+91 6377646514',
  'Ahmedabad, Gujarat, India',
  'https://github.com',
  'https://linkedin.com'
);

-- Insert contact
INSERT INTO contact (id, email, phone, address) VALUES (
  1,
  'vishvadeepsinh3301@gmail.com',
  '+91 6377646514',
  'Ahmedabad, Gujarat, India'
);
