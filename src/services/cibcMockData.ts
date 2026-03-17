/**
 * CIBC Power by KATH - Mock Data Service
 *
 * Provides mock implementations for all CIBC services
 * Designed to match future API structure
 */

import type {
  Team,
  TeamMember,
  Submission,
  SubmissionDocument,
  CompetitionCategory,
  CIBCNotification,
  DashboardStats,
  DashboardProgress,
  TimelinePhase,
  JudgeEvaluation,
  JudgingCriteria,
} from '../types/cibc';

// ============================================
// Storage Keys
// ============================================

const STORAGE_KEYS = {
  TEAMS: 'cibc_teams',
  SUBMISSIONS: 'cibc_submissions',
  NOTIFICATIONS: 'cibc_notifications',
  CURRENT_TEAM: 'cibc_current_team',
  REGISTRATION: 'cibc_registration_draft',
};

// ============================================
// Helper Functions
// ============================================

const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateTeamCode = (): string => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStoredData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ============================================
// Initial Mock Data
// ============================================

const initialTeams: Team[] = [
  {
    id: 'team_001',
    name: 'Green Innovators',
    code: 'GRN12345',
    category: 'student',
    leaderId: 'user_001',
    members: [
      {
        id: 'mem_001',
        name: 'Ahmad Rizki',
        email: 'ahmad@example.com',
        role: 'leader',
        status: 'active',
        institution: 'Universitas Indonesia',
        position: 'Computer Science Student',
        joinedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 'mem_002',
        name: 'Siti Rahma',
        email: 'siti@example.com',
        role: 'member',
        status: 'active',
        institution: 'Universitas Indonesia',
        position: 'Business Student',
        joinedAt: '2024-01-16T14:30:00Z',
      },
    ],
    maxMembers: 5,
    createdAt: '2024-01-15T10:00:00Z',
    status: 'complete',
  },
  {
    id: 'team_002',
    name: 'EcoTech Solutions',
    code: 'ECO67890',
    category: 'startup',
    leaderId: 'user_002',
    members: [
      {
        id: 'mem_003',
        name: 'Budi Santoso',
        email: 'budi@example.com',
        role: 'leader',
        status: 'active',
        institution: 'EcoTech Pte Ltd',
        position: 'CEO & Founder',
        joinedAt: '2024-01-10T09:00:00Z',
      },
    ],
    maxMembers: 5,
    createdAt: '2024-01-10T09:00:00Z',
    status: 'forming',
  },
];

const initialSubmissions: Submission[] = [
  {
    id: 'sub_001',
    teamId: 'team_001',
    projectName: 'PlasticCycle',
    oneLineDescription: 'AI-powered plastic waste sorting system for recycling facilities',
    problemStatement: 'Recycling facilities struggle to sort different types of plastic waste efficiently, leading to contamination and reduced recycling rates. Current manual sorting is slow, error-prone, and expensive.',
    solutionOverview: 'We use computer vision and machine learning to automatically identify and sort plastic waste by type at 95% accuracy. Our system increases recycling facility throughput by 300% while reducing costs.',
    sdgAlignment: ['responsible_consumption', 'industry_innovation', 'climate_action'],
    documents: [
      {
        id: 'doc_001',
        type: 'bmc',
        name: 'PlasticCycle_BMC.pdf',
        url: '/mock/bmc.pdf',
        size: 2048576,
        uploadedAt: '2024-02-01T10:00:00Z',
        status: 'uploaded',
      },
      {
        id: 'doc_002',
        type: 'pitch_deck',
        name: 'PlasticCycle_PitchDeck.pdf',
        url: '/mock/pitch.pdf',
        size: 5242880,
        uploadedAt: '2024-02-01T11:00:00Z',
        status: 'uploaded',
      },
    ],
    status: 'submitted',
    submittedAt: '2024-02-01T12:00:00Z',
    currentPhase: 'screening',
  },
];

