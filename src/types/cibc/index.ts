/**
 * CIBC Power by KATH - Type Definitions
 *
 * Complete type system for the competition platform
 */

// ============================================
// User & Team Types
// ============================================

export type CompetitionCategory = 'student' | 'startup' | 'corporate';

export type TeamRole = 'leader' | 'member';

export type MemberStatus = 'active' | 'pending' | 'declined';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: MemberStatus;
  institution?: string;
  position?: string;
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  code: string; // Invite code
  category: CompetitionCategory;
  leaderId: string;
  members: TeamMember[];
  maxMembers: number; // 5 for student/startup, 10 for corporate
  createdAt: string;
  status: 'forming' | 'complete' | 'submitted';
}

// ============================================
// Registration Types
// ============================================

export interface RegistrationStep1 {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface RegistrationStep2 {
  fullName: string;
  birthDate: string;
  phone: string;
  country: string;
  city: string;
}

export interface RegistrationStep3 {
  category: CompetitionCategory;
  // Student specific
  institutionName?: string;
  major?: string;
  yearOfStudy?: string;
  // Startup specific
  companyName?: string;
  companyStage?: 'idea' | 'mvp' | 'revenue' | 'growth';
  foundedYear?: string;
  // Corporate specific
  corporationName?: string;
  department?: string;
  position?: string;
  employeeCount?: string;
}

export interface RegistrationStep4 {
  hasTeam: boolean;
  teamName?: string;
  teamCode?: string; // If joining existing team
  inviteEmails?: string[]; // If creating new team
}

export interface RegistrationStep5 {
  projectName: string;
  oneLineDescription: string;
  problemStatement: string;
  solutionOverview: string;
  sdgAlignment: SDG[];
}

export interface RegistrationData {
  step1: RegistrationStep1;
  step2: RegistrationStep2;
  step3: RegistrationStep3;
  step4: RegistrationStep4;
  step5: RegistrationStep5;
}

// ============================================
// Submission Types
// ============================================

export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'screening_passed'
  | 'screening_failed'
  | 'semifinalist'
  | 'finalist'
  | 'winner';

export type SDG =
  | 'no_poverty'
  | 'zero_hunger'
  | 'good_health'
  | 'quality_education'
  | 'gender_equality'
  | 'clean_water'
  | 'clean_energy'
  | 'decent_work'
  | 'industry_innovation'
  | 'reduced_inequalities'
  | 'sustainable_cities'
  | 'responsible_consumption'
  | 'climate_action'
  | 'life_below_water'
  | 'life_on_land'
  | 'peace_justice'
  | 'partnerships';

export interface SubmissionDocument {
  id: string;
  type: 'bmc' | 'pitch_deck' | 'executive_summary' | 'video' | 'supporting';
  name: string;
  url: string;
  size: number; // in bytes
  uploadedAt: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
}

export interface Submission {
  id: string;
  teamId: string;
  projectName: string;
  oneLineDescription: string;
  problemStatement: string;
  solutionOverview: string;
  sdgAlignment: SDG[];
  documents: SubmissionDocument[];
  status: SubmissionStatus;
  submittedAt?: string;
  reviewedAt?: string;
  score?: number;
  feedback?: string;
  currentPhase: 'registration' | 'screening' | 'semifinal' | 'final' | 'completed';
}

// ============================================
// Judging Types
// ============================================

export interface JudgingCriteria {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
}

export interface JudgeScore {
  criteriaId: string;
  score: number;
  comment?: string;
}

export interface JudgeEvaluation {
  id: string;
  submissionId: string;
  judgeId: string;
  scores: JudgeScore[];
  totalScore: number;
  overallComment: string;
  evaluatedAt: string;
  status: 'pending' | 'completed';
}

// ============================================
// Timeline Types
// ============================================

export interface TimelinePhase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  milestones: TimelineMilestone[];
}

export interface TimelineMilestone {
  id: string;
  name: string;
  date: string;
  completed: boolean;
}

// ============================================
// Notification Types
// ============================================

export type NotificationType = 'info' | 'success' | 'warning' | 'urgent';

export interface CIBCNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  category?: string;
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
  totalTeams: number;
  totalSubmissions: number;
  submissionRate: number;
  daysRemaining: number;
  currentPhase: string;
}

export interface DashboardProgress {
  registration: boolean;
  teamFormation: boolean;
  submission: boolean;
  documentsUploaded: {
    bmc: boolean;
    pitchDeck: boolean;
    executiveSummary: boolean;
    video: boolean;
  };
  overallProgress: number; // 0-100
}

// ============================================
// Prize Types
// ============================================

export interface Prize {
  rank: '1st' | '2nd' | '3rd' | 'finalist' | 'participant';
  amount: number;
  currency: string;
  benefits: string[];
  certificate: boolean;
}

export interface CategoryPrizes {
  category: CompetitionCategory;
  prizes: Prize[];
}

// ============================================
// SDG Label Mapping
// ============================================

export const SDG_LABELS: Record<SDG, { id: number; label: string; color: string }> = {
  no_poverty: { id: 1, label: 'No Poverty', color: '#E5243B' },
  zero_hunger: { id: 2, label: 'Zero Hunger', color: '#DDA63A' },
  good_health: { id: 3, label: 'Good Health & Well-being', color: '#4C9F38' },
  quality_education: { id: 4, label: 'Quality Education', color: '#C5192D' },
  gender_equality: { id: 5, label: 'Gender Equality', color: '#FF3A21' },
  clean_water: { id: 6, label: 'Clean Water & Sanitation', color: '#26BDE2' },
  clean_energy: { id: 7, label: 'Affordable & Clean Energy', color: '#FCC30B' },
  decent_work: { id: 8, label: 'Decent Work & Economic Growth', color: '#A21942' },
  industry_innovation: { id: 9, label: 'Industry, Innovation & Infrastructure', color: '#FD6925' },
  reduced_inequalities: { id: 10, label: 'Reduced Inequalities', color: '#DD1367' },
  sustainable_cities: { id: 11, label: 'Sustainable Cities & Communities', color: '#FD9D24' },
  responsible_consumption: { id: 12, label: 'Responsible Consumption & Production', color: '#BF8B2E' },
  climate_action: { id: 13, label: 'Climate Action', color: '#3F7E44' },
  life_below_water: { id: 14, label: 'Life Below Water', color: '#0A97D9' },
  life_on_land: { id: 15, label: 'Life on Land', color: '#56C02B' },
  peace_justice: { id: 16, label: 'Peace, Justice & Strong Institutions', color: '#00689D' },
  partnerships: { id: 17, label: 'Partnerships for the Goals', color: '#19486A' },
};

// ============================================
// Category Labels
// ============================================

export const CATEGORY_LABELS: Record<CompetitionCategory, { label: string; description: string }> = {
  student: {
    label: 'Student Innovation',
    description: 'For high school and university students (age 16-28)',
  },
  startup: {
    label: 'Startup Challenge',
    description: 'For early-stage startups (0-3 years old)',
  },
  corporate: {
    label: 'Corporate Innovation',
    description: 'For established companies and corporations',
  },
};

// ============================================
// Status Labels
// ============================================

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'gray' },
  submitted: { label: 'Submitted', color: 'blue' },
  under_review: { label: 'Under Review', color: 'yellow' },
  screening_passed: { label: 'Screening Passed', color: 'green' },
  screening_failed: { label: 'Screening Failed', color: 'red' },
  semifinalist: { label: 'Semifinalist', color: 'purple' },
  finalist: { label: 'Finalist', color: 'gold' },
  winner: { label: 'Winner', color: 'gold' },
};