# 🔄 Supabase Service Overhaul - Single Competition Focus

## 📋 Context & Problem

**Project:** CIBC Power by KATH - Single Competition Platform  
**Issue:** Current services support multiple competitions, but we only have ONE (CIBC 2026)  
**Goal:** Simplify services, add missing endpoints (News, Timeline), remove unused features  

---

## 🔍 Current Problems Found

### Problem 1: Missing Critical Endpoints ❌

**What's MISSING:**

```typescript
// ❌ NO News Service (but News UI exists!)
- getNews()
- getNewsBySlug()
- createNews()
- updateNews()
- deleteNews()

// ❌ NO Timeline Management
- getTimeline()
- updateTimeline()
- activateStage()
- getStageProgress()
```

### Problem 2: Over-Engineered for Multiple Competitions ❌

**Current (WRONG):**
```typescript
// Support multiple competitions (NOT NEEDED!)
getCompetitions()      // Returns Competition[]
getByCompetition(id)   // Filter by competitionId
```

**Should Be (CORRECT):**
```typescript
// Single competition focus (CIBC 2026 ONLY)
getCompetition()       // Returns SINGLE competition
getTimeline()          // Timeline for CIBC 2026
```

### Problem 3: News Section Has UI But No Service ❌

**UI Exists:** `src/sections/News.tsx`
```typescript
import { newsConfig } from '../config';

// Reading from static config (WRONG!)
const filteredNews = newsConfig.items;
```

**Service Missing:**
```typescript
// ❌ NO supabaseNewsService
// Should read from database, not config!
```

---

## 🎯 Required Changes

### Change 1: Simplify Competition Service

**BEFORE (Multiple Competitions):**
```typescript
export const supabaseCompetitionService = {
  async getActive() {
    const { data } = await supabase
      .from('competitions')
      .select('*')
      .eq('status', 'active');
    return data; // Competition[]
  },

  async getByCode(code: string) {
    const { data } = await supabase
      .from('competitions')
      .select('*')
      .eq('code', code)
      .single();
    return data;
  },

  async getAll() {
    const { data } = await supabase
      .from('competitions')
      .select('*');
    return data; // Competition[]
  },
};
```

**AFTER (Single Competition - CIBC 2026):**
```typescript
export const supabaseCompetitionService = {
  async getCompetition() {
    // ALWAYS return CIBC 2026
    const { data } = await supabase
      .from('competitions')
      .select('*')
      .eq('code', 'cibc-2026')
      .single();
    return data; // Single Competition
  },

  async getTimeline() {
    // Get stages + tasks for CIBC 2026
    const { data } = await supabase
      .from('stages')
      .select(`
        *,
        tasks (
          id,
          name,
          name_id,
          description,
          deadline,
          is_published,
          type
        )
      `)
      .eq('competition_code', 'cibc-2026')
      .order('order_index', { ascending: true });
    return data;
  },

  async updateTimeline(updates: { stages: any[] }) {
    // Admin update timeline
    const { data, error } = await supabase.rpc('update_timeline', {
      p_stages: updates.stages
    });
    return data;
  },

  async activateStage(stageId: string) {
    // Admin activate stage
    const { data, error } = await supabase.rpc('activate_stage', {
      p_stage_id: stageId
    });
    return data;
  },

  async getStats() {
    // Competition statistics
    const { data } = await supabase.rpc('get_competition_stats', {
      p_competition_code: 'cibc-2026'
    });
    return data;
  },
};
```

---

### Change 2: Add News Service (NEW!)

**Create:** `src/services/supabaseNewsService.ts`

```typescript
import { supabase } from '@/lib/supabase';

export interface News {
  id: string;
  title: string;
  title_id?: string; // Indonesian translation
  slug: string;
  excerpt: string;
  excerpt_id?: string;
  content: string;
  content_id?: string;
  image?: string;
  category: 'competition' | 'announcement' | 'news';
  author: string;
  published_at?: string;
  is_published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export const supabaseNewsService = {
  /**
   * Get all published news (public)
   */
  async getAll(category?: string) {
    let query = supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Get news by URL slug (for detail page)
   */
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get news by category (for filtering)
   */
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', category)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Create news article
   */
  async create(news: Partial<News>) {
    const { data, error } = await supabase
      .from('news')
      .insert({
        ...news,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Update news article
   */
  async update(id: string, updates: Partial<News>) {
    const { data, error } = await supabase
      .from('news')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Delete news article
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  /**
   * Admin: Publish news article
   */
  async publish(id: string, publishedAt?: string) {
    const { data, error } = await supabase
      .from('news')
      .update({
        is_published: true,
        published_at: publishedAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Unpublish news article
   */
  async unpublish(id: string) {
    const { data, error } = await supabase
      .from('news')
      .update({
        is_published: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Increment view count (when user reads news)
   */
  async incrementView(id: string) {
    const { error } = await supabase.rpc('increment_news_view', {
      p_news_id: id
    });

    if (error) throw error;
    return { success: true };
  },
};
```