const initialNotifications: CIBCNotification[] = [
  {
    id: 'notif_001',
    type: 'info',
    title: 'Registration Open',
    message: 'CIBC Power 2025 registration is now open! Join us in building sustainable solutions.',
    time: '2 hours ago',
    read: false,
    actionUrl: '/cibc/register',
  },
  {
    id: 'notif_002',
    type: 'success',
    title: 'Team Created',
    message: 'Your team "Green Innovators" has been successfully created. Invite your teammates now!',
    time: '1 day ago',
    read: true,
    actionUrl: '/cibc/dashboard/team',
  },
  {
    id: 'notif_003',
    type: 'warning',
    title: 'Deadline Approaching',
    message: 'Submission deadline is in 14 days. Make sure to complete your submission.',
    time: '3 days ago',
    read: false,
    actionUrl: '/cibc/dashboard/submission',
  },
];

const timelinePhases: TimelinePhase[] = [
  {
    id: 'phase_1',
    name: 'Registration',
    description: 'Create your account and form your team',
    startDate: '2024-01-01',
    endDate: '2024-02-28',
    status: 'active',
    milestones: [
      { id: 'm1', name: 'Registration Opens', date: '2024-01-01', completed: true },
      { id: 'm2', name: 'Early Bird Deadline', date: '2024-01-31', completed: false },
      { id: 'm3', name: 'Registration Closes', date: '2024-02-28', completed: false },
    ],
  },
  {
    id: 'phase_2',
    name: 'Submission',
    description: 'Submit your BMC, pitch deck, and video',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    status: 'upcoming',
    milestones: [
      { id: 'm4', name: 'Submission Opens', date: '2024-02-01', completed: false },
      { id: 'm5', name: 'Submission Deadline', date: '2024-02-28', completed: false },
    ],
  },
  {
    id: 'phase_3',
    name: 'Screening',
    description: 'Admin review and content evaluation',
    startDate: '2024-03-01',
    endDate: '2024-03-21',
    status: 'upcoming',
    milestones: [
      { id: 'm6', name: 'Screening Starts', date: '2024-03-01', completed: false },
      { id: 'm7', name: 'Semifinalists Announced', date: '2024-03-21', completed: false },
    ],
  },
  {
    id: 'phase_4',
    name: 'Semifinal',
    description: 'Virtual pitch presentations',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    status: 'upcoming',
    milestones: [
      { id: 'm8', name: 'Semifinal Presentations', date: '2024-04-15', completed: false },
      { id: 'm9', name: 'Finalists Announced', date: '2024-04-30', completed: false },
    ],
  },
  {
    id: 'phase_5',
    name: 'Final',
    description: 'Grand finale and awards ceremony',
    startDate: '2024-05-15',
    endDate: '2024-05-17',
    status: 'upcoming',
    milestones: [
      { id: 'm10', name: 'Final Presentations', date: '2024-05-16', completed: false },
      { id: 'm11', name: 'Awards Ceremony', date: '2024-05-17', completed: false },
    ],
  },
];

const judgingCriteria: JudgingCriteria[] = [
  {
    id: 'innovation',
    name: 'Innovation & Creativity',
    description: 'Novelty of the business model and solution',
    maxScore: 25,
    weight: 0.25,
  },
  {
    id: 'market',
    name: 'Market Potential',
    description: 'Size and growth potential of target market',
    maxScore: 20,
    weight: 0.20,
  },
  {
    id: 'business_model',
    name: 'Business Model Viability',
    description: 'Clarity and feasibility of revenue model',
    maxScore: 25,
    weight: 0.25,
  },
  {
    id: 'sustainability',
    name: 'Sustainability Impact',
    description: 'Environmental and social impact potential',
    maxScore: 15,
    weight: 0.15,
  },
  {
    id: 'team',
    name: 'Team Capability',
    description: 'Relevant experience and commitment',
    maxScore: 10,
    weight: 0.10,
  },
  {
    id: 'presentation',
    name: 'Presentation Quality',
    description: 'Clarity and professionalism of pitch',
    maxScore: 5,
    weight: 0.05,
  },
];

// ============================================
// Team Services
// ============================================

