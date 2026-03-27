-- ============================================
-- Email Notification Edge Functions
-- ============================================
-- These functions handle sending emails for various events
-- Requires Supabase Edge Functions to be deployed
-- ============================================

-- ============================================
-- 1. EMAIL LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_type TEXT NOT NULL,
    template_data JSONB DEFAULT '{}',
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view email logs
CREATE POLICY "Admins can view email logs" ON email_logs FOR SELECT
    USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

-- ============================================
-- 2. FUNCTION: Send Verification Email
-- ============================================
CREATE OR REPLACE FUNCTION send_verification_email(
    p_team_id UUID,
    p_team_name TEXT,
    p_leader_email TEXT,
    p_leader_name TEXT
)
RETURNS void AS $$
DECLARE
    v_competition_name TEXT;
    v_verification_url TEXT;
BEGIN
    -- Get competition name
    SELECT name INTO v_competition_name
    FROM competitions
    WHERE id = (SELECT competition_id FROM teams WHERE id = p_team_id);

    -- Generate verification URL (admin will verify, this is for notification)
    -- In production, this would trigger an email to admin as well

    -- Log the email request
    INSERT INTO email_logs (recipient_email, subject, template_type, template_data)
    VALUES (
        p_leader_email,
        'Registration Received - ' || v_competition_name,
        'registration_received',
        jsonb_build_object(
            'team_name', p_team_name,
            'leader_name', p_leader_name,
            'competition_name', v_competition_name,
            'status', 'pending_verification'
        )
    );

    -- In production, this would call an Edge Function to send the email
    -- Example: SELECT net.http_post(...) to trigger Edge Function

    -- For now, create a notification for the user
    INSERT INTO notifications (user_id, title, message, type)
    SELECT
        u.id,
        'Registration Submitted',
        'Your team "' || p_team_name || '" has been registered. Waiting for verification.',
        'success'
    FROM users u
    WHERE u.email = p_leader_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. FUNCTION: Send Team Verified Email
-- ============================================
CREATE OR REPLACE FUNCTION send_team_verified_email(
    p_team_id UUID
)
RETURNS void AS $$
DECLARE
    v_team_name TEXT;
    v_leader_email TEXT;
    v_leader_id UUID;
    v_leader_name TEXT;
    v_competition_name TEXT;
BEGIN
    -- Get team details
    SELECT name INTO v_team_name FROM teams WHERE id = p_team_id;

    -- Get leader details
    SELECT u.id, u.email, u.name
    INTO v_leader_id, v_leader_email, v_leader_name
    FROM users u
    JOIN team_members tm ON tm.user_id = u.id
    WHERE tm.team_id = p_team_id AND tm.role = 'leader';

    -- Get competition name
    SELECT c.name INTO v_competition_name
    FROM competitions c
    JOIN teams t ON t.competition_id = c.id
    WHERE t.id = p_team_id;

    -- Log the email
    INSERT INTO email_logs (recipient_email, subject, template_type, template_data, status, sent_at)
    VALUES (
        v_leader_email,
        'Team Verified - ' || v_competition_name,
        'team_verified',
        jsonb_build_object(
            'team_name', v_team_name,
            'leader_name', v_leader_name,
            'competition_name', v_competition_name
        ),
        'sent',
        NOW()
    );

    -- Create notification for the user
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
        v_leader_id,
        'Team Verified!',
        'Congratulations! Your team "' || v_team_name || '" has been verified. You can now access the dashboard.',
        'success'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. FUNCTION: Send Team Rejected Email
-- ============================================
CREATE OR REPLACE FUNCTION send_team_rejected_email(
    p_team_id UUID,
    p_reason TEXT
)
RETURNS void AS $$
DECLARE
    v_team_name TEXT;
    v_leader_email TEXT;
    v_leader_id UUID;
    v_leader_name TEXT;
