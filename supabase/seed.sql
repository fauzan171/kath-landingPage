-- ============================================
-- CIBC Admin Dashboard - Seed Data
-- Version: 2.0.0 (Supabase Overhaul)
-- ============================================

-- ============================================
-- 1. DEFAULT ADMIN USER
-- ============================================
-- Password: Admin123! (use Supabase Auth in production)

INSERT INTO users (id, email, password_hash, name, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@kathevent.com',
    '$2a$10$PlaceholderHashUseSupabaseAuth',  -- Use Supabase Auth instead
    'Super Admin',
    true
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. CIBC 2026 COMPETITION
-- ============================================

INSERT INTO competitions (
    id,
    code,
    name,
    subtitle,
    description,
    status,
    registration_start,
    registration_end,
    event_start,
    event_end,
    config,
    theme,
    settings,
    created_by
) VALUES (
    '00000000-0000-0000-0000-000000000010',
    'cibc-2026',
    'CIBC Power by KATH 2026',
    'Inovasi untuk Masa Depan Berkelanjutan',
    'Kompetisi Business Model Canvas tingkat internasional yang menghadirkan talenta terbaik dari seluruh dunia untuk berkompetisi dan mempresentasikan ide-ide inovatif mereka. Dengan hadiah total Rp 200 Juta, kompetisi ini terbuka untuk kategori Student, Startup, dan Corporate Innovation.',
    'active',
    '2026-03-01 00:00:00+00',
    '2026-04-30 23:59:59+00',
    '2026-05-01 00:00:00+00',
    '2026-05-17 23:59:59+00',
    '{
        "totalPrize": "Rp 200 Juta",
        "maxTeamSize": 5,
        "minTeamSize": 2,
        "categories": [
            {
                "id": "startup",
                "name": "Startup",
                "nameId": "Startup",
                "prize": "Rp 100 Juta",
                "description": "For early-stage startups with validated MVP"
            },
            {
                "id": "student",
                "name": "Student",
                "nameId": "Mahasiswa",
                "prize": "Rp 50 Juta",
                "description": "For university students with innovative ideas"
            },
            {
                "id": "corporate",
                "name": "Corporate Innovation",
                "nameId": "Inovasi Korporasi",
                "prize": "Rp 50 Juta",
                "description": "For corporate teams with internal innovation projects"
            }
        ],
        "allowedFileTypes": [".pdf", ".pptx", ".docx"],
        "maxFileSizeMB": 10
    }'::jsonb,
    '{
        "primaryColor": "#C4A35A",
        "secondaryColor": "#1A1A1A",
        "accentColor": "#F59E0B",
        "heroImage": "/images/hero-cibc-2026.jpg",
        "logo": "/images/logo-cibc.png"
    }'::jsonb,
    '{
        "autoProgressStages": true,
        "publicLeaderboard": false,
        "blindGrading": true,
        "allowLateSubmission": false,
        "latePenaltyPercent": 10,
        "requireEmailVerification": true
    }'::jsonb,
    '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. SUPER ADMIN ROLE
-- ============================================

