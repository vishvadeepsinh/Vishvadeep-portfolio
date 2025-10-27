-- Resume Data Import Script for Vishvadeepsinh Chudasama
-- This script populates the database with resume information

-- ============================================
-- 1. CLEAR EXISTING DATA (Optional - uncomment if needed)
-- ============================================
-- DELETE FROM skills;
-- DELETE FROM experience;
-- DELETE FROM profile WHERE id = 1;
-- DELETE FROM about WHERE id = 1;
-- DELETE FROM contact WHERE id = 1;

-- ============================================
-- 2. INSERT PROFILE DATA
-- ============================================
INSERT INTO profile (
  id,
  name,
  title,
  bio,
  email,
  phone,
  location,
  github_url,
  linkedin_url,
  twitter_url,
  created_at,
  updated_at
) VALUES (
  1,
  'Vishvadeepsinh Chudasama',
  'Python Developer | Full-Stack Developer | UI/UX Designer | Data Analyst',
  'Versatile tech professional with over 1.5+ years of experience in Python/Django development, full-stack engineering, UI/UX design, and data analysis. Skilled in mentoring, building scalable applications, and creating intuitive user experiences. Proficient in deriving insights from data using Tableau, Power BI, and Excel, with experience in AI content workflows, automation, and prompt engineering.',
  'vishvadeepsinh3301@gmail.com',
  '+91 6377646514',
  'Ahmedabad, Gujarat, India',
  'https://github.com/vishvadeepsinh',
  'https://linkedin.com/in/vishvadeepsinh-chudasama',
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location = EXCLUDED.location,
  github_url = EXCLUDED.github_url,
  linkedin_url = EXCLUDED.linkedin_url,
  updated_at = NOW();

-- ============================================
-- 3. INSERT SKILLS DATA
-- ============================================

-- Languages & Frameworks
INSERT INTO skills (category, name, proficiency, order_index) VALUES
('Languages & Frameworks', 'Python', 90, 1),
('Languages & Frameworks', 'Django', 90, 2),
('Languages & Frameworks', 'JavaScript', 85, 3),
('Languages & Frameworks', 'Node.js', 85, 4),
('Languages & Frameworks', 'React', 80, 5),
('Languages & Frameworks', 'Express.js', 80, 6),
('Languages & Frameworks', 'C', 75, 7),
('Languages & Frameworks', 'C++', 75, 8),
('Languages & Frameworks', 'Core Java', 75, 9),
('Languages & Frameworks', 'PHP', 70, 10);

-- Web & UI/UX
INSERT INTO skills (category, name, proficiency, order_index) VALUES
('Web & UI/UX', 'HTML5', 95, 11),
('Web & UI/UX', 'CSS3', 90, 12),
('Web & UI/UX', 'Bootstrap', 85, 13),
('Web & UI/UX', 'Figma', 90, 14),
('Web & UI/UX', 'Canva', 85, 15),
('Web & UI/UX', 'Wireframing', 85, 16),
('Web & UI/UX', 'Prototyping', 85, 17),
('Web & UI/UX', 'Interaction Design', 80, 18);

-- Databases
INSERT INTO skills (category, name, proficiency, order_index) VALUES
('Databases', 'MySQL', 85, 19),
('Databases', 'MongoDB', 80, 20),
('Databases', 'PostgreSQL', 85, 21);

-- Tools & Platforms
INSERT INTO skills (category, name, proficiency, order_index) VALUES
('Tools & Platforms', 'Git', 90, 22),
('Tools & Platforms', 'Linux', 80, 23),
('Tools & Platforms', 'Tableau', 75, 24),
('Tools & Platforms', 'Power BI', 75, 25),
('Tools & Platforms', 'Google Cloud', 70, 26),
('Tools & Platforms', 'Excel', 85, 27);

-- AI & Content Evaluation
INSERT INTO skills (category, name, proficiency, order_index) VALUES
('AI & Content', 'Prompt Reviewing', 90, 28),
('AI & Content', 'Structured Feedback', 85, 29),
('AI & Content', 'Content Validation', 85, 30),
('AI & Content', 'ChatGPT', 90, 31),
('AI & Content', 'Claude', 85, 32);

-- ============================================
-- 4. INSERT EXPERIENCE DATA
-- ============================================

INSERT INTO experience (
  company,
  position,
  description,
  start_date,
  end_date,
  is_current,
  order_index
) VALUES
(
  'Outlier AI',
  'AI Prompt Engineer & Response Analyst',
  'Designed, tested, and refined prompts for AI systems in both technical (e.g., coding) and non-technical areas. Evaluated AI outputs for accuracy, clarity, and relevance. Corrected programming-related errors and contributed high-quality training data. Supported AI model improvements through structured feedback.',
  '2023-12-01',
  NULL,
  TRUE,
  1
),
(
  'Royal Technosoft Pvt Ltd',
  'Technical Instructor',
  'Instructed students in Python, Java, C/C++, and full-stack web technologies. Mentored Django-based capstone projects through planning to deployment. Conducted live code reviews and debugging sessions.',
  '2023-08-01',
  '2024-04-30',
  FALSE,
  2
),
(
  'Arth Infosoft Pvt Ltd',
  'Django Developer Intern',
  'Developed backend modules for project/bug tracking systems using Django. Integrated RESTful APIs and PostgreSQL for scalable solutions. Participated in QA and peer code reviews.',
  '2023-01-01',
  '2023-05-31',
  FALSE,
  3
),
(
  'Edureka',
  'Full Stack Web Development Intern',
  'Built responsive full-stack applications using Node.js, JavaScript, HTML/CSS. Gained real-world workflow experience including Git, deployment, and version control.',
  '2022-03-01',
  '2022-10-31',
  FALSE,
  4
);

-- ============================================
-- 5. INSERT ABOUT DATA
-- ============================================

INSERT INTO about (
  id,
  title,
  intro,
  description,
  education,
  experience_years,
  location,
  languages,
  what_drives_me,
  created_at,
  updated_at
) VALUES (
  1,
  'About Me',
  'Versatile tech professional with over 1.5+ years of experience in Python/Django development, full-stack engineering, UI/UX design, and data analysis.',
  'I am a passionate developer who loves building scalable applications and creating intuitive user experiences. With expertise spanning multiple domains including backend development, frontend engineering, UI/UX design, and data analysis, I bring a holistic approach to software development. My experience in mentoring and teaching has honed my ability to communicate complex technical concepts effectively.',
  'Bachelor of Engineering (B.E), 2024 - Silver Oak University - CGPA: 7.78/10.0',
  '1.5+',
  'Ahmedabad, Gujarat, India',
  ARRAY['English (Fluent)', 'Hindi (Native)', 'Gujarati (Native)'],
  ARRAY[
    'Building scalable and efficient applications',
    'Creating intuitive user experiences',
    'Mentoring and teaching others',
    'Continuous learning and skill development',
    'Contributing to AI advancement through quality data'
  ],
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  intro = EXCLUDED.intro,
  description = EXCLUDED.description,
  education = EXCLUDED.education,
  experience_years = EXCLUDED.experience_years,
  location = EXCLUDED.location,
  languages = EXCLUDED.languages,
  what_drives_me = EXCLUDED.what_drives_me,
  updated_at = NOW();

-- ============================================
-- 6. INSERT CONTACT DATA
-- ============================================

INSERT INTO contact (
  id,
  email,
  phone,
  address,
  created_at,
  updated_at
) VALUES (
  1,
  'vishvadeepsinh3301@gmail.com',
  '+91 6377646514',
  'Ahmedabad, Gujarat, India',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  updated_at = NOW();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify profile data
SELECT * FROM profile WHERE id = 1;

-- Verify skills count by category
SELECT category, COUNT(*) as skill_count 
FROM skills 
GROUP BY category 
ORDER BY category;

-- Verify experience entries
SELECT company, position, start_date, end_date, is_current 
FROM experience 
ORDER BY order_index;

-- Verify about data
SELECT * FROM about WHERE id = 1;

-- Verify contact data
SELECT * FROM contact WHERE id = 1;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Resume data import completed successfully!';
  RAISE NOTICE 'Please verify the data in your admin panel.';
END $$;