BEGIN
    -- Get team details
    SELECT name INTO v_team_name FROM teams WHERE id = p_team_id;

    -- Get leader details
    SELECT u.id, u.email, u.name
    INTO v_leader_id, v_leader_email, v_leader_name
    FROM users u
    JOIN team_members tm ON tm.user_id = u.id
    WHERE tm.team_id = p_team_id AND tm.role = 'leader';

    -- Log the email
    INSERT INTO email_logs (recipient_email, subject, template_type, template_data, status, sent_at)
    VALUES (
        v_leader_email,
        'Registration Update',
        'team_rejected',
        jsonb_build_object(
            'team_name', v_team_name,
            'leader_name', v_leader_name,
            'reason', p_reason
        ),
        'sent',
        NOW()
    );

    -- Create notification
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
        v_leader_id,
        'Registration Update',
        'Your team "' || v_team_name || '" registration needs attention. Reason: ' || p_reason,
        'warning'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. FUNCTION: Send Submission Graded Email
-- ============================================
CREATE OR REPLACE FUNCTION send_submission_graded_email(
    p_submission_id UUID
)
RETURNS void AS $$
DECLARE
    v_team_id UUID;
    v_team_name TEXT;
    v_leader_email TEXT;
    v_leader_id UUID;
    v_score DECIMAL;
    v_feedback TEXT;
    v_task_name TEXT;
BEGIN
    -- Get submission details
    SELECT s.team_id, s.total_score, s.feedback
    INTO v_team_id, v_score, v_feedback
    FROM submissions s
    WHERE s.id = p_submission_id;

    -- Get task name
    SELECT t.name INTO v_task_name
    FROM tasks t
    JOIN submissions s ON s.task_id = t.id
    WHERE s.id = p_submission_id;

    -- Get team details
    SELECT name INTO v_team_name FROM teams WHERE id = v_team_id;

    -- Get leader details
    SELECT u.id, u.email
    INTO v_leader_id, v_leader_email
    FROM users u
    JOIN team_members tm ON tm.user_id = u.id
    WHERE tm.team_id = v_team_id AND tm.role = 'leader';

    -- Log the email
    INSERT INTO email_logs (recipient_email, subject, template_type, template_data, status, sent_at)
    VALUES (
        v_leader_email,
        'Submission Graded - ' || v_task_name,
        'submission_graded',
        jsonb_build_object(
            'team_name', v_team_name,
            'task_name', v_task_name,
            'score', v_score,
            'feedback', v_feedback
        ),
        'sent',
        NOW()
    );

    -- Create notification
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
        v_leader_id,
        'Submission Graded',
        'Your submission for "' || v_task_name || '" has been graded. Score: ' || v_score || '/100',
        'info'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. FUNCTION: Send Announcement Notification
-- ============================================
CREATE OR REPLACE FUNCTION send_announcement_notification(
    p_announcement_id UUID
)
RETURNS void AS $$
DECLARE
    v_title TEXT;
    v_content TEXT;
    v_competition_id UUID;
    v_user_record RECORD;
