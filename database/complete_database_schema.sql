-- ============================================================================
-- قاعدة البيانات الكاملة لموقع Apex & Base
-- Complete Database Schema for Apex & Base Construction Portfolio
-- Supabase PostgreSQL
-- ============================================================================
--
-- هذا الملف يحتوي على:
-- 1. جميع الجداول (Tables)
-- 2. الفهارس (Indexes) لتحسين الأداء
-- 3. السياسات الأمنية (RLS Policies)
-- 4. الدوال (Functions) والمشغلات (Triggers)
-- 5. البيانات الافتراضية (Initial Data)
--
-- ============================================================================

-- ============================================
-- 1. تفعيل الإضافات المطلوبة
-- Enable Required Extensions
-- ============================================

-- إضافة UUID لتوليد معرفات فريدة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- أو استخدم gen_random_uuid() المدمجة في PostgreSQL 13+
-- Extension for generating UUIDs

-- ============================================
-- 2. إنشاء الجداول - TABLES CREATION
-- ============================================

-- --------------------------------------------
-- 2.1 صفحة الرئيسية - HOME PAGE
-- --------------------------------------------

-- جدول محتوى الصفحة الرئيسية
CREATE TABLE home_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL DEFAULT 'Beyond Construction',
  hero_subtitle TEXT NOT NULL DEFAULT 'At A.B. we are committed to helping our clients bring their visions to life.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE home_page IS 'محتوى Hero Section للصفحة الرئيسية';
COMMENT ON COLUMN home_page.hero_title IS 'العنوان الرئيسي';
COMMENT ON COLUMN home_page.hero_subtitle IS 'العنوان الفرعي';

-- جدول كروت المميزات في الصفحة الرئيسية
CREATE TABLE feature_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE feature_cards IS 'كروت المميزات الثلاثة في الصفحة الرئيسية';
COMMENT ON COLUMN feature_cards.title IS 'عنوان الكارد';
COMMENT ON COLUMN feature_cards.description IS 'وصف الكارد';
COMMENT ON COLUMN feature_cards.image IS 'رابط صورة الكارد';
COMMENT ON COLUMN feature_cards."order" IS 'ترتيب ظهور الكارد';

-- --------------------------------------------
-- 2.2 صفحة من نحن - ABOUT PAGE
-- --------------------------------------------

-- جدول محتوى صفحة About
CREATE TABLE about_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Hero Section
  hero_title TEXT NOT NULL DEFAULT 'About Apex & Base',
  hero_subtitle TEXT NOT NULL,

  -- Mission Section
  mission_title TEXT NOT NULL DEFAULT 'Our Mission',
  mission_content TEXT NOT NULL,
  mission_image TEXT,
  show_mission BOOLEAN DEFAULT true,

  -- Values Section
  values_title TEXT NOT NULL DEFAULT 'Our Values',
  values_content TEXT NOT NULL,
  show_values BOOLEAN DEFAULT true,

  -- Principles Section
  principles_section_title TEXT DEFAULT 'Our Guiding Principles',
  principles_section_subtitle TEXT,
  show_principles BOOLEAN DEFAULT true,

  -- Team Section
  team_section_title TEXT DEFAULT 'Meet Our Leadership',
  team_section_subtitle TEXT,
  show_team BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE about_page IS 'محتوى صفحة About Us';
COMMENT ON COLUMN about_page.show_mission IS 'إظهار/إخفاء قسم Mission';
COMMENT ON COLUMN about_page.show_values IS 'إظهار/إخفاء قسم Values';
COMMENT ON COLUMN about_page.show_principles IS 'إظهار/إخفاء قسم Principles';
COMMENT ON COLUMN about_page.show_team IS 'إظهار/إخفاء قسم Team';

-- جدول المبادئ (Principles)
CREATE TABLE principles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE principles IS 'مبادئ الشركة في صفحة About';
COMMENT ON COLUMN principles.icon IS 'اسم الأيقونة من Material Symbols';

-- جدول أعضاء الفريق
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT NOT NULL,
  image TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE team_members IS 'أعضاء فريق القيادة';
COMMENT ON COLUMN team_members.position IS 'المنصب الوظيفي';
COMMENT ON COLUMN team_members.bio IS 'نبذة عن العضو';

-- --------------------------------------------
-- 2.3 صفحة الخدمات - SERVICES PAGE
-- --------------------------------------------

