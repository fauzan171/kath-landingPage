import { get, post, put, del } from './api';
import type { FeaturedEvent, FeaturedEventFormData } from './types';
import type { ApiResponse } from './api';

const ENDPOINT = '/featured-events';

// Get all featured events
export async function getFeaturedEvents(): Promise<ApiResponse<FeaturedEvent[]>> {
  return get<FeaturedEvent[]>(ENDPOINT);
}

// Get single featured event by ID
export async function getFeaturedEventById(id: number): Promise<ApiResponse<FeaturedEvent>> {
  return get<FeaturedEvent>(`${ENDPOINT}/${id}`);
}

// Create new featured event
export async function createFeaturedEvent(
  data: FeaturedEventFormData
): Promise<ApiResponse<FeaturedEvent>> {
  return post<FeaturedEvent>(ENDPOINT, data);
}

// Update featured event
export async function updateFeaturedEvent(
  id: number,
  data: Partial<FeaturedEventFormData>
): Promise<ApiResponse<FeaturedEvent>> {
  return put<FeaturedEvent>(`${ENDPOINT}/${id}`, data);
}

// Delete featured event
export async function deleteFeaturedEvent(id: number): Promise<ApiResponse<void>> {
  return del<void>(`${ENDPOINT}/${id}`);
}

// Reorder featured events
export async function reorderFeaturedEvents(
  orders: { id: number; order: number }[]
): Promise<ApiResponse<void>> {
  return put<void>(`${ENDPOINT}/reorder`, { orders });
}

// Featured Event Service Object (alternative export)
export const featuredEventService = {
  getAll: getFeaturedEvents,
  getById: getFeaturedEventById,
  create: createFeaturedEvent,
  update: updateFeaturedEvent,
  delete: deleteFeaturedEvent,
  reorder: reorderFeaturedEvents,
};