BEGIN
    -- Get announcement details
    SELECT title, content, competition_id
    INTO v_title, v_content, v_competition_id
    FROM announcements
    WHERE id = p_announcement_id;

    -- Notify all team leaders in the competition
    FOR v_user_record IN
        SELECT DISTINCT u.id as user_id, u.email
        FROM users u
        JOIN team_members tm ON tm.user_id = u.id
        JOIN teams t ON t.id = tm.team_id
        WHERE t.competition_id = v_competition_id
        AND tm.role = 'leader'
        AND t.status = 'verified'
    LOOP
        -- Create notification
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            v_user_record.user_id,
            v_title,
            v_content,
            'info'
        );

        -- Log email
        INSERT INTO email_logs (recipient_email, subject, template_type, template_data)
        VALUES (
            v_user_record.email,
            v_title,
            'announcement',
            jsonb_build_object('content', v_content)
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. TRIGGER: Auto-send verification email on team creation
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_team_registration()
RETURNS TRIGGER AS $$
BEGIN
    -- Send verification email when team is created with pending status
    IF NEW.status = 'pending' AND (OLD.status IS NULL OR OLD.status = 'draft') THEN
        PERFORM send_verification_email(
            NEW.id,
            NEW.name,
            (SELECT u.email FROM users u JOIN team_members tm ON tm.user_id = u.id WHERE tm.team_id = NEW.id AND tm.role = 'leader'),
            (SELECT u.name FROM users u JOIN team_members tm ON tm.user_id = u.id WHERE tm.team_id = NEW.id AND tm.role = 'leader')
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_team_status_change ON teams;
CREATE TRIGGER on_team_status_change
    AFTER INSERT OR UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_team_registration();

-- ============================================
-- 8. TRIGGER: Send email when team is verified
-- ============================================
CREATE OR REPLACE FUNCTION handle_team_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- Send verified email when status changes to verified
    IF NEW.status = 'verified' AND OLD.status != 'verified' THEN
        PERFORM send_team_verified_email(NEW.id);
    END IF;

    -- Send rejected email when payment is rejected
    IF NEW.payment_status = 'rejected' AND OLD.payment_status != 'rejected' THEN
        PERFORM send_team_rejected_email(NEW.id, COALESCE(NEW.notes, 'Payment verification failed'));
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_team_verification ON teams;
CREATE TRIGGER on_team_verification
    AFTER UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION handle_team_verification();

-- ============================================
-- 9. TRIGGER: Send email when submission is graded
-- ============================================
CREATE OR REPLACE FUNCTION handle_submission_grading()
RETURNS TRIGGER AS $$
BEGIN
    -- Send graded email when status changes to graded
    IF NEW.status = 'graded' AND (OLD.status IS NULL OR OLD.status != 'graded') THEN
        PERFORM send_submission_graded_email(NEW.id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_submission_graded ON submissions;
CREATE TRIGGER on_submission_graded
    AFTER UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION handle_submission_grading();

-- ============================================
-- 10. TRIGGER: Send notification when announcement is published
-- ============================================
CREATE OR REPLACE FUNCTION handle_announcement_publish()
RETURNS TRIGGER AS $$
BEGIN
    -- Send notification when announcement is published
    IF NEW.is_published = true AND (OLD.is_published = false OR OLD.is_published IS NULL) THEN
        PERFORM send_announcement_notification(NEW.id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_announcement_publish ON announcements;
CREATE TRIGGER on_announcement_publish
    AFTER UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION handle_announcement_publish();

-- ============================================
-- 11. FUNCTION: Send Password Reset Email (for Supabase Auth)
-- ============================================
-- Note: Password reset is handled by Supabase Auth directly
-- This function can be used for custom password reset flows
CREATE OR REPLACE FUNCTION request_password_reset(
    p_email TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_user_exists BOOLEAN;
    v_reset_token TEXT;
BEGIN
    -- Check if user exists
    SELECT EXISTS(SELECT 1 FROM users WHERE email = p_email) INTO v_user_exists;

    IF NOT v_user_exists THEN
        RETURN jsonb_build_object('success', false, 'message', 'If the email exists, a reset link will be sent');
    END IF;

    -- Log the request (actual email sent by Supabase Auth)
    INSERT INTO email_logs (recipient_email, subject, template_type, template_data)
    VALUES (
        p_email,
        'Password Reset Request',
        'password_reset',
        jsonb_build_object('requested_at', NOW())
    );

    RETURN jsonb_build_object('success', true, 'message', 'If the email exists, a reset link will be sent');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 12. MANUAL EMAIL FUNCTIONS
-- ============================================

-- Send email to all verified team leaders (for admin use)
CREATE OR REPLACE FUNCTION broadcast_to_all_teams(
    p_subject TEXT,
    p_message TEXT,
    p_competition_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER := 0;
    v_comp_id UUID;
BEGIN
    -- Get competition ID if not provided
    IF p_competition_id IS NULL THEN
        SELECT id INTO v_comp_id FROM competitions WHERE code = 'cibc-2026';
    ELSE
        v_comp_id := p_competition_id;
    END IF;

    -- Insert notifications for all team leaders
    INSERT INTO notifications (user_id, title, message, type)
    SELECT
        u.id,
        p_subject,
        p_message,
        'info'
    FROM users u
    JOIN team_members tm ON tm.user_id = u.id
    JOIN teams t ON t.id = tm.team_id
    WHERE t.competition_id = v_comp_id
    AND tm.role = 'leader'
    AND t.status = 'verified';

    GET DIAGNOSTICS v_count = ROW_COUNT;

    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DONE!
-- ============================================
SELECT 'Email notification functions created successfully!' as status;