-- جدول محتوى صفحة الخدمات
CREATE TABLE services_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL DEFAULT 'Our Construction Services',
  hero_subtitle TEXT NOT NULL,
  hero_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE services_page IS 'محتوى Hero Section لصفحة الخدمات';

-- جدول الخدمات
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  image_position TEXT NOT NULL DEFAULT 'left' CHECK (image_position IN ('left', 'right')),
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE services IS 'قائمة الخدمات المعروضة';
COMMENT ON COLUMN services.image_position IS 'موقع الصورة: يسار أو يمين';
COMMENT ON COLUMN services.is_active IS 'تفعيل/إخفاء الخدمة من الموقع';

-- --------------------------------------------
-- 2.4 صفحة اتصل بنا - CONTACT PAGE
-- --------------------------------------------

-- جدول معلومات الاتصال
CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Hero Section
  hero_title TEXT NOT NULL DEFAULT 'Get In Touch',
  hero_subtitle TEXT NOT NULL,

  -- Office Information
  office_title TEXT DEFAULT 'Our Office',
  office_address TEXT NOT NULL,
  office_phone TEXT NOT NULL,
  office_email TEXT NOT NULL,
  office_map_embed_url TEXT,

  -- Social Media Links
  social_facebook TEXT DEFAULT '',
  social_twitter TEXT DEFAULT '',
  social_linkedin TEXT DEFAULT '',
  social_instagram TEXT DEFAULT '',

  -- Footer Content
  footer_company_name TEXT,
  footer_copyright TEXT,
  footer_founded_year TEXT DEFAULT '2005',
  footer_tagline TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE contact_info IS 'معلومات الاتصال ومحتوى الفوتر';
COMMENT ON COLUMN contact_info.office_map_embed_url IS 'رابط خريطة Google Maps المضمنة';
COMMENT ON COLUMN contact_info.footer_tagline IS 'شعار الشركة في الفوتر';

-- جدول رسائل التواصل
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('general', 'vendor')),

  -- General Inquiry Fields
  name TEXT,
  email TEXT NOT NULL,
  message TEXT,

  -- Vendor/Subcontractor Fields
  company_name TEXT,
  contact_person TEXT,
  phone TEXT,

  -- Status Tracking
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE contact_submissions IS 'رسائل التواصل من الزوار';
COMMENT ON COLUMN contact_submissions.type IS 'نوع الرسالة: استفسار عام أو من مقاول';
COMMENT ON COLUMN contact_submissions.status IS 'حالة الرسالة: جديدة، مقروءة، تم الرد، مؤرشفة';

-- --------------------------------------------
-- 2.5 الإعدادات العامة - SITE SETTINGS
-- --------------------------------------------

-- جدول إعدادات الموقع
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Apex & Base',
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE site_settings IS 'الإعدادات العامة للموقع (اللوجو واسم الموقع)';
COMMENT ON COLUMN site_settings.logo_url IS 'رابط شعار الموقع';
COMMENT ON COLUMN site_settings.site_name IS 'اسم الموقع الظاهر في الهيدر';

-- ============================================
-- 3. الفهارس - INDEXES
-- ============================================
-- الفهارس تحسن أداء الاستعلامات

CREATE INDEX idx_feature_cards_order ON feature_cards("order");
CREATE INDEX idx_principles_order ON principles("order");
CREATE INDEX idx_team_members_order ON team_members("order");
CREATE INDEX idx_services_order ON services("order");
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_type ON contact_submissions(type);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);

COMMENT ON INDEX idx_feature_cards_order IS 'تسريع ترتيب كروت المميزات';
COMMENT ON INDEX idx_services_active IS 'تسريع البحث عن الخدمات النشطة فقط';
COMMENT ON INDEX idx_contact_submissions_created IS 'تسريع عرض الرسائل من الأحدث للأقدم';

-- ============================================
-- 4. Row Level Security (RLS) - السياسات الأمنية
-- ============================================

-- تفعيل RLS على جميع الجداول
ALTER TABLE home_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE principles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- 4.1 سياسات القراءة العامة - Public Read Policies
-- --------------------------------------------
-- السماح لأي شخص بقراءة المحتوى العام

CREATE POLICY "public_read_home_page"
  ON home_page FOR SELECT
  USING (true);

CREATE POLICY "public_read_feature_cards"
  ON feature_cards FOR SELECT
  USING (true);

CREATE POLICY "public_read_about_page"
  ON about_page FOR SELECT
  USING (true);

