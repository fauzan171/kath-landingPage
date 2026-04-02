// ============================================
// KATH Landing Page - Content Service
// ============================================
// Service for managing all landing page content
// ============================================

import { supabase } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================

export interface HeroContent {
  id: string;
  title: string;
  title_id?: string;
  subtitle?: string;
  description?: string;
  description_id?: string;
  background_image?: string;
  background_video?: string;
  cta_text?: string;
  cta_text_id?: string;
  cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  is_active: boolean;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  name_id?: string;
  description?: string;
  description_id?: string;
  icon?: string;
  image?: string;
  features?: string[];
  features_id?: string[];
  price_range?: string;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  title: string;
  title_id?: string;
  category: string;
  location?: string;
  year?: string;
  description?: string;
  description_id?: string;
  image?: string;
  images?: string[];
  video_url?: string;
  client_name?: string;
  event_date?: string;
  guests_count?: number;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeaturedEvent {
  id: string;
  title: string;
  title_id?: string;
  description?: string;
  description_id?: string;
  image?: string;
  category?: string;
  rotation: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  title_id?: string;
  slug: string;
  excerpt?: string;
  excerpt_id?: string;
  content?: string;
  content_id?: string;
  image?: string;
  category: string;
  author: string;
  author_id?: string;
  is_published: boolean;
  published_at?: string;
  views: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  content: string;
  content_id?: string;
  rating: number;
  event_type?: string;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  question_id?: string;
  answer: string;
  answer_id?: string;
  category: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Statistic {
  id: string;
  label: string;
  label_id?: string;
  value: string;
  suffix?: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  type: string;
  label?: string;
  value: string;
  link?: string;
  icon?: string;
  is_active: boolean;
  order_index: number;
  updated_at: string;
}

export interface Navigation {
  id: string;
  label: string;
  label_id?: string;
  href: string;
  is_external: boolean;
  parent_id?: string;
  order_index: number;
  is_active: boolean;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value?: string;
  value_json?: Record<string, unknown>;
  description?: string;
  updated_at: string;
}

// ============================================
// HERO SERVICE
// ============================================

export const heroService = {
  get: async (): Promise<HeroContent | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .eq('is_active', true)
      .single();
    if (error) return null;
    return data;
  },

  update: async (id: string, updates: Partial<HeroContent>): Promise<HeroContent> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('hero_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================
// SERVICES SERVICE
// ============================================

export const servicesService = {
  getAll: async (): Promise<Service[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  getActive: async (): Promise<Service[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  create: async (service: Partial<Service>): Promise<Service> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Service>): Promise<Service> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// PORTFOLIO SERVICE
// ============================================

export const portfolioService = {
  getAll: async (): Promise<Portfolio[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  getActive: async (): Promise<Portfolio[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  getFeatured: async (): Promise<Portfolio[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  create: async (item: Partial<Portfolio>): Promise<Portfolio> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('portfolio')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Portfolio>): Promise<Portfolio> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('portfolio')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('portfolio').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// FEATURED EVENTS SERVICE
// ============================================

export const featuredEventsService = {
  getAll: async (): Promise<FeaturedEvent[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('featured_events')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  getActive: async (): Promise<FeaturedEvent[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('featured_events')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  create: async (event: Partial<FeaturedEvent>): Promise<FeaturedEvent> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('featured_events')
      .insert(event)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<FeaturedEvent>): Promise<FeaturedEvent> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('featured_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('featured_events').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// NEWS SERVICE
// ============================================

export const newsService = {
  getAll: async (): Promise<News[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  },

  getPublished: async (): Promise<News[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    if (error) return [];
    return data || [];
  },

  getBySlug: async (slug: string): Promise<News | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data;
  },

  create: async (article: Partial<News>): Promise<News> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('news')
      .insert(article)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<News>): Promise<News> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('news')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw error;
  },

  publish: async (id: string): Promise<News> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('news')
      .update({ is_published: true, published_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================
// TESTIMONIALS SERVICE
// ============================================

export const testimonialsService = {
  getAll: async (): Promise<Testimonial[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  getActive: async (): Promise<Testimonial[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  create: async (testimonial: Partial<Testimonial>): Promise<Testimonial> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonial)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Testimonial>): Promise<Testimonial> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// FAQ SERVICE
// ============================================

export const faqService = {
  getAll: async (): Promise<FAQ[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  getActive: async (): Promise<FAQ[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  create: async (faq: Partial<FAQ>): Promise<FAQ> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('faq')
      .insert(faq)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<FAQ>): Promise<FAQ> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('faq')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('faq').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// STATISTICS SERVICE
// ============================================

export const statisticsService = {
  getAll: async (): Promise<Statistic[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('statistics')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  getActive: async (): Promise<Statistic[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('statistics')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  update: async (id: string, updates: Partial<Statistic>): Promise<Statistic> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('statistics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================
// CONTACT INFO SERVICE
// ============================================

export const contactInfoService = {
  getAll: async (): Promise<ContactInfo[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  getActive: async (): Promise<ContactInfo[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  create: async (info: Partial<ContactInfo>): Promise<ContactInfo> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('contact_info')
      .insert(info)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<ContactInfo>): Promise<ContactInfo> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('contact_info')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('contact_info').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// NAVIGATION SERVICE
// ============================================

export const navigationService = {
  getAll: async (): Promise<Navigation[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('navigation')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  getActive: async (): Promise<Navigation[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('navigation')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (error) return [];
    return data || [];
  },

  create: async (nav: Partial<Navigation>): Promise<Navigation> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('navigation')
      .insert(nav)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Navigation>): Promise<Navigation> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('navigation')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('navigation').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================
// SITE SETTINGS SERVICE
// ============================================

export const siteSettingsService = {
  getAll: async (): Promise<SiteSetting[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');
    if (error) return [];
    return data || [];
  },

  get: async (key: string): Promise<string | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();
    if (error) return null;
    return data?.value || null;
  },

  set: async (key: string, value: string): Promise<void> => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
  },
};

// ============================================
// EXPORT ALL
// ============================================

export const contentService = {
  hero: heroService,
  services: servicesService,
  portfolio: portfolioService,
  featuredEvents: featuredEventsService,
  news: newsService,
  testimonials: testimonialsService,
  faq: faqService,
  statistics: statisticsService,
  contactInfo: contactInfoService,
  navigation: navigationService,
  settings: siteSettingsService,
};

export default contentService;