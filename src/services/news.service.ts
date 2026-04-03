import { get, post, put, del } from './api';
import type {
  NewsItem,
  NewsFormData,
  NewsQueryParams,
  ApiResponse,
} from './types';

const ENDPOINT = '/news';

// Get all news items with optional filters
export async function getNews(
  params?: NewsQueryParams
): Promise<ApiResponse<NewsItem[]>> {
  return get<NewsItem[]>(ENDPOINT, params as Record<string, unknown>);
}

// Get single news item by slug
export async function getNewsBySlug(slug: string): Promise<ApiResponse<NewsItem>> {
  return get<NewsItem>(`${ENDPOINT}/${slug}`);
}

// Get single news item by ID (for admin)
export async function getNewsById(id: string): Promise<ApiResponse<NewsItem>> {
  return get<NewsItem>(`${ENDPOINT}/id/${id}`);
}

// Create new news item
export async function createNews(
  data: NewsFormData
): Promise<ApiResponse<NewsItem>> {
  return post<NewsItem>(ENDPOINT, data);
}

// Update news item
export async function updateNews(
  id: string,
  data: Partial<NewsFormData>
): Promise<ApiResponse<NewsItem>> {
  return put<NewsItem>(`${ENDPOINT}/${id}`, data);
}

// Delete news item
export async function deleteNews(id: string): Promise<ApiResponse<void>> {
  return del<void>(`${ENDPOINT}/${id}`);
}

// Get news categories
export async function getNewsCategories(): Promise<ApiResponse<string[]>> {
  return get<string[]>(`${ENDPOINT}/categories`);
}

// News Service Object (alternative export)
export const newsService = {
  getAll: getNews,
  getBySlug: getNewsBySlug,
  getById: getNewsById,
  create: createNews,
  update: updateNews,
  delete: deleteNews,
  getCategories: getNewsCategories,
};