INSERT INTO user_roles (id, user_id, competition_id, role, permissions)
VALUES (
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000010',
    'super_admin',
    '["read", "write", "delete", "grade", "manage_users", "manage_competitions"]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. DEFAULT STAGES
-- ============================================

-- Stage 1: Registration
INSERT INTO stages (
    id, competition_id, name, name_id, description, order_index,
    start_date, end_date, status, is_active, is_visible, auto_progress, requires_all_tasks
) VALUES (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000010',
    'Registration',
    'Pendaftaran',
    'Register your team and complete the initial registration form',
    1,
    '2026-03-01 00:00:00+00',
    '2026-04-30 23:59:59+00',
    'active',
    true,
    true,
    false,
    true
) ON CONFLICT (id) DO NOTHING;

-- Stage 2: BMC Submission
INSERT INTO stages (
    id, competition_id, name, name_id, description, order_index,
    start_date, end_date, status, is_active, is_visible, auto_progress, requires_all_tasks
) VALUES (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000010',
    'BMC Submission',
    'Pengumpulan BMC',
    'Submit your Business Model Canvas document',
    2,
    '2026-05-01 00:00:00+00',
    '2026-05-07 23:59:59+00',
    'upcoming',
    false,
    true,
    false,
    true
) ON CONFLICT (id) DO NOTHING;

-- Stage 3: Pitch Deck
INSERT INTO stages (
    id, competition_id, name, name_id, description, order_index,
    start_date, end_date, status, is_active, is_visible, auto_progress, requires_all_tasks
) VALUES (
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000010',
    'Pitch Deck Submission',
    'Pengumpulan Pitch Deck',
    'Submit your pitch deck and video presentation',
    3,
    '2026-05-08 00:00:00+00',
    '2026-05-12 23:59:59+00',
    'draft',
    false,
    true,
    false,
    true
) ON CONFLICT (id) DO NOTHING;

-- Stage 4: Semifinal
INSERT INTO stages (
    id, competition_id, name, name_id, description, order_index,
    start_date, end_date, status, is_active, is_visible, auto_progress, requires_all_tasks
) VALUES (
    '00000000-0000-0000-0000-000000000104',
    '00000000-0000-0000-0000-000000000010',
    'Semifinal',
    'Semifinal',
    'Present your idea to the judges',
    4,
    '2026-05-13 00:00:00+00',
    '2026-05-14 23:59:59+00',
    'draft',
    false,
    true,
    false,
    true
) ON CONFLICT (id) DO NOTHING;

-- Stage 5: Final
INSERT INTO stages (
    id, competition_id, name, name_id, description, order_index,
    start_date, end_date, status, is_active, is_visible, auto_progress, requires_all_tasks
) VALUES (
    '00000000-0000-0000-0000-000000000105',
    '00000000-0000-0000-0000-000000000010',
    'Final',
    'Final',
    'Final presentation and award ceremony',
    5,
    '2026-05-15 00:00:00+00',
    '2026-05-17 23:59:59+00',
    'draft',
    false,
    true,
    false,
    true
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. DEFAULT TASKS
-- ============================================

-- Registration Task
INSERT INTO tasks (
    id, stage_id, competition_id, name, name_id, description, instructions,
    type, max_file_size_mb, allowed_extensions, max_files, deadline,
    is_required, is_published, allow_edit, rubric, custom_fields, order_index
) VALUES (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000010',
    'Team Registration Form',
    'Formulir Pendaftaran Tim',
    'Complete your team registration with all required information',
    'Fill out the team registration form with your team details, member information, and project concept.',
    'text_input',
    10,
    '[".pdf"]'::jsonb,
    1,
    '2026-04-30 23:59:59+00',
    true,
    true,
    true,
    NULL,
    '[
        {
            "id": "team_name",
            "label": "Team Name",
            "labelId": "Nama Tim",
            "type": "text",
            "required": true,
            "placeholder": "Enter your team name"
        },
        {
            "id": "project_name",
            "label": "Project Name",
            "labelId": "Nama Proyek",
            "type": "text",
            "required": true,
            "placeholder": "Enter your project name"
        },
        {
            "id": "project_description",
            "label": "Project Description",
            "labelId": "Deskripsi Proyek",
            "type": "textarea",
            "required": true,
            "minLength": 100,
            "maxLength": 1000,
            "placeholder": "Describe your project in 100-1000 characters"
        },
        {
            "id": "category",
            "label": "Category",
            "labelId": "Kategori",
            "type": "select",
            "required": true,
            "options": ["startup", "student", "corporate"]
        }
    ]'::jsonb,
    1
) ON CONFLICT (id) DO NOTHING;

-- BMC Upload Task
INSERT INTO tasks (
    id, stage_id, competition_id, name, name_id, description, instructions,
    type, max_file_size_mb, allowed_extensions, max_files, deadline,
    is_required, is_published, allow_edit, rubric, custom_fields, order_index
) VALUES (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000010',
    'Business Model Canvas',
    'Business Model Canvas',
    'Upload your Business Model Canvas document in PDF format',
    'Create and upload your BMC following the standard template. Maximum 1 page.',
    'file_upload',
    10,
    '[".pdf"]'::jsonb,
    1,
    '2026-05-07 23:59:59+00',
    true,
    true,
    true,
    '[
        {
            "id": "innovation",
            "name": "Innovation & Creativity",
            "nameId": "Inovasi & Kreativitas",
            "description": "Novelty and creativity of the business idea",
            "maxScore": 25,
            "weight": 0.25
        },
        {
            "id": "market_potential",
            "name": "Market Potential",
            "nameId": "Potensi Pasar",
            "description": "Size and attractiveness of the target market",
            "maxScore": 20,
            "weight": 0.20
        },
        {
            "id": "business_model",
            "name": "Business Model Viability",
            "nameId": "Viabilitas Model Bisnis",
            "description": "Feasibility and sustainability of the business model",
            "maxScore": 25,
            "weight": 0.25
        },
        {
            "id": "team_capability",
            "name": "Team Capability",
            "nameId": "Kapasitas Tim",
            "description": "Skills and experience of the team",
            "maxScore": 15,
            "weight": 0.15
        },
        {
            "id": "presentation",
            "name": "Presentation Quality",
            "nameId": "Kualitas Presentasi",
            "description": "Clarity and professionalism of the BMC",
            "maxScore": 15,
            "weight": 0.15
        }
    ]'::jsonb,
    NULL,
    1
) ON CONFLICT (id) DO NOTHING;

