// ============================================
// CIBC Dashboard - News Service (Supabase)
// ============================================
// News management for CIBC 2026
// - CRUD operations for news articles
// - Bilingual support (English/Indonesian)
// - Category filtering
// - View tracking
// ============================================

import { supabase } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================

export type NewsCategory = 'competition' | 'announcement' | 'news' | 'update' | 'tips';

export interface News {
  id: string;
  // Content (Bilingual)
  title: string;
  title_id?: string;       // Indonesian translation
  slug: string;
  excerpt: string;
  excerpt_id?: string;
  content: string;
  content_id?: string;
  // Media
  image?: string;
  // Classification
  category: NewsCategory;
  // Metadata
  author: string;
  author_id?: string;
  // Publishing
  is_published: boolean;
  published_at?: string;
  scheduled_at?: string;
  // Stats
  views: number;
  // SEO
  meta_title?: string;
  meta_description?: string;
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface NewsFormData {
  title: string;
  title_id?: string;
  slug: string;
  excerpt: string;
  excerpt_id?: string;
  content: string;
  content_id?: string;
  image?: string;
  category: NewsCategory;
  author?: string;
  meta_title?: string;
  meta_description?: string;
  is_published?: boolean;
  published_at?: string;
  scheduled_at?: string;
}

// ============================================
// NEWS SERVICE
// ============================================

export const supabaseNewsService = {
  /**
   * Get all published news (public)
   * Optionally filter by category
   */
  async getAll(category?: NewsCategory | 'all'): Promise<News[]> {
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
    return data || [];
  },

  /**
   * Get news by URL slug (for detail page)
   */
  async getBySlug(slug: string): Promise<News | null> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Get news by ID
   */
  async getById(id: string): Promise<News | null> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Get news by category
   */
  async getByCategory(category: NewsCategory): Promise<News[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', category)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get featured/latest news
   */
  async getFeatured(limit: number = 3): Promise<News[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Search news by title or content
   */
  async search(query: string): Promise<News[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,title_id.ilike.%${query}%,excerpt.ilike.%${query}%,excerpt_id.ilike.%${query}%`)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ============================================
  // ADMIN OPERATIONS
  // ============================================

  /**
   * Get all news (admin - includes unpublished)
   */
  async getAllAdmin(): Promise<News[]> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create news article (admin)
   */
  async create(news: Partial<NewsFormData>): Promise<News> {
    const { data, error } = await supabase
      .from('news')
      .insert({
        ...news,
        author: news.author || 'CIBC Team',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update news article (admin)
   */
  async update(id: string, updates: Partial<NewsFormData>): Promise<News> {
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
   * Delete news article (admin)
   */
  async delete(id: string): Promise<{ success: boolean }> {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  /**
   * Publish news article (admin)
   */
  async publish(id: string, publishedAt?: string): Promise<News> {
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
   * Unpublish news article (admin)
   */
  async unpublish(id: string): Promise<News> {
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
  async incrementView(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_news_view', {
      p_news_id: id
    });

    if (error) {
      // Fallback: manual increment if RPC fails
      const { data: news } = await supabase
        .from('news')
        .select('views')
        .eq('id', id)
        .single();

      if (news) {
        await supabase
          .from('news')
          .update({ views: (news.views || 0) + 1 })
          .eq('id', id);
      }
    }
  },

  /**
   * Get news statistics (admin)
   */
  async getStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    totalViews: number;
    byCategory: Record<NewsCategory, number>;
  }> {
    const { data: allNews, error } = await supabase
      .from('news')
      .select('category, is_published, views');

    if (error) throw error;

    const news = allNews || [];

    return {
      total: news.length,
      published: news.filter(n => n.is_published).length,
      draft: news.filter(n => !n.is_published).length,
      totalViews: news.reduce((sum, n) => sum + (n.views || 0), 0),
      byCategory: {
        competition: news.filter(n => n.category === 'competition').length,
        announcement: news.filter(n => n.category === 'announcement').length,
        news: news.filter(n => n.category === 'news').length,
        update: news.filter(n => n.category === 'update').length,
        tips: news.filter(n => n.category === 'tips').length,
      },
    };
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Get localized title
 */
export function getLocalizedTitle(news: News, locale: 'en' | 'id' = 'en'): string {
  if (locale === 'id' && news.title_id) {
    return news.title_id;
  }
  return news.title;
}

/**
 * Get localized excerpt
 */
export function getLocalizedExcerpt(news: News, locale: 'en' | 'id' = 'en'): string {
  if (locale === 'id' && news.excerpt_id) {
    return news.excerpt_id;
  }
  return news.excerpt;
}

/**
 * Get localized content
 */
export function getLocalizedContent(news: News, locale: 'en' | 'id' = 'en'): string {
  if (locale === 'id' && news.content_id) {
    return news.content_id;
  }
  return news.content;
}

/**
 * Format date for display
 */
export function formatNewsDate(dateString: string, locale: 'en' | 'id' = 'en'): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', options);
}

export default supabaseNewsService;