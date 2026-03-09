import { get, post, put, del } from './api';
import type {
  Competition,
  MainCompetition,
  CompetitionCategory,
  CompetitionFormData,
  CompetitionQueryParams,
  RegistrationFormData,
  CompetitionRegistration,
} from './types';
import type { ApiResponse } from './api';

const ENDPOINT = '/competitions';

// Get all competitions with optional filters
export async function getCompetitions(
  params?: CompetitionQueryParams
): Promise<ApiResponse<Competition[]>> {
  return get<Competition[]>(ENDPOINT, params as Record<string, unknown>);
}

// Get main competition info (highlighted)
export async function getMainCompetition(): Promise<ApiResponse<MainCompetition>> {
  return get<MainCompetition>(`${ENDPOINT}/main`);
}

// Get single competition by ID
export async function getCompetitionById(id: string): Promise<ApiResponse<Competition>> {
  return get<Competition>(`${ENDPOINT}/${id}`);
}

// Create new competition
export async function createCompetition(
  data: CompetitionFormData
): Promise<ApiResponse<Competition>> {
  return post<Competition>(ENDPOINT, data);
}

// Update competition
export async function updateCompetition(
  id: string,
  data: Partial<CompetitionFormData>
): Promise<ApiResponse<Competition>> {
  return put<Competition>(`${ENDPOINT}/${id}`, data);
}

// Delete competition
export async function deleteCompetition(id: string): Promise<ApiResponse<void>> {
  return del<void>(`${ENDPOINT}/${id}`);
}

// Register to competition
export async function registerToCompetition(
  competitionId: string,
  data: RegistrationFormData
): Promise<ApiResponse<CompetitionRegistration>> {
  return post<CompetitionRegistration>(`${ENDPOINT}/${competitionId}/register`, data);
}

// Get competition categories
export async function getCompetitionCategories(): Promise<ApiResponse<CompetitionCategory[]>> {
  return get<CompetitionCategory[]>(`${ENDPOINT}/categories/list`);
}

// Competition Service Object (alternative export)
export const competitionService = {
  getAll: getCompetitions,
  getMain: getMainCompetition,
  getById: getCompetitionById,
  create: createCompetition,
  update: updateCompetition,
  delete: deleteCompetition,
  register: registerToCompetition,
  getCategories: getCompetitionCategories,
};