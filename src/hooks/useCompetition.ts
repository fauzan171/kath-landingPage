import { useCallback } from 'react';
import { useApi, useMutation } from './useApi';
import {
  getCompetitions,
  getMainCompetition,
  getCompetitionById,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  registerToCompetition,
} from '../services/competition.service';
import type {
  Competition,
  MainCompetition,
  CompetitionFormData,
  CompetitionQueryParams,
  RegistrationFormData,
  CompetitionRegistration,
} from '../services/types';

// Hook for fetching all competitions
export function useCompetitions(params?: CompetitionQueryParams) {
  const fetchFunction = useCallback(
    () => (params ? getCompetitions(params) : getCompetitions()),
    [params]
  );
  return useApi<Competition[]>(fetchFunction);
}

// Hook for fetching main competition
export function useMainCompetition() {
  return useApi<MainCompetition>(getMainCompetition);
}

// Hook for fetching single competition
export function useCompetition(id: string) {
  const fetchFunction = useCallback(() => getCompetitionById(id), [id]);
  return useApi<Competition>(fetchFunction);
}

// Hook for creating competition
export function useCreateCompetition() {
  return useMutation<Competition, CompetitionFormData>(createCompetition);
}

// Hook for updating competition
export function useUpdateCompetition(id: string) {
  const mutationFn = useCallback(
    (data: Partial<CompetitionFormData>) => updateCompetition(id, data),
    [id]
  );
  return useMutation<Competition, Partial<CompetitionFormData>>(mutationFn);
}

// Hook for deleting competition
export function useDeleteCompetition() {
  return useMutation<void, string>(deleteCompetition);
}

// Hook for registering to competition
export function useRegisterCompetition(competitionId: string) {
  const mutationFn = useCallback(
    (data: RegistrationFormData) => registerToCompetition(competitionId, data),
    [competitionId]
  );
  return useMutation<CompetitionRegistration, RegistrationFormData>(mutationFn);
}