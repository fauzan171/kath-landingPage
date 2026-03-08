import { useCallback } from 'react';
import { useApi, useMutation } from './useApi';
import {
  getNews,
  getNewsBySlug,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getNewsCategories,
} from '../services/news.service';
import type {
  NewsItem,
  NewsFormData,
  NewsQueryParams,
} from '../services/types';

// Hook for fetching all news items
export function useNews(params?: NewsQueryParams) {
  const fetchFunction = useCallback(
    () => (params ? getNews(params) : getNews()),
    [params]
  );
  return useApi<NewsItem[]>(fetchFunction);
}

// Hook for fetching single news item by slug
export function useNewsItem(slug: string) {
  const fetchFunction = useCallback(() => getNewsBySlug(slug), [slug]);
  return useApi<NewsItem>(fetchFunction);
}

// Hook for fetching single news item by ID (admin)
export function useNewsById(id: string) {
  const fetchFunction = useCallback(() => getNewsById(id), [id]);
  return useApi<NewsItem>(fetchFunction);
}

// Hook for news categories
export function useNewsCategories() {
  return useApi<string[]>(getNewsCategories);
}

// Hook for creating news
export function useCreateNews() {
  return useMutation<NewsItem, NewsFormData>(createNews);
}

// Hook for updating news
export function useUpdateNews(id: string) {
  const mutationFn = useCallback(
    (data: Partial<NewsFormData>) => updateNews(id, data),
    [id]
  );
  return useMutation<NewsItem, Partial<NewsFormData>>(mutationFn);
}

// Hook for deleting news
export function useDeleteNews() {
  return useMutation<void, string>(deleteNews);
}