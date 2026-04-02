// ============================================
// Competition Service Tests
// ============================================
// Tests for competition.service.ts localStorage implementation
// Issue #2 from SERVICE-ANALYSIS-REPORT.md
// ============================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  competitionService,
  getCompetitions,
  getMainCompetition,
  getCompetitionById,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  registerToCompetition,
  getCompetitionCategories,
} from '../competition.service';
import type { CompetitionFormData, RegistrationFormData } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

// ============================================
// getCompetitions Tests
// ============================================

describe('getCompetitions', () => {
  it('should return competitions successfully', async () => {
    const result = await getCompetitions();

    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('should filter competitions by status', async () => {
    const result = await getCompetitions({ status: 'Open' });

    expect(result.success).toBe(true);
    result.data.forEach(competition => {
      expect(competition.status).toBe('Open');
    });
  });

  it('should apply pagination', async () => {
    const result = await getCompetitions({ page: 1, limit: 2 });

    expect(result.success).toBe(true);
    expect(result.data.length).toBeLessThanOrEqual(2);
    expect(result.pagination).toBeDefined();
    expect(result.pagination?.page).toBe(1);
    expect(result.pagination?.limit).toBe(2);
  });
});

// ============================================
// getMainCompetition Tests
// ============================================

describe('getMainCompetition', () => {
  it('should return main competition successfully', async () => {
    const result = await getMainCompetition();

    expect(result.success).toBe(true);
    expect(result.data.name).toBeDefined();
    expect(result.data.categories).toBeDefined();
    expect(Array.isArray(result.data.categories)).toBe(true);
  });
});

// ============================================
// getCompetitionById Tests
// ============================================

describe('getCompetitionById', () => {
  it('should return competition by ID', async () => {
    const result = await getCompetitionById('comp_001');

    expect(result.success).toBe(true);
    expect(result.data.id).toBe('comp_001');
    expect(result.data.name).toBe('Wedding Concept Competition 2026');
  });

  it('should return error for non-existent competition', async () => {
    const result = await getCompetitionById('non-existent-id');

    expect(result.success).toBe(false);
    expect(result.message).toContain('tidak ditemukan');
  });
});

// ============================================
// createCompetition Tests
// ============================================

describe('createCompetition', () => {
  it('should create a new competition', async () => {
    const formData: CompetitionFormData = {
      name: 'Test Competition 2026',
      target: 'Everyone',
      prize: 'Rp 10.000.000',
      status: 'Open',
      deadline: '2026-06-30',
      description: 'A test competition',
      image: '/test.webp',
      requirements: ['Requirement 1', 'Requirement 2'],
    };

    const result = await createCompetition(formData);

    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Test Competition 2026');
    expect(result.data.target).toBe('Everyone');
    expect(result.message).toContain('berhasil dibuat');
  });

  it('should generate unique ID for new competition', async () => {
    const formData: CompetitionFormData = {
      name: 'Another Competition',
      target: 'Students',
      prize: 'Rp 5.000.000',
      status: 'Coming Soon',
      deadline: '2026-12-31',
      description: 'Another test',
    };

    const result = await createCompetition(formData);

    expect(result.success).toBe(true);
    expect(result.data.id).toMatch(/^comp_\d+$/);
  });
});

// ============================================
// updateCompetition Tests
// ============================================

describe('updateCompetition', () => {
  it('should update an existing competition', async () => {
    const updates = {
      name: 'Updated Competition Name',
      prize: 'Rp 200.000.000',
    };

    const result = await updateCompetition('comp_001', updates);

    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Updated Competition Name');
    expect(result.data.prize).toBe('Rp 200.000.000');
  });

  it('should return error for non-existent competition', async () => {
    const result = await updateCompetition('non-existent-id', { name: 'Test' });

    expect(result.success).toBe(false);
    expect(result.message).toContain('tidak ditemukan');
  });

  it('should update status correctly', async () => {
    const result = await updateCompetition('comp_001', { status: 'Closed' });

    expect(result.success).toBe(true);
    expect(result.data.status).toBe('Closed');
  });
});

// ============================================
// deleteCompetition Tests
// ============================================

describe('deleteCompetition', () => {
  it('should delete an existing competition', async () => {
    // First create a competition to delete
    const formData: CompetitionFormData = {
      name: 'To Be Deleted',
      target: 'Test',
      prize: 'Rp 1',
      status: 'Open',
      deadline: '2026-01-01',
      description: 'Test',
    };
    const created = await createCompetition(formData);

    const result = await deleteCompetition(created.data.id);

    expect(result.success).toBe(true);
    expect(result.message).toContain('berhasil dihapus');

    // Verify it's deleted
    const checkResult = await getCompetitionById(created.data.id);
    expect(checkResult.success).toBe(false);
  });

  it('should return error for non-existent competition', async () => {
    const result = await deleteCompetition('non-existent-id');

    expect(result.success).toBe(false);
    expect(result.message).toContain('tidak ditemukan');
  });
});

// ============================================
// registerToCompetition Tests
// ============================================

describe('registerToCompetition', () => {
  it('should register to a competition', async () => {
    const registrationData: RegistrationFormData = {
      participantName: 'John Doe',
      email: 'john@example.com',
      phone: '08123456789',
    };

    const result = await registerToCompetition('comp_001', registrationData);

    expect(result.success).toBe(true);
    expect(result.data.participantName).toBe('John Doe');
    expect(result.data.status).toBe('registered');
    expect(result.message).toContain('berhasil');
  });

  it('should return error for non-existent competition', async () => {
    const registrationData: RegistrationFormData = {
      participantName: 'John Doe',
      email: 'john@example.com',
      phone: '08123456789',
    };

    const result = await registerToCompetition('non-existent-id', registrationData);

    expect(result.success).toBe(false);
    expect(result.message).toContain('tidak ditemukan');
  });

  it('should reject registration for closed competition', async () => {
    // First close a competition
    await updateCompetition('comp_002', { status: 'Closed' });

    const registrationData: RegistrationFormData = {
      participantName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '08123456789',
    };

    const result = await registerToCompetition('comp_002', registrationData);

    expect(result.success).toBe(false);
    expect(result.message).toContain('ditutup');
  });
});

// ============================================
// getCompetitionCategories Tests
// ============================================

describe('getCompetitionCategories', () => {
  it('should return competition categories', async () => {
    const result = await getCompetitionCategories();

    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
  });
});

// ============================================
// competitionService Object Tests
// ============================================

describe('competitionService object', () => {
  it('should have all required methods', () => {
    expect(competitionService.getAll).toBeDefined();
    expect(competitionService.getMain).toBeDefined();
    expect(competitionService.getById).toBeDefined();
    expect(competitionService.create).toBeDefined();
    expect(competitionService.update).toBeDefined();
    expect(competitionService.delete).toBeDefined();
    expect(competitionService.register).toBeDefined();
    expect(competitionService.getCategories).toBeDefined();
  });

  it('should work through the service object', async () => {
    const result = await competitionService.getAll();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });
});