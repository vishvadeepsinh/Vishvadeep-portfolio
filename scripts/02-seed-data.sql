-- Insert profile data
INSERT INTO profile (name, title, bio, email, phone, location, github_url, linkedin_url) VALUES (
  'Vishvadeepsinh Chudasama',
  'Python Developer | Full-Stack Developer | UI/UX Designer | Data Analyst',
  'Versatile tech professional with over 1.5+ years of experience in Python/Django development, full-stack engineering, UI/UX design, and data analysis. Skilled in mentoring, building scalable applications, and creating intuitive user experiences.',
  'vishvadeepsinh3301@gmail.com',
  '+91 6377646514',
  'Ahmedabad, Gujarat, India',
  'https://github.com',
  'https://linkedin.com'
);

-- Insert skills
INSERT INTO skills (category, name, proficiency, order_index) VALUES
-- Programming Languages
('Programming Languages', 'Python', 90, 1),
('Programming Languages', 'JavaScript', 80, 2),
('Programming Languages', 'Java (Core & Advanced)', 75, 3),
('Programming Languages', 'C / C++', 70, 4),
('Programming Languages', 'PHP', 65, 5),
-- Frameworks & Libraries
('Frameworks & Libraries', 'Django', 85, 6),
('Frameworks & Libraries', 'React.js', 80, 7),
('Frameworks & Libraries', 'Node.js', 75, 8),
('Frameworks & Libraries', 'Express.js', 75, 9),
('Frameworks & Libraries', 'Flask', 70, 10),
('Frameworks & Libraries', 'Bootstrap', 85, 11),
-- Web Development
('Web Development', 'HTML5', 90, 12),
('Web Development', 'CSS3', 85, 13),
('Web Development', 'RESTful APIs', 85, 14),
('Web Development', 'JSON & AJAX', 80, 15),
('Web Development', 'Full-Stack (MERN & Django)', 85, 16),
('Web Development', 'Web Deployment (Heroku, Render, GitHub Pages)', 80, 17),
-- Databases
('Databases', 'PostgreSQL', 80, 18),
('Databases', 'MySQL', 75, 19),
('Databases', 'MongoDB', 70, 20),
('Databases', 'SQLite', 70, 21),
-- UI/UX Design
('UI/UX Design', 'Figma', 80, 22),
('UI/UX Design', 'Canva', 75, 23),
('UI/UX Design', 'Wireframing', 80, 24),
('UI/UX Design', 'Prototyping', 80, 25),
('UI/UX Design', 'Interaction Design', 75, 26),
('UI/UX Design', 'Visual Design Principles', 75, 27),
-- Data Analytics & Visualization
('Data Analytics & Visualization', 'Excel (Advanced)', 85, 28),
('Data Analytics & Visualization', 'Power BI', 75, 29),
('Data Analytics & Visualization', 'Tableau', 75, 30),
('Data Analytics & Visualization', 'Data Cleaning & Preprocessing', 80, 31),
('Data Analytics & Visualization', 'Data Interpretation & Reporting', 80, 32),
-- AI & Automation
('AI & Automation', 'Prompt Engineering (ChatGPT, Claude)', 85, 33),
('AI & Automation', 'AI Model Evaluation & Feedback', 80, 34),
('AI & Automation', 'Content Automation Workflows', 80, 35),
('AI & Automation', 'Scripting & Task Automation (Python)', 85, 36),
-- Tools & Platforms
('Tools & Platforms', 'Git / GitHub', 85, 37),
('Tools & Platforms', 'Linux', 75, 38),
('Tools & Platforms', 'VS Code', 85, 39),
('Tools & Platforms', 'Postman', 80, 40),
('Tools & Platforms', 'Google Cloud', 70, 41),
('Tools & Platforms', 'Docker (Basic)', 65, 42),
-- Professional Skills
('Professional Skills', 'Mentoring & Technical Training', 85, 43),
('Professional Skills', 'Debugging & Code Reviews', 85, 44),
('Professional Skills', 'Project Management', 80, 45),
('Professional Skills', 'Team Collaboration', 85, 46),
('Professional Skills', 'Documentation & Reporting', 80, 47),
-- Soft Skills
('Soft Skills', 'Problem Solving', 90, 48),
('Soft Skills', 'Analytical Thinking', 85, 49),
('Soft Skills', 'Communication (Fluent English)', 85, 50),
('Soft Skills', 'Adaptability', 85, 51),
('Soft Skills', 'Time Management', 80, 52),
('Soft Skills', 'Continuous Learning', 90, 53);

-- Insert experience
INSERT INTO experience (company, position, description, start_date, end_date, is_current, order_index) VALUES
('Outlier AI', 'AI Prompt Engineer & Response Analyst', 'Designed, tested, and refined prompts for AI systems. Evaluated AI outputs for accuracy and clarity. Corrected programming errors and contributed high-quality training data.', '2023-12-01', NULL, true, 1),
('Royal Technosoft Pvt Ltd', 'Technical Instructor', 'Instructed students in Python, Java, C/C++, and full-stack web technologies. Mentored Django-based capstone projects. Conducted live code reviews and debugging sessions.', '2023-08-01', '2024-04-30', false, 2),
('Arth Infosoft Pvt Ltd', 'Django Developer Intern', 'Developed backend modules for project/bug tracking systems using Django. Integrated RESTful APIs and PostgreSQL for scalable solutions. Participated in QA and peer code reviews.', '2023-01-01', '2023-05-31', false, 3),
('Edureka', 'Full Stack Web Development Intern', 'Built responsive full-stack applications using Node.js, JavaScript, HTML/CSS. Gained real-world workflow experience including Git, deployment, and version control.', '2022-03-01', '2022-10-31', false, 4);

-- Insert sample projects
INSERT INTO projects (title, description, technologies, github_url, live_url, featured, order_index) VALUES
('E-Commerce Platform', 'Full-stack e-commerce application with Django backend and React frontend. Features include product catalog, shopping cart, and payment integration.', ARRAY['Django', 'React', 'PostgreSQL', 'Stripe'], 'https://github.com', 'https://example.com', true, 1),
('Task Management App', 'Collaborative task management tool built with Node.js and MongoDB. Real-time updates and team collaboration features.', ARRAY['Node.js', 'React', 'MongoDB', 'Socket.io'], 'https://github.com', 'https://example.com', true, 2),
('Data Analytics Dashboard', 'Interactive dashboard for data visualization using Tableau and Power BI. Analyzes business metrics and trends.', ARRAY['Tableau', 'Power BI', 'Python', 'SQL'], 'https://github.com', 'https://example.com', false, 3);

-- Insert contact info
INSERT INTO contact (email, phone, address) VALUES
('vishvadeepsinh3301@gmail.com', '+91 6377646514', 'Ahmedabad, Gujarat, India');
