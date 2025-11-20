-- ============================================
-- Apex & Base Portfolio Database Schema
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HOME PAGE
-- ============================================

CREATE TABLE home_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_title TEXT NOT NULL DEFAULT 'Beyond Construction',
  hero_subtitle TEXT NOT NULL DEFAULT 'At A.B. we are committed to helping our clients bring their visions to life.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE feature_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ABOUT PAGE
-- ============================================

CREATE TABLE about_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_title TEXT NOT NULL DEFAULT 'About Apex & Base',
  hero_subtitle TEXT NOT NULL,
  mission_title TEXT NOT NULL DEFAULT 'Our Mission',
  mission_content TEXT NOT NULL,
  values_title TEXT NOT NULL DEFAULT 'Our Values',
  values_content TEXT NOT NULL,
  mission_image TEXT,
  principles_section_title TEXT DEFAULT 'Our Guiding Principles',
  principles_section_subtitle TEXT,
  team_section_title TEXT DEFAULT 'Meet Our Leadership',
  team_section_subtitle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE principles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT NOT NULL,
  image TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SERVICES PAGE
-- ============================================

CREATE TABLE services_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_title TEXT NOT NULL DEFAULT 'Our Construction Services',
  hero_subtitle TEXT NOT NULL,
  hero_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  image_position TEXT NOT NULL DEFAULT 'left' CHECK (image_position IN ('left', 'right')),
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTACT PAGE
-- ============================================

CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_title TEXT NOT NULL DEFAULT 'Get In Touch',
  hero_subtitle TEXT NOT NULL,
  office_title TEXT DEFAULT 'Our Office',
  office_address TEXT NOT NULL,
  office_phone TEXT NOT NULL,
  office_email TEXT NOT NULL,
  office_map_embed_url TEXT,
  social_facebook TEXT DEFAULT '#',
  social_twitter TEXT DEFAULT '#',
  social_linkedin TEXT DEFAULT '#',
  social_instagram TEXT DEFAULT '#',
  footer_company_name TEXT,
  footer_copyright TEXT,
  footer_founded_year TEXT DEFAULT '2005',
  footer_tagline TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('general', 'vendor')),

  -- General inquiry fields
  name TEXT,
  email TEXT NOT NULL,
  message TEXT,

  -- Vendor/Subcontractor fields
  company_name TEXT,
  contact_person TEXT,
  phone TEXT,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_feature_cards_order ON feature_cards("order");
CREATE INDEX idx_principles_order ON principles("order");
CREATE INDEX idx_team_members_order ON team_members("order");
CREATE INDEX idx_services_order ON services("order");
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_type ON contact_submissions(type);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);

-- ============================================
-- RLS (Row Level Security) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE home_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE principles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for all content tables
CREATE POLICY "Public read access" ON home_page FOR SELECT USING (true);
CREATE POLICY "Public read access" ON feature_cards FOR SELECT USING (true);
CREATE POLICY "Public read access" ON about_page FOR SELECT USING (true);
CREATE POLICY "Public read access" ON principles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public read access" ON services_page FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON contact_info FOR SELECT USING (true);

-- Admin access for all tables (requires authentication)
CREATE POLICY "Authenticated users full access" ON home_page FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON feature_cards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON about_page FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON principles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON team_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON services_page FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON contact_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');

-- Public can submit contact forms
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions FOR INSERT WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_home_page_updated_at BEFORE UPDATE ON home_page FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_cards_updated_at BEFORE UPDATE ON feature_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_page_updated_at BEFORE UPDATE ON about_page FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_principles_updated_at BEFORE UPDATE ON principles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_page_updated_at BEFORE UPDATE ON services_page FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default home page
INSERT INTO home_page (hero_title, hero_subtitle) VALUES (
  'Beyond Construction',
  'At A.B. we are committed to helping our clients bring their visions to life.'
);

