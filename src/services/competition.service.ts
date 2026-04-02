// ============================================
// Competition Service - localStorage Implementation
// ============================================
// FIXED: Now uses localStorage instead of REST API
// Issue #2 from SERVICE-ANALYSIS-REPORT.md
//
// Note: KATH Landing Page competitions use localStorage for demo/mock data.
// CIBC Dashboard competitions use Supabase (see supabase.service.ts)
// ============================================

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

// ============================================
// Storage Keys
// ============================================
const STORAGE_KEYS = {
  COMPETITIONS: 'kath_landing_competitions',
  REGISTRATIONS: 'kath_landing_registrations',
};

// ============================================
// Initial Competition Data
// ============================================
const initialCompetitions: Competition[] = [
  {
    id: 'comp_001',
    name: 'Wedding Concept Competition 2026',
    target: 'Mahasiswa & Fresh Graduate',
    prize: 'Rp 100.000.000',
    status: 'Open',
    deadline: '2025-04-30',
    description: 'Kompetisi desain konsep pernikahan terbesar di Indonesia. Tunjukkan kreativitas Anda dalam merancang pengalaman pernikahan yang tak terlupakan.',
    image: '/card-1.webp',
    requirements: [
      'Proposal konsep (PDF, max 50MB)',
      'Moodboard dan referensi visual',
      'Rincian anggaran',
      'Timeline pelaksanaan',
      'Portofolio tim'
    ],
    timeline: [
      { phase: 'Registration Open', startDate: '2025-03-01', endDate: '2025-03-31' },
      { phase: 'Workshop', startDate: '2025-04-01', endDate: '2025-04-15' },
      { phase: 'Submission', startDate: '2025-04-16', endDate: '2025-04-30' },
      { phase: 'Final', startDate: '2025-06-15', endDate: '2025-06-20' },
    ],
    judges: [
      { name: 'Andi Wijaya', role: 'Lead Judge', image: '/judge-1.webp' },
      { name: 'Sari Indah', role: 'Creative Director', image: '/judge-2.webp' },
    ],
    registeredCount: 45,
    maxParticipants: 100,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'comp_002',
    name: 'Event Design Challenge 2025',
    target: 'Umum',
    prize: 'Rp 75.000.000',
    status: 'Closed',
    deadline: '2024-10-31',
    description: 'Tantangan desain event untuk para kreator muda. Ciptakan pengalaman event yang inovatif dan memorable.',
    image: '/card-2.webp',
    requirements: [
      'Desain konsep event',
      '3D visualization',
      'Rincian teknis',
      'Anggaran'
    ],
    timeline: [
      { phase: 'Registration', startDate: '2024-08-01', endDate: '2024-09-30' },
      { phase: 'Submission', startDate: '2024-10-01', endDate: '2024-10-31' },
      { phase: 'Judging', startDate: '2024-11-01', endDate: '2024-11-15' },
    ],
    judges: [
      { name: 'Budi Santoso', role: 'Event Expert', image: '/judge-3.webp' },
    ],
    registeredCount: 78,
    maxParticipants: 100,
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
  },
  {
    id: 'comp_003',
    name: 'Student Event Competition 2025',
    target: 'Mahasiswa Aktif',
    prize: 'Rp 50.000.000',
    status: 'Coming Soon',
    deadline: '2025-05-15',
    description: 'Kompetisi khusus mahasiswa untuk mengembangkan ide event kreatif dengan budget terbatas.',
    image: '/card-3.webp',
    requirements: [
      'Kartu mahasiswa aktif',
      'Proposal event',
      'Video pitch (3 menit)',
      'Surat rekomendasi dosen'
    ],
    timeline: [
      { phase: 'Registration', startDate: '2025-06-01', endDate: '2025-06-30' },
      { phase: 'Submission', startDate: '2025-07-01', endDate: '2025-07-31' },
      { phase: 'Final', startDate: '2025-08-15', endDate: '2025-08-30' },
    ],
    registeredCount: 0,
    maxParticipants: 50,
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-02-01T00:00:00Z',
  },
];

