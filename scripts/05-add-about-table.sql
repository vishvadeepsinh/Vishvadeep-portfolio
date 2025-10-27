-- Add about table for dynamic About page content
CREATE TABLE IF NOT EXISTS about (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title TEXT NOT NULL DEFAULT 'About Me',
  intro TEXT,
  description TEXT,
  location TEXT,
  experience_years TEXT,
  education TEXT,
  languages TEXT[], -- Array of languages
  what_drives_me TEXT[], -- Array of motivations
  quick_facts JSONB, -- Flexible JSON for additional facts
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default data
INSERT INTO about (id, title, intro, description, location, experience_years, education, languages, what_drives_me, quick_facts)
VALUES (
  1,
  'About Me',
  'I''m Vishvadeepsinh Chudasama, a versatile tech professional with over 1.5 years of experience in Python/Django development, full-stack engineering, UI/UX design, and data analysis.',
  'My journey in tech started with a strong foundation in programming, and I''ve since expanded my expertise to include full-stack development, UI/UX design, and data analytics. I''m particularly interested in AI content workflows, automation, and prompt engineering. When I''m not coding or designing, I enjoy mentoring junior developers, exploring new technologies, and contributing to open-source projects.',
  'Ahmedabad, Gujarat, India',
  '1.5+ Years',
  'Bachelor of Engineering (B.E.) from Silver Oak University, Graduated 2024, CGPA: 7.78/10.0',
  ARRAY['English', 'Hindi', 'Gujarati'],
  ARRAY[
    'Building scalable, maintainable applications that solve real-world problems',
    'Creating beautiful, intuitive user interfaces that delight users',
    'Mentoring and helping other developers grow in their careers',
    'Exploring emerging technologies and staying current with industry trends',
    'Deriving meaningful insights from data to drive better decisions'
  ],
  '{"graduation_year": "2024", "university": "Silver Oak University", "cgpa": "7.78/10.0"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON about
  FOR SELECT USING (true);

-- Create policies for authenticated write access
CREATE POLICY "Allow all operations" ON about
  FOR ALL USING (true);
