-- ============================================
-- Precision Pro's — Complete Supabase Schema
-- Run this entire file in Supabase SQL Editor
-- This is the ONLY schema file needed
-- ============================================

-- ============================================
-- RESET EXISTING APP SCHEMA
-- ============================================
-- Drop app tables and helper function so this script can be run to rebuild from scratch.
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP TABLE IF EXISTS auth_failures CASCADE;
DROP TABLE IF EXISTS site_analytics CASCADE;
DROP TABLE IF EXISTS custom_options CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS contact_requests CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS works CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Brain',
  category TEXT NOT NULL DEFAULT 'AI',
  features TEXT[] DEFAULT '{}',
  is_visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Works/Portfolio table
CREATE TABLE IF NOT EXISTS works (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'AI',
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  client_name TEXT,
  project_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Pro',
  designation TEXT NOT NULL,
  photo_url TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact requests table
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  city TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom options for dynamic categories/icons/service types
CREATE TABLE IF NOT EXISTS custom_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  option_type TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(option_type, value)
);

-- Site analytics table
CREATE TABLE IF NOT EXISTS site_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL DEFAULT 'page_view',
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authentication failure log table
CREATE TABLE IF NOT EXISTS auth_failures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  attempted_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  error_message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGERS & AUTO-UPDATE FUNCTIONS
-- ============================================

-- Auto-update updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON works FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_contact_requests_updated_at BEFORE UPDATE ON contact_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Enable
-- ============================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_failures ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - Public Read Access
-- ============================================

-- Public can read visible content
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read works" ON works FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read team" ON team_members FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read custom_options" ON custom_options FOR SELECT USING (true);

-- ============================================
-- RLS POLICIES - Service Role (Admin) Access
-- ============================================

-- Service role (admin) has full access to all tables
CREATE POLICY "Service role full access services" ON services FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access works" ON works FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access team" ON team_members FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access contacts" ON contact_requests FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access settings" ON site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access testimonials" ON testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role custom_options" ON custom_options FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role analytics" ON site_analytics FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role auth failures" ON auth_failures FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Allow public to insert contact requests
CREATE POLICY "Public insert contact" ON contact_requests FOR INSERT WITH CHECK (true);

-- ============================================
-- STORAGE - Image Uploads
-- ============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read uploads" ON storage.objects;
DROP POLICY IF EXISTS "Service role uploads" ON storage.objects;
CREATE POLICY "Public read uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Service role uploads" ON storage.objects FOR ALL TO service_role USING (bucket_id = 'uploads') WITH CHECK (bucket_id = 'uploads');

-- ============================================
-- SEED DATA - Site Settings
-- ============================================

INSERT INTO site_settings (key, value) VALUES
('company_name', 'Precision Pro''s'),
('tagline', 'Building Tomorrow''s Intelligence, Today'),
('phone', '+91 98765 43210'),
('phone_2', ''),
('whatsapp', '+91 98765 43210'),
('email', 'hello@precisionpros.in'),
('address', 'Chennai, Tamil Nadu, India'),
('instagram', 'https://instagram.com/precisionpros'),
('linkedin', 'https://linkedin.com/company/precisionpros'),
('youtube', 'https://youtube.com/@precisionpros'),
('show_home', 'true'),
('show_works', 'true'),
('show_team', 'true'),
('show_services', 'true'),
('show_contact', 'true'),
('show_testimonials', 'false'),
('section_order', '["home","services","works","about","testimonials","contact"]'),
('default_theme_mode', 'auto'),
('total_projects', '20'),
('happy_clients', '15'),
('team_size', '13'),
('years_experience', '3+'),
('technologies_count', '25+'),
('stat_projects_label', 'Projects Delivered'),
('stat_projects_desc', 'AI systems, SaaS platforms & mobile apps shipped.'),
('stat_clients_label', 'Happy Clients'),
('stat_clients_desc', 'Businesses that trust us with their technology.'),
('stat_team_label', 'Expert Team'),
('stat_team_desc', 'Engineers, designers & strategists in one crew.'),
('stat_satisfaction_label', 'Client Satisfaction'),
('stat_satisfaction_desc', 'Quality-first delivery on every engagement.')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SEED DATA - Services
-- ============================================

INSERT INTO services (title, description, icon, category, features, is_visible, order_index) VALUES
('AI Solutions & Integration', 'Custom AI systems, intelligent automation, and seamless AI integrations tailored to your business needs.', 'Brain', 'AI', ARRAY['AI Application Development', 'LLM Integration', 'RAG Systems', 'AI Agents', 'Prompt Engineering'], true, 0),
('Machine Learning Systems', 'End-to-end ML pipelines, model development, training, optimization and deployment at scale.', 'Cpu', 'AI', ARRAY['Model Development', 'Model Training & Optimization', 'Generative AI', 'Data Pipelines', 'ML Ops'], true, 1),
('Web Application Development', 'High-performance, scalable web applications built with modern frameworks and best practices.', 'Globe', 'Software', ARRAY['Frontend Development', 'Backend Development', 'Full Stack', 'API Development', 'SaaS Platforms'], true, 2),
('Mobile Application Development', 'Native and cross-platform mobile apps delivering exceptional user experiences on iOS and Android.', 'Smartphone', 'Software', ARRAY['iOS Development', 'Android Development', 'Cross-Platform', 'UI/UX Design', 'App Store Deployment'], true, 3),
('Intelligent Automation', 'Workflow automation, process optimization, and autonomous systems to supercharge your operations.', 'Zap', 'Automation', ARRAY['Workflow Automation', 'Process Optimization', 'RPA Solutions', 'AI Agents', 'System Integration'], true, 4),
('Cloud & Deployment', 'Scalable cloud infrastructure, CI/CD pipelines, containerization, and reliable production deployments.', 'Cloud', 'Infrastructure', ARRAY['Cloud Architecture', 'CI/CD Pipelines', 'Docker & Kubernetes', 'DevOps', 'Monitoring & Reliability'], true, 5)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA - Team Members
-- ============================================

