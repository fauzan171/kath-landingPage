// Mock Data Service - Simulates API calls with localStorage persistence

// Types
export interface Competition {
  id: string;
  name: string;
  category: string;
  description: string;
  organizer: string;
  location: string;
  startDate: string;
  endDate: string;
  deadline: string;
  status: 'registered' | 'in_progress' | 'finished' | 'upcoming';
  progress: number;
  teamName?: string;
  teamSize: number;
  hasSubmitted: boolean;
  submissionDate?: string;
  result?: 'winner' | 'runner_up' | 'participant';
  prize?: string;
  image: string;
  requirements: string[];
  timeline: { phase: string; date: string; completed: boolean }[];
  rules: string[];
}

export interface Team {
  id: string;
  name: string;
  code: string;
  competitionId: string;
  competitionName: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
  maxMembers: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'leader' | 'member';
  status: 'active' | 'pending';
  avatar?: string;
  joinedAt: string;
}

export interface Submission {
  id: string;
  competitionId: string;
  competitionName: string;
  userId: string;
  files: SubmissionFile[];
  description: string;
  submittedAt: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  feedback?: string;
}

export interface SubmissionFile {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

export interface UserProfile {
  bio: string;
  linkedin: string;
  website: string;
  portfolio: string;
  avatar?: string;
}

// Storage Keys
const STORAGE_KEYS = {
  COMPETITIONS: 'kath_competitions',
  TEAMS: 'kath_teams',
  SUBMISSIONS: 'kath_submissions',
  NOTIFICATIONS: 'kath_notifications',
  PROFILE: 'kath_profile',
  SETTINGS: 'kath_settings',
};

// Initial Mock Data
const initialCompetitions: Competition[] = [
  {
    id: 'comp_001',
    name: 'Wedding Concept Competition 2026',
    category: 'Wedding Concept',
    description: 'Kompetisi desain konsep pernikahan terbesar di Indonesia. Tunjukkan kreativitas Anda dalam merancang pengalaman pernikahan yang tak terlupakan.',
    organizer: 'KATH Event Organizer',
    location: 'Jakarta',
    startDate: '2025-03-01',
    endDate: '2025-06-20',
    deadline: '2025-04-30',
    status: 'in_progress',
    progress: 65,
    teamName: 'Dream Team',
    teamSize: 3,
    hasSubmitted: false,
    image: '/card-1.webp',
    requirements: [
      'Proposal konsep (PDF, max 50MB)',
      'Moodboard dan referensi visual',
      'Rincian anggaran',
      'Timeline pelaksanaan',
      'Portofolio tim'
    ],
    timeline: [
      { phase: 'Registration Open', date: '1 Maret 2025', completed: true },
      { phase: 'Workshop', date: '25 Maret 2025', completed: true },
      { phase: 'Deadline Registration', date: '15 April 2025', completed: false },
      { phase: 'Submission', date: '30 April 2025', completed: false },
      { phase: 'Semi Final', date: '15 Mei 2025', completed: false },
      { phase: 'Final', date: '20 Juni 2025', completed: false },
    ],
    rules: [
      'Peserta wajib mahasiswa atau fresh graduate',
      'Tim maksimal 3 orang',
      'Karya harus orisinal',
      'Plagiarisme akan didiskualifikasi'
    ]
  },
  {
    id: 'comp_002',
    name: 'Event Design Challenge 2025',
    category: 'Event Design',
    description: 'Tantangan desain event untuk para kreator muda. Ciptakan pengalaman event yang inovatif dan memorable.',
    organizer: 'Design Indonesia',
    location: 'Bandung',
    startDate: '2024-08-01',
    endDate: '2024-11-15',
    deadline: '2024-10-31',
    status: 'finished',
    progress: 100,
    teamSize: 1,
    hasSubmitted: true,
    submissionDate: '2024-10-28',
    result: 'runner_up',
    prize: 'Rp 75.000.000',
    image: '/card-2.webp',
    requirements: [
      'Desain konsep event',
      '3D visualization',
      'Rincian teknis',
      'Anggaran'
    ],
    timeline: [
      { phase: 'Registration', date: '1 Agustus 2024', completed: true },
      { phase: 'Submission', date: '31 Oktober 2024', completed: true },
      { phase: 'Judging', date: '15 November 2024', completed: true },
      { phase: 'Awarding', date: '20 November 2024', completed: true },
    ],
    rules: [
      'Individu atau tim max 2 orang',
      'Desain harus feasible',
      'Mengikuti brief yang diberikan'
    ]
  },
  {
    id: 'comp_003',
    name: 'Student Event Competition 2025',
    category: 'Student Event',
    description: 'Kompetisi khusus mahasiswa untuk mengembangkan ide event kreatif dengan budget terbatas.',
    organizer: 'KATH EO',
    location: 'Jakarta',
    startDate: '2025-06-01',
    endDate: '2025-08-30',
    deadline: '2025-05-15',
    status: 'upcoming',
    progress: 10,
    teamName: 'Innovators',
    teamSize: 4,
    hasSubmitted: false,
    image: '/card-3.webp',
    requirements: [
      'Kartu mahasiswa aktif',
      'Proposal event',
      'Video pitch (3 menit)',
      'Surat rekomendasi dosen'
    ],
    timeline: [
      { phase: 'Registration', date: '1 Juni 2025', completed: false },
      { phase: 'Workshop', date: '15 Juni 2025', completed: false },
      { phase: 'Submission', date: '15 Juli 2025', completed: false },
      { phase: 'Final', date: '30 Agustus 2025', completed: false },
    ],
    rules: [
      'Mahasiswa aktif S1/D3',
      'Tim 2-4 orang',
      'Budget maksimal 50 juta'
    ]
  },
  {
    id: 'comp_004',
    name: 'Photography Contest 2025',
    category: 'Photography',
    description: 'Kompetisi fotografi event untuk menangkap momen-momen berharga.',
    organizer: 'Photo Indonesia',
    location: 'Surabaya',
    startDate: '2025-04-01',
    endDate: '2025-05-30',
    deadline: '2025-04-20',
    status: 'registered',
    progress: 25,
    teamSize: 1,
    hasSubmitted: false,
    image: '/wedding-event.webp',
    requirements: [
      '10 foto terbaik',
      'Deskripsi setiap foto',
      'Portofolio',
      'Biodata'
    ],
    timeline: [
      { phase: 'Registration', date: '1 April 2025', completed: true },
      { phase: 'Submission', date: '20 April 2025', completed: false },
      { phase: 'Voting', date: '1 Mei 2025', completed: false },
      { phase: 'Winner', date: '30 Mei 2025', completed: false },
    ],
    rules: [
      'Foto original',
      'Minimal resolusi 3000px',
      'Edit minor diperbolehkan'
    ]
  }
];

const initialTeams: Team[] = [
  {
    id: 'team_001',
    name: 'Dream Team',
    code: 'DREAM2026',
    competitionId: 'comp_001',
    competitionName: 'Wedding Concept Competition 2026',
    description: 'Tim profesional wedding planner dengan pengalaman 5+ tahun',
    maxMembers: 3,
    createdAt: '2025-03-10',
    members: [
      {
        id: 'usr_test_001',
        name: 'Budi Santoso',
        email: 'test@kath.com',
        role: 'leader',
        status: 'active',
        joinedAt: '2025-03-10'
      },
      {
        id: 'mem_002',
        name: 'Anisa Wijaya',
        email: 'anisa@example.com',
        role: 'member',
        status: 'active',
        joinedAt: '2025-03-12'
      },
      {
        id: 'mem_003',
        name: 'Rudi Hartono',
        email: 'rudi@example.com',
        role: 'member',
        status: 'pending',
        joinedAt: '2025-03-15'
      }
    ]
  },
  {
    id: 'team_002',
    name: 'Innovators',
    code: 'INNOV2025',
    competitionId: 'comp_003',
    competitionName: 'Student Event Competition 2025',
    description: 'Mahasiswa kreatif dari berbagai jurusan',
    maxMembers: 4,
    createdAt: '2025-03-20',
    members: [
      {
        id: 'usr_test_001',
        name: 'Budi Santoso',
        email: 'test@kath.com',
        role: 'leader',
        status: 'active',
        joinedAt: '2025-03-20'
      },
      {
        id: 'mem_004',
        name: 'Dewi Kusuma',
        email: 'dewi@example.com',
        role: 'member',
        status: 'active',
        joinedAt: '2025-03-21'
      }
    ]
  }
];

const initialSubmissions: Submission[] = [
  {
    id: 'sub_001',
    competitionId: 'comp_002',
    competitionName: 'Event Design Challenge 2025',
    userId: 'usr_test_001',
    description: 'Konsep event sustainable dengan tema "Green Future"',
    submittedAt: '2024-10-28',
    status: 'accepted',
    feedback: 'Desain sangat inovatif dan feasible. Presentasi yang baik!',
    files: [
      { id: 'file_001', name: 'Proposal_Green_Future.pdf', type: 'application/pdf', size: '15.2 MB', url: '#' },
      { id: 'file_002', name: '3D_Rendering.zip', type: 'application/zip', size: '45.8 MB', url: '#' },
      { id: 'file_003', name: 'Budget_Detail.xlsx', type: 'application/excel', size: '2.1 MB', url: '#' }
    ]
  }
];

const initialNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'success',
    title: 'Pendaftaran Berhasil',
    message: 'Anda telah terdaftar di Wedding Concept Competition 2026',
    time: '2 jam yang lalu',
    read: false,
    actionUrl: '/my-competitions'
  },
  {
    id: 'notif_002',
    type: 'info',
    title: 'Workshop Mendatang',
    message: 'Jangan lupa ikuti workshop persiapan pada 25 Maret 2025 pukul 14:00 WIB',
    time: '1 hari yang lalu',
    read: false,
    actionUrl: '/my-competitions'
  },
  {
    id: 'notif_003',
    type: 'warning',
    title: 'Deadline Menjelang',
    message: 'Submission Photography Contest tinggal 5 hari lagi!',
    time: '3 hari yang lalu',
    read: true,
    actionUrl: '/competition/comp_004/submit'
  },
  {
    id: 'notif_004',
    type: 'success',
    title: 'Undangan Tim Diterima',
    message: 'Anda telah bergabung dengan tim Innovators',
    time: '5 hari yang lalu',
    read: true,
    actionUrl: '/my-teams'
  },
  {
    id: 'notif_005',
    type: 'urgent',
    title: 'Dokumen Kurang Lengkap',
    message: 'Silakan upload KTP yang lebih jelas untuk verifikasi',
    time: '1 minggu yang lalu',
    read: false
  }
];

