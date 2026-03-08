import { useCallback } from 'react';
import { useApi, useApiWithParams, useMutation } from './useApi';
import {
  getPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  getPortfolioCategories,
} from '../services/portfolio.service';
import type {
  PortfolioItem,
  PortfolioFormData,
  PortfolioQueryParams,
} from '../services/types';

// Hook for fetching all portfolio items
export function usePortfolio(params?: PortfolioQueryParams) {
  const fetchFunction = useCallback(
    () => (params ? getPortfolio(params) : getPortfolio()),
    [params]
  );
  return useApi<PortfolioItem[]>(fetchFunction);
}

// Hook for fetching single portfolio item
export function usePortfolioItem(id: string) {
  const fetchFunction = useCallback(() => getPortfolioById(id), [id]);
  return useApi<PortfolioItem>(fetchFunction);
}

// Hook for portfolio categories
export function usePortfolioCategories() {
  return useApi<string[]>(getPortfolioCategories);
}

// Hook for creating portfolio
export function useCreatePortfolio() {
  return useMutation<PortfolioItem, PortfolioFormData>(createPortfolio);
}

// Hook for updating portfolio
export function useUpdatePortfolio(id: string) {
  const mutationFn = useCallback(
    (data: Partial<PortfolioFormData>) => updatePortfolio(id, data),
    [id]
  );
  return useMutation<PortfolioItem, Partial<PortfolioFormData>>(mutationFn);
}

// Hook for deleting portfolio
export function useDeletePortfolio() {
  return useMutation<void, string>(deletePortfolio);
}