export const teamService = {
  getAll: async (): Promise<Team[]> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network
    return getStoredData(STORAGE_KEYS.TEAMS, initialTeams);
  },

  getById: async (id: string): Promise<Team | undefined> => {
    const teams = await teamService.getAll();
    return teams.find(t => t.id === id);
  },

  getByCode: async (code: string): Promise<Team | undefined> => {
    const teams = await teamService.getAll();
    return teams.find(t => t.code.toUpperCase() === code.toUpperCase());
  },

  create: async (data: {
    name: string;
    category: CompetitionCategory;
    leaderId: string;
    leaderInfo: Omit<TeamMember, 'id' | 'joinedAt'>;
  }): Promise<Team> => {
    const teams = await teamService.getAll();
    const newMember: TeamMember = {
      id: generateId(),
      ...data.leaderInfo,
      status: 'active',
      joinedAt: new Date().toISOString(),
    };

    const maxMembers = data.category === 'corporate' ? 10 : 5;
    const newTeam: Team = {
      id: generateId(),
      name: data.name,
      code: generateTeamCode(),
      category: data.category,
      leaderId: data.leaderId,
      members: [newMember],
      maxMembers,
      createdAt: new Date().toISOString(),
      status: 'forming',
    };

    teams.push(newTeam);
    setStoredData(STORAGE_KEYS.TEAMS, teams);
    return newTeam;
  },

  join: async (teamCode: string, memberData: Omit<TeamMember, 'id' | 'joinedAt'>): Promise<Team | null> => {
    const teams = await teamService.getAll();
    const teamIndex = teams.findIndex(t => t.code.toUpperCase() === teamCode.toUpperCase());

    if (teamIndex === -1) return null;

    const team = teams[teamIndex];
    if (team.members.length >= team.maxMembers) {
      throw new Error('Team is full');
    }

    const newMember: TeamMember = {
      id: generateId(),
      ...memberData,
      status: 'pending',
      joinedAt: new Date().toISOString(),
    };

    teams[teamIndex].members.push(newMember);
    setStoredData(STORAGE_KEYS.TEAMS, teams);
    return teams[teamIndex];
  },

  updateMemberStatus: async (teamId: string, memberId: string, status: TeamMember['status']): Promise<Team | null> => {
    const teams = await teamService.getAll();
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) return null;

    const memberIndex = teams[teamIndex].members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) return null;

    teams[teamIndex].members[memberIndex].status = status;
    setStoredData(STORAGE_KEYS.TEAMS, teams);
    return teams[teamIndex];
  },

  inviteMember: async (teamId: string, email: string, name: string): Promise<TeamMember | null> => {
    const teams = await teamService.getAll();
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) return null;

    const team = teams[teamIndex];
    if (team.members.length >= team.maxMembers) {
      throw new Error('Team is full');
    }

    const newMember: TeamMember = {
      id: generateId(),
      name,
      email,
      role: 'member',
      status: 'pending',
      joinedAt: new Date().toISOString(),
    };

    teams[teamIndex].members.push(newMember);
    setStoredData(STORAGE_KEYS.TEAMS, teams);
    return newMember;
  },
};

// ============================================
// Submission Services
// ============================================

export const submissionService = {
  getAll: async (): Promise<Submission[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getStoredData(STORAGE_KEYS.SUBMISSIONS, initialSubmissions);
  },

  getById: async (id: string): Promise<Submission | undefined> => {
    const submissions = await submissionService.getAll();
    return submissions.find(s => s.id === id);
  },

  getByTeamId: async (teamId: string): Promise<Submission | undefined> => {
    const submissions = await submissionService.getAll();
    return submissions.find(s => s.teamId === teamId);
  },

  create: async (data: Omit<Submission, 'id' | 'documents' | 'status' | 'currentPhase'>): Promise<Submission> => {
    const submissions = await submissionService.getAll();
    const newSubmission: Submission = {
      ...data,
      id: generateId(),
      documents: [],
      status: 'draft',
      currentPhase: 'registration',
    };

    submissions.push(newSubmission);
    setStoredData(STORAGE_KEYS.SUBMISSIONS, submissions);
    return newSubmission;
  },

  update: async (id: string, updates: Partial<Submission>): Promise<Submission | null> => {
    const submissions = await submissionService.getAll();
    const index = submissions.findIndex(s => s.id === id);

    if (index === -1) return null;

    submissions[index] = { ...submissions[index], ...updates };
    setStoredData(STORAGE_KEYS.SUBMISSIONS, submissions);
    return submissions[index];
  },

  addDocument: async (submissionId: string, document: Omit<SubmissionDocument, 'id' | 'uploadedAt' | 'status'>): Promise<SubmissionDocument> => {
    const submissions = await submissionService.getAll();
    const index = submissions.findIndex(s => s.id === submissionId);

    if (index === -1) throw new Error('Submission not found');

    const newDoc: SubmissionDocument = {
      ...document,
      id: generateId(),
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
    };

    submissions[index].documents.push(newDoc);
    setStoredData(STORAGE_KEYS.SUBMISSIONS, submissions);
    return newDoc;
  },

  submit: async (id: string): Promise<Submission | null> => {
    return submissionService.update(id, {
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      currentPhase: 'screening',
    });
  },
};