INSERT INTO team_members (name, role, designation, photo_url, linkedin_url, instagram_url, is_visible, order_index) VALUES
('Sabari', 'Lead', 'Business Development Lead & Operations Head', NULL, NULL, NULL, true, 0),
('Jagan', 'Lead', 'Marketing Lead & BD Co-Lead', NULL, NULL, NULL, true, 1),
('Mohith', 'Lead', 'Intelligent Systems Lead', NULL, NULL, NULL, true, 2),
('Vetri', 'Lead', 'Technology Systems Lead', NULL, NULL, NULL, true, 3),
('Muppidathi', 'Lead', 'Product Strategy & Innovation Lead', NULL, NULL, NULL, true, 4),
('Naveen Kumar', 'Lead', 'Infrastructure & Quality Lead', NULL, NULL, NULL, true, 5),
('Saran', 'Pro', 'Full Stack Developer & AI Engineer', NULL, NULL, NULL, true, 6),
('Komal', 'Pro', 'AI Developer & Frontend Engineer', NULL, NULL, NULL, true, 7),
('Naveen', 'Pro', 'Finance & Operations Specialist', NULL, NULL, NULL, true, 8),
('Barath', 'Pro', 'Brand & Marketing Specialist', NULL, NULL, NULL, true, 9),
('Girivasan', 'Pro', 'Creative Media Designer', NULL, NULL, NULL, true, 10),
('Saranraj', 'Pro', 'Content Strategist & SEO Specialist', NULL, NULL, NULL, true, 11),
('Sabarivasan', 'Pro', 'Social Media & Community Manager', NULL, NULL, NULL, true, 12)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA - Portfolio Projects
-- ============================================

INSERT INTO works (title, description, category, tags, is_featured, is_visible, order_index) VALUES
('AI Customer Support System', 'Built an intelligent customer support automation system using RAG and LLMs, reducing response time by 70%.', 'AI', ARRAY['AI', 'RAG', 'LLM', 'Automation'], true, true, 0),
('E-Commerce SaaS Platform', 'Full-stack multi-tenant e-commerce platform with AI-powered product recommendations and analytics.', 'Software', ARRAY['Next.js', 'Node.js', 'PostgreSQL', 'AI'], true, true, 1),
('Workflow Automation Suite', 'End-to-end business process automation connecting 15+ tools, saving 40+ hours per week for the client.', 'Automation', ARRAY['Automation', 'Integration', 'AI Agents'], true, true, 2),
('Real Estate Mobile App', 'Cross-platform mobile application with AI property matching, virtual tours, and smart notifications.', 'Mobile', ARRAY['React Native', 'AI', 'Mobile', 'UX'], false, true, 3)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA - Testimonials
-- ============================================

INSERT INTO testimonials (name, company, city, rating, content, is_visible, order_index) VALUES
('Arun Kumar', 'CEO, TechVantage', 'Chennai', 5, 'Precision Pro''s delivered our AI customer support agent on schedule. It has cut our support queue by 60% and resolved customer inquiries instantly. Highly professional team!', true, 0),
('Priya Sharma', 'Product Manager, Innovate Corp', 'Bangalore', 5, 'Their software engineering team is exceptional. The full-stack app they built for us is highly scalable, fast, and exactly what we envisioned. Would definitely recommend them.', true, 1),
('Sanjay Viswanathan', 'Operations Director, LogiChain', 'Hyderabad', 5, 'The automation workflows they designed for our operations have saved us countless hours of manual work. The integration was seamless, and the results speak for themselves.', true, 2)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA - Custom Options
-- ============================================

INSERT INTO custom_options (option_type, value, label, order_index) VALUES
-- Service Categories
('service_category', 'AI', 'AI', 0),
('service_category', 'Software', 'Software', 1),
('service_category', 'Automation', 'Automation', 2),
-- Project Categories
('project_category', 'AI', 'AI', 0),
('project_category', 'Software', 'Software', 1),
('project_category', 'Automation', 'Automation', 2),
('project_category', 'Mobile', 'Mobile', 3),
-- Service Icons
('service_icon', 'Brain', 'Brain', 0),
('service_icon', 'Cpu', 'Cpu', 1),
('service_icon', 'Globe', 'Globe', 2),
('service_icon', 'Smartphone', 'Smartphone', 3),
('service_icon', 'Zap', 'Zap', 4),
('service_icon', 'Cloud', 'Cloud', 5),
-- Contact Service Types
('contact_service_type', 'AI Solutions & Integration', 'AI Solutions & Integration', 0),
('contact_service_type', 'Machine Learning Systems', 'Machine Learning Systems', 1),
('contact_service_type', 'Web Application Development', 'Web Application Development', 2),
('contact_service_type', 'Mobile App Development', 'Mobile App Development', 3),
('contact_service_type', 'Intelligent Automation', 'Intelligent Automation', 4),
('contact_service_type', 'Cloud & Deployment', 'Cloud & Deployment', 5),
('contact_service_type', 'Other', 'Other', 6)
ON CONFLICT (option_type, value) DO NOTHING;

-- ============================================
-- END OF SCHEMA
-- ============================================
-- All tables, policies, and seed data are now created.
-- You can run this script multiple times safely (uses IF NOT EXISTS and ON CONFLICT).