// Initialize Data
export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.COMPETITIONS)) {
    localStorage.setItem(STORAGE_KEYS.COMPETITIONS, JSON.stringify(initialCompetitions));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEAMS)) {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(initialTeams));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(initialSubmissions));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  }
};

// Competition Services
export const getCompetitions = (): Competition[] => {
  const data = localStorage.getItem(STORAGE_KEYS.COMPETITIONS);
  return data ? JSON.parse(data) : [];
};

export const getCompetitionById = (id: string): Competition | undefined => {
  const competitions = getCompetitions();
  return competitions.find(c => c.id === id);
};

export const updateCompetition = (id: string, updates: Partial<Competition>) => {
  const competitions = getCompetitions();
  const index = competitions.findIndex(c => c.id === id);
  if (index !== -1) {
    competitions[index] = { ...competitions[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.COMPETITIONS, JSON.stringify(competitions));
    return competitions[index];
  }
  return null;
};

// Team Services
export const getTeams = (): Team[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
  return data ? JSON.parse(data) : [];
};

export const getTeamById = (id: string): Team | undefined => {
  const teams = getTeams();
  return teams.find(t => t.id === id);
};

export const getTeamsByCompetition = (competitionId: string): Team[] => {
  const teams = getTeams();
  return teams.filter(t => t.competitionId === competitionId);
};

export const createTeam = (team: Omit<Team, 'id' | 'createdAt' | 'code'>): Team => {
  const teams = getTeams();
  const newTeam: Team = {
    ...team,
    id: `team_${Date.now()}`,
    code: Math.random().toString(36).substring(2, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  teams.push(newTeam);
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  return newTeam;
};

export const updateTeam = (id: string, updates: Partial<Team>) => {
  const teams = getTeams();
  const index = teams.findIndex(t => t.id === id);
  if (index !== -1) {
    teams[index] = { ...teams[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    return teams[index];
  }
  return null;
};

export const deleteTeam = (id: string) => {
  const teams = getTeams();
  const filtered = teams.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(filtered));
};

export const inviteMember = (teamId: string, email: string) => {
  const team = getTeamById(teamId);
  if (team) {
    const newMember: TeamMember = {
      id: `mem_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'member',
      status: 'pending',
      joinedAt: new Date().toISOString(),
    };
    team.members.push(newMember);
    updateTeam(teamId, { members: team.members });
    return newMember;
  }
  return null;
};

export const removeMember = (teamId: string, memberId: string) => {
  const team = getTeamById(teamId);
  if (team) {
    team.members = team.members.filter(m => m.id !== memberId);
    updateTeam(teamId, { members: team.members });
  }
};

export const promoteMember = (teamId: string, memberId: string) => {
  const team = getTeamById(teamId);
  if (team) {
    // Demote current leader
    team.members = team.members.map(m => ({
      ...m,
      role: m.id === memberId ? 'leader' : (m.role === 'leader' ? 'member' : m.role)
    }));
    updateTeam(teamId, { members: team.members });
  }
};

// Submission Services
export const getSubmissions = (): Submission[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
  return data ? JSON.parse(data) : [];
};

export const getSubmissionByCompetition = (competitionId: string): Submission | undefined => {
  const submissions = getSubmissions();
  return submissions.find(s => s.competitionId === competitionId);
};

export const createSubmission = (submission: Omit<Submission, 'id' | 'submittedAt'>): Submission => {
  const submissions = getSubmissions();
  const newSubmission: Submission = {
    ...submission,
    id: `sub_${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  submissions.push(newSubmission);
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  
  // Update competition hasSubmitted status
  updateCompetition(submission.competitionId, { hasSubmitted: true, submissionDate: newSubmission.submittedAt });
  
  return newSubmission;
};

export const updateSubmission = (id: string, updates: Partial<Submission>) => {
  const submissions = getSubmissions();
  const index = submissions.findIndex(s => s.id === id);
  if (index !== -1) {
    submissions[index] = { ...submissions[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    return submissions[index];
  }
  return null;
};

// Notification Services
export const getNotifications = (): Notification[] => {
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  return data ? JSON.parse(data) : [];
};

export const markNotificationAsRead = (id: string) => {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications[index].read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
};

export const markAllNotificationsAsRead = () => {
  const notifications = getNotifications();
  notifications.forEach(n => n.read = true);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const addNotification = (notification: Omit<Notification, 'id' | 'time'>) => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    ...notification,
    id: `notif_${Date.now()}`,
    time: 'Baru saja',
  };
  notifications.unshift(newNotification);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  return newNotification;
};

export const deleteNotification = (id: string) => {
  const notifications = getNotifications();
  const filtered = notifications.filter(n => n.id !== id);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(filtered));
};

// Profile Services
export const getProfile = (): UserProfile => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return data ? JSON.parse(data) : { bio: '', linkedin: '', website: '', portfolio: '' };
};

export const updateProfile = (profile: UserProfile) => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

// Settings Services
export const getSettings = () => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : {
    emailUpdates: true,
    competitionReminders: true,
    submissionDeadlines: true,
    teamInvites: true,
    marketingEmails: false,
    smsNotifications: false,
  };
};

export const updateSettings = (settings: any) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// Stats
export const getDashboardStats = () => {
  const competitions = getCompetitions();
  return {
    totalCompetitions: competitions.length,
    active: competitions.filter(c => c.status === 'in_progress' || c.status === 'registered').length,
    wins: competitions.filter(c => c.result === 'winner').length,
    certificates: competitions.filter(c => c.status === 'finished').length,
  };
};
