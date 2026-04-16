-- ============================================
-- CMS Tables for Landing Page Content Management
-- v7.0.0-cms-tables.sql
-- ============================================

-- Hero Content
CREATE TABLE IF NOT EXISTS hero_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_id TEXT,
    subtitle TEXT,
    subtitle_id TEXT,
    description TEXT,
    description_id TEXT,
    background_image TEXT,
    background_video TEXT,
    primary_cta_text TEXT,
    primary_cta_link TEXT,
    secondary_cta_text TEXT,
    secondary_cta_link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    description_id TEXT,
    icon TEXT,
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

-- Portfolio
CREATE TABLE IF NOT EXISTS portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_id TEXT,
    category TEXT,
    location TEXT,
    year TEXT,
    description TEXT,
    description_id TEXT,
    image TEXT,
    images TEXT[],
    video_url TEXT,
    client_name TEXT,
    event_date TEXT,
    guests_count INTEGER,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Featured Events
CREATE TABLE IF NOT EXISTS featured_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    avatar TEXT,
    content TEXT,
    content_id TEXT,
    rating INTEGER DEFAULT 5,
    event_type TEXT,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ
CREATE TABLE IF NOT EXISTS faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    question_id TEXT,
    answer TEXT,
    answer_id TEXT,
    category TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Statistics
CREATE TABLE IF NOT EXISTS statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    label_id TEXT,
    value TEXT NOT NULL,
    suffix TEXT,
    icon TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Info
CREATE TABLE IF NOT EXISTS contact_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    label TEXT,
    value TEXT,
    link TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Navigation
CREATE TABLE IF NOT EXISTS navigation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    label_id TEXT,
    href TEXT NOT NULL,
    is_external BOOLEAN DEFAULT false,
    parent_id UUID REFERENCES navigation(id),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    value_json JSONB,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS Policies for CMS tables
-- ============================================

-- Enable RLS
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for active content
CREATE POLICY "Public can view active hero content" ON hero_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active portfolio" ON portfolio FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active featured events" ON featured_events FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active faq" ON faq FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active statistics" ON statistics FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active contact info" ON contact_info FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active navigation" ON navigation FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);

-- Admin full access (role-based)
CREATE POLICY "Admin can manage hero content" ON hero_content FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admin can manage services" ON services FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admin can manage portfolio" ON portfolio FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admin can manage featured events" ON featured_events FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admin can manage testimonials" ON testimonials FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admin can manage faq" ON faq FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admin can manage statistics" ON statistics FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admin can manage contact info" ON contact_info FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admin can manage navigation" ON navigation FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admin can manage site settings" ON site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'super_admin'))
);

-- ============================================
-- Seed default data
-- ============================================

-- Default statistics
INSERT INTO statistics (label, value, suffix, icon, order_index) VALUES
    ('Events Organized', '50', '+', 'Calendar', 1),
    ('Happy Clients', '200', '+', 'Users', 2),
    ('Awards Won', '25', '+', 'Trophy', 3),
    ('Team Members', '30', '+', 'Heart', 4);

-- Default site settings
INSERT INTO site_settings (key, value, description) VALUES
    ('site_name', 'KATH Event Organizer', 'Site display name'),
    ('site_description', 'Professional Event Organizer', 'Site meta description'),
    ('contact_email', 'innovatewith.cibc@gmail.com', 'Contact email'),
    ('contact_phone', '+62 821-1201-4719', 'Contact phone'),
    ('instagram', '@innovatewith.cibc', 'Instagram handle'),
    ('whatsapp_group', '', 'WhatsApp group link');
