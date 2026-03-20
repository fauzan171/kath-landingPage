-- ============================================
-- CIBC Admin Dashboard - Database Migration
-- Version: 2.1.0 (Single Competition Focus)
-- Last Updated: 2026-03-20
-- ============================================
--
-- Changes:
-- - Add NEWS table for dynamic news management
-- - Add database functions for single competition
-- - Add timeline management functions
-- - Simplify for CIBC 2026 only
--
-- ============================================

-- ============================================
-- 1. NEWS TABLE (NEW!)
-- ============================================

CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Content (Bilingual)
    title TEXT NOT NULL,
    title_id TEXT,              -- Indonesian translation
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,      -- Short summary
    excerpt_id TEXT,            -- Indonesian translation
    content TEXT NOT NULL,      -- Full content (HTML)
    content_id TEXT,            -- Indonesian translation

    -- Media
    image TEXT,                 -- Cover image URL

    -- Classification
    category TEXT NOT NULL CHECK(category IN ('competition', 'announcement', 'news', 'update', 'tips')) DEFAULT 'news',

    -- Metadata
    author TEXT NOT NULL DEFAULT 'CIBC Team',
    author_id UUID REFERENCES users(id),

    -- Publishing
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,

    -- Stats
    views INTEGER DEFAULT 0,

    -- SEO
    meta_title TEXT,
    meta_description TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for news
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- RLS for news
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Public can read published news
CREATE POLICY "Public can read published news" ON news
    FOR SELECT USING (is_published = true);

-- Enable RLS for news
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Trigger for updated_at
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. DATABASE FUNCTIONS
-- ============================================