// Default main competition
const defaultMainCompetition: MainCompetition = {
  name: 'Wedding Concept Competition 2026',
  deadline: '2025-04-30',
  description: 'Kompetisi desain konsep pernikahan terbesar di Indonesia dengan total hadiah lebih dari Rp 100 juta!',
  categories: [
    { id: 'cat_001', name: 'Wedding Concept', target: 'Mahasiswa', prize: 'Rp 50.000.000', status: 'Open' },
    { id: 'cat_002', name: 'Event Design', target: 'Umum', prize: 'Rp 30.000.000', status: 'Open' },
    { id: 'cat_003', name: 'Student Innovation', target: 'Mahasiswa', prize: 'Rp 20.000.000', status: 'Coming Soon' },
  ],
};

// Default categories
const defaultCategories: CompetitionCategory[] = [
  { id: 'cat_001', name: 'Wedding Concept', target: 'Mahasiswa & Fresh Graduate', prize: 'Rp 50.000.000', status: 'Open' },
  { id: 'cat_002', name: 'Event Design', target: 'Umum', prize: 'Rp 30.000.000', status: 'Open' },
  { id: 'cat_003', name: 'Student Innovation', target: 'Mahasiswa Aktif', prize: 'Rp 20.000.000', status: 'Coming Soon' },
];

// ============================================
// Helper Functions
// ============================================

/**
 * Initialize localStorage with default data if not exists
 */
function initializeData(): void {
  if (!localStorage.getItem(STORAGE_KEYS.COMPETITIONS)) {
    localStorage.setItem(STORAGE_KEYS.COMPETITIONS, JSON.stringify(initialCompetitions));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
  }
}

/**
 * Get all competitions from localStorage
 */
function getStoredCompetitions(): Competition[] {
  initializeData();
  const data = localStorage.getItem(STORAGE_KEYS.COMPETITIONS);
  return data ? JSON.parse(data) : [];
}

/**
 * Save competitions to localStorage
 */
function saveCompetitions(competitions: Competition[]): void {
  localStorage.setItem(STORAGE_KEYS.COMPETITIONS, JSON.stringify(competitions));
}

/**
 * Get registrations from localStorage
 */
function getStoredRegistrations(): CompetitionRegistration[] {
  const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
  return data ? JSON.parse(data) : [];
}

/**
 * Save registrations to localStorage
 */
function saveRegistrations(registrations: CompetitionRegistration[]): void {
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
}

// ============================================
// Competition Service Functions
// ============================================

/**
 * Get all competitions with optional filters
 */
export async function getCompetitions(
  params?: CompetitionQueryParams
): Promise<ApiResponse<Competition[]>> {
  try {
    let competitions = getStoredCompetitions();

    // Apply filters
    if (params?.status) {
      competitions = competitions.filter(c => c.status === params.status);
    }

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCompetitions = competitions.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedCompetitions,
      pagination: {
        total: competitions.length,
        page,
        limit,
        totalPages: Math.ceil(competitions.length / limit),
      },
    };
  } catch (error) {
    console.error('[CompetitionService.getCompetitions]', error);
    return {
      success: false,
      data: [],
      message: 'Gagal memuat data kompetisi',
    };
  }
}

/**
 * Get main competition info (highlighted)
 */
export async function getMainCompetition(): Promise<ApiResponse<MainCompetition>> {
  try {
    // Return the default main competition
    // In a real app, this would come from a database or CMS
    return {
      success: true,
      data: defaultMainCompetition,
    };
  } catch (error) {
    console.error('[CompetitionService.getMainCompetition]', error);
    return {
      success: false,
      data: defaultMainCompetition,
      message: 'Gagal memuat kompetisi utama',
    };
  }
}

/**
 * Get single competition by ID
 */
export async function getCompetitionById(id: string): Promise<ApiResponse<Competition>> {
  try {
    const competitions = getStoredCompetitions();
    const competition = competitions.find(c => c.id === id);

    if (!competition) {
      return {
        success: false,
        data: {} as Competition,
        message: 'Kompetisi tidak ditemukan',
      };
    }

    return {
      success: true,
      data: competition,
    };
  } catch (error) {
    console.error('[CompetitionService.getCompetitionById]', error);
    return {
      success: false,
      data: {} as Competition,
      message: 'Gagal memuat data kompetisi',
    };
  }
}

/**
 * Create new competition (admin only)
 */