-- Pitch Deck Upload Task
INSERT INTO tasks (
    id, stage_id, competition_id, name, name_id, description, instructions,
    type, max_file_size_mb, allowed_extensions, max_files, deadline,
    is_required, is_published, allow_edit, rubric, custom_fields, order_index
) VALUES (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000010',
    'Pitch Deck',
    'Pitch Deck',
    'Upload your pitch deck presentation (10-15 slides)',
    'Create a compelling pitch deck covering: Problem, Solution, Market, Business Model, Competition, Team, Financials, and Ask.',
    'file_upload',
    20,
    '[".pdf", ".pptx"]'::jsonb,
    1,
    '2026-05-12 23:59:59+00',
    true,
    false,
    true,
    '[
        {
            "id": "problem_solution",
            "name": "Problem-Solution Fit",
            "nameId": "Kesesuaian Masalah-Solusi",
            "maxScore": 20,
            "weight": 0.20
        },
        {
            "id": "market_analysis",
            "name": "Market Analysis",
            "nameId": "Analisis Pasar",
            "maxScore": 20,
            "weight": 0.20
        },
        {
            "id": "business_viability",
            "name": "Business Viability",
            "nameId": "Viabilitas Bisnis",
            "maxScore": 20,
            "weight": 0.20
        },
        {
            "id": "competitive_advantage",
            "name": "Competitive Advantage",
            "nameId": "Keunggulan Kompetitif",
            "maxScore": 15,
            "weight": 0.15
        },
        {
            "id": "team_strength",
            "name": "Team Strength",
            "nameId": "Kekuatan Tim",
            "maxScore": 15,
            "weight": 0.15
        },
        {
            "id": "presentation_quality",
            "name": "Presentation Quality",
            "nameId": "Kualitas Presentasi",
            "maxScore": 10,
            "weight": 0.10
        }
    ]'::jsonb,
    NULL,
    1
) ON CONFLICT (id) DO NOTHING;

-- Video Pitch Task
INSERT INTO tasks (
    id, stage_id, competition_id, name, name_id, description, instructions,
    type, max_file_size_mb, allowed_extensions, max_files, deadline,
    is_required, is_published, allow_edit, rubric, custom_fields, order_index
) VALUES (
    '00000000-0000-0000-0000-000000000204',
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000010',
    'Video Pitch',
    'Video Pitch',
    'Submit a 2-3 minute video pitch of your project',
    'Record a compelling 2-3 minute video pitch. Upload to YouTube/Vimeo and provide the link.',
    'link_submit',
    0,
    NULL,
    1,
    '2026-05-12 23:59:59+00',
    true,
    false,
    true,
    NULL,
    '[
        {
            "id": "video_url",
            "label": "Video URL",
            "labelId": "URL Video",
            "type": "url",
            "required": true,
            "placeholder": "https://youtube.com/watch?v=..."
        }
    ]'::jsonb,
    2
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. SAMPLE ANNOUNCEMENT
-- ============================================

INSERT INTO announcements (
    id, competition_id, created_by, title, title_id, content, content_id,
    type, is_published, published_at, target_all
) VALUES (
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'Welcome to CIBC Power by KATH 2026!',
    'Selamat Datang di CIBC Power by KATH 2026!',
    '<p>Welcome to the CIBC Power by KATH 2026 competition! We are excited to have you participate in this international Business Model Canvas competition.</p><p>Registration is now open. Please complete your team registration before the deadline.</p>',
    '<p>Selamat datang di kompetisi CIBC Power by KATH 2026! Kami sangat senang menyambut partisipasi Anda dalam kompetisi Business Model Canvas internasional ini.</p><p>Pendaftaran telah dibuka. Silakan lengkapi pendaftaran tim Anda sebelum batas waktu yang ditentukan.</p>',
    'general',
    true,
    NOW(),
    true
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Seed data inserted successfully!';
    RAISE NOTICE '👤 Admin user: admin@kathevent.com';
    RAISE NOTICE '🏆 Competition: CIBC Power by KATH 2026';
    RAISE NOTICE '📋 Stages: 5 stages created';
    RAISE NOTICE '📝 Tasks: 4 tasks created';
    RAISE NOTICE '📢 Announcements: 1 announcement created';
END $$;