-- Function: Get competition statistics
CREATE OR REPLACE FUNCTION get_competition_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'competition', (SELECT row_to_json(c) FROM competitions c WHERE code = 'cibc-2026'),
        'totalTeams', (SELECT COUNT(*)::int FROM teams t
                       JOIN competitions c ON c.id = t.competition_id
                       WHERE c.code = 'cibc-2026'),
        'totalSubmissions', (SELECT COUNT(*)::int FROM submissions s
                             JOIN competitions c ON c.id = s.competition_id
                             WHERE c.code = 'cibc-2026'),
        'activeStages', (SELECT COUNT(*)::int FROM stages st
                         JOIN competitions c ON c.id = st.competition_id
                         WHERE c.code = 'cibc-2026' AND st.is_active = true),
        'teamsByCategory', (
            SELECT json_build_object(
                'startup', (SELECT COUNT(*)::int FROM teams t
                            JOIN competitions c ON c.id = t.competition_id
                            WHERE c.code = 'cibc-2026' AND t.category = 'startup'),
                'student', (SELECT COUNT(*)::int FROM teams t
                            JOIN competitions c ON c.id = t.competition_id
                            WHERE c.code = 'cibc-2026' AND t.category = 'student'),
                'corporate', (SELECT COUNT(*)::int FROM teams t
                              JOIN competitions c ON c.id = t.competition_id
                              WHERE c.code = 'cibc-2026' AND t.category = 'corporate')
            )
        ),
        'submissionsByStatus', (
            SELECT json_build_object(
                'draft', (SELECT COUNT(*)::int FROM submissions s
                          JOIN competitions c ON c.id = s.competition_id
                          WHERE c.code = 'cibc-2026' AND s.status = 'draft'),
                'submitted', (SELECT COUNT(*)::int FROM submissions s
                              JOIN competitions c ON c.id = s.competition_id
                              WHERE c.code = 'cibc-2026' AND s.status = 'submitted'),
                'graded', (SELECT COUNT(*)::int FROM submissions s
                           JOIN competitions c ON c.id = s.competition_id
                           WHERE c.code = 'cibc-2026' AND s.status = 'graded')
            )
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function: Get full timeline (stages + tasks)
CREATE OR REPLACE FUNCTION get_timeline()
RETURNS TABLE (
    stage_id UUID,
    stage_name TEXT,
    stage_name_id TEXT,
    stage_description TEXT,
    stage_order_index INTEGER,
    stage_start_date TIMESTAMPTZ,
    stage_end_date TIMESTAMPTZ,
    stage_status TEXT,
    stage_is_active BOOLEAN,
    stage_progress DECIMAL,
    tasks JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id as stage_id,
        s.name as stage_name,
        s.name_id as stage_name_id,
        s.description as stage_description,
        s.order_index as stage_order_index,
        s.start_date as stage_start_date,
        s.end_date as stage_end_date,
        s.status as stage_status,
        s.is_active as stage_is_active,
        -- Calculate progress based on tasks completed
        COALESCE(
            (SELECT COUNT(*)::DECIMAL / NULLIF(COUNT(*), 0) * 100
             FROM submissions sub
             JOIN tasks t ON t.id = sub.task_id
             WHERE t.stage_id = s.id AND sub.status IN ('submitted', 'graded', 'final')),
            0
        ) as stage_progress,
        -- Aggregate tasks as JSON
        COALESCE(
            (SELECT jsonb_agg(jsonb_build_object(
                'id', t.id,
                'name', t.name,
                'name_id', t.name_id,
                'description', t.description,
                'type', t.type,
                'deadline', t.deadline,
                'is_published', t.is_published,
                'is_required', t.is_required,
                'order_index', t.order_index
            ))
            FROM tasks t
            WHERE t.stage_id = s.id
            ORDER BY t.order_index),
            '[]'::jsonb
        ) as tasks
    FROM stages s
    JOIN competitions c ON c.id = s.competition_id
    WHERE c.code = 'cibc-2026'
    ORDER BY s.order_index;
END;
$$ LANGUAGE plpgsql;

-- Function: Activate a stage (deactivates others)
CREATE OR REPLACE FUNCTION activate_stage(p_stage_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
    v_competition_id UUID;
BEGIN
    -- Get competition_id from stage
    SELECT competition_id INTO v_competition_id
    FROM stages WHERE id = p_stage_id;

    -- Deactivate all other stages in this competition
    UPDATE stages
    SET is_active = false, status = 'upcoming'
    WHERE competition_id = v_competition_id AND id != p_stage_id;

    -- Activate target stage
    UPDATE stages
    SET is_active = true, status = 'active'
    WHERE id = p_stage_id
    RETURNING json_build_object(
        'id', id,
        'name', name,
        'status', status,
        'is_active', is_active
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function: Increment news view count
CREATE OR REPLACE FUNCTION increment_news_view(p_news_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE news SET views = views + 1
    WHERE id = p_news_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Get leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(
    p_category TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    rank INTEGER,
    team_id UUID,
    team_name TEXT,
    team_institution TEXT,
    team_category TEXT,
    total_score DECIMAL,
    submissions_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ROW_NUMBER() OVER (ORDER BY t.total_score DESC NULLS LAST)::INTEGER as rank,
        t.id as team_id,
        t.name as team_name,
        t.institution as team_institution,
        t.category as team_category,
        COALESCE(t.total_score, 0) as total_score,
        (SELECT COUNT(*) FROM submissions s WHERE s.team_id = t.id) as submissions_count
    FROM teams t
    JOIN competitions c ON c.id = t.competition_id
    WHERE c.code = 'cibc-2026'
    AND t.status = 'active'
    AND (p_category IS NULL OR t.category = p_category)
    ORDER BY t.total_score DESC NULLS LAST
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. SEED DATA FOR NEWS
-- ============================================

INSERT INTO news (id, title, title_id, slug, excerpt, excerpt_id, content, content_id, image, category, author, is_published, published_at, views)
VALUES
(
    '00000000-0000-0000-0000-000000000401',
    'CIBC Power by KATH 2026 Officially Open for Registration',
    'CIBC Power by KATH 2026 Resmi Dibuka untuk Pendaftaran',
    'cibc-power-by-kath-2026-officially-open',
    'The biggest BMC competition in Indonesia is now open for registration. Total prize of Rp 200 Million awaits the best innovators!',
    'Kompetisi BMC terbesar di Indonesia kini dibuka untuk pendaftaran. Total hadiah Rp 200 Juta menanti para inovator terbaik!',
    '<p>We are excited to announce that <strong>CIBC Power by KATH 2026</strong> is now open for registration!</p><p>This international Business Model Canvas competition brings together the best talents from around the world to compete and present their innovative ideas.</p><h2>Competition Categories</h2><ul><li><strong>Startup</strong> - For early-stage startups with validated MVP (Prize: Rp 100 Juta)</li><li><strong>Student</strong> - For university students with innovative ideas (Prize: Rp 50 Juta)</li><li><strong>Corporate Innovation</strong> - For corporate teams with internal innovation projects (Prize: Rp 50 Juta)</li></ul><p>Register your team now and be part of this exciting journey!</p>',
    '<p>Kami dengan antusias mengumumkan bahwa <strong>CIBC Power by KATH 2026</strong> kini dibuka untuk pendaftaran!</p><p>Kompetisi Business Model Canvas internasional ini menghadirkan talenta terbaik dari seluruh dunia untuk berkompetisi dan mempresentasikan ide-ide inovatif mereka.</p><h2>Kategori Kompetisi</h2><ul><li><strong>Startup</strong> - Untuk startup tahap awal dengan MVP yang tervalidasi (Hadiah: Rp 100 Juta)</li><li><strong>Student</strong> - Untuk mahasiswa dengan ide-ide inovatif (Hadiah: Rp 50 Juta)</li><li><strong>Corporate Innovation</strong> - Untuk tim korporasi dengan proyek inovasi internal (Hadiah: Rp 50 Juta)</li></ul><p>Daftarkan tim Anda sekarang dan jadilah bagian dari perjalanan seru ini!</p>',
    '/images/news/cibc-2026-open.jpg',
    'competition',
    'CIBC Team',
    true,
    NOW(),
    0
),
(
    '00000000-0000-0000-0000-000000000402',
    '5 Tips to Create a Winning Business Model Canvas',
    '5 Tips Membuat Business Model Canvas yang Menang',
    '5-tips-winning-business-model-canvas',
    'Learn the secrets to creating a compelling Business Model Canvas that stands out from the competition.',
    'Pelajari rahasia membuat Business Model Canvas yang menarik dan berbeda dari kompetisi.',
    '<p>Creating a winning Business Model Canvas requires more than just filling out the nine building blocks. Here are 5 tips to help you stand out:</p><ol><li><strong>Start with a Clear Value Proposition</strong> - What unique value do you bring to customers?</li><li><strong>Know Your Customer Segments</strong> - Who are you serving and why?</li><li><strong>Design Scalable Revenue Streams</strong> - How will you make money sustainably?</li><li><strong>Build Strong Key Partnerships</strong> - Who can help you succeed?</li><li><strong>Keep It Simple and Visual</strong> - A clear, concise BMC is easier to understand and pitch.</li></ol>',
    '<p>Membuat Business Model Canvas yang menang membutuhkan lebih dari sekadar mengisi sembilan blok bangunan. Berikut 5 tips untuk membantu Anda menonjol:</p><ol><li><strong>Mulai dengan Value Proposition yang Jelas</strong> - Nilai unik apa yang Anda tawarkan?</li><li><strong>Kenali Customer Segments Anda</strong> - Siapa yang Anda layani dan mengapa?</li><li><strong>Desain Revenue Streams yang Skalabel</strong> - Bagaimana Anda akan menghasilkan uang secara berkelanjutan?</li><li><strong>Bangun Key Partnerships yang Kuat</strong> - Siapa yang dapat membantu Anda sukses?</li><li><strong>Jaga Tetap Sederhana dan Visual</strong> - BMC yang jelas dan ringkas lebih mudah dipahami dan dipresentasikan.</li></ol>',
    '/images/news/tips-bmc.jpg',
    'tips',
    'CIBC Team',
    true,
    NOW() - INTERVAL '2 days',
    0
),
(
    '00000000-0000-0000-0000-000000000403',
    'Meet the Judges: Industry Leaders Ready to Evaluate Your Ideas',
    'Kenali Juri: Pemimpin Industri Siap Menilai Ide Anda',
    'meet-the-judges-industry-leaders',
    'Our distinguished panel of judges brings decades of experience in business, innovation, and entrepreneurship.',
    'Panel juri terhormat kami membawa pengalaman puluhan tahun dalam bisnis, inovasi, dan kewirausahaan.',
    '<p>We are proud to introduce our panel of distinguished judges for CIBC Power by KATH 2026. Each judge brings unique expertise and perspective to evaluate your innovative ideas.</p><p>Stay tuned for the full announcement of our judging panel!</p>',
    '<p>Kami bangga memperkenalkan panel juri terhormat untuk CIBC Power by KATH 2026. Setiap juri membawa keahlian dan perspektif unik untuk mengevaluasi ide-ide inovatif Anda.</p><p>Nantikan pengumuman lengkap panel juri kami!</p>',
    '/images/news/judges.jpg',
    'announcement',
    'CIBC Team',
    true,
    NOW() - INTERVAL '5 days',
    0
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration completed successfully!';
    RAISE NOTICE '📊 New table: news';
    RAISE NOTICE '🔧 New functions: get_competition_stats, get_timeline, activate_stage, increment_news_view, get_leaderboard';
    RAISE NOTICE '📝 News seed data: 3 articles';
END $$;