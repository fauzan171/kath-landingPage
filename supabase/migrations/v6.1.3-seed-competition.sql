-- ============================================
-- Seed Data: CIBC 2026 Competition
-- Version: 6.1.3
-- Date: 2026-04-04
-- ============================================
--
-- This migration seeds the CIBC 2026 competition data
-- Required for the platform to function
--
-- Schema based on v6.0.0-final-schema.sql
-- ============================================

-- ============================================
-- PART 1: Insert CIBC 2026 Competition
-- ============================================
-- competitions columns: id, code, name, name_id, description, description_id,
-- status, is_active, registration_start, registration_end,
-- competition_start, competition_end, config, created_at, updated_at

INSERT INTO competitions (
    id,
    code,
    name,
    name_id,
    description,
    description_id,
    status,
    is_active,
    registration_start,
    registration_end,
    competition_start,
    competition_end,
    config,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'cibc-2026',
    'CIBC 2026 Competition',
    'Kompetisi CIBC 2026',
    'Columbia International Business Competition 2026 - Innovate for a Sustainable Future',
    'Kompetisi Bisnis Internasional Columbia 2026 - Berinovasi untuk Masa Depan yang Berkelanjutan',
    'active',
    true,
    NOW(),
    NOW() + INTERVAL '60 days',
    NOW() + INTERVAL '70 days',
    NOW() + INTERVAL '75 days',
    '{
        "totalPrize": "$10,000",
        "maxTeamSize": 5,
        "minTeamSize": 1,
        "primaryColor": "#FFB22C",
        "secondaryColor": "#1A1A1A",
        "heroImage": "/images/cibc-hero.jpg",
        "logo": "/CIBC-logo-white.png",
        "autoProgressStages": true,
        "publicLeaderboard": true,
        "blindGrading": true,
        "categories": [
            {
                "id": "student",
                "name": "Student",
                "nameId": "Mahasiswa",
                "prize": "$5,000",
                "description": "Open to all university students"
            },
            {
                "id": "startup",
                "name": "Startup",
                "nameId": "Startup",
                "prize": "$3,000",
                "description": "Early-stage startups (less than 2 years)"
            },
            {
                "id": "corporate",
                "name": "Corporate",
                "nameId": "Korporasi",
                "prize": "$2,000",
                "description": "Corporate innovation teams"
            }
        ]
    }'::jsonb,
    NOW(),
    NOW()
) ON CONFLICT (code) DO UPDATE SET
    is_active = EXCLUDED.is_active,
    status = EXCLUDED.status,
    competition_start = EXCLUDED.competition_start,
    competition_end = EXCLUDED.competition_end,
    config = EXCLUDED.config,
    updated_at = NOW();

-- ============================================
-- PART 2: Insert Default Stages
-- ============================================
-- stages columns: id, competition_id, name, name_id, description,
-- order_index, start_date, end_date, status, is_active, created_at

INSERT INTO stages (
    id,
    competition_id,
    name,
    name_id,
    description,
    order_index,
    start_date,
    end_date,
    status,
    is_active
)
SELECT
    gen_random_uuid(),
    c.id,
    stage_name,
    stage_name_id,
    stage_desc,
    stage_order,
    NOW() + (stage_order || ' days')::interval,
    NOW() + ((stage_order + 14) || ' days')::interval,
    CASE WHEN stage_order = 1 THEN 'active'::text ELSE 'upcoming'::text END,
    stage_order = 1
FROM competitions c
CROSS JOIN (
    VALUES
        ('Registration', 'Registrasi', 'Team registration and payment verification', 1),
        ('Proposal Submission', 'Pengumpulan Proposal', 'Submit your business proposal', 15),
        ('Semi-Final', 'Semi-Final', 'Pitch your proposal to judges', 30),
        ('Final', 'Final', 'Final presentation and awards', 50)
) AS stages(stage_name, stage_name_id, stage_desc, stage_order)
WHERE c.code = 'cibc-2026'
ON CONFLICT DO NOTHING;

-- ============================================
-- PART 3: Insert Default Tasks for Stage 1
-- ============================================
-- tasks columns: id, stage_id, competition_id, name, name_id, description,
-- type, is_required, is_published, max_score, created_at

INSERT INTO tasks (
    id,
    stage_id,
    competition_id,
    name,
    name_id,
    description,
    type,
    max_score,
    is_required,
    is_published
)
SELECT
    gen_random_uuid(),
    s.id,
    s.competition_id,
    task_name,
    task_name_id,
    task_desc,
    task_type,
    100,
    true,
    true
FROM stages s
CROSS JOIN (
    VALUES
        ('Team Registration', 'Registrasi Tim', 'Complete your team registration', 'text'),
        ('Payment Proof', 'Bukti Pembayaran', 'Upload your payment proof', 'file_upload')
) AS tasks(task_name, task_name_id, task_desc, task_type)
WHERE s.competition_id = (SELECT id FROM competitions WHERE code = 'cibc-2026')
AND s.order_index = 1
ON CONFLICT DO NOTHING;

-- ============================================
-- PART 4: Insert Sample Announcements
-- ============================================
-- announcements columns: id, competition_id, title, title_id, content,
-- content_id, type, is_published, published_at, created_at

INSERT INTO announcements (
    id,
    competition_id,
    title,
    title_id,
    content,
    content_id,
    type,
    is_published,
    published_at
)
SELECT
    gen_random_uuid(),
    c.id,
    'Welcome to CIBC 2026!',
    'Selamat Datang di CIBC 2026!',
    'We are excited to have you participate in this year''s competition. Make sure to complete your registration and payment before the deadline.',
    'Kami senang menyambut Anda dalam kompetisi tahun ini. Pastikan untuk menyelesaikan registrasi dan pembayaran sebelum batas waktu.',
    'general',
    true,
    NOW()
FROM competitions c
WHERE c.code = 'cibc-2026'
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================
-- After running, verify with:
--
-- SELECT * FROM competitions WHERE code = 'cibc-2026';
-- SELECT * FROM stages WHERE competition_id = (SELECT id FROM competitions WHERE code = 'cibc-2026');
-- SELECT * FROM tasks WHERE competition_id = (SELECT id FROM competitions WHERE code = 'cibc-2026');
-- SELECT * FROM announcements WHERE competition_id = (SELECT id FROM competitions WHERE code = 'cibc-2026');
--
-- ============================================

SELECT '✅ CIBC 2026 Competition seeded successfully!' AS result;