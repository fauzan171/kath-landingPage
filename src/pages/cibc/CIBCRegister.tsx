/**
 * CIBC Power by KATH - Registration Page
 *
 * Multi-step registration for Team Leaders only
 * Steps: Account -> Personal -> Category -> Team -> Project
 * Color Theme: Cream (#E6DDC5) & Black
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronLeft, ChevronRight, Check, Mail, User,
  Building2, GraduationCap, Briefcase,
  Users, Leaf, Target
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';
import type { CompetitionCategory, SDG } from '../../types/cibc';
import { isSupabaseConfigured } from '@/config/environment';
import { supabase } from '@/lib/supabase';
import { supabaseAuthService } from '@/services/supabase.service';
import { competitionService, teamsService } from '@/services/cibc.service';

// Validation Schemas
const step1Schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const step2Schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  birthDate: z.string().min(1, 'Birth date is required'),
  phone: z.string().min(10, 'Invalid phone number'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
});

const step3Schema = z.object({
  category: z.enum(['student', 'startup', 'corporate']),
  institutionName: z.string().optional(),
  major: z.string().optional(),
  yearOfStudy: z.string().optional(),
  companyName: z.string().optional(),
  companyStage: z.enum(['idea', 'mvp', 'revenue', 'growth']).optional(),
  foundedYear: z.string().optional(),
  corporationName: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  employeeCount: z.string().optional(),
});

const step4Schema = z.object({
  hasTeam: z.boolean(),
  teamName: z.string().optional(),
  teamCode: z.string().optional(),
  inviteEmails: z.array(z.string().email()).optional(),
});

const step5Schema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  oneLineDescription: z.string().min(20, 'Description must be at least 20 characters').max(100),
  problemStatement: z.string().min(50, 'Problem statement must be at least 50 characters'),
  solutionOverview: z.string().min(50, 'Solution overview must be at least 50 characters'),
  sdgAlignment: z.array(z.string()).min(1, 'Select at least 1 SDG'),
});

// SDG Options
const SDG_OPTIONS: { value: SDG; label: string; color: string }[] = [
  { value: 'clean_energy', label: 'Affordable & Clean Energy', color: '#FCC30B' },
  { value: 'industry_innovation', label: 'Industry, Innovation & Infrastructure', color: '#FD6925' },
  { value: 'responsible_consumption', label: 'Responsible Consumption & Production', color: '#BF8B2E' },
  { value: 'climate_action', label: 'Climate Action', color: '#3F7E44' },
  { value: 'sustainable_cities', label: 'Sustainable Cities & Communities', color: '#FD9D24' },
  { value: 'life_on_land', label: 'Life on Land', color: '#56C02B' },
  { value: 'life_below_water', label: 'Life Below Water', color: '#0A97D9' },
  { value: 'clean_water', label: 'Clean Water & Sanitation', color: '#26BDE2' },
];

// Country Options
const COUNTRIES = [
  'Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Philippines', 'Vietnam',
  'United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'South Korea',
  'China', 'India', 'Australia', 'Netherlands', 'Canada', 'Brazil',
];

const CIBCRegister = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSDGs, setSelectedSDGs] = useState<SDG[]>([]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form for each step
  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: { email: '', password: '', confirmPassword: '', agreeToTerms: false },
  });

  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: { fullName: '', birthDate: '', phone: '', country: '', city: '' },
  });

  const step3Form = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      category: 'student' as CompetitionCategory,
      institutionName: '',
      major: '',
      yearOfStudy: '',
      companyName: '',
      companyStage: 'idea',
      foundedYear: '',
      corporationName: '',
      department: '',
      position: '',
      employeeCount: '',
    },
  });

  const step4Form = useForm({
    resolver: zodResolver(step4Schema),
    defaultValues: { hasTeam: true, teamName: '', teamCode: '', inviteEmails: [] },
  });

  const step5Form = useForm({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      projectName: '',
      oneLineDescription: '',
      problemStatement: '',
      solutionOverview: '',
      sdgAlignment: [],
    },
  });

  const watchedCategory = step3Form.watch('category');
  const watchedHasTeam = step4Form.watch('hasTeam');

  // Step navigation
  const nextStep = useCallback(async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await step1Form.trigger();
        break;
      case 2:
        isValid = await step2Form.trigger();
        break;
      case 3:
        isValid = await step3Form.trigger();
        break;
      case 4:
        isValid = await step4Form.trigger();
        break;
      case 5:
        isValid = await step5Form.trigger();
        break;
    }

    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, step1Form, step2Form, step3Form, step4Form, step5Form]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Toggle SDG selection
  const toggleSDG = (sdg: SDG) => {
    const newSelection = selectedSDGs.includes(sdg)
      ? selectedSDGs.filter(s => s !== sdg)
      : [...selectedSDGs, sdg].slice(0, 3);
    setSelectedSDGs(newSelection);
    step5Form.setValue('sdgAlignment', newSelection);
  };

  // Final submission
  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      const step1Data = step1Form.getValues();
      const step2Data = step2Form.getValues();
      const step3Data = step3Form.getValues();
      const step4Data = step4Form.getValues();
      const step5Data = step5Form.getValues();

      // Check if Supabase is configured
      if (isSupabaseConfigured() && supabase) {
        // 1. Create auth user with Supabase
        const { user } = await supabaseAuthService.signUp(
          step1Data.email,
          step1Data.password,
          {
            name: step2Data.fullName,
            category: step3Data.category,
          }
        );

        if (!user) {
          throw new Error('Failed to create user account');
        }

        // 2. Get the active competition
        const competition = await competitionService.getActive();
        if (!competition) {
          throw new Error('Competition not found');
        }

        // 3. Create user record in users table
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: step1Data.email,
            name: step2Data.fullName,
            phone: step2Data.phone,
            institution: step3Data.institutionName || step3Data.companyName || step3Data.corporationName,
            category: step3Data.category,
            is_verified: false,
          });

        if (userError) {
          console.error('Error creating user record:', userError);
          // Continue anyway - auth user is created
        }

        // 4. Create team
        const teamName = step4Data.teamName || `${step2Data.fullName}'s Team`;
        const institution = step3Data.institutionName || step3Data.companyName || step3Data.corporationName;

        // Map category: student -> 'student', startup/corporate -> 'open'
        const teamCategory: 'student' | 'open' = step3Data.category === 'student' ? 'student' : 'open';

        const team = await teamsService.create({
          competition_id: competition.id,
          name: teamName,
          category: teamCategory,
          institution,
        }, user.id);

        // 5. Store session info
        localStorage.setItem('cibc_current_user', JSON.stringify({
          id: user.id,
          email: step1Data.email,
          fullName: step2Data.fullName,
          category: step3Data.category,
          teamId: team.id,
        }));

        toast.success(
          language === 'id'
            ? 'Registrasi berhasil! Mengarahkan ke dashboard...'
            : 'Registration successful! Redirecting to dashboard...',
          {
            description: language === 'id'
              ? 'Tim Anda sedang menunggu verifikasi.'
              : 'Your team is pending verification.',
          }
        );

        navigate('/cibc/dashboard');
      } else {
        // Fallback to localStorage (mock mode)
        const userId = `user_${Date.now()}`;
        const teamId = `team_${Date.now()}`;
        const teamCode = Math.random().toString(36).substr(2, 8).toUpperCase();

        const newUser = {
          id: userId,
          email: step1Data.email,
          password: step1Data.password,
          fullName: step2Data.fullName,
          category: step3Data.category,
          teamId: teamId,
          createdAt: new Date().toISOString(),
        };

        const newTeam = {
          id: teamId,
          name: step4Data.teamName || `${step2Data.fullName}'s Team`,
          code: teamCode,
          category: step3Data.category,
          leaderId: userId,
          members: [
            {
              id: `mem_${Date.now()}`,
              name: step2Data.fullName,
              email: step1Data.email,
              role: 'leader' as const,
              status: 'active' as const,
              institution: step3Data.institutionName || step3Data.companyName || step3Data.corporationName,
              joinedAt: new Date().toISOString(),
            },
          ],
          maxMembers: step3Data.category === 'corporate' ? 10 : 5,
          createdAt: new Date().toISOString(),
          status: 'forming' as const,
        };

        const newSubmission = {
          id: `sub_${Date.now()}`,
          teamId: teamId,
          projectName: step5Data.projectName,
          oneLineDescription: step5Data.oneLineDescription,
          problemStatement: step5Data.problemStatement,
          solutionOverview: step5Data.solutionOverview,
          sdgAlignment: step5Data.sdgAlignment,
          documents: [],
          status: 'draft' as const,
          currentPhase: 'registration' as const,
        };

        const users = JSON.parse(localStorage.getItem('cibc_users') || '[]');
        users.push(newUser);
        localStorage.setItem('cibc_users', JSON.stringify(users));

        const teams = JSON.parse(localStorage.getItem('cibc_teams') || '[]');
        teams.push(newTeam);
        localStorage.setItem('cibc_teams', JSON.stringify(teams));

        const submissions = JSON.parse(localStorage.getItem('cibc_submissions') || '[]');
        submissions.push(newSubmission);
        localStorage.setItem('cibc_submissions', JSON.stringify(submissions));

        localStorage.setItem('cibc_current_user', JSON.stringify({
          id: userId,
          email: newUser.email,
          fullName: newUser.fullName,
          category: newUser.category,
          teamId: teamId,
        }));

        toast.success(
          language === 'id'
            ? 'Registrasi berhasil! Mengarahkan ke dashboard...'
            : 'Registration successful! Redirecting to dashboard...'
        );

        navigate('/cibc/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(
        language === 'id'
          ? 'Registrasi gagal. Silakan coba lagi.'
          : 'Registration failed. Please try again.',
        {
          description: errorMessage,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step labels
  const steps = [
    { number: 1, label: language === 'id' ? 'Akun' : 'Account', icon: Mail },
    { number: 2, label: language === 'id' ? 'Personal' : 'Personal', icon: User },
    { number: 3, label: language === 'id' ? 'Kategori' : 'Category', icon: Target },
    { number: 4, label: language === 'id' ? 'Tim' : 'Team', icon: Users },
    { number: 5, label: language === 'id' ? 'Proyek' : 'Project', icon: Leaf },
  ];

  return (
    <div className="min-h-screen bg-cibc-bgMain py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-white mb-2">
            CIBC Power Registration
          </h1>
          <p className="font-body text-cibc-textSecondary">
            {language === 'id'
              ? 'Daftarkan tim Anda untuk kompetisi BMC internasional'
              : 'Register your team for the international BMC competition'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-body text-sm transition-colors ${
                  currentStep >= step.number
                    ? 'bg-cibc-primary text-cibc-textDark'
                    : 'bg-cibc-bgCard text-cibc-textMuted border border-cibc-border'
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 md:w-20 h-0.5 mx-2 transition-colors ${
                    currentStep > step.number ? 'bg-cibc-primary' : 'bg-cibc-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-cibc-bgCard border border-cibc-border rounded-2xl shadow-lg p-6 md:p-8">
          {/* Step 1: Account */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-cibc-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-cibc-primary" />
                </div>
                <h2 className="font-display text-2xl text-white">
                  {language === 'id' ? 'Buat Akun' : 'Create Account'}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    {...step1Form.register('email')}
                    className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary focus:ring-1 focus:ring-cibc-primary outline-none font-body"
                    placeholder="your@email.com"
                  />
                  {step1Form.formState.errors.email && (
                    <p className="mt-1 text-sm text-cibc-error font-body">
                      {step1Form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                    {language === 'id' ? 'Password' : 'Password'}
                  </label>
                  <input
                    type="password"
                    {...step1Form.register('password')}
                    className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                    placeholder="Min. 8 characters"
                  />
                  {step1Form.formState.errors.password && (
                    <p className="mt-1 text-sm text-cibc-error font-body">
                      {step1Form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                    {language === 'id' ? 'Konfirmasi Password' : 'Confirm Password'}
                  </label>
                  <input
                    type="password"
                    {...step1Form.register('confirmPassword')}
                    className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                    placeholder="Confirm your password"
                  />
                  {step1Form.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-cibc-error font-body">
                      {step1Form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    {...step1Form.register('agreeToTerms')}
                    className="mt-1 w-4 h-4 rounded border-cibc-border text-cibc-primary focus:ring-cibc-primary"
                  />
                  <label className="font-body text-sm text-cibc-textSecondary">
                    {language === 'id'
                      ? 'Saya menyetujui syarat dan ketentuan kompetisi'
                      : 'I agree to the competition terms and conditions'}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-cibc-primary/20 flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-cibc-primary" />
                </div>
                <h2 className="font-display text-2xl text-white">
                  {language === 'id' ? 'Informasi Pribadi' : 'Personal Information'}
                </h2>
                <p className="font-body text-cibc-textSecondary mt-2">
                  {language === 'id' ? 'Data ketua tim' : 'Team leader information'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                    {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    {...step2Form.register('fullName')}
                    className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                    {language === 'id' ? 'Tanggal Lahir' : 'Birth Date'}
                  </label>
                  <input
                    type="date"
                    {...step2Form.register('birthDate')}
                    className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                    {language === 'id' ? 'Nomor Telepon' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    {...step2Form.register('phone')}
                    className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                    placeholder="+62 xxx xxxx xxxx"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                    {language === 'id' ? 'Negara' : 'Country'}
                  </label>
                  <select
                    {...step2Form.register('country')}
                    className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                  >
                    <option value="">{language === 'id' ? 'Pilih negara' : 'Select country'}</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                    {language === 'id' ? 'Kota' : 'City'}
                  </label>
                  <input
                    type="text"
                    {...step2Form.register('city')}
                    className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Category Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-cibc-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-cibc-primary" />
                </div>
                <h2 className="font-display text-2xl text-white">
                  {language === 'id' ? 'Pilih Kategori' : 'Select Category'}
                </h2>
              </div>

              <div className="grid gap-4">
                {(['student', 'startup', 'corporate'] as const).map(cat => (
                  <label
                    key={cat}
                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      watchedCategory === cat
                        ? 'border-cibc-primary bg-cibc-primary/10'
                        : 'border-cibc-border hover:border-cibc-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      value={cat}
                      {...step3Form.register('category')}
                      className="sr-only"
                    />
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      watchedCategory === cat ? 'bg-cibc-primary text-cibc-textDark' : 'bg-cibc-bgSection text-cibc-textMuted'
                    }`}>
                      {cat === 'student' && <GraduationCap className="w-6 h-6" />}
                      {cat === 'startup' && <Briefcase className="w-6 h-6" />}
                      {cat === 'corporate' && <Building2 className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg text-white">
                        {cat === 'student' && (language === 'id' ? 'Mahasiswa' : 'Student Innovation')}
                        {cat === 'startup' && 'Startup Challenge'}
                        {cat === 'corporate' && (language === 'id' ? 'Korporat' : 'Corporate Innovation')}
                      </h3>
                      <p className="font-body text-sm text-cibc-textSecondary">
                        {cat === 'student' && (language === 'id' ? 'Siswa & Mahasiswa (16-28 tahun)' : 'High School & University Students')}
                        {cat === 'startup' && (language === 'id' ? 'Startup awal (0-3 tahun)' : 'Early-stage startups (0-3 years)')}
                        {cat === 'corporate' && (language === 'id' ? 'Perusahaan established' : 'Established companies')}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      watchedCategory === cat ? 'border-cibc-primary bg-cibc-primary' : 'border-cibc-border'
                    }`}>
                      {watchedCategory === cat && <Check className="w-4 h-4 text-cibc-textDark" />}
                    </div>
                  </label>
                ))}
              </div>

              {watchedCategory === 'student' && (
                <div className="grid md:grid-cols-2 gap-4 mt-6 p-4 bg-cibc-bgSection rounded-xl border border-cibc-border">
                  <div>
                    <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                      {language === 'id' ? 'Nama Institusi' : 'Institution Name'}
                    </label>
                    <input
                      type="text"
                      {...step3Form.register('institutionName')}
                      className="w-full px-4 py-3 rounded-lg bg-cibc-bgCard border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                      {language === 'id' ? 'Jurusan' : 'Major'}
                    </label>
                    <input
                      type="text"
                      {...step3Form.register('major')}
                      className="w-full px-4 py-3 rounded-lg bg-cibc-bgCard border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                    />
                  </div>
                </div>
              )}

              {watchedCategory === 'startup' && (
                <div className="grid md:grid-cols-2 gap-4 mt-6 p-4 bg-cibc-bgSection rounded-xl border border-cibc-border">
                  <div>
                    <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                      {language === 'id' ? 'Nama Perusahaan' : 'Company Name'}
                    </label>
                    <input
                      type="text"
                      {...step3Form.register('companyName')}
                      className="w-full px-4 py-3 rounded-lg bg-cibc-bgCard border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                      Stage
                    </label>
                    <select
                      {...step3Form.register('companyStage')}
                      className="w-full px-4 py-3 rounded-lg bg-cibc-bgCard border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                    >
                      <option value="idea">Idea Stage</option>
                      <option value="mvp">MVP</option>
                      <option value="revenue">Generating Revenue</option>
                      <option value="growth">Growth Stage</option>
                    </select>
                  </div>
                </div>
              )}

              {watchedCategory === 'corporate' && (
                <div className="grid md:grid-cols-2 gap-4 mt-6 p-4 bg-cibc-bgSection rounded-xl border border-cibc-border">
                  <div>
                    <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                      {language === 'id' ? 'Nama Korporasi' : 'Corporation Name'}
                    </label>
                    <input
                      type="text"
                      {...step3Form.register('corporationName')}
                      className="w-full px-4 py-3 rounded-lg bg-cibc-bgCard border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                      {language === 'id' ? 'Posisi' : 'Position'}
                    </label>
                    <input
                      type="text"
                      {...step3Form.register('position')}
                      className="w-full px-4 py-3 rounded-lg bg-cibc-bgCard border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Team Formation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-cibc-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-cibc-primary" />
                </div>
                <h2 className="font-display text-2xl text-white">
                  {language === 'id' ? 'Formasi Tim' : 'Team Formation'}
                </h2>
                <p className="font-body text-cibc-textSecondary mt-2">
                  {language === 'id'
                    ? 'Anda terdaftar sebagai ketua tim'
                    : 'You are registered as team leader'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <label
                  className={`relative flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    watchedHasTeam === false
                      ? 'border-cibc-primary bg-cibc-primary/10'
                      : 'border-cibc-border hover:border-cibc-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    value="false"
                    {...step4Form.register('hasTeam')}
                    onChange={() => step4Form.setValue('hasTeam', false)}
                    className="sr-only"
                  />
                  <div className="text-center flex-1">
                    <User className="w-8 h-8 mx-auto mb-2 text-cibc-textSecondary" />
                    <h3 className="font-display text-lg text-white">
                      {language === 'id' ? 'Peserta Individu' : 'Solo Participant'}
                    </h3>
                    <p className="font-body text-sm text-cibc-textSecondary">
                      {language === 'id' ? 'Hanya saya sendiri' : 'Just me'}
                    </p>
                  </div>
                </label>

                <label
                  className={`relative flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    watchedHasTeam === true
                      ? 'border-cibc-primary bg-cibc-primary/10'
                      : 'border-cibc-border hover:border-cibc-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    value="true"
                    {...step4Form.register('hasTeam')}
                    onChange={() => step4Form.setValue('hasTeam', true)}
                    className="sr-only"
                  />
                  <div className="text-center flex-1">
                    <Users className="w-8 h-8 mx-auto mb-2 text-cibc-textSecondary" />
                    <h3 className="font-display text-lg text-white">
                      {language === 'id' ? 'Dengan Tim' : 'With Team'}
                    </h3>
                    <p className="font-body text-sm text-cibc-textSecondary">
                      {language === 'id' ? 'Dengan anggota lain' : 'With other members'}
                    </p>
                  </div>
                </label>
              </div>

              {watchedHasTeam && (
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                      {language === 'id' ? 'Nama Tim' : 'Team Name'}
                    </label>
                    <input
                      type="text"
                      {...step4Form.register('teamName')}
                      className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                      placeholder={language === 'id' ? 'Contoh: Green Innovators' : 'e.g., Green Innovators'}
                    />
                  </div>

                  <div className="p-4 bg-cibc-bgSection rounded-xl border border-cibc-border">
                    <p className="font-body text-sm text-cibc-textSecondary mb-2">
                      {language === 'id'
                        ? 'Setelah registrasi, Anda dapat mengundang anggota tim via email atau kode undangan.'
                        : 'After registration, you can invite team members via email or invitation code.'}
                    </p>
                    <p className="font-body text-xs text-cibc-textMuted">
                      {language === 'id'
                        ? 'Maksimal 5 anggota untuk Student/Startup, 10 untuk Corporate'
                        : 'Max 5 members for Student/Startup, 10 for Corporate'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Project Info */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-cibc-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-cibc-primary" />
                </div>
                <h2 className="font-display text-2xl text-white">
                  {language === 'id' ? 'Informasi Proyek' : 'Project Information'}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                    {language === 'id' ? 'Nama Proyek' : 'Project Name'}
                  </label>
                  <input
                    type="text"
                    {...step5Form.register('projectName')}
                    className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                    placeholder={language === 'id' ? 'Contoh: EcoSort AI' : 'e.g., EcoSort AI'}
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                    {language === 'id' ? 'Deskripsi Singkat (maks. 100 kata)' : 'One-line Description (max 100 words)'}
                  </label>
                  <input
                    type="text"
                    {...step5Form.register('oneLineDescription')}
                    className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary outline-none font-body"
                    placeholder={language === 'id' ? 'Solusi AI untuk sortir sampah plastik' : 'AI solution for plastic waste sorting'}
                    maxLength={100}
                  />
                  <p className="text-xs text-cibc-textMuted mt-1 font-body">
                    {step5Form.watch('oneLineDescription')?.length || 0}/100
                  </p>
                </div>

                <div>
                  <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                    {language === 'id' ? 'Pernyataan Masalah' : 'Problem Statement'}
                  </label>
                  <textarea
                    {...step5Form.register('problemStatement')}
                    className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary outline-none font-body resize-none"
                    rows={4}
                    placeholder={language === 'id'
                      ? 'Jelaskan masalah yang ingin Anda selesaikan...'
                      : 'Describe the problem you want to solve...'}
                  />
                  <p className="text-xs text-cibc-textMuted mt-1 font-body">
                    {step5Form.watch('problemStatement')?.length || 0} / 50 min
                  </p>
                </div>

                <div>
                  <label className="block font-body text-sm text-cibc-textSecondary mb-2">
                    {language === 'id' ? 'Ikhtisar Solusi' : 'Solution Overview'}
                  </label>
                  <textarea
                    {...step5Form.register('solutionOverview')}
                    className="w-full px-4 py-3 rounded-lg bg-cibc-bgSection border border-cibc-border text-white focus:border-cibc-primary outline-none font-body resize-none"
                    rows={4}
                    placeholder={language === 'id'
                      ? 'Jelaskan solusi yang Anda tawarkan...'
                      : 'Describe your proposed solution...'}
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-cibc-textSecondary mb-3">
                    {language === 'id' ? 'Keselarasan SDG (maks. 3)' : 'SDG Alignment (max 3)'}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {SDG_OPTIONS.map(sdg => (
                      <button
                        key={sdg.value}
                        type="button"
                        onClick={() => toggleSDG(sdg.value)}
                        disabled={!selectedSDGs.includes(sdg.value) && selectedSDGs.length >= 3}
                        className={`p-3 rounded-lg text-xs font-body transition-all ${
                          selectedSDGs.includes(sdg.value)
                            ? 'text-white'
                            : 'bg-cibc-bgSection text-cibc-textSecondary hover:bg-cibc-border'
                        }`}
                        style={{
                          backgroundColor: selectedSDGs.includes(sdg.value) ? sdg.color : undefined,
                        }}
                      >
                        {sdg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-cibc-border">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-body text-sm transition-colors ${
                currentStep === 1
                  ? 'text-cibc-textMuted cursor-not-allowed'
                  : 'text-cibc-textSecondary hover:bg-cibc-bgSection'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {language === 'id' ? 'Kembali' : 'Back'}
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-cibc-primary text-cibc-textDark rounded-full font-body text-sm hover:bg-cibc-primaryDark transition-colors"
              >
                {language === 'id' ? 'Lanjut' : 'Continue'}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-cibc-primary text-cibc-textDark rounded-full font-body text-sm hover:bg-cibc-primaryDark transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cibc-textDark/30 border-t-cibc-textDark rounded-full animate-spin" />
                    {language === 'id' ? 'Mendaftar...' : 'Registering...'}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {language === 'id' ? 'Selesaikan Registrasi' : 'Complete Registration'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="font-body text-sm text-cibc-textSecondary">
            {language === 'id' ? 'Sudah punya akun?' : 'Already have an account?'}
            <button
              onClick={() => navigate('/cibc/login')}
              className="ml-2 text-cibc-primary hover:underline"
            >
              {language === 'id' ? 'Masuk di sini' : 'Login here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CIBCRegister;