CREATE POLICY "public_read_principles"
  ON principles FOR SELECT
  USING (true);

CREATE POLICY "public_read_team_members"
  ON team_members FOR SELECT
  USING (true);

CREATE POLICY "public_read_services_page"
  ON services_page FOR SELECT
  USING (true);

-- عرض الخدمات النشطة فقط للزوار
CREATE POLICY "public_read_active_services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "public_read_contact_info"
  ON contact_info FOR SELECT
  USING (true);

CREATE POLICY "public_read_site_settings"
  ON site_settings FOR SELECT
  USING (true);

-- --------------------------------------------
-- 4.2 سياسات الإدارة - Admin Full Access Policies
-- --------------------------------------------
-- المستخدمون المصادق عليهم (Authenticated) لهم صلاحيات كاملة

CREATE POLICY "authenticated_full_access_home_page"
  ON home_page FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_full_access_feature_cards"
  ON feature_cards FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_full_access_about_page"
  ON about_page FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_full_access_principles"
  ON principles FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_full_access_team_members"
  ON team_members FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_full_access_services_page"
  ON services_page FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_full_access_services"
  ON services FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_full_access_contact_info"
  ON contact_info FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_full_access_contact_submissions"
  ON contact_submissions FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_full_access_site_settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- --------------------------------------------
-- 4.3 سياسات إرسال النماذج - Form Submission Policy
-- --------------------------------------------
-- السماح لأي شخص بإرسال نموذج التواصل

CREATE POLICY "public_insert_contact_submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 5. الدوال والمشغلات - Functions & Triggers
-- ============================================

-- --------------------------------------------
-- 5.1 دالة تحديث updated_at تلقائياً
-- --------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 'تحديث عمود updated_at تلقائياً عند التعديل';

-- --------------------------------------------
-- 5.2 إنشاء المشغلات لجميع الجداول
-- --------------------------------------------

CREATE TRIGGER update_home_page_updated_at
  BEFORE UPDATE ON home_page
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_cards_updated_at
  BEFORE UPDATE ON feature_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_page_updated_at
  BEFORE UPDATE ON about_page
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_principles_updated_at
  BEFORE UPDATE ON principles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_page_updated_at
  BEFORE UPDATE ON services_page
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON contact_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. البيانات الافتراضية - Initial Data
-- ============================================

-- --------------------------------------------
-- 6.1 الصفحة الرئيسية
-- --------------------------------------------

INSERT INTO home_page (hero_title, hero_subtitle) VALUES (
  'Beyond Construction',
  'At A.B. we are committed to helping our clients bring their visions to life.'
) ON CONFLICT DO NOTHING;

INSERT INTO feature_cards (title, description, image, "order") VALUES
  (
    'Proven Track Record',
    'Our extensive portfolio of successful projects speaks for itself, showcasing our commitment to quality and excellence.',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
    1
  ),
  (
    'Forward-Thinking Approach',
    'We leverage the latest technology and sustainable practices to deliver innovative and efficient construction solutions.',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
    2
  ),
  (
    'Trusted Partnership',
    'We believe in collaborative relationships with our clients, ensuring transparency and reliability from start to finish.',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
    3
  )
ON CONFLICT DO NOTHING;

-- --------------------------------------------
-- 6.2 صفحة About
-- --------------------------------------------

INSERT INTO about_page (
  hero_title, hero_subtitle,
  mission_title, mission_content, mission_image,
  values_title, values_content,
  principles_section_title, principles_section_subtitle,
  team_section_title, team_section_subtitle,
  show_mission, show_values, show_principles, show_team
) VALUES (
  'About Apex & Base',
  'Building Beyond Construction: Crafting visions into reality with integrity, quality, and innovation.',
  'Our Mission',
  'Our mission is to deliver exceptional construction services by building lasting relationships with our clients through transparency, collaboration, and a relentless commitment to quality.',
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800',
  'Our Values',
  'At Apex & Base, our core values of integrity, innovation, and client-centricity guide every decision we make.',
  'Our Guiding Principles',
  'We are defined by our commitment to these core principles in every project we undertake.',
  'Meet Our Leadership',
  'Our dedicated team of professionals is the cornerstone of our success, bringing expertise and passion to every project.',
  true, true, true, true
) ON CONFLICT DO NOTHING;

INSERT INTO principles (icon, title, description, "order") VALUES
  (
    'trophy',
    'Proven Track Record',
    'Highlighting years of experience, successful project completions, and unwavering reliability.',
    1
  ),
  (
    'lightbulb',
    'Forward-Thinking Approach',
    'Utilizing modern technology, sustainable practices, and innovative solutions to build for the future.',
    2
  ),
  (
    'handshake',
    'Trusted Partnership',
    'Focusing on client collaboration and clear communication to realize their unique vision.',
    3
  )
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, position, bio, image, "order") VALUES
  (
    'Johnathan Doe',
    'Founder & CEO',
    'With over 25 years in the industry, Johnathan''s vision guides our commitment to excellence.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    1
  ),
  (
    'Jane Smith',
    'Lead Architect',
    'Jane translates bold ideas into beautiful, functional designs that stand the test of time.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    2
  ),
  (
    'Michael Johnson',
    'Head of Operations',
    'Michael ensures every project runs smoothly, on time, and within budget with meticulous oversight.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    3
  ),
  (
    'Emily Williams',
    'Client Relations Manager',
    'Emily is the bridge between our clients and our team, ensuring clear communication and satisfaction.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    4
  )
ON CONFLICT DO NOTHING;

-- --------------------------------------------
-- 6.3 صفحة الخدمات
-- --------------------------------------------

INSERT INTO services_page (hero_title, hero_subtitle, hero_image) VALUES (
  'Our Construction Services',
  'We help you plan, design, and build with precision and creativity.',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200'
) ON CONFLICT DO NOTHING;

INSERT INTO services (title, description, image, image_position, "order", is_active) VALUES
  (
    'Elevate Your Business',
    'We focus on commercial construction, fostering growth through professional partnerships and impeccable execution. Our commitment is to build spaces that not only meet but exceed your business needs.',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    'left',
    1,
    true
  ),
  (
    'Focus on Your Vision',
    'Through close client collaboration and custom build solutions, we bring your unique ideas to life exactly as you envisioned. Your dream is the blueprint for our craftsmanship.',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'right',
    2,
    true
  ),
  (
    'Data-Driven Decisions',
    'Leveraging the latest in project management technology, we ensure efficient execution and transparent communication from start to finish, keeping your project on time and on budget.',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    'left',
    3,
    true
  )
ON CONFLICT DO NOTHING;

-- --------------------------------------------
-- 6.4 صفحة التواصل
-- --------------------------------------------

INSERT INTO contact_info (
  hero_title, hero_subtitle,
  office_title, office_address, office_phone, office_email,
  office_map_embed_url,
  social_facebook, social_twitter, social_linkedin, social_instagram,
  footer_company_name, footer_copyright, footer_founded_year, footer_tagline
) VALUES (
  'Get In Touch',
  'We''re here to help and answer any question you might have. We look forward to hearing from you.',
  'Our Office',
  '123 Construction Ave, Suite 456, Builderville, ST 78910',
  '(123) 456-7890',
  'contact@apexbase.com',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.622956276834!2d-73.9878536845941!3d40.74844097932822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1622055622836!5m2!1sen!2sus',
  '',
  '',
  '',
  '',
  'Apex & Base Constructions Company L.L.C',
  '© 2024 Apex & Base Constructions Company L.L.C. All Rights Reserved.',
  '2005',
  'Building visions into reality since 2005.'
) ON CONFLICT DO NOTHING;

-- --------------------------------------------
-- 6.5 إعدادات الموقع
-- --------------------------------------------

INSERT INTO site_settings (site_name, logo_url) VALUES (
  'Apex & Base',
  NULL
) ON CONFLICT DO NOTHING;

-- ============================================
-- 7. Supabase Storage Buckets
-- ============================================
--
-- ملاحظة: Buckets يتم إنشاؤها من لوحة تحكم Supabase
-- أو عبر JavaScript API
--
-- المطلوب:
-- 1. Bucket اسمه: images
--    - Public: true
--    - Allowed MIME types: image/*
--    - Max file size: 5MB
--
-- Folders داخل images bucket:
-- - /home (صور الصفحة الرئيسية)
-- - /about (صور صفحة About)
-- - /services (صور الخدمات)
-- - /team (صور أعضاء الفريق)
-- - /branding (اللوجو)
-- - /uploads (رفوعات عامة)
--
-- ============================================

-- ============================================
-- نهاية ملف قاعدة البيانات
-- END OF DATABASE SCHEMA
-- ============================================

-- للتحقق من أن كل شيء تم بنجاحه، قم بتشغيل:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
