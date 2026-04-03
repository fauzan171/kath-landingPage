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
  Users, Target, CreditCard, Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';
import type { CompetitionCategory } from '../../types/cibc';
import { isSupabaseConfigured } from '@/config/environment';
import { supabase } from '@/lib/supabase';
import { supabaseAuthService } from '@/services/supabase.service';
import { competitionService, teamsService, paymentService } from '@/services/cibc.service';

// Password strength validation regex
const passwordRegex = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
};

// Custom password validation
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .refine(val => passwordRegex.uppercase.test(val), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine(val => passwordRegex.lowercase.test(val), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine(val => passwordRegex.number.test(val), {
    message: 'Password must contain at least one number',
  });

// Validation Schemas
const step1Schema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
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
  paymentFile: z.any().optional(), // File handled separately
  agreeToPayment: z.boolean().refine(val => val === true, {
    message: 'You must confirm payment submission',
  }),
});

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
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [paymentUploaded, setPaymentUploaded] = useState<string | null>(null);

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
      paymentFile: null,
      agreeToPayment: false,
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

  // Final submission
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const step1Data = step1Form.getValues();
      const step2Data = step2Form.getValues();
      const step3Data = step3Form.getValues();
      const step4Data = step4Form.getValues();
      const step5Data = step5Form.getValues();

      // Validate payment confirmation
      if (!step5Data.agreeToPayment) {
        toast.error(language === 'id' ? 'Harap konfirmasi pembayaran' : 'Please confirm payment');
        setIsSubmitting(false);
        return;
      }

      if (isSupabaseConfigured() && supabase) {
        // Sign up user - trigger will auto-create public.users entry
        const { user } = await supabaseAuthService.signUp(
          step1Data.email, step1Data.password, { name: step2Data.fullName, category: step3Data.category }
        );
        if (!user) throw new Error('Failed to create user account');

        const competition = await competitionService.getActive();
        if (!competition) throw new Error('Competition not found');

        // Update user with additional data (trigger already created basic entry)
        const { error: userError } = await supabase.from('users').update({
          phone: step2Data.phone,
          institution: step3Data.institutionName || step3Data.companyName || step3Data.corporationName,
          category: step3Data.category,
        }).eq('id', user.id);
        if (userError) console.error('Error updating user record:', userError);

        const teamName = step4Data.teamName || `${step2Data.fullName}'s Team`;
        const institution = step3Data.institutionName || step3Data.companyName || step3Data.corporationName;
        const teamCategory: 'student' | 'open' = step3Data.category === 'student' ? 'student' : 'open';

        // Create team
        const team = await teamsService.create({
          competition_id: competition.id,
          name: teamName,
          category: teamCategory,
          institution,
          status: 'pending',
          payment_status: 'pending',
        }, user.id);

        // Upload payment proof if provided
        if (paymentFile) {
          try {
            const paymentResult = await paymentService.uploadProof(
              paymentFile,
              team.id,
              competition.id
            );

            // Update team with payment proof
            await paymentService.updateTeamPayment(
              team.id,
              paymentResult.fileUrl,
              paymentResult.driveFileId
            );

            toast.success(language === 'id' ? 'Bukti pembayaran berhasil diupload' : 'Payment proof uploaded');
          } catch (uploadError) {
            console.error('Payment upload error:', uploadError);
            toast.warning(
              language === 'id' ? 'Gagal upload bukti pembayaran, tapi registrasi berhasil' : 'Payment upload failed, but registration successful',
              { description: language === 'id' ? 'Anda dapat upload bukti pembayaran di dashboard' : 'You can upload payment proof in dashboard' }
            );
          }
        }

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
        // Fallback to localStorage (mock mode)
        // SECURITY: Do NOT store passwords in localStorage
        const userId = `user_${Date.now()}`;
        const teamId = `team_${Date.now()}`;
        const teamCode = Math.random().toString(36).substr(2, 8).toUpperCase();

        const newUser = {
          id: userId,
          email: step1Data.email,
          // Password is NOT stored - authentication is handled by Supabase
          // For mock mode, we use simple email-based lookup
          fullName: step2Data.fullName,
          category: step3Data.category,
          teamId: teamId,
          createdAt: new Date().toISOString(),
          status: 'pending', // PENDING - needs admin approval
        };

        const newTeam = {
          id: teamId,
          name: step4Data.teamName || `${step2Data.fullName}'s Team`,
          code: teamCode,
          category: step3Data.category,
          leaderId: userId,
          members: [{ id: `mem_${Date.now()}`, name: step2Data.fullName, email: step1Data.email, role: 'leader' as const, status: 'active' as const, institution: step3Data.institutionName || step3Data.companyName || step3Data.corporationName, joinedAt: new Date().toISOString() }],
          maxMembers: step3Data.category === 'corporate' ? 10 : 5,
          createdAt: new Date().toISOString(),
          status: 'forming' as const,
          paymentStatus: paymentUploaded ? 'pending' : 'not_uploaded',
          paymentProof: paymentUploaded,
        };

        const users = JSON.parse(localStorage.getItem('cibc_users') || '[]');
        users.push(newUser);
        localStorage.setItem('cibc_users', JSON.stringify(users));

        const teams = JSON.parse(localStorage.getItem('cibc_teams') || '[]');
        teams.push(newTeam);
        localStorage.setItem('cibc_teams', JSON.stringify(teams));

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
    { number: 5, label: language === 'id' ? 'Pembayaran' : 'Payment', icon: CreditCard },
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
                  {step.number === 5 && (language === 'id' ? 'Pembayaran' : 'Payment')}
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

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-[#0F0F0F] mb-6 border-b border-gray-100 pb-4">
                {language === 'id' ? 'Bukti Pembayaran' : 'Payment Proof'}
              </h2>

              {/* Payment Info */}
              <div className="bg-amber-50 rounded-2xl p-6 mb-8 border border-amber-200">
                <div className="flex items-start gap-4">
                  <CreditCard className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">
                      {language === 'id' ? 'Informasi Pembayaran' : 'Payment Information'}
                    </h3>
                    <p className="text-sm text-amber-700 mb-3">
                      {language === 'id'
                        ? 'Upload bukti pembayaran registrasi untuk menyelesaikan pendaftaran tim Anda.'
                        : 'Upload your registration payment proof to complete your team registration.'}
                    </p>
                    <div className="space-y-2 text-sm text-amber-700">
                      <p>• {language === 'id' ? 'Student Category: Rp 150.000' : 'Student Category: Rp 150.000'}</p>
                      <p>• {language === 'id' ? 'Startup/Open Category: Rp 250.000' : 'Startup/Open Category: Rp 250.000'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Upload Component - Simple file selector for registration */}
              <div className="mb-6">
                <label className="block font-semibold text-sm text-[#0F0F0F] mb-3">
                  {language === 'id' ? 'Upload Bukti Pembayaran (Foto)' : 'Upload Payment Proof (Image)'}
                </label>

                {/* File drop zone */}
                <div
                  onDrop={(e) => {
                    e.preventDefault();
                    const droppedFile = e.dataTransfer.files[0];
                    if (droppedFile && droppedFile.type.startsWith('image/')) {
                      if (droppedFile.size <= 5 * 1024 * 1024) {
                        setPaymentFile(droppedFile);
                        setPaymentUploaded(null);
                        toast.success(language === 'id' ? 'File berhasil dipilih' : 'File selected');
                      } else {
                        toast.error(language === 'id' ? 'File maksimal 5MB' : 'File max 5MB');
                      }
                    } else {
                      toast.error(language === 'id' ? 'Format file harus gambar' : 'File must be an image');
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
                    paymentFile ? 'border-[#FFB22C] bg-[#FFB22C]/5' : 'border-gray-200 bg-[#F4F6F8] hover:border-[#FFB22C]'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
                          setPaymentFile(file);
                          setPaymentUploaded(null);
                        } else {
                          toast.error(language === 'id' ? 'Format gambar (JPG, PNG), max 5MB' : 'Image format (JPG, PNG), max 5MB');
                        }
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-10 h-10 text-gray-400" />
                    {paymentFile ? (
                      <div className="text-center">
                        <p className="font-semibold text-[#0F0F0F]">{paymentFile.name}</p>
                        <p className="text-sm text-gray-500">{(paymentFile.size / 1024 / 1024).toFixed(1)} MB</p>
                        <button
                          onClick={() => setPaymentFile(null)}
                          className="mt-2 text-sm text-red-500 hover:underline"
                        >
                          {language === 'id' ? 'Hapus gambar' : 'Remove image'}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="font-semibold text-[#0F0F0F]">
                          {language === 'id' ? 'Drag & drop atau klik untuk upload' : 'Drag & drop or click to upload'}
                        </p>
                        <p className="text-sm text-gray-500">JPG, PNG, max 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Agreement */}
              <div className="flex items-start gap-3 mt-6">
                <input
                  type="checkbox"
                  {...step5Form.register('agreeToPayment')}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-[#FFB22C] focus:ring-[#FFB22C] cursor-pointer"
                />
                <label className="text-sm text-gray-600 cursor-pointer">
                  {language === 'id'
                    ? 'Saya menyetujui bahwa bukti pembayaran yang saya upload adalah valid dan benar.'
                    : 'I confirm that the payment proof I uploaded is valid and accurate.'}
                </label>
              </div>
              {step5Form.formState.errors.agreeToPayment && (
                <p className="mt-1 text-xs text-red-500">{step5Form.formState.errors.agreeToPayment.message}</p>
              )}
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