---

### Change 3: Update Database Schema

**File:** `database-schema.sql`

```sql
-- NEWS TABLE (NEW!)
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_id TEXT, -- Indonesian translation
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    excerpt_id TEXT, -- Indonesian translation
    content TEXT NOT NULL,
    content_id TEXT, -- Indonesian translation
    image TEXT,
    category TEXT CHECK(category IN ('competition', 'announcement', 'news')) NOT NULL,
    author TEXT NOT NULL,
    published_at TIMESTAMP,
    is_published BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- COMPETITION TABLE (Simplify for single competition)
CREATE TABLE competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL DEFAULT 'cibc-2026', -- ONLY ONE!
    name TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed', 'archived')),
    registration_start TIMESTAMP,
    registration_end TIMESTAMP,
    event_start TIMESTAMP,
    event_end TIMESTAMP,
    config JSONB,
    theme JSONB,
    settings JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- STAGES TABLE (Add competition_code for easier querying)
CREATE TABLE stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_code TEXT NOT NULL REFERENCES competitions(code) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_id TEXT,
    description TEXT,
    order_index INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed')),
    is_active BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    auto_progress BOOLEAN DEFAULT false,
    requires_all_tasks BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_published ON news(is_published);
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_stages_competition_code ON stages(competition_code);

-- FUNCTIONS

-- Function: Get competition stats
CREATE OR REPLACE FUNCTION get_competition_stats(p_competition_code TEXT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_teams', (SELECT COUNT(*) FROM teams WHERE competition_code = p_competition_code),
        'total_submissions', (SELECT COUNT(*) FROM submissions WHERE competition_code = p_competition_code),
        'active_stages', (SELECT COUNT(*) FROM stages WHERE competition_code = p_competition_code AND is_active = true),
        'total_prize', (SELECT config->>'totalPrize' FROM competitions WHERE code = p_competition_code)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function: Update timeline
CREATE OR REPLACE FUNCTION update_timeline(p_stages JSONB)
RETURNS VOID AS $$
BEGIN
    -- Update stages order and dates
    -- Implementation depends on your needs
    NULL;
END;
$$ LANGUAGE plpgsql;

-- Function: Activate stage
CREATE OR REPLACE FUNCTION activate_stage(p_stage_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Deactivate all stages first
    UPDATE stages SET is_active = false, status = 'completed'
    WHERE competition_code = 'cibc-2026' AND is_active = true;
    
    -- Activate target stage
    UPDATE stages SET is_active = true, status = 'active'
    WHERE id = p_stage_id
    RETURNING json_build_object('id', id, 'name', name, 'status', status) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function: Increment news view
CREATE OR REPLACE FUNCTION increment_news_view(p_news_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE news SET views = views + 1
    WHERE id = p_news_id;
END;
$$ LANGUAGE plpgsql;
```

---

### Change 4: Update Frontend Integration

**File:** `src/sections/News.tsx`

```typescript
// BEFORE (Reading from static config)
import { newsConfig } from '../config';
const filteredNews = newsConfig.items;

// AFTER (Reading from database via service)
import { supabaseNewsService } from '@/services/supabaseNewsService';

const [news, setNews] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadNews = async () => {
    try {
      const data = await supabaseNewsService.getAll(
        activeCategory === 'all' ? undefined : activeCategory
      );
      setNews(data);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  loadNews();
}, [activeCategory]);
```

**File:** `src/sections/Competition.tsx`

```typescript
// BEFORE (Reading from static config)
import { competitionConfig } from '../config';
const { mainCompetition, categories } = competitionConfig;

// AFTER (Reading from database via service)
import { supabaseCompetitionService } from '@/services/supabaseCompetitionService';

const [competition, setCompetition] = useState(null);
const [timeline, setTimeline] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadCompetition = async () => {
    try {
      const [comp, timelineData] = await Promise.all([
        supabaseCompetitionService.getCompetition(),
        supabaseCompetitionService.getTimeline(),
      ]);
      setCompetition(comp);
      setTimeline(timelineData);
    } catch (error) {
      console.error('Failed to load competition:', error);
    } finally {
      setLoading(false);
    }
  };

  loadCompetition();
}, []);
```