// ============================================
// Notification Services
// ============================================

export const notificationService = {
  getAll: async (): Promise<CIBCNotification[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getStoredData(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  },

  markAsRead: async (id: string): Promise<void> => {
    const notifications = await notificationService.getAll();
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index].read = true;
      setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  },

  markAllAsRead: async (): Promise<void> => {
    const notifications = await notificationService.getAll();
    notifications.forEach(n => n.read = true);
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  add: async (notification: Omit<CIBCNotification, 'id' | 'time'>): Promise<CIBCNotification> => {
    const notifications = await notificationService.getAll();
    const newNotification: CIBCNotification = {
      ...notification,
      id: generateId(),
      time: 'Just now',
    };
    notifications.unshift(newNotification);
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotification;
  },
};

// ============================================
// Dashboard Services
// ============================================

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const teams = await teamService.getAll();
    const submissions = await submissionService.getAll();

    return {
      totalTeams: teams.length,
      totalSubmissions: submissions.filter(s => s.status !== 'draft').length,
      submissionRate: Math.round((submissions.filter(s => s.status !== 'draft').length / teams.length) * 100) || 0,
      daysRemaining: 14,
      currentPhase: 'Registration',
    };
  },

  getProgress: async (teamId: string): Promise<DashboardProgress> => {
    const team = await teamService.getById(teamId);
    const submission = await submissionService.getByTeamId(teamId);

    const documents = submission?.documents || [];

    return {
      registration: !!team,
      teamFormation: (team?.members?.length || 0) >= 2,
      submission: submission?.status !== 'draft',
      documentsUploaded: {
        bmc: documents.some(d => d.type === 'bmc'),
        pitchDeck: documents.some(d => d.type === 'pitch_deck'),
        executiveSummary: documents.some(d => d.type === 'executive_summary'),
        video: documents.some(d => d.type === 'video'),
      },
      overallProgress: calculateOverallProgress({
        registration: !!team,
        teamFormation: (team?.members?.length || 0) >= 2,
        submission: submission?.status !== 'draft',
        documents,
      }),
    };
  },
};

function calculateOverallProgress(data: {
  registration: boolean;
  teamFormation: boolean;
  submission: boolean;
  documents: SubmissionDocument[];
}): number {
  let progress = 0;
  if (data.registration) progress += 20;
  if (data.teamFormation) progress += 15;
  if (data.documents.some(d => d.type === 'bmc')) progress += 15;
  if (data.documents.some(d => d.type === 'pitch_deck')) progress += 15;
  if (data.documents.some(d => d.type === 'executive_summary')) progress += 10;
  if (data.documents.some(d => d.type === 'video')) progress += 10;
  if (data.submission) progress += 15;
  return progress;
}

// ============================================
// Timeline Services
// ============================================

export const timelineService = {
  getAll: async (): Promise<TimelinePhase[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return timelinePhases;
  },

  getCurrentPhase: async (): Promise<TimelinePhase | undefined> => {
    const phases = await timelineService.getAll();
    return phases.find(p => p.status === 'active');
  },
};

// ============================================
// Judging Services
// ============================================

