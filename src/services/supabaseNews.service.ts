// ============================================
// CIBC Dashboard - News Service (Supabase)
// ============================================
// News management for CIBC 2026
// - CRUD operations for news articles
// - Bilingual support (English/Indonesian)
// - Category filtering
// - View tracking
// ============================================

import { supabase as supabaseClient } from '@/lib/supabase';

// Use non-null assertion - Supabase should be configured before using this service
const sb = supabaseClient!;

// ============================================
// TYPES
// ============================================

export type NewsCategory = string;

export interface News {
  id: string;
  // Content (Bilingual)
  title: string;
  title_id?: string;       // Indonesian translation
  content: string;
  content_id?: string;
  // Media
  image_url?: string;
  // Publishing
  is_published: boolean;
  published_at?: string;
  // Timestamps
  created_at: string;
}

export interface NewsFormData {
  title: string;
  title_id?: string;
  content: string;
  content_id?: string;
  image_url?: string;
  is_published?: boolean;
  published_at?: string;
}

// ============================================
// NEWS SERVICE
// ============================================

export const supabaseNewsService = {
  /**
   * Get all published news (public)
   * Optionally filter by category
   */
  async getAll(): Promise<News[]> {
    let query = sb
      .from('news')
      .select('id, title, title_id, content, content_id, image_url, is_published, published_at, created_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  /**
   * Get news by title (for detail page)
   */
  async getByTitle(title: string): Promise<News | null> {
    const { data, error } = await sb
      .from('news')
      .select('id, title, title_id, content, content_id, image_url, is_published, published_at, created_at')
      .eq('title', title)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Get news by ID
   */
  async getById(id: string): Promise<News | null> {
    const { data, error } = await sb
      .from('news')
      .select('id, title, title_id, content, content_id, image_url, is_published, published_at, created_at')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Get all published news
   */
  async getAllPublished(): Promise<News[]> {
    const { data, error } = await sb
      .from('news')
      .select('id, title, title_id, content, content_id, image_url, is_published, published_at, created_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get featured/latest news
   */
  async getFeatured(limit: number = 3): Promise<News[]> {
    const { data, error } = await sb
      .from('news')
      .select('id, title, title_id, content, content_id, image_url, is_published, published_at, created_at')
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
    const { data, error } = await sb
      .from('news')
      .select('id, title, title_id, content, content_id, image_url, is_published, published_at, created_at')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,title_id.ilike.%${query}%`)
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
    const { data, error } = await sb
      .from('news')
      .select('id, title, title_id, content, content_id, image_url, is_published, published_at, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create news article (admin)
   */
  async create(news: Partial<NewsFormData>): Promise<News> {
    const { data, error } = await sb
      .from('news')
      .insert({
        ...news,
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
    const { data, error } = await sb
      .from('news')
      .update({
        ...updates,
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
    const { error } = await sb
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
    const { data, error } = await sb
      .from('news')
      .update({
        is_published: true,
        published_at: publishedAt || new Date().toISOString(),
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
    const { data, error } = await sb
      .from('news')
      .update({
        is_published: false,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Increment view count (no-op - views column does not exist)
   */
  async incrementView(_id: string): Promise<void> {
    // No-op: views column does not exist in the news table
  },

  /**
   * Get news statistics (admin)
   */
  async getStats(): Promise<{
    total: number;
    published: number;
    draft: number;
  }> {
    const { data: allNews, error } = await sb
      .from('news')
      .select('is_published');

    if (error) throw error;

    const news = allNews || [];

    return {
      total: news.length,
      published: news.filter(n => n.is_published).length,
      draft: news.filter(n => !n.is_published).length,
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
 * Get localized content (used as excerpt replacement)
 */
export function getLocalizedExcerpt(news: News, locale: 'en' | 'id' = 'en'): string {
  // excerpt column does not exist; return a truncated version of content
  const content = getLocalizedContent(news, locale);
  return content.length > 150 ? content.substring(0, 150) + '...' : content;
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