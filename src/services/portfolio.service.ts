import { get, post, put, del } from './api';
import type {
  PortfolioItem,
  PortfolioFormData,
  PortfolioQueryParams,
  ApiResponse,
} from './types';

const ENDPOINT = '/portfolio';

// Get all portfolio items with optional filters
export async function getPortfolio(
  params?: PortfolioQueryParams
): Promise<ApiResponse<PortfolioItem[]>> {
  return get<PortfolioItem[]>(ENDPOINT, params as Record<string, unknown>);
}

// Get single portfolio item by ID
export async function getPortfolioById(id: string): Promise<ApiResponse<PortfolioItem>> {
  return get<PortfolioItem>(`${ENDPOINT}/${id}`);
}

// Create new portfolio item
export async function createPortfolio(
  data: PortfolioFormData
): Promise<ApiResponse<PortfolioItem>> {
  return post<PortfolioItem>(ENDPOINT, data);
}

// Update portfolio item
export async function updatePortfolio(
  id: string,
  data: Partial<PortfolioFormData>
): Promise<ApiResponse<PortfolioItem>> {
  return put<PortfolioItem>(`${ENDPOINT}/${id}`, data);
}

// Delete portfolio item
export async function deletePortfolio(id: string): Promise<ApiResponse<void>> {
  return del<void>(`${ENDPOINT}/${id}`);
}

// Get portfolio categories
export async function getPortfolioCategories(): Promise<ApiResponse<string[]>> {
  return get<string[]>(`${ENDPOINT}/categories`);
}

// Portfolio Service Object (alternative export)
export const portfolioService = {
  getAll: getPortfolio,
  getById: getPortfolioById,
  create: createPortfolio,
  update: updatePortfolio,
  delete: deletePortfolio,
  getCategories: getPortfolioCategories,
};