---

## ✅ Complete Service List (Final)

```typescript
// SERVICES TO CREATE/UPDATE:

// 1. ✅ supabaseAuthService (NO CHANGE)
// 2. ✅ supabaseCompetitionService (REFACTOR - Single competition)
// 3. ✅ supabaseStageService (NO CHANGE)
// 4. ✅ supabaseTaskService (NO CHANGE)
// 5. ✅ supabaseTeamService (NO CHANGE)
// 6. ✅ supabaseSubmissionService (NO CHANGE)
// 7. ✅ supabaseAnnouncementService (NO CHANGE)
// 8. ✅ supabaseNewsService (NEW!)
// 9. ✅ n8n webhook (NO CHANGE)

// TOTAL: 8 services + 1 webhook
```

---

## 📊 Database Tables (Final)

```sql
-- 12 TABLES TOTAL:

-- Core (8 tables)
1. users
2. user_roles
3. competitions (SINGLE: cibc-2026)
4. stages
5. tasks
6. teams
7. team_members
8. submissions

-- Content (2 tables)
9. news (NEW!)
10. announcements

-- System (2 tables)
11. notifications
12. audit_logs
```

---

## 🎯 Implementation Tasks

### Task 1: Create News Service
```bash
# Create file
touch src/services/supabaseNewsService.ts

# Implement all methods (see code above)

# Export from services index
echo "export * from './supabaseNewsService';" >> src/services/index.ts
```

### Task 2: Update Competition Service
```bash
# Update file
# Change from multiple to single competition
# Add getTimeline(), updateTimeline(), activateStage()
```

### Task 3: Add Database Functions
```bash
# Run SQL in Supabase SQL Editor
# Create news table
# Create functions (get_competition_stats, activate_stage, etc)
```

### Task 4: Update Frontend
```bash
# Update News.tsx to use supabaseNewsService
# Update Competition.tsx to use supabaseCompetitionService
# Remove static config usage
```

### Task 5: Test Everything
```bash
# Test news loading
# Test competition data loading
# Test timeline display
# Test admin operations
```

---

## 📝 Migration Guide

### From Multiple to Single Competition

**Step 1: Update existing data**
```sql
-- Set all competitions to use code 'cibc-2026'
UPDATE competitions SET code = 'cibc-2026' WHERE code IS NULL;

-- Add unique constraint
ALTER TABLE competitions ADD CONSTRAINT unique_code UNIQUE (code);

-- Update foreign keys in stages
ALTER TABLE stages ADD COLUMN competition_code TEXT;
UPDATE stages SET competition_code = 'cibc-2026';
ALTER TABLE stages ADD CONSTRAINT fk_competition 
  FOREIGN KEY (competition_code) REFERENCES competitions(code);
```

**Step 2: Update service calls**
```typescript
// BEFORE
const competitions = await supabaseCompetitionService.getActive();

// AFTER
const competition = await supabaseCompetitionService.getCompetition();
```

---

## ✅ Testing Checklist

```bash
# News Service
[ ] getAll() returns published news
[ ] getBySlug() returns single news
[ ] getByCategory() filters correctly
[ ] create() creates news (admin)
[ ] update() updates news (admin)
[ ] delete() deletes news (admin)
[ ] publish() publishes news (admin)

# Competition Service
[ ] getCompetition() returns CIBC 2026
[ ] getTimeline() returns stages + tasks
[ ] updateTimeline() updates timeline (admin)
[ ] activateStage() activates stage (admin)
[ ] getStats() returns statistics

# Frontend Integration
[ ] News section displays dynamic news
[ ] Competition section displays dynamic data
[ ] Timeline displays correctly
[ ] Admin operations work
```

---

## 🎯 Success Criteria

Your output is successful if:

✅ News service created with all CRUD operations  
✅ Competition service simplified to single competition  
✅ Timeline management functions added  
✅ Database schema updated with news table  
✅ Database functions created (stats, activate, etc)  
✅ Frontend updated to use services (not config)  
✅ All tests passing  
✅ No breaking changes to existing features  

---

**Start implementation now!** 🚀
