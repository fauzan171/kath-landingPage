/**
 * CIBC Power by KATH - Registration Page
 *
 * Multi-step registration for Team Leaders only
 * Steps: Account -> Personal -> Category -> Team -> Project
 * Color Theme: Light Cream (#F9F8F6) & Dark Text (#0F0F0F) & Gold (#FFB22C)
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronLeft, Check, Mail, User,
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

// Base Input Class to keep code clean
// const inputClass = "w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-[#0F0F0F] focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/20 outline-none font-body transition-all duration-300";

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
      case 1: isValid = await step1Form.trigger(); break;
      case 2: isValid = await step2Form.trigger(); break;
      case 3: isValid = await step3Form.trigger(); break;
      case 4: isValid = await step4Form.trigger(); break;
      case 5: isValid = await step5Form.trigger(); break;
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

      if (isSupabaseConfigured() && supabase) {
        // ... (Logika Supabase tetap sama seperti original)
        const { user } = await supabaseAuthService.signUp(
          step1Data.email, step1Data.password, { name: step2Data.fullName, category: step3Data.category }
        );
        if (!user) throw new Error('Failed to create user account');

        const competition = await competitionService.getActive();
        if (!competition) throw new Error('Competition not found');

        // Create user with PENDING status (requires admin approval)
        const { error: userError } = await supabase.from('users').insert({
          id: user.id,
          email: step1Data.email,
          name: step2Data.fullName,
          phone: step2Data.phone,
          institution: step3Data.institutionName || step3Data.companyName || step3Data.corporationName,
          category: step3Data.category,
          is_verified: false,
          status: 'pending', // PENDING - needs admin approval
        });
        if (userError) console.error('Error creating user record:', userError);

        const teamName = step4Data.teamName || `${step2Data.fullName}'s Team`;
        const institution = step3Data.institutionName || step3Data.companyName || step3Data.corporationName;
        const teamCategory: 'student' | 'open' = step3Data.category === 'student' ? 'student' : 'open';

        await teamsService.create({
          competition_id: competition.id, name: teamName, category: teamCategory, institution,
        }, user.id);

        // Don't store user session - they need to wait for approval
        // localStorage.setItem('cibc_current_user', ...) - REMOVED

        // Sign out the user - they need admin approval first
        await supabaseAuthService.signOut();

        toast.success(
          language === 'id' ? 'Registrasi berhasil!' : 'Registration successful!',
          {
            description: language === 'id'
              ? 'Akun Anda sedang menunggu persetujuan admin. Anda akan menerima email setelah disetujui.'
              : 'Your account is pending admin approval. You will receive an email once approved.'
          }
        );

        // Redirect to pending approval page
        navigate('/cibc/pending-approval');
      } else {
        // Fallback to localStorage (mock mode) ... (Logika sama)
        const userId = `user_${Date.now()}`;
        const teamId = `team_${Date.now()}`;
        const teamCode = Math.random().toString(36).substr(2, 8).toUpperCase();

        const newUser = {
          id: userId, email: step1Data.email, password: step1Data.password, fullName: step2Data.fullName,
          category: step3Data.category, teamId: teamId, createdAt: new Date().toISOString(),
          status: 'pending', // PENDING - needs admin approval
        };

        const newTeam = {
          id: teamId, name: step4Data.teamName || `${step2Data.fullName}'s Team`, code: teamCode,
          category: step3Data.category, leaderId: userId,
          members: [{ id: `mem_${Date.now()}`, name: step2Data.fullName, email: step1Data.email, role: 'leader' as const, status: 'active' as const, institution: step3Data.institutionName || step3Data.companyName || step3Data.corporationName, joinedAt: new Date().toISOString() }],
          maxMembers: step3Data.category === 'corporate' ? 10 : 5, createdAt: new Date().toISOString(), status: 'forming' as const,
        };

        const newSubmission = {
          id: `sub_${Date.now()}`, teamId: teamId, projectName: step5Data.projectName, oneLineDescription: step5Data.oneLineDescription, problemStatement: step5Data.problemStatement, solutionOverview: step5Data.solutionOverview, sdgAlignment: step5Data.sdgAlignment, documents: [], status: 'draft' as const, currentPhase: 'registration' as const,
        };

        const users = JSON.parse(localStorage.getItem('cibc_users') || '[]');
        users.push(newUser); localStorage.setItem('cibc_users', JSON.stringify(users));

        const teams = JSON.parse(localStorage.getItem('cibc_teams') || '[]');
        teams.push(newTeam); localStorage.setItem('cibc_teams', JSON.stringify(teams));

        const submissions = JSON.parse(localStorage.getItem('cibc_submissions') || '[]');
        submissions.push(newSubmission); localStorage.setItem('cibc_submissions', JSON.stringify(submissions));

        // Don't auto-login - user needs admin approval
        // localStorage.setItem('cibc_current_user', ...) - REMOVED

        toast.success(language === 'id' ? 'Registrasi berhasil!' : 'Registration successful!', {
          description: language === 'id'
            ? 'Akun Anda sedang menunggu persetujuan admin.'
            : 'Your account is pending admin approval.'
        });
        navigate('/cibc/pending-approval');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(language === 'id' ? 'Registrasi gagal. Silakan coba lagi.' : 'Registration failed. Please try again.', { description: errorMessage });
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
    <div className="min-h-screen bg-white relative py-10 px-4 sm:px-6 lg:px-8 font-body flex flex-col justify-center overflow-hidden">

      {/* Main Card Container */}
      <div className="w-full max-w-5xl mx-auto bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 sm:p-10 lg:p-12 relative z-10 border border-gray-100">

        {/* Header Grid: Back | Title | Sign In */}
        <div className="grid grid-cols-3 items-start mb-10">
          <div className="flex justify-start">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#0F0F0F] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">{language === 'id' ? 'Kembali' : 'Back'}</span>
            </button>
          </div>
          <div className="flex justify-center text-center">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#0F0F0F]">
              {language === 'id' ? 'Pendaftaran' : 'Sign up'}
            </h1>
          </div>
          <div className="flex justify-end text-right">
            <p className="text-sm font-medium text-gray-500">
              <span className="hidden sm:inline">{language === 'id' ? 'Sudah punya akun? ' : 'Already a Member? '}</span>
              <button
                onClick={() => navigate('/cibc/login')}
                className="font-bold text-[#FFB22C] hover:text-[#FFB22C]/80 transition-colors"
              >
                {language === 'id' ? 'Masuk' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Progress Tracker (Horizontal Line with Circles) */}
        <div className="relative max-w-3xl mx-auto mb-14 px-2 sm:px-10">
          {/* Background Line */}
          <div className="absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-[#F4F6F8] -z-10" />
          {/* Active Line */}
          <div
            className="absolute top-[18px] left-[10%] h-[2px] bg-[#FFB22C] transition-all duration-500 -z-10"
            style={{ width: `${((currentStep - 1) / 4) * 80}%` }}
          />

          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center w-20">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${currentStep >= step.number
                    ? 'bg-[#FFB22C] text-white shadow-md shadow-[#FFB22C]/30'
                    : 'bg-[#F4F6F8] text-gray-400'
                    }`}
                >
                  {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                </div>
                <span className={`mt-2 text-xs font-semibold text-center ${currentStep >= step.number ? 'text-[#0F0F0F]' : 'text-gray-400'
                  }`}>
                  {step.number === 1 && (language === 'id' ? 'Akun' : 'Account')}
                  {step.number === 2 && (language === 'id' ? 'Personal' : 'Personal')}
                  {step.number === 3 && (language === 'id' ? 'Kategori' : 'Category')}
                  {step.number === 4 && (language === 'id' ? 'Tim' : 'Team')}
                  {step.number === 5 && (language === 'id' ? 'Proyek' : 'Project')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Form Wrapper */}
        <div className="max-w-4xl mx-auto">

          {/* Step 1: Account */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-[#0F0F0F] mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Detail Akun' : 'Account Details'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">Email</label>
                  <input
                    type="email"
                    {...step1Form.register('email')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder="Enter Email Address"
                  />
                  {step1Form.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-500">{step1Form.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Password' : 'Password'}
                  </label>
                  <input
                    type="password"
                    {...step1Form.register('password')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder="Create Password"
                  />
                  {step1Form.formState.errors.password && (
                    <p className="mt-1 text-xs text-red-500">{step1Form.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Konfirmasi Password' : 'Confirm Password'}
                  </label>
                  <input
                    type="password"
                    {...step1Form.register('confirmPassword')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder="Confirm Password"
                  />
                  {step1Form.formState.errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{step1Form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2 flex items-start gap-3 mt-2">
                  <input
                    type="checkbox"
                    {...step1Form.register('agreeToTerms')}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-[#FFB22C] focus:ring-[#FFB22C] cursor-pointer"
                  />
                  <label className="text-sm text-gray-500 cursor-pointer">
                    {language === 'id'
                      ? 'Saya menyetujui syarat dan ketentuan kompetisi.'
                      : 'I agree to the terms and conditions.'}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-[#0F0F0F] mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Informasi Personal' : 'Personal Details'}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    {...step2Form.register('fullName')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder="Enter Full Name"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Tanggal Lahir' : 'Date Of Birth'}
                  </label>
                  <input
                    type="date"
                    {...step2Form.register('birthDate')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm text-gray-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Nomor Telepon' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    {...step2Form.register('phone')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder="+62 812 xxxx xxxx"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Negara' : 'Country'}
                  </label>
                  <select
                    {...step2Form.register('country')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                  >
                    <option value="">- Select -</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Kota' : 'City'}
                  </label>
                  <input
                    type="text"
                    {...step2Form.register('city')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder="Enter City"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Category */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-[#0F0F0F] mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Kategori Partisipasi' : 'Participation Category'}
              </h2>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {(['student', 'startup', 'corporate'] as const).map(cat => (
                  <label
                    key={cat}
                    className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${watchedCategory === cat
                      ? 'border-[#FFB22C] bg-[#FFB22C]/5'
                      : 'border-[#F4F6F8] bg-[#F4F6F8] hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      value={cat}
                      {...step3Form.register('category')}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-center mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${watchedCategory === cat ? 'bg-[#FFB22C] text-white' : 'bg-white text-gray-400'
                        }`}>
                        {cat === 'student' && <GraduationCap className="w-5 h-5" />}
                        {cat === 'startup' && <Briefcase className="w-5 h-5" />}
                        {cat === 'corporate' && <Building2 className="w-5 h-5" />}
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${watchedCategory === cat ? 'border-[#FFB22C] bg-[#FFB22C]' : 'border-gray-300 bg-white'
                        }`}>
                        {watchedCategory === cat && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <h3 className="font-bold text-sm text-[#0F0F0F] mt-1">
                      {cat === 'student' && (language === 'id' ? 'Mahasiswa' : 'Student')}
                      {cat === 'startup' && 'Startup'}
                      {cat === 'corporate' && (language === 'id' ? 'Korporat' : 'Corporate')}
                    </h3>
                  </label>
                ))}
              </div>

              {/* Conditional Inputs based on Category */}
              {watchedCategory && (
                <div className="grid md:grid-cols-2 gap-6 bg-white pt-2">
                  {watchedCategory === 'student' && (
                    <>
                      <div>
                        <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                          {language === 'id' ? 'Nama Institusi' : 'Institution Name'}
                        </label>
                        <input
                          type="text"
                          {...step3Form.register('institutionName')}
                          className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                          {language === 'id' ? 'Jurusan' : 'Major'}
                        </label>
                        <input
                          type="text"
                          {...step3Form.register('major')}
                          className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                        />
                      </div>
                    </>
                  )}
                  {watchedCategory === 'startup' && (
                    <>
                      <div>
                        <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                          {language === 'id' ? 'Nama Perusahaan' : 'Company Name'}
                        </label>
                        <input
                          type="text"
                          {...step3Form.register('companyName')}
                          className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">Stage</label>
                        <select
                          {...step3Form.register('companyStage')}
                          className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                        >
                          <option value="idea">Idea Stage</option>
                          <option value="mvp">MVP</option>
                          <option value="revenue">Generating Revenue</option>
                          <option value="growth">Growth Stage</option>
                        </select>
                      </div>
                    </>
                  )}
                  {watchedCategory === 'corporate' && (
                    <>
                      <div>
                        <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                          {language === 'id' ? 'Nama Korporasi' : 'Corporation Name'}
                        </label>
                        <input
                          type="text"
                          {...step3Form.register('corporationName')}
                          className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                          {language === 'id' ? 'Posisi' : 'Position'}
                        </label>
                        <input
                          type="text"
                          {...step3Form.register('position')}
                          className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Team Formation */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-[#0F0F0F] mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Formasi Tim' : 'Team Details'}
              </h2>

              <div className="flex gap-6 mb-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="hasTeam"
                    checked={watchedHasTeam === false}
                    onChange={() => step4Form.setValue('hasTeam', false, { shouldValidate: true })}
                    className="w-5 h-5 text-[#FFB22C] focus:ring-[#FFB22C] border-gray-300"
                  />
                  <span className="font-semibold text-sm text-[#0F0F0F]">
                    {language === 'id' ? 'Individu' : 'Solo'}
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="hasTeam"
                    checked={watchedHasTeam === true}
                    onChange={() => step4Form.setValue('hasTeam', true, { shouldValidate: true })}
                    className="w-5 h-5 text-[#FFB22C] focus:ring-[#FFB22C] border-gray-300"
                  />
                  <span className="font-semibold text-sm text-[#0F0F0F]">
                    {language === 'id' ? 'Dengan Tim' : 'With Team'}
                  </span>
                </label>
              </div>

              {watchedHasTeam && (
                <div className="animate-in fade-in">
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Nama Tim' : 'Team Name'}
                  </label>
                  <input
                    type="text"
                    {...step4Form.register('teamName')}
                    className="w-full md:w-1/2 bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder="Enter Team Name"
                  />
                  <p className="text-xs text-gray-500 mt-3">
                    {language === 'id'
                      ? '* Anda dapat mengundang anggota tim via email setelah pendaftaran selesai.'
                      : '* You can invite members via email after registration is complete.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Project Info */}
          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-[#0F0F0F] mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Detail Proyek' : 'Project Details'}
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Nama Proyek' : 'Project Name'}
                  </label>
                  <input
                    type="text"
                    {...step5Form.register('projectName')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder="Enter Project Name"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                    {language === 'id' ? 'Visi & Misi (maks. 100 karakter)' : 'Vision & Mission (max 100 char)'}
                  </label>
                  <input
                    type="text"
                    {...step5Form.register('oneLineDescription')}
                    className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm"
                    placeholder="Type Here..."
                    maxLength={100}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                      {language === 'id' ? 'Masalah' : 'Problem Statement'}
                    </label>
                    <textarea
                      {...step5Form.register('problemStatement')}
                      className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm resize-none"
                      rows={4}
                      placeholder="Type Here..."
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-sm text-[#0F0F0F] mb-2">
                      {language === 'id' ? 'Solusi' : 'Solution Overview'}
                    </label>
                    <textarea
                      {...step5Form.register('solutionOverview')}
                      className="w-full bg-[#F4F6F8] px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-[#FFB22C] focus:ring-4 focus:ring-[#FFB22C]/15 outline-none text-[#0F0F0F] transition-all text-sm resize-none"
                      rows={4}
                      placeholder="Type Here..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-sm text-[#0F0F0F] mb-3">
                    {language === 'id' ? 'Pilih SDG (maks. 3)' : 'Select SDG (max 3)'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SDG_OPTIONS.map(sdg => {
                      const isSelected = selectedSDGs.includes(sdg.value);
                      const isDisabled = !isSelected && selectedSDGs.length >= 3;
                      return (
                        <button
                          key={sdg.value}
                          type="button"
                          onClick={() => toggleSDG(sdg.value)}
                          disabled={isDisabled}
                          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${isSelected
                            ? 'text-white shadow-sm'
                            : 'bg-[#F4F6F8] text-gray-500 hover:bg-gray-200'
                            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                          style={{ backgroundColor: isSelected ? sdg.color : undefined }}
                        >
                          {sdg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Centered Navigation Button */}
          <div className="flex justify-center items-center gap-4 mt-12">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 font-semibold text-sm text-gray-400 hover:text-[#0F0F0F] transition-colors"
              >
                {language === 'id' ? 'Kembali' : 'Cancel'}
              </button>
            )}

            <button
              type="button"
              onClick={currentStep < 5 ? nextStep : onSubmit}
              disabled={isSubmitting}
              className="px-10 py-3.5 bg-[#FFB22C] text-[#0F0F0F] rounded-full font-bold text-sm hover:bg-[#FFB22C]/90 shadow-md shadow-[#FFB22C]/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? '...' : (
                currentStep < 5
                  ? (language === 'id' ? 'Simpan & Lanjut' : 'Save & Continue')
                  : (language === 'id' ? 'Selesai' : 'Complete Registration')
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CIBCRegister;