-- Insert feature cards
INSERT INTO feature_cards (title, description, image, "order") VALUES
('Proven Track Record', 'Our extensive portfolio of successful projects speaks for itself, showcasing our commitment to quality and excellence.', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', 1),
('Forward-Thinking Approach', 'We leverage the latest technology and sustainable practices to deliver innovative and efficient construction solutions.', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', 2),
('Trusted Partnership', 'We believe in collaborative relationships with our clients, ensuring transparency and reliability from start to finish.', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800', 3);

-- Insert about page
INSERT INTO about_page (
  hero_title, hero_subtitle,
  mission_content, values_content,
  mission_image,
  principles_section_subtitle, team_section_subtitle
) VALUES (
  'About Apex & Base',
  'Building Beyond Construction: Crafting visions into reality with integrity, quality, and innovation.',
  'Our mission is to deliver exceptional construction services by building lasting relationships with our clients through transparency, collaboration, and a relentless commitment to quality.',
  'At Apex & Base, our core values of integrity, innovation, and client-centricity guide every decision we make.',
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800',
  'We are defined by our commitment to these core principles in every project we undertake.',
  'Our dedicated team of professionals is the cornerstone of our success, bringing expertise and passion to every project.'
);

-- Insert principles
INSERT INTO principles (icon, title, description, "order") VALUES
('trophy', 'Proven Track Record', 'Highlighting years of experience, successful project completions, and unwavering reliability.', 1),
('lightbulb', 'Forward-Thinking Approach', 'Utilizing modern technology, sustainable practices, and innovative solutions to build for the future.', 2),
('handshake', 'Trusted Partnership', 'Focusing on client collaboration and clear communication to realize their unique vision.', 3);

-- Insert team members
INSERT INTO team_members (name, position, bio, image, "order") VALUES
('Johnathan Doe', 'Founder & CEO', 'With over 25 years in the industry, Johnathan''s vision guides our commitment to excellence.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 1),
('Jane Smith', 'Lead Architect', 'Jane translates bold ideas into beautiful, functional designs that stand the test of time.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 2),
('Michael Johnson', 'Head of Operations', 'Michael ensures every project runs smoothly, on time, and within budget with meticulous oversight.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 3),
('Emily Williams', 'Client Relations Manager', 'Emily is the bridge between our clients and our team, ensuring clear communication and satisfaction.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 4);

-- Insert services page
INSERT INTO services_page (hero_title, hero_subtitle, hero_image) VALUES (
  'Our Construction Services',
  'We help you plan, design, and build with precision and creativity.',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200'
);

-- Insert services
INSERT INTO services (title, description, image, image_position, "order", is_active) VALUES
('Elevate Your Business', 'We focus on commercial construction, fostering growth through professional partnerships and impeccable execution. Our commitment is to build spaces that not only meet but exceed your business needs.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'left', 1, true),
('Focus on Your Vision', 'Through close client collaboration and custom build solutions, we bring your unique ideas to life exactly as you envisioned. Your dream is the blueprint for our craftsmanship.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'right', 2, true),
('Data-Driven Decisions', 'Leveraging the latest in project management technology, we ensure efficient execution and transparent communication from start to finish, keeping your project on time and on budget.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', 'left', 3, true);

-- Insert contact info
INSERT INTO contact_info (
  hero_title, hero_subtitle,
  office_address, office_phone, office_email,
  office_map_embed_url,
  footer_company_name, footer_copyright, footer_tagline
) VALUES (
  'Get In Touch',
  'We''re here to help and answer any question you might have. We look forward to hearing from you.',
  '123 Construction Ave, Suite 456, Builderville, ST 78910',
  '(123) 456-7890',
  'contact@apexbase.com',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.622956276834!2d-73.9878536845941!3d40.74844097932822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1622055622836!5m2!1sen!2sus',
  'Apex & Base Constructions Company L.L.C',
  '© 2024 Apex & Base Constructions Company L.L.C. All Rights Reserved.',
  'Building visions into reality since 2005.'
);