export async function createCompetition(
  data: CompetitionFormData
): Promise<ApiResponse<Competition>> {
  try {
    const competitions = getStoredCompetitions();

    const newCompetition: Competition = {
      id: `comp_${Date.now()}`,
      name: data.name,
      target: data.target,
      prize: data.prize,
      status: data.status as 'Open' | 'Coming Soon' | 'Closed',
      deadline: data.deadline,
      description: data.description,
      image: data.image,
      requirements: data.requirements || [],
      timeline: [],
      judges: [],
      registeredCount: 0,
      maxParticipants: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    competitions.push(newCompetition);
    saveCompetitions(competitions);

    return {
      success: true,
      data: newCompetition,
      message: 'Kompetisi berhasil dibuat',
    };
  } catch (error) {
    console.error('[CompetitionService.createCompetition]', error);
    return {
      success: false,
      data: {} as Competition,
      message: 'Gagal membuat kompetisi',
    };
  }
}

/**
 * Update competition (admin only)
 */
export async function updateCompetition(
  id: string,
  data: Partial<CompetitionFormData>
): Promise<ApiResponse<Competition>> {
  try {
    const competitions = getStoredCompetitions();
    const index = competitions.findIndex(c => c.id === id);

    if (index === -1) {
      return {
        success: false,
        data: {} as Competition,
        message: 'Kompetisi tidak ditemukan',
      };
    }

    const { status, ...otherData } = data;
    const statusValue = status ? (status as 'Open' | 'Coming Soon' | 'Closed') : competitions[index].status;

    competitions[index] = {
      ...competitions[index],
      ...otherData,
      status: statusValue,
      updatedAt: new Date().toISOString(),
    };

    saveCompetitions(competitions);

    return {
      success: true,
      data: competitions[index],
      message: 'Kompetisi berhasil diperbarui',
    };
  } catch (error) {
    console.error('[CompetitionService.updateCompetition]', error);
    return {
      success: false,
      data: {} as Competition,
      message: 'Gagal memperbarui kompetisi',
    };
  }
}

/**
 * Delete competition (admin only)
 */
export async function deleteCompetition(id: string): Promise<ApiResponse<void>> {
  try {
    const competitions = getStoredCompetitions();
    const filtered = competitions.filter(c => c.id !== id);

    if (filtered.length === competitions.length) {
      return {
        success: false,
        data: undefined as void,
        message: 'Kompetisi tidak ditemukan',
      };
    }

    saveCompetitions(filtered);

    return {
      success: true,
      data: undefined as void,
      message: 'Kompetisi berhasil dihapus',
    };
  } catch (error) {
    console.error('[CompetitionService.deleteCompetition]', error);
    return {
      success: false,
      data: undefined as void,
      message: 'Gagal menghapus kompetisi',
    };
  }
}

/**
 * Register to competition
 */
export async function registerToCompetition(
  competitionId: string,
  data: RegistrationFormData
): Promise<ApiResponse<CompetitionRegistration>> {
  try {
    const competitions = getStoredCompetitions();
    const competition = competitions.find(c => c.id === competitionId);

    if (!competition) {
      return {
        success: false,
        data: {} as CompetitionRegistration,
        message: 'Kompetisi tidak ditemukan',
      };
    }

    if (competition.status === 'Closed') {
      return {
        success: false,
        data: {} as CompetitionRegistration,
        message: 'Pendaftaran sudah ditutup',
      };
    }

    // Create registration
    const registration: CompetitionRegistration = {
      registrationId: `reg_${Date.now()}`,
      competitionId,
      participantName: data.participantName,
      status: 'registered',
      registeredAt: new Date().toISOString(),
    };

    // Save registration
    const registrations = getStoredRegistrations();
    registrations.push(registration);
    saveRegistrations(registrations);

    // Update competition registered count
    const index = competitions.findIndex(c => c.id === competitionId);
    competitions[index].registeredCount = (competitions[index].registeredCount || 0) + 1;
    saveCompetitions(competitions);

    return {
      success: true,
      data: registration,
      message: 'Pendaftaran berhasil',
    };
  } catch (error) {
    console.error('[CompetitionService.registerToCompetition]', error);
    return {
      success: false,
      data: {} as CompetitionRegistration,
      message: 'Gagal mendaftar ke kompetisi',
    };
  }
}

/**
 * Get competition categories
 */
export async function getCompetitionCategories(): Promise<ApiResponse<CompetitionCategory[]>> {
  try {
    return {
      success: true,
      data: defaultCategories,
    };
  } catch (error) {
    console.error('[CompetitionService.getCompetitionCategories]', error);
    return {
      success: false,
      data: [],
      message: 'Gagal memuat kategori kompetisi',
    };
  }
}

// ============================================
// Competition Service Object (exported for convenience)
// ============================================

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