import { useCallback } from 'react';
import { useApi, useMutation } from './useApi';
import {
  getFeaturedEvents,
  getFeaturedEventById,
  createFeaturedEvent,
  updateFeaturedEvent,
  deleteFeaturedEvent,
  reorderFeaturedEvents,
} from '../services/featured-event.service';
import type { FeaturedEvent, FeaturedEventFormData } from '../services/types';

// Hook for fetching all featured events
export function useFeaturedEvents() {
  return useApi<FeaturedEvent[]>(getFeaturedEvents);
}

// Hook for fetching single featured event
export function useFeaturedEvent(id: number) {
  const fetchFunction = useCallback(() => getFeaturedEventById(id), [id]);
  return useApi<FeaturedEvent>(fetchFunction);
}

// Hook for creating featured event
export function useCreateFeaturedEvent() {
  return useMutation<FeaturedEvent, FeaturedEventFormData>(createFeaturedEvent);
}

// Hook for updating featured event
export function useUpdateFeaturedEvent(id: number) {
  const mutationFn = useCallback(
    (data: Partial<FeaturedEventFormData>) => updateFeaturedEvent(id, data),
    [id]
  );
  return useMutation<FeaturedEvent, Partial<FeaturedEventFormData>>(mutationFn);
}

// Hook for deleting featured event
export function useDeleteFeaturedEvent() {
  return useMutation<void, number>(deleteFeaturedEvent);
}

// Hook for reordering featured events
export function useReorderFeaturedEvents() {
  return useMutation<void, { id: number; order: number }[]>(reorderFeaturedEvents);
}