export const judgingService = {
  getCriteria: async (): Promise<JudgingCriteria[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return judgingCriteria;
  },

  submitEvaluation: async (evaluation: Omit<JudgeEvaluation, 'id' | 'evaluatedAt' | 'status'>): Promise<JudgeEvaluation> => {
    const newEvaluation: JudgeEvaluation = {
      ...evaluation,
      id: generateId(),
      evaluatedAt: new Date().toISOString(),
      status: 'completed',
    };

    // In real API, this would save to database
    console.log('Evaluation submitted:', newEvaluation);
    return newEvaluation;
  },
};

// ============================================
// Prize Services
// ============================================

export const prizeService = {
  getByCategory: async (category: CompetitionCategory) => {
    const prizes = {
      student: [
        { rank: '1st' as const, amount: 25000, currency: 'USD', benefits: ['Cash Prize', 'Mentorship', 'Certificate', 'Media Coverage'], certificate: true },
        { rank: '2nd' as const, amount: 15000, currency: 'USD', benefits: ['Cash Prize', 'Mentorship', 'Certificate'], certificate: true },
        { rank: '3rd' as const, amount: 10000, currency: 'USD', benefits: ['Cash Prize', 'Certificate'], certificate: true },
        { rank: 'finalist' as const, amount: 2000, currency: 'USD', benefits: ['Cash Prize', 'Certificate'], certificate: true },
      ],
      startup: [
        { rank: '1st' as const, amount: 50000, currency: 'USD', benefits: ['Cash Prize', 'Investment Opportunity', 'Mentorship', 'Certificate'], certificate: true },
        { rank: '2nd' as const, amount: 30000, currency: 'USD', benefits: ['Cash Prize', 'Mentorship', 'Certificate'], certificate: true },
        { rank: '3rd' as const, amount: 20000, currency: 'USD', benefits: ['Cash Prize', 'Mentorship', 'Certificate'], certificate: true },
        { rank: 'finalist' as const, amount: 5000, currency: 'USD', benefits: ['Cash Prize', 'Certificate'], certificate: true },
      ],
      corporate: [
        { rank: '1st' as const, amount: 0, currency: 'USD', benefits: ['Trophy', 'Recognition', 'Partnership Opportunity', 'Media Coverage'], certificate: true },
        { rank: '2nd' as const, amount: 0, currency: 'USD', benefits: ['Trophy', 'Recognition', 'Certificate'], certificate: true },
        { rank: '3rd' as const, amount: 0, currency: 'USD', benefits: ['Trophy', 'Recognition', 'Certificate'], certificate: true },
        { rank: 'finalist' as const, amount: 0, currency: 'USD', benefits: ['Certificate', 'Recognition'], certificate: true },
      ],
    };

    return prizes[category];
  },

  getTotalPrizePool: async (): Promise<string> => {
    return '$100,000+';
  },
};

// ============================================
// Initialize Mock Data
// ============================================

export const initializeCIBCData = (): void => {
  // Initialize teams if not exists
  if (!localStorage.getItem(STORAGE_KEYS.TEAMS)) {
    setStoredData(STORAGE_KEYS.TEAMS, initialTeams);
  }

  // Initialize submissions if not exists
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    setStoredData(STORAGE_KEYS.SUBMISSIONS, initialSubmissions);
  }

  // Initialize notifications if not exists
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }

  // Initialize test user for CIBC
  initializeCIBCTestUser();
};

// ============================================
// Test User Account
// ============================================

export const initializeCIBCTestUser = (): void => {
  const USERS_KEY = 'cibc_users';
  const testUser = {
    id: 'user_001', // Match with team leaderId
    email: 'cibc@test.com',
    password: 'cibc2026', // Plain text for mock (in production would be hashed)
    fullName: 'Ahmad Rizki',
    category: 'student',
    teamId: 'team_001', // Link to Green Innovators team
    teamName: 'Green Innovators',
    createdAt: new Date().toISOString(),
  };

  const stored = localStorage.getItem(USERS_KEY);
  const users = stored ? JSON.parse(stored) : [];

  // Check if test user exists
  if (!users.some((u: { email: string }) => u.email === testUser.email)) {
    users.push(testUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};