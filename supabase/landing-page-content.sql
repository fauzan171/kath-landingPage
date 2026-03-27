-- ============================================
-- KATH Landing Page - Content Management Schema
-- ============================================
-- Tables for managing all landing page content
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. HERO SECTION
-- ============================================
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_id TEXT,
  subtitle TEXT,
  subtitle_id TEXT,
  description TEXT,
  description_id TEXT,
  background_image TEXT,
  background_video TEXT,
  cta_text TEXT,
  cta_text_id TEXT,
  cta_link TEXT,
  secondary_cta_text TEXT,
  secondary_cta_link TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID
);

-- Insert default hero content
INSERT INTO hero_content (title, title_id, subtitle, description, background_image, cta_text, cta_link)
VALUES (
  'Creating Unforgettable Moments',
  'Menciptakan Momen Tak Terlupakan',
  'Premium Event Organizer',
  'We transform your vision into extraordinary events that leave lasting impressions.',
  '/hero-bg.webp',
  'Explore Our Work',
  '#portfolio'
) ON CONFLICT DO NOTHING;

-- ============================================
-- 2. SERVICES
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_id TEXT,
  description TEXT,
  description_id TEXT,
  icon TEXT DEFAULT 'Calendar',
  image TEXT,
  features TEXT[],
  features_id TEXT[],
  price_range TEXT,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default services
INSERT INTO services (name, name_id, description, description_id, icon, order_index) VALUES
('Wedding', 'Pernikahan', 'Elegant and personalized wedding planning services', 'Layanan perencanaan pernikahan yang elegan dan personal', 'Heart', 1),
('Corporate Events', 'Acara Korporat', 'Professional corporate event management', 'Manajemen acara korporat profesional', 'Building', 2),
('Exhibitions', 'Pameran', 'Creative exhibition design and execution', 'Desain dan eksekusi pameran yang kreatif', 'Layout', 3),
('Private Parties', 'Pesta Pribadi', 'Exclusive private party planning', 'Perencanaan pesta pribadi eksklusif', 'PartyPopper', 4);

-- ============================================
-- 3. PORTFOLIO
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_id TEXT,
  category TEXT DEFAULT 'All',
  location TEXT,
  year TEXT,
  description TEXT,
  description_id TEXT,
  image TEXT,
  images TEXT[],
  video_url TEXT,
  client_name TEXT,
  event_date DATE,
  guests_count INTEGER,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. FEATURED EVENTS (Card Stack)
-- ============================================
CREATE TABLE IF NOT EXISTS featured_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_id TEXT,
  description TEXT,
  description_id TEXT,
  image TEXT,
  category TEXT,
  rotation INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. NEWS / BLOG
-- ============================================
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_id TEXT,
  slug TEXT UNIQUE,
  excerpt TEXT,
  excerpt_id TEXT,
  content TEXT,
  content_id TEXT,
  image TEXT,
  category TEXT DEFAULT 'news',
  author TEXT DEFAULT 'KATH Team',
  author_id UUID,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. TESTIMONIALS
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  avatar TEXT,
  content TEXT NOT NULL,
  content_id TEXT,
  rating INTEGER DEFAULT 5,
  event_type TEXT,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. FAQ
-- ============================================
CREATE TABLE IF NOT EXISTS faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  question_id TEXT,
  answer TEXT NOT NULL,
  answer_id TEXT,
  category TEXT DEFAULT 'general',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default FAQs
INSERT INTO faq (question, question_id, answer, answer_id, category, order_index) VALUES
('How far in advance should I book?', 'Berapa lama sebelumnya saya harus booking?', 'We recommend booking at least 3-6 months in advance for weddings and large events. For smaller events, 1-2 months may be sufficient.', 'Kami merekomendasikan booking minimal 3-6 bulan sebelumnya untuk pernikahan dan acara besar. Untuk acara kecil, 1-2 bulan mungkin cukup.', 'booking', 1),
('What is included in your services?', 'Apa saja yang termasuk dalam layanan?', 'Our full-service packages include consultation, planning, vendor coordination, on-site management, and post-event support. Specific inclusions vary by package.', 'Paket layanan lengkap kami termasuk konsultasi, perencanaan, koordinasi vendor, manajemen on-site, dan dukungan pasca acara.', 'services', 2),
('Do you offer custom packages?', 'Apakah Anda menawarkan paket khusus?', 'Yes! We specialize in creating bespoke experiences tailored to your vision and budget. Contact us for a personalized quote.', 'Ya! Kami ahli dalam menciptakan pengalaman khusus sesuai visi dan anggaran Anda.', 'services', 3);

-- ============================================
-- 8. STATISTICS
-- ============================================
CREATE TABLE IF NOT EXISTS statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  label_id TEXT,
  value TEXT NOT NULL,
  suffix TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default statistics
INSERT INTO statistics (label, label_id, value, suffix, icon, order_index) VALUES
('Events Completed', 'Acara Selesai', '500', '+', 'Calendar', 1),
('Happy Clients', 'Klien Puas', '350', '+', 'Heart', 2),
('Team Members', 'Tim Kami', '50', '+', 'Users', 3),
('Years Experience', 'Tahun Pengalaman', '10', '+', 'Clock', 4);

-- ============================================
-- 9. CONTACT INFO
-- ============================================
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'email', 'phone', 'address', 'social'
  label TEXT,
  value TEXT NOT NULL,
  link TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default contact info
INSERT INTO contact_info (type, label, value, icon, order_index) VALUES
('email', 'Email', 'hello@kath-event.com', 'Mail', 1),
('phone', 'Phone', '+62 21 1234 5678', 'Phone', 2),
('address', 'Address', 'Jakarta, Indonesia', 'MapPin', 3);

INSERT INTO contact_info (type, label, value, link, icon, order_index) VALUES
('social', 'Instagram', '@kathevent', 'https://instagram.com/kathevent', 'Instagram', 4),
('social', 'Facebook', 'KATH Event', 'https://facebook.com/kathevent', 'Facebook', 5);

-- ============================================
-- 10. NAVIGATION
-- ============================================
CREATE TABLE IF NOT EXISTS navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  label_id TEXT,
  href TEXT NOT NULL,
  is_external BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES navigation(id),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default navigation
INSERT INTO navigation (label, href, order_index) VALUES
('Home', '/', 1),
('About', '#about', 2),
('Services', '#services', 3),
('Portfolio', '#portfolio', 4),
('News', '#news', 5),
('Contact', '#contact', 6);

-- ============================================
-- 11. SITE SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  value_json JSONB,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value, description) VALUES
('site_name', 'KATH Event Organizer', 'Site name'),
('site_tagline', 'Creating Unforgettable Moments', 'Site tagline'),
('logo_url', '/logo.svg', 'Logo URL'),
('footer_text', '© 2026 KATH Event Organizer. All rights reserved.', 'Footer copyright text'),
('primary_color', '#D4AF37', 'Primary brand color (gold)'),
('secondary_color', '#0A0A0A', 'Secondary brand color (black)');

-- ============================================
-- ENABLE RLS
-- ============================================
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES (Public read, Admin write)
-- ============================================
-- Allow public read access
CREATE POLICY "Public read access" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON portfolio FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON featured_events FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON faq FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON statistics FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON contact_info FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON navigation FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);

-- Allow all operations for authenticated users (admin)
CREATE POLICY "Admin full access" ON hero_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON portfolio FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON featured_events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON faq FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON statistics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON contact_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON navigation FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- UPDATED AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY['hero_content', 'services', 'portfolio', 'featured_events', 'news', 'testimonials', 'faq', 'statistics', 'contact_info', 'navigation', 'site_settings'])
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', t, t);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END;
$$;

-- ============================================
-- DONE!
-- ============================================
SELECT 'Landing page content tables